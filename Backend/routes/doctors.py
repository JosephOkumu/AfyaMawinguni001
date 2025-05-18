from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import get_db_connection
from datetime import datetime

doctors_bp = Blueprint('doctors', __name__)

@doctors_bp.route('/', methods=['GET'])
def get_doctors():
    """Get all doctors with optional filtering"""
    search = request.args.get('search', '')
    specialty = request.args.get('specialty', '')
    available_online = request.args.get('available_online', '').lower() == 'true'
    min_rating = request.args.get('min_rating')
    limit = int(request.args.get('limit', 20))
    offset = int(request.args.get('offset', 0))
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query_params = []
        
        query = '''
        SELECT dp.id, dp.specialty, dp.qualification, dp.experience_years, 
               dp.bio, dp.consultation_fee, dp.rating, dp.total_ratings, dp.available_for_online,
               u.id as user_id, u.full_name, u.profile_picture
        FROM doctor_profiles dp
        JOIN users u ON dp.user_id = u.id
        WHERE u.is_active = TRUE AND u.user_type = 'doctor'
        '''
        
        if search:
            query += " AND (u.full_name LIKE %s OR dp.specialty LIKE %s OR dp.bio LIKE %s)"
            search_param = f'%{search}%'
            query_params.extend([search_param, search_param, search_param])
            
        if specialty:
            query += " AND dp.specialty = %s"
            query_params.append(specialty)
            
        if available_online:
            query += " AND dp.available_for_online = TRUE"
            
        if min_rating:
            query += " AND dp.rating >= %s"
            query_params.append(float(min_rating))
            
        query += " ORDER BY dp.rating DESC LIMIT %s OFFSET %s"
        query_params.extend([limit, offset])
        
        cursor.execute(query, query_params)
        doctors = cursor.fetchall()
        
        result = []
        for doctor in doctors:
            result.append({
                'id': doctor['id'],
                'user_id': doctor['user_id'],
                'full_name': doctor['full_name'],
                'profile_picture': doctor['profile_picture'],
                'specialty': doctor['specialty'],
                'qualification': doctor['qualification'],
                'experience_years': doctor['experience_years'],
                'bio': doctor['bio'],
                'consultation_fee': float(doctor['consultation_fee']) if doctor['consultation_fee'] else None,
                'rating': float(doctor['rating']) if doctor['rating'] else None,
                'total_ratings': doctor['total_ratings'],
                'available_for_online': bool(doctor['available_for_online'])
            })
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@doctors_bp.route('/<int:doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    """Get doctor details by ID"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = '''
        SELECT dp.id, dp.specialty, dp.license_number, dp.qualification, dp.experience_years, 
               dp.bio, dp.consultation_fee, dp.rating, dp.total_ratings, dp.available_for_online,
               u.id as user_id, u.full_name, u.email, u.phone_number, u.profile_picture
        FROM doctor_profiles dp
        JOIN users u ON dp.user_id = u.id
        WHERE dp.id = %s AND u.is_active = TRUE
        '''
        
        cursor.execute(query, (doctor_id,))
        doctor = cursor.fetchone()
        
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404
        
        # Get doctor's schedule
        query = '''
        SELECT id, day_of_week, start_time, end_time, is_available, slot_duration_minutes
        FROM doctor_schedules
        WHERE doctor_profile_id = %s
        ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
        '''
        
        cursor.execute(query, (doctor_id,))
        schedules = cursor.fetchall()
        
        # Format the schedule for better readability
        formatted_schedules = []
        for schedule in schedules:
            formatted_schedules.append({
                'id': schedule['id'],
                'day_of_week': schedule['day_of_week'],
                'start_time': schedule['start_time'].strftime('%H:%M') if schedule['start_time'] else None,
                'end_time': schedule['end_time'].strftime('%H:%M') if schedule['end_time'] else None,
                'is_available': bool(schedule['is_available']),
                'slot_duration_minutes': schedule['slot_duration_minutes']
            })
        
        result = {
            'id': doctor['id'],
            'user_id': doctor['user_id'],
            'full_name': doctor['full_name'],
            'email': doctor['email'],
            'phone_number': doctor['phone_number'],
            'profile_picture': doctor['profile_picture'],
            'specialty': doctor['specialty'],
            'license_number': doctor['license_number'],
            'qualification': doctor['qualification'],
            'experience_years': doctor['experience_years'],
            'bio': doctor['bio'],
            'consultation_fee': float(doctor['consultation_fee']) if doctor['consultation_fee'] else None,
            'rating': float(doctor['rating']) if doctor['rating'] else None,
            'total_ratings': doctor['total_ratings'],
            'available_for_online': bool(doctor['available_for_online']),
            'schedules': formatted_schedules
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@doctors_bp.route('/specialties', methods=['GET'])
def get_specialties():
    """Get all doctor specialties"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT DISTINCT specialty FROM doctor_profiles WHERE specialty IS NOT NULL ORDER BY specialty')
        specialties = cursor.fetchall()
        
        result = [s['specialty'] for s in specialties]
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@doctors_bp.route('/available-slots', methods=['GET'])
def get_available_slots():
    """Get available appointment slots for a doctor on a specific date"""
    doctor_id = request.args.get('doctor_id')
    date = request.args.get('date')
    
    if not doctor_id or not date:
        return jsonify({'error': 'Doctor ID and date are required'}), 400
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get day of week from date
        cursor.execute('SELECT DAYNAME(%s) as day_of_week', (date,))
        day_result = cursor.fetchone()
        day_of_week = day_result['day_of_week']
        
        # Check if doctor has a schedule for this day
        query = '''
        SELECT start_time, end_time, slot_duration_minutes
        FROM doctor_schedules
        WHERE doctor_profile_id = %s AND day_of_week = %s AND is_available = TRUE
        '''
        
        cursor.execute(query, (doctor_id, day_of_week))
        schedule = cursor.fetchone()
        
        if not schedule:
            return jsonify({'message': 'No schedule available for this day', 'slots': []}), 200
        
        # Get booked appointments for this doctor on this date
        query = '''
        SELECT start_time, end_time
        FROM appointments
        WHERE doctor_id = %s AND appointment_date = %s AND status != 'Cancelled'
        '''
        
        cursor.execute(query, (doctor_id, date))
        booked_slots = cursor.fetchall()
        
        # Calculate available slots
        start_time = schedule['start_time']
        end_time = schedule['end_time']
        duration = schedule['slot_duration_minutes']
        
        all_slots = []
        current_time = start_time
        
        while current_time < end_time:
            slot_end = current_time.replace(minute=current_time.minute + duration)
            
            # Check if slot is booked
            is_booked = False
            for booked in booked_slots:
                if (current_time >= booked['start_time'] and current_time < booked['end_time']) or \
                   (slot_end > booked['start_time'] and slot_end <= booked['end_time']) or \
                   (current_time <= booked['start_time'] and slot_end >= booked['end_time']):
                    is_booked = True
                    break
            
            if not is_booked:
                all_slots.append({
                    'start_time': current_time.strftime('%H:%M'),
                    'end_time': slot_end.strftime('%H:%M')
                })
            
            current_time = slot_end
        
        return jsonify({'slots': all_slots}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@doctors_bp.route('/book-appointment', methods=['POST'])
@jwt_required()
def book_appointment():
    """Book an appointment with a doctor"""
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    user_type = current_user['user_type']
    
    if user_type != 'patient':
        return jsonify({'error': 'Only patients can book appointments'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['doctor_id', 'appointment_date', 'start_time', 'end_time', 'consultation_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    doctor_id = data['doctor_id']
    appointment_date = data['appointment_date']
    start_time = data['start_time']
    end_time = data['end_time']
    consultation_type = data['consultation_type']
    reason = data.get('reason', '')
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get patient profile id
        cursor.execute('SELECT id FROM patient_profiles WHERE user_id = %s', (user_id,))
        patient = cursor.fetchone()
        
        if not patient:
            return jsonify({'error': 'Patient profile not found'}), 404
            
        patient_id = patient['id']
        
        # Validate doctor exists
        cursor.execute('''
            SELECT dp.id FROM doctor_profiles dp
            JOIN users u ON dp.user_id = u.id
            WHERE dp.id = %s AND u.is_active = TRUE
        ''', (doctor_id,))
        
        if not cursor.fetchone():
            return jsonify({'error': 'Doctor not found or inactive'}), 404
        
        # Validate consultation type
        valid_types = ['In-person', 'Video', 'Voice']
        if consultation_type not in valid_types:
            return jsonify({'error': f'Invalid consultation type. Must be one of {valid_types}'}), 400
        
        # Check for slot availability
        cursor.execute('''
            SELECT 1 FROM appointments
            WHERE doctor_id = %s AND appointment_date = %s 
            AND ((start_time <= %s AND end_time > %s) OR (start_time < %s AND end_time >= %s))
            AND status != 'Cancelled'
        ''', (doctor_id, appointment_date, start_time, start_time, end_time, end_time))
        
        if cursor.fetchone():
            return jsonify({'error': 'Selected time slot is already booked'}), 409
        
        # Book the appointment
        cursor.execute('''
            INSERT INTO appointments (
                patient_id, doctor_id, appointment_date, start_time, end_time,
                status, consultation_type, reason, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            patient_id, doctor_id, appointment_date, start_time, end_time,
            'Scheduled', consultation_type, reason, datetime.now()
        ))
        
        appointment_id = cursor.lastrowid
        conn.commit()
        
        return jsonify({
            'message': 'Appointment booked successfully',
            'appointment_id': appointment_id
        }), 201
        
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()
