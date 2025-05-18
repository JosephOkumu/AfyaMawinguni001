from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import get_db_connection
from datetime import datetime

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    """Get all orders for the current user"""
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    user_type = current_user['user_type']
    
    if user_type != 'patient':
        return jsonify({'error': 'Only patients can view their orders'}), 403
    
    status = request.args.get('status')
    limit = int(request.args.get('limit', 20))
    offset = int(request.args.get('offset', 0))
    
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
        
        # Get all orders for this patient
        query = '''
        SELECT o.id, o.order_date, o.total_amount, o.status, o.shipping_address,
               o.payment_method, o.payment_status, o.transaction_id, o.notes
        FROM orders o
        WHERE o.patient_id = %s
        '''
        
        params = [patient_id]
        
        if status:
            query += ' AND o.status = %s'
            params.append(status)
            
        query += ' ORDER BY o.order_date DESC LIMIT %s OFFSET %s'
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        orders = cursor.fetchall()
        
        result = []
        for order in orders:
            # Get order items
            cursor.execute('''
                SELECT oi.id, oi.quantity, oi.unit_price, oi.subtotal,
                       m.id as medicine_id, m.name as medicine_name, 
                       p.name as pharmacy_name
                FROM order_items oi
                JOIN pharmacy_medicines pm ON oi.pharmacy_medicine_id = pm.id
                JOIN medicines m ON pm.medicine_id = m.id
                JOIN pharmacies p ON pm.pharmacy_id = p.id
                WHERE oi.order_id = %s
            ''', (order['id'],))
            
            items = cursor.fetchall()
            
            order_items = []
            for item in items:
                order_items.append({
                    'id': item['id'],
                    'quantity': item['quantity'],
                    'unit_price': float(item['unit_price']),
                    'subtotal': float(item['subtotal']),
                    'medicine_name': item['medicine_name'],
                    'pharmacy_name': item['pharmacy_name']
                })
            
            result.append({
                'id': order['id'],
                'order_date': order['order_date'].strftime('%Y-%m-%d %H:%M:%S'),
                'total_amount': float(order['total_amount']),
                'status': order['status'],
                'shipping_address': order['shipping_address'],
                'payment_method': order['payment_method'],
                'payment_status': order['payment_status'],
                'items': order_items
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    """Create a new order"""
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    user_type = current_user['user_type']
    
    if user_type != 'patient':
        return jsonify({'error': 'Only patients can create orders'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['items', 'shipping_address', 'payment_method']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    items = data['items']
    shipping_address = data['shipping_address']
    payment_method = data['payment_method']
    notes = data.get('notes', '')
    
    # Validate items format
    if not isinstance(items, list) or len(items) == 0:
        return jsonify({'error': 'Items must be a non-empty array'}), 400
    
    for item in items:
        if 'pharmacy_medicine_id' not in item or 'quantity' not in item:
            return jsonify({'error': 'Each item must have pharmacy_medicine_id and quantity'}), 400
    
    # Validate payment method
    valid_payment_methods = ['M-PESA', 'Credit Card', 'Debit Card', 'Cash on Delivery']
    if payment_method not in valid_payment_methods:
        return jsonify({'error': f'Invalid payment method. Must be one of {valid_payment_methods}'}), 400
    
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
        
        # Calculate total amount and validate items
        total_amount = 0
        validated_items = []
        
        for item in items:
            pharmacy_medicine_id = item['pharmacy_medicine_id']
            quantity = item['quantity']
            
            if quantity <= 0:
                return jsonify({'error': 'Quantity must be greater than 0'}), 400
            
            # Get medicine details and check availability
            cursor.execute('''
                SELECT pm.price, pm.stock_quantity, pm.status,
                       m.name as medicine_name
                FROM pharmacy_medicines pm
                JOIN medicines m ON pm.medicine_id = m.id
                WHERE pm.id = %s
            ''', (pharmacy_medicine_id,))
            
            medicine = cursor.fetchone()
            
            if not medicine:
                return jsonify({'error': f'Medicine with ID {pharmacy_medicine_id} not found'}), 404
            
            price = medicine['price']
            subtotal = price * quantity
            total_amount += subtotal
            
            validated_items.append({
                'pharmacy_medicine_id': pharmacy_medicine_id,
                'quantity': quantity,
                'unit_price': price,
                'subtotal': subtotal
            })
        
        # Create the order
        cursor.execute('''
            INSERT INTO orders (
                patient_id, order_date, total_amount, status, shipping_address,
                payment_method, payment_status, notes
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            patient_id, datetime.now(), total_amount, 'Pending', shipping_address,
            payment_method, 'Pending', notes
        ))
        
        order_id = cursor.lastrowid
        
        # Add order items
        for item in validated_items:
            cursor.execute('''
                INSERT INTO order_items (
                    order_id, pharmacy_medicine_id, quantity, unit_price, subtotal
                ) VALUES (%s, %s, %s, %s, %s)
            ''', (
                order_id, item['pharmacy_medicine_id'], item['quantity'],
                item['unit_price'], item['subtotal']
            ))
        
        conn.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order_id': order_id,
            'total_amount': total_amount
        }), 201
        
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()
