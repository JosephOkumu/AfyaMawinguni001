from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import get_db_connection
from datetime import datetime

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('/', methods=['GET'])
@jwt_required()
def get_appointments():
    """Get all appointments for the current user"""
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    user_type = current_user['user_type']
    
    appointment_type = request.args.get('type', 'all')  # doctor, lab, nursing, or all
    status = request.args.get('status')
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        result = {
            'doctor_appointments': [],
            'lab_appointments': [],
            'nursing_appointments': []
        }
        
        # For patients: Get profile ID
        patient_id = None
        if user_type == 'patient':
            cursor.execute('SELECT id FROM patient_profiles WHERE user_id = %s', (user_id,))
            patient = cursor.fetchone()
            if not patient:
                return jsonify({'error': 'Patient profile not found'}), 404
            
            patient_id = patient['id']
            
            # Get doctor appointments
            if appointment_type in ['all', 'doctor']:
                query = '''
                SELECT a.id, a.appointment_date, a.start_time, a.end_time, a.status, 
                       a.consultation_type, a.reason, a.created_at,
                       dp.id as doctor_id, u.full_name as doctor_name, 
                       u.profile_picture as doctor_image, dp.specialty,
                       dp.consultation_fee
                FROM appointments a
                JOIN doctor_profiles dp ON a.doctor_id = dp.id
                JOIN users u ON dp.user_id = u.id
                WHERE a.patient_id = %s
                '''
                
                params = [patient_id]
                
                if status:
                    query += ' AND a.status = %s'
                    params.append(status)
                    
                query += ' ORDER BY a.appointment_date DESC, a.start_time ASC'
                
                cursor.execute(query, params)
                doctor_appointments = cursor.fetchall()
                
                for appointment in doctor_appointments:
                    result['doctor_appointments'].append({
                        'id': appointment['id'],
                        'appointment_date': appointment['appointment_date'].strftime('%Y-%m-%d'),
                        'start_time': appointment['start_time'].strftime('%H:%M'),
                        'end_time': appointment['end_time'].strftime('%H:%M'),
                        'status': appointment['status'],
                        'consultation_type': appointment['consultation_type'],
                        'reason': appointment['reason'],
                        'doctor': {
                            'id': appointment['doctor_id'],
                            'name': appointment['doctor_name'],
                            'profile_picture': appointment['doctor_image'],
                            'specialty': appointment['specialty']
                        },
                        'fee': float(appointment['consultation_fee']) if appointment['consultation_fee'] else None
                    })
        
        # Filter the result based on appointment_type
        if appointment_type != 'all':
            filtered_result = {}
            filtered_result[f'{appointment_type}_appointments'] = result[f'{appointment_type}_appointments']
            return jsonify(filtered_result), 200
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@appointments_bp.route('/<string:appointment_type>/<int:appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment_status(appointment_type, appointment_id):
    """Update appointment status"""
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    user_type = current_user['user_type']
    
    data = request.get_json()
    if 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
    
    status = data['status']
    notes = data.get('notes', '')
    
    valid_statuses = ['Scheduled', 'Completed', 'Cancelled', 'No-show']
    if status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of {valid_statuses}'}), 400
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check appointment exists and user has permission to update it
        if appointment_type == 'doctor':
            if user_type == 'patient':
                cursor.execute('''
                    SELECT a.id FROM appointments a
                    JOIN patient_profiles pp ON a.patient_id = pp.id
                    WHERE a.id = %s AND pp.user_id = %s
                ''', (appointment_id, user_id))
            elif user_type == 'doctor':
                cursor.execute('''
                    SELECT a.id FROM appointments a
                    JOIN doctor_profiles dp ON a.doctor_id = dp.id
                    WHERE a.id = %s AND dp.user_id = %s
                ''', (appointment_id, user_id))
            else:
                return jsonify({'error': 'Unauthorized to update this appointment'}), 403
            
            if not cursor.fetchone():
                return jsonify({'error': 'Appointment not found or unauthorized'}), 404
            
            # Update appointment
            cursor.execute('''
                UPDATE appointments SET status = %s, notes = %s
                WHERE id = %s
            ''', (status, notes, appointment_id))
            
        conn.commit()
        return jsonify({'message': 'Appointment status updated successfully'}), 200
        
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()
