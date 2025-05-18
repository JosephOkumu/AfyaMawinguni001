from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import get_db_connection
from datetime import datetime

lab_tests_bp = Blueprint('lab_tests', __name__)

@lab_tests_bp.route('/', methods=['GET'])
def get_lab_tests():
    """Get all lab tests with optional filtering"""
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    popular = request.args.get('popular', '').lower() == 'true'
    limit = int(request.args.get('limit', 20))
    offset = int(request.args.get('offset', 0))
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query_params = []
        
        query = '''
        SELECT lt.id, lt.name, lt.description, lt.price, lt.preparation_instructions,
               lt.is_popular, lt.icon_name, c.name as category_name
        FROM lab_tests lt
        LEFT JOIN lab_test_categories c ON lt.category_id = c.id
        WHERE 1=1
        '''
        
        if search:
            query += " AND (lt.name LIKE %s OR lt.description LIKE %s OR c.name LIKE %s)"
            search_param = f'%{search}%'
            query_params.extend([search_param, search_param, search_param])
            
        if category:
            query += " AND c.name = %s"
            query_params.append(category)
            
        if popular:
            query += " AND lt.is_popular = TRUE"
            
        query += " ORDER BY lt.name ASC LIMIT %s OFFSET %s"
        query_params.extend([limit, offset])
        
        cursor.execute(query, query_params)
        lab_tests = cursor.fetchall()
        
        for test in lab_tests:
            test['price'] = float(test['price'])
            test['is_popular'] = bool(test['is_popular'])
            
        return jsonify(lab_tests), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@lab_tests_bp.route('/<int:test_id>', methods=['GET'])
def get_lab_test(test_id):
    """Get lab test details by ID"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get the lab test details
        query = '''
        SELECT lt.id, lt.name, lt.description, lt.price, lt.preparation_instructions,
               lt.is_popular, lt.icon_name, c.name as category_name
        FROM lab_tests lt
        LEFT JOIN lab_test_categories c ON lt.category_id = c.id
        WHERE lt.id = %s
        '''
        
        cursor.execute(query, (test_id,))
        test = cursor.fetchone()
        
        if not test:
            return jsonify({'error': 'Lab test not found'}), 404
            
        # Get all lab facilities that offer this test
        query = '''
        SELECT lft.price, lft.turnaround_time,
               lf.id as facility_id, lf.name as facility_name, lf.logo as facility_logo,
               lf.initials as facility_initials, lf.rating as facility_rating,
               lf.patients_served, lf.location, lf.address
        FROM lab_facility_tests lft
        JOIN lab_facilities lf ON lft.lab_facility_id = lf.id
        WHERE lft.lab_test_id = %s AND lf.is_active = TRUE
        '''
        
        cursor.execute(query, (test_id,))
        facilities = cursor.fetchall()
        
        result = {
            'id': test['id'],
            'name': test['name'],
            'description': test['description'],
            'price': float(test['price']),
            'preparation_instructions': test['preparation_instructions'],
            'is_popular': bool(test['is_popular']),
            'icon_name': test['icon_name'],
            'category': test['category_name'],
            'facilities': []
        }
        
        for facility in facilities:
            result['facilities'].append({
                'facility_id': facility['facility_id'],
                'name': facility['facility_name'],
                'logo': facility['facility_logo'],
                'initials': facility['facility_initials'],
                'rating': float(facility['facility_rating']) if facility['facility_rating'] else None,
                'patients_served': facility['patients_served'],
                'location': facility['location'],
                'address': facility['address'],
                'price': float(facility['price']),
                'turnaround_time': facility['turnaround_time']
            })
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@lab_tests_bp.route('/facilities', methods=['GET'])
def get_lab_facilities():
    """Get all lab facilities with optional filtering"""
    search = request.args.get('search', '')
    limit = int(request.args.get('limit', 20))
    offset = int(request.args.get('offset', 0))
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query_params = []
        
        query = '''
        SELECT id, name, logo, initials, address, contact_phone, email, 
               rating, total_ratings, patients_served, location
        FROM lab_facilities 
        WHERE is_active = TRUE
        '''
        
        if search:
            query += " AND (name LIKE %s OR location LIKE %s OR address LIKE %s)"
            search_param = f'%{search}%'
            query_params.extend([search_param, search_param, search_param])
            
        query += " ORDER BY name ASC LIMIT %s OFFSET %s"
        query_params.extend([limit, offset])
        
        cursor.execute(query, query_params)
        facilities = cursor.fetchall()
        
        for facility in facilities:
            facility['rating'] = float(facility['rating']) if facility['rating'] else None
        
        return jsonify(facilities), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()
