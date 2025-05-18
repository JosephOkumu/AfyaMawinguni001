from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request
from functools import wraps
from flask import jsonify, request
import re
from datetime import timedelta

def generate_token(user_id, user_type):
    """Generate a JWT token for the user"""
    identity = {
        'user_id': user_id,
        'user_type': user_type
    }
    return create_access_token(identity=identity, expires_delta=timedelta(days=1))

def admin_required(fn):
    """Decorator to require admin role for a route"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_identity()
        if claims['user_type'] != 'admin':
            return jsonify(message='Admins only!'), 403
        return fn(*args, **kwargs)
    return wrapper

def doctor_required(fn):
    """Decorator to require doctor role for a route"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_identity()
        if claims['user_type'] != 'doctor':
            return jsonify(message='Doctors only!'), 403
        return fn(*args, **kwargs)
    return wrapper

def nursing_required(fn):
    """Decorator to require nursing role for a route"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_identity()
        if claims['user_type'] != 'nursing':
            return jsonify(message='Nursing staff only!'), 403
        return fn(*args, **kwargs)
    return wrapper

def laboratory_required(fn):
    """Decorator to require laboratory role for a route"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_identity()
        if claims['user_type'] != 'laboratory':
            return jsonify(message='Laboratory staff only!'), 403
        return fn(*args, **kwargs)
    return wrapper

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, 'Password must be at least 8 characters long'
    
    if not re.search(r'[A-Z]', password):
        return False, 'Password must contain at least one uppercase letter'
    
    if not re.search(r'[a-z]', password):
        return False, 'Password must contain at least one lowercase letter'
    
    if not re.search(r'[0-9]', password):
        return False, 'Password must contain at least one number'
    
    return True, 'Password is valid'

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(pattern, email):
        return True, 'Email is valid'
    return False, 'Invalid email format'
