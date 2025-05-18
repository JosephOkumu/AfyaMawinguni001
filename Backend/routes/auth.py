from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import bcrypt, get_db_connection
from utils.auth_utils import generate_token, validate_password, validate_email
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password', 'full_name', 'user_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    email = data['email']
    password = data['password']
    full_name = data['full_name']
    user_type = data['user_type']
    phone_number = data.get('phone_number', None)
    
    # Validate email format
    is_valid_email, email_msg = validate_email(email)
    if not is_valid_email:
        return jsonify({'error': email_msg}), 400
    
    # Validate password strength
    is_valid_password, password_msg = validate_password(password)
    if not is_valid_password:
        return jsonify({'error': password_msg}), 400
    
    # Validate user type
    valid_user_types = ['patient', 'doctor', 'nursing', 'laboratory']
    if user_type not in valid_user_types:
        return jsonify({'error': f'Invalid user type. Must be one of {valid_user_types}'}), 400
    
    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute('SELECT id FROM users WHERE email = %s', (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Insert user
        cursor.execute(
            'INSERT INTO users (email, password_hash, full_name, phone_number, user_type, date_registered) VALUES (%s, %s, %s, %s, %s, %s)',
            (email, hashed_password, full_name, phone_number, user_type, datetime.now())
        )
        user_id = cursor.lastrowid
        
        # Create user profile based on user type
        if user_type == 'patient':
            cursor.execute('INSERT INTO patient_profiles (user_id) VALUES (%s)', (user_id,))
        elif user_type == 'doctor':
            cursor.execute('INSERT INTO doctor_profiles (user_id, specialty, license_number, qualification) VALUES (%s, %s, %s, %s)', 
                (user_id, 'Not specified', 'Not specified', 'Not specified'))
        elif user_type == 'nursing':
            cursor.execute('INSERT INTO nursing_profiles (user_id, license_number, qualification) VALUES (%s, %s, %s)', 
                (user_id, 'Not specified', 'Not specified'))
        elif user_type == 'laboratory':
            cursor.execute('INSERT INTO laboratory_profiles (user_id) VALUES (%s)', (user_id,))
        
        conn.commit()
        
        # Generate JWT token
        token = generate_token(user_id, user_type)
        
        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': {
                'id': user_id,
                'email': email,
                'full_name': full_name,
                'user_type': user_type
            }
        }), 201
        
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate required fields
    if 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    email = data['email']
    password = data['password']
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get user by email
        cursor.execute('SELECT id, email, password_hash, full_name, user_type FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        
        if not user or not bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login time
        cursor.execute('UPDATE users SET last_login = %s WHERE id = %s', (datetime.now(), user['id']))
        conn.commit()
        
        # Generate JWT token
        token = generate_token(user['id'], user['user_type'])
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'full_name': user['full_name'],
                'user_type': user['user_type']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()
