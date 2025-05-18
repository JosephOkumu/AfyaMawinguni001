from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import pymysql
import os

from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app, resources={r"/*": {"origins": Config.CORS_ORIGINS}})

# Initialize JWT
jwt = JWTManager(app)

# Initialize Bcrypt
bcrypt = Bcrypt(app)

# Create upload directory if it doesn't exist
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

# Database connection function
def get_db_connection():
    return pymysql.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        db=Config.DB_NAME,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

# Import routes after app initialization to avoid circular imports
from routes.auth import auth_bp
from routes.users import users_bp
from routes.medicines import medicines_bp
from routes.lab_tests import lab_tests_bp
from routes.doctors import doctors_bp
from routes.nursing import nursing_bp
from routes.appointments import appointments_bp
from routes.orders import orders_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(medicines_bp, url_prefix='/api/medicines')
app.register_blueprint(lab_tests_bp, url_prefix='/api/lab-tests')
app.register_blueprint(doctors_bp, url_prefix='/api/doctors')
app.register_blueprint(nursing_bp, url_prefix='/api/nursing')
app.register_blueprint(appointments_bp, url_prefix='/api/appointments')
app.register_blueprint(orders_bp, url_prefix='/api/orders')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=Config.DEBUG)
