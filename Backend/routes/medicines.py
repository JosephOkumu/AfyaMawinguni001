from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import get_db_connection
import os
from werkzeug.utils import secure_filename
from config import Config

medicines_bp = Blueprint('medicines', __name__)

@medicines_bp.route('/', methods=['GET'])
def get_medicines():
    """Get all medicines with optional filtering"""
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    pharmacy_id = request.args.get('pharmacy_id')
    limit = int(request.args.get('limit', 20))
    offset = int(request.args.get('offset', 0))
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query_params = []
        
        query = '''
        SELECT m.id, m.name, m.description, m.price, m.manufacturer, m.form, 
               m.dosage_adult, m.dosage_children, m.side_effects, m.image_path,
               c.name as category_name, 
               pm.status, pm.price as pharmacy_price, 
               p.name as pharmacy_name, p.logo as pharmacy_logo, p.initials as pharmacy_initials,
               p.rating as pharmacy_rating
        FROM medicines m
        LEFT JOIN medicine_categories c ON m.category_id = c.id
        LEFT JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
        LEFT JOIN pharmacies p ON pm.pharmacy_id = p.id
        WHERE 1=1
        '''
        
        if search:
            query += " AND (m.name LIKE %s OR m.description LIKE %s OR c.name LIKE %s)"
            search_param = f'%{search}%'
            query_params.extend([search_param, search_param, search_param])
            
        if category:
            query += " AND c.name = %s"
            query_params.append(category)
            
        if pharmacy_id:
            query += " AND p.id = %s"
            query_params.append(pharmacy_id)
            
        query += " ORDER BY m.name ASC LIMIT %s OFFSET %s"
        query_params.extend([limit, offset])
        
        cursor.execute(query, query_params)
        medicines = cursor.fetchall()
        
        result = []
        for med in medicines:
            # Parse side effects from string to list
            side_effects = []
            if med['side_effects']:
                side_effects = [effect.strip() for effect in med['side_effects'].split(',')]
                
            result.append({
                'id': med['id'],
                'name': med['name'],
                'description': med['description'],
                'price': float(med['pharmacy_price'] or med['price']),
                'manufacturer': med['manufacturer'],
                'form': med['form'],
                'dosage_adult': med['dosage_adult'],
                'dosage_children': med['dosage_children'],
                'side_effects': side_effects,
                'image_path': med['image_path'],
                'category': med['category_name'],
                'status': med['status'],
                'pharmacy': {
                    'name': med['pharmacy_name'],
                    'logo': med['pharmacy_logo'],
                    'initials': med['pharmacy_initials'],
                    'rating': float(med['pharmacy_rating']) if med['pharmacy_rating'] else None
                }
            })
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@medicines_bp.route('/<int:medicine_id>', methods=['GET'])
def get_medicine(medicine_id):
    """Get medicine details by ID"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get the medicine details
        query = '''
        SELECT m.id, m.name, m.description, m.price, m.manufacturer, m.form, 
               m.dosage_adult, m.dosage_children, m.side_effects, m.image_path,
               c.name as category_name
        FROM medicines m
        LEFT JOIN medicine_categories c ON m.category_id = c.id
        WHERE m.id = %s
        '''
        
        cursor.execute(query, (medicine_id,))
        medicine = cursor.fetchone()
        
        if not medicine:
            return jsonify({'error': 'Medicine not found'}), 404
            
        # Get all pharmacies that stock this medicine
        query = '''
        SELECT pm.price, pm.status, pm.stock_quantity,
               p.id as pharmacy_id, p.name as pharmacy_name, p.logo as pharmacy_logo, 
               p.initials as pharmacy_initials, p.rating as pharmacy_rating
        FROM pharmacy_medicines pm
        JOIN pharmacies p ON pm.pharmacy_id = p.id
        WHERE pm.medicine_id = %s
        '''
        
        cursor.execute(query, (medicine_id,))
        pharmacies = cursor.fetchall()
        
        # Parse side effects from string to list
        side_effects = []
        if medicine['side_effects']:
            side_effects = [effect.strip() for effect in medicine['side_effects'].split(',')]
            
        result = {
            'id': medicine['id'],
            'name': medicine['name'],
            'description': medicine['description'],
            'price': float(medicine['price']),
            'manufacturer': medicine['manufacturer'],
            'form': medicine['form'],
            'dosage_adult': medicine['dosage_adult'],
            'dosage_children': medicine['dosage_children'],
            'side_effects': side_effects,
            'image_path': medicine['image_path'],
            'category': medicine['category_name'],
            'pharmacies': []
        }
        
        for pharmacy in pharmacies:
            result['pharmacies'].append({
                'pharmacy_id': pharmacy['pharmacy_id'],
                'name': pharmacy['pharmacy_name'],
                'logo': pharmacy['pharmacy_logo'],
                'initials': pharmacy['pharmacy_initials'],
                'rating': float(pharmacy['pharmacy_rating']) if pharmacy['pharmacy_rating'] else None,
                'price': float(pharmacy['price']),
                'status': pharmacy['status'],
                'stock_quantity': pharmacy['stock_quantity']
            })
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@medicines_bp.route('/categories', methods=['GET'])
def get_medicine_categories():
    """Get all medicine categories"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, name FROM medicine_categories ORDER BY name')
        categories = cursor.fetchall()
        
        return jsonify(categories), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@medicines_bp.route('/pharmacies', methods=['GET'])
def get_pharmacies():
    """Get all pharmacies with optional filtering"""
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
               rating, total_ratings
        FROM pharmacies 
        WHERE is_active = TRUE
        '''
        
        if search:
            query += " AND (name LIKE %s OR address LIKE %s)"
            search_param = f'%{search}%'
            query_params.extend([search_param, search_param])
            
        query += " ORDER BY name ASC LIMIT %s OFFSET %s"
        query_params.extend([limit, offset])
        
        cursor.execute(query, query_params)
        pharmacies = cursor.fetchall()
        
        for pharmacy in pharmacies:
            pharmacy['rating'] = float(pharmacy['rating']) if pharmacy['rating'] else None
        
        return jsonify(pharmacies), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()
