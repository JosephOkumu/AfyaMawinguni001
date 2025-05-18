# Afya Mawinguni Backend

This is the backend implementation for the Afya Mawinguni healthcare platform, providing API endpoints for medicines, lab tests, doctor consultations, nursing services, and user management.

## Features

- User authentication and authorization (JWT)
- User profiles for patients, doctors, nursing staff, and laboratory staff
- Medicine catalog with pharmacy inventory
- Lab test management and booking
- Doctor consultation scheduling
- Home nursing service booking
- Order management for medicine purchases

## Prerequisites

- Python 3.8 or higher
- MySQL 5.7 or higher
- pip (Python package manager)

## Installation

1. Clone the repository (if you haven't already):
   ```
   git clone <repository-url>
   cd AfyaMawinguni001/Backend
   ```

2. Create a virtual environment and activate it:
   ```
   # On Windows
   python -m venv venv
   venv\\Scripts\\activate

   # On macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up your MySQL database:
   - Create a MySQL database named `afya_mawinguni`
   - Import the database schema from `database_schema.sql`
   ```
   mysql -u your_username -p afya_mawinguni < database_schema.sql
   ```

5. Create a `.env` file in the Backend directory with your configuration:
   ```
   SECRET_KEY=your_secret_key
   DEBUG=True
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=afya_mawinguni
   JWT_SECRET_KEY=your_jwt_secret_key
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

## Running the Application

1. Start the Flask development server:
   ```
   python app.py
   ```

2. The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and get JWT token

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/{id}` - Get medicine details by ID
- `GET /api/medicines/categories` - Get medicine categories
- `GET /api/medicines/pharmacies` - Get pharmacies

### Lab Tests
- `GET /api/lab-tests` - Get all lab tests
- `GET /api/lab-tests/{id}` - Get lab test details by ID
- `GET /api/lab-tests/facilities` - Get lab facilities
- `POST /api/lab-tests/book` - Book a lab test

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/{id}` - Get doctor details by ID
- `GET /api/doctors/specialties` - Get doctor specialties
- `GET /api/doctors/available-slots` - Get available appointment slots
- `POST /api/doctors/book-appointment` - Book a doctor appointment

### Nursing
- `GET /api/nursing` - Get all nursing providers
- `GET /api/nursing/{id}` - Get nursing provider details by ID
- `GET /api/nursing/services` - Get nursing services
- `GET /api/nursing/categories` - Get nursing service categories
- `POST /api/nursing/book` - Book a nursing service

### Appointments
- `GET /api/appointments` - Get user's appointments
- `PUT /api/appointments/{type}/{id}` - Update appointment status

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/{id}` - Get order details

## License

This project is licensed under the MIT License - see the LICENSE file for details.
