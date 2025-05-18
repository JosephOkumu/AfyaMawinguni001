from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import get_db_connection
from datetime import datetime

nursing_bp = Blueprint('nursing', __name__)

@nursing_bp.route('/', methods=['GET'])
def get_nursing_providers():
    """Get all nursing providers with optional filtering"""
    search = request.args.get('search', '')
    specialty = request.args.get('specialty', '')
    min_rating = request.args.get('min_rating')
    limit = int(request.args.get('limit', 20))
    offset = int(request.args.get('offset', 0))
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query_params = []
        
        query = '''
        SELECT np.id, np.specialty, np.qualification, np.experience_years, 
               np.bio, np.hourly_rate, np.rating, np.total_ratings,
               u.id as user_id, u.full_name, u.profile_picture
        FROM nursing_profiles np
        JOIN users u ON np.user_id = u.id
        WHERE u.is_active = TRUE AND u.user_type = 'nursing'
        '''
        
        if search:
            query += " AND (u.full_name LIKE %s OR np.specialty LIKE %s OR np.bio LIKE %s)"
            search_param = f'%{search}%'
            query_params.extend([search_param, search_param, search_param])
            
        if specialty:
            query += " AND np.specialty = %s"
            query_params.append(specialty)
            
        if min_rating:
            query += " AND np.rating >= %s"
            query_params.append(float(min_rating))
            
        query += " ORDER BY np.rating DESC LIMIT %s OFFSET %s"
        query_params.extend([limit, offset])
        
        cursor.execute(query, query_params)
        providers = cursor.fetchall()
        
        result = []
        for provider in providers:
            result.append({
                'id': provider['id'],
                'user_id': provider['user_id'],
                'full_name': provider['full_name'],
                'profile_picture': provider['profile_picture'],
                'specialty': provider['specialty'],
                'qualification': provider['qualification'],
                'experience_years': provider['experience_years'],
                'bio': provider['bio'],
                'hourly_rate': float(provider['hourly_rate']) if provider['hourly_rate'] else None,
                'rating': float(provider['rating']) if provider['rating'] else None,
                'total_ratings': provider['total_ratings']
            })
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@nursing_bp.route('/<int:provider_id>', methods=['GET'])
def get_nursing_provider(provider_id):
    """Get nursing provider details by ID"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = '''
        SELECT np.id, np.specialty, np.license_number, np.qualification, np.experience_years, 
               np.bio, np.hourly_rate, np.rating, np.total_ratings,
               u.id as user_id, u.full_name, u.email, u.phone_number, u.profile_picture
        FROM nursing_profiles np
        JOIN users u ON np.user_id = u.id
        WHERE np.id = %s AND u.is_active = TRUE
        '''
        
        cursor.execute(query, (provider_id,))
        provider = cursor.fetchone()
        
        if not provider:
            return jsonify({'error': 'Nursing provider not found'}), 404
        
        # Get services offered by this nursing provider
        query = '''
        SELECT nss.id as provider_service_id, nss.price,
               ns.id as service_id, ns.name, ns.description, ns.duration_minutes,
               c.name as category_name
        FROM nursing_staff_services nss
        JOIN nursing_services ns ON nss.nursing_service_id = ns.id
        LEFT JOIN nursing_service_categories c ON ns.category_id = c.id
        WHERE nss.nursing_profile_id = %s
        ORDER BY ns.name ASC
        '''
        
        cursor.execute(query, (provider_id,))
        services = cursor.fetchall()
        
        provider_services = []
        for service in services:
            provider_services.append({
                'provider_service_id': service['provider_service_id'],
                'service_id': service['service_id'],
                'name': service['name'],
                'description': service['description'],
                'duration_minutes': service['duration_minutes'],
                'category': service['category_name'],
                'price': float(service['price'])
            })
        
        result = {
            'id': provider['id'],
            'user_id': provider['user_id'],
            'full_name': provider['full_name'],
            'email': provider['email'],
            'phone_number': provider['phone_number'],
            'profile_picture': provider['profile_picture'],
            'specialty': provider['specialty'],
            'license_number': provider['license_number'],
            'qualification': provider['qualification'],
            'experience_years': provider['experience_years'],
            'bio': provider['bio'],
            'hourly_rate': float(provider['hourly_rate']) if provider['hourly_rate'] else None,
            'rating': float(provider['rating']) if provider['rating'] else None,
            'total_ratings': provider['total_ratings'],
            'services': provider_services
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@nursing_bp.route('/services', methods=['GET'])
def get_nursing_services():
    """Get all nursing services with optional filtering"""
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    limit = int(request.args.get('limit', 50))
    offset = int(request.args.get('offset', 0))
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query_params = []
        
        query = '''
        SELECT ns.id, ns.name, ns.description, ns.base_price, ns.duration_minutes,
               c.name as category_name
        FROM nursing_services ns
        LEFT JOIN nursing_service_categories c ON ns.category_id = c.id
        WHERE 1=1
        '''
        
        if search:
            query += " AND (ns.name LIKE %s OR ns.description LIKE %s OR c.name LIKE %s)"
            search_param = f'%{search}%'
            query_params.extend([search_param, search_param, search_param])
            
        if category:
            query += " AND c.name = %s"
            query_params.append(category)
            
        query += " ORDER BY ns.name ASC LIMIT %s OFFSET %s"
        query_params.extend([limit, offset])
        
        cursor.execute(query, query_params)
        services = cursor.fetchall()
        
        result = []
        for service in services:
            result.append({
                'id': service['id'],
                'name': service['name'],
                'description': service['description'],
                'base_price': float(service['base_price']),
                'duration_minutes': service['duration_minutes'],
                'category': service['category_name']
            })
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@nursing_bp.route('/categories', methods=['GET'])
def get_nursing_categories():
    """Get all nursing service categories"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, name FROM nursing_service_categories ORDER BY name')
        categories = cursor.fetchall()
        
        return jsonify(categories), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@nursing_bp.route('/specialties', methods=['GET'])
def get_specialties():
    """Get all nursing specialties"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT DISTINCT specialty FROM nursing_profiles WHERE specialty IS NOT NULL ORDER BY specialty')
        specialties = cursor.fetchall()
        
        result = [s['specialty'] for s in specialties]
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@nursing_bp.route('/book', methods=['POST'])
@jwt_required()
def book_nursing_service():
    """Book a nursing service"""
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    user_type = current_user['user_type']
    
    if user_type != 'patient':
        return jsonify({'error': 'Only patients can book nursing services'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['nursing_profile_id', 'nursing_service_id', 'appointment_date', 'start_time', 'end_time', 'address']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    nursing_profile_id = data['nursing_profile_id']
    nursing_service_id = data['nursing_service_id']
    appointment_date = data['appointment_date']
    start_time = data['start_time']
    end_time = data['end_time']
    address = data['address']
    notes = data.get('notes', '')
    
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
        
        # Verify nursing provider exists
        cursor.execute('''
            SELECT np.id FROM nursing_profiles np
            JOIN users u ON np.user_id = u.id
            WHERE np.id = %s AND u.is_active = TRUE
        ''', (nursing_profile_id,))
        
        if not cursor.fetchone():
            return jsonify({'error': 'Nursing provider not found or inactive'}), 404
        
        # Verify nursing service exists and is offered by the provider
        cursor.execute('''
            SELECT nss.price FROM nursing_staff_services nss
            JOIN nursing_services ns ON nss.nursing_service_id = ns.id
            WHERE nss.nursing_profile_id = %s AND nss.nursing_service_id = %s
        ''', (nursing_profile_id, nursing_service_id))
        
        service = cursor.fetchone()
        if not service:
            return jsonify({'error': 'The selected service is not offered by this provider'}), 400
        
        # Check provider availability
        cursor.execute('''
            SELECT 1 FROM nursing_appointments
            WHERE nursing_profile_id = %s AND appointment_date = %s 
            AND ((start_time <= %s AND end_time > %s) OR (start_time < %s AND end_time >= %s))
            AND status != 'Cancelled'
        ''', (nursing_profile_id, appointment_date, start_time, start_time, end_time, end_time))
        
        if cursor.fetchone():
            return jsonify({'error': 'Provider is not available during the selected time slot'}), 409
        
        # Book the appointment
        cursor.execute('''
            INSERT INTO nursing_appointments (
                patient_id, nursing_profile_id, nursing_service_id, appointment_date,
                start_time, end_time, status, address, notes, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            patient_id, nursing_profile_id, nursing_service_id, appointment_date,
            start_time, end_time, 'Scheduled', address, notes, datetime.now()
        ))
        
        appointment_id = cursor.lastrowid
        conn.commit()
        
        return jsonify({
            'message': 'Nursing service booked successfully',
            'appointment_id': appointment_id,
            'service_price': float(service['price'])
        }), 201
        
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()
