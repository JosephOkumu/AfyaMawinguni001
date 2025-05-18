-- AfyaMawinguni Healthcare Platform Database Schema

-- Create the database
CREATE DATABASE IF NOT EXISTS afya_mawinguni;
USE afya_mawinguni;

-- Users table - contains all users across different types
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    user_type ENUM('patient', 'doctor', 'nursing', 'laboratory') NOT NULL,
    profile_picture VARCHAR(255),
    date_registered DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE
);

-- Patient profiles - extends users for patient-specific details
CREATE TABLE patient_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    blood_group VARCHAR(10),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    allergies TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    medical_history TEXT,
    insurance_provider VARCHAR(255),
    insurance_number VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Doctor profiles - extends users for doctor-specific details
CREATE TABLE doctor_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    specialty VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    qualification TEXT NOT NULL,
    experience_years INT,
    bio TEXT,
    consultation_fee DECIMAL(10,2),
    rating DECIMAL(3,1) DEFAULT 0,
    total_ratings INT DEFAULT 0,
    available_for_online BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Nursing staff profiles
CREATE TABLE nursing_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    specialty VARCHAR(255),
    license_number VARCHAR(100) NOT NULL,
    qualification TEXT NOT NULL,
    experience_years INT,
    bio TEXT,
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,1) DEFAULT 0,
    total_ratings INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Laboratory staff profiles
CREATE TABLE laboratory_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    lab_id INT,
    position VARCHAR(255),
    license_number VARCHAR(100),
    qualification TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Pharmacies
CREATE TABLE pharmacies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255),
    initials VARCHAR(10),
    address TEXT,
    contact_phone VARCHAR(20),
    email VARCHAR(255),
    rating DECIMAL(3,1) DEFAULT 0,
    total_ratings INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    date_registered DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Medicine categories
CREATE TABLE medicine_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Medicines
CREATE TABLE medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    manufacturer VARCHAR(255),
    form VARCHAR(100),
    dosage_adult TEXT,
    dosage_children TEXT,
    side_effects TEXT,
    image_path VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES medicine_categories(id)
);

-- Pharmacy medicines (inventory)
CREATE TABLE pharmacy_medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pharmacy_id INT NOT NULL,
    medicine_id INT NOT NULL,
    stock_quantity INT NOT NULL,
    status ENUM('In Stock', 'Low Stock', 'Out of Stock') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

-- Lab facilities
CREATE TABLE lab_facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255),
    initials VARCHAR(10),
    address TEXT,
    contact_phone VARCHAR(20),
    email VARCHAR(255),
    rating DECIMAL(3,1) DEFAULT 0,
    total_ratings INT DEFAULT 0,
    patients_served INT DEFAULT 0,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    date_registered DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Lab test categories
CREATE TABLE lab_test_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Lab tests
CREATE TABLE lab_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    preparation_instructions TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    icon_name VARCHAR(100),
    FOREIGN KEY (category_id) REFERENCES lab_test_categories(id)
);

-- Lab facility tests (available tests at each facility)
CREATE TABLE lab_facility_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lab_facility_id INT NOT NULL,
    lab_test_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    turnaround_time VARCHAR(100),
    FOREIGN KEY (lab_facility_id) REFERENCES lab_facilities(id),
    FOREIGN KEY (lab_test_id) REFERENCES lab_tests(id)
);

-- Nursing service categories
CREATE TABLE nursing_service_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Nursing services
CREATE TABLE nursing_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    category_id INT,
    duration_minutes INT,
    FOREIGN KEY (category_id) REFERENCES nursing_service_categories(id)
);

-- Nursing staff services (which nurse provides which services)
CREATE TABLE nursing_staff_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nursing_profile_id INT NOT NULL,
    nursing_service_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (nursing_profile_id) REFERENCES nursing_profiles(id),
    FOREIGN KEY (nursing_service_id) REFERENCES nursing_services(id)
);

-- Doctor schedules
CREATE TABLE doctor_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_profile_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    slot_duration_minutes INT DEFAULT 30,
    FOREIGN KEY (doctor_profile_id) REFERENCES doctor_profiles(id)
);

-- Appointments (for doctor consultations)
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled', 'No-show') NOT NULL DEFAULT 'Scheduled',
    consultation_type ENUM('In-person', 'Video', 'Voice') NOT NULL,
    reason TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(id)
);

-- Medical records
CREATE TABLE medical_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT,
    record_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    follow_up_instructions TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(id)
);

-- Lab appointments
CREATE TABLE lab_appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    lab_facility_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot TIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled', 'No-show') NOT NULL DEFAULT 'Scheduled',
    is_home_collection BOOLEAN DEFAULT FALSE,
    home_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    FOREIGN KEY (lab_facility_id) REFERENCES lab_facilities(id)
);

-- Lab appointment tests (which tests are included in an appointment)
CREATE TABLE lab_appointment_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lab_appointment_id INT NOT NULL,
    lab_test_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (lab_appointment_id) REFERENCES lab_appointments(id),
    FOREIGN KEY (lab_test_id) REFERENCES lab_tests(id)
);

-- Lab test results
CREATE TABLE lab_test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lab_appointment_test_id INT NOT NULL,
    result_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    result_value TEXT NOT NULL,
    normal_range TEXT,
    is_abnormal BOOLEAN,
    notes TEXT,
    file_path VARCHAR(255),
    FOREIGN KEY (lab_appointment_test_id) REFERENCES lab_appointment_tests(id)
);

-- Nursing appointments
CREATE TABLE nursing_appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    nursing_profile_id INT NOT NULL,
    nursing_service_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled', 'No-show') NOT NULL DEFAULT 'Scheduled',
    address TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    FOREIGN KEY (nursing_profile_id) REFERENCES nursing_profiles(id),
    FOREIGN KEY (nursing_service_id) REFERENCES nursing_services(id)
);

-- Orders (medicine orders)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    shipping_address TEXT NOT NULL,
    payment_method ENUM('M-PESA', 'Credit Card', 'Debit Card', 'Cash on Delivery') NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
    transaction_id VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id)
);

-- Order items (individual medicines in an order)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    pharmacy_medicine_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (pharmacy_medicine_id) REFERENCES pharmacy_medicines(id)
);

-- Reviews (for doctors, pharmacies, labs, nursing staff)
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entity_type ENUM('doctor', 'pharmacy', 'lab', 'nursing') NOT NULL,
    entity_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Initial seed data
INSERT INTO medicine_categories (name) VALUES 
('Pain Relief'),
('Antibiotics'),
('Allergy Relief'),
('Diabetes'),
('Digestive Health'),
('Cold and Flu'),
('Hypertension'),
('Vitamins and Supplements');

INSERT INTO lab_test_categories (name) VALUES 
('Blood Tests'),
('Imaging'),
('Urinalysis'),
('Cardiac Tests'),
('Respiratory Tests'),
('Infectious Disease'),
('Cancer Screening'),
('Diabetes Tests');

INSERT INTO nursing_service_categories (name) VALUES 
('Elder Care'),
('Post-Surgical Care'),
('Maternal Care'),
('Pediatric Care'),
('Physical Therapy'),
('Mental Health Care'),
('Palliative Care');
