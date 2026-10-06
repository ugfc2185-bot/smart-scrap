-- SmartScrap Database Schema

CREATE DATABASE IF NOT EXISTS smartscrap;
USE smartscrap;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE collectors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    vehicle_number VARCHAR(50),
    vehicle_type VARCHAR(50),
    license_number VARCHAR(100),
    status ENUM('active', 'inactive', 'on_duty') DEFAULT 'inactive',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 5.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE waste_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    points_per_kg INT NOT NULL,
    icon VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pickups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pickup_code VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    collector_id INT,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    scheduled_date DATE NOT NULL,
    time_slot VARCHAR(100) NOT NULL,
    status ENUM('requested', 'assigned', 'accepted', 'on_the_way', 'arrived', 'in_progress', 'weight_verified', 'completed', 'cancelled') DEFAULT 'requested',
    estimated_weight DECIMAL(10, 2),
    actual_weight DECIMAL(10, 2),
    estimated_points INT,
    final_points INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (collector_id) REFERENCES collectors(id)
);

CREATE TABLE pickup_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pickup_id INT NOT NULL,
    waste_category_id INT NOT NULL,
    estimated_weight DECIMAL(10, 2),
    actual_weight DECIMAL(10, 2),
    points INT,
    FOREIGN KEY (pickup_id) REFERENCES pickups(id),
    FOREIGN KEY (waste_category_id) REFERENCES waste_categories(id)
);

CREATE TABLE collector_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    collector_id INT NOT NULL,
    pickup_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collector_id) REFERENCES collectors(id),
    FOREIGN KEY (pickup_id) REFERENCES pickups(id)
);

CREATE TABLE rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INT NOT NULL,
    cash_value INT NOT NULL,
    image VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE reward_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reward_id INT NOT NULL,
    points_used INT NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reward_id) REFERENCES rewards(id)
);

CREATE TABLE point_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pickup_id INT,
    points INT NOT NULL,
    transaction_type ENUM('earned', 'redeemed') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pickup_id) REFERENCES pickups(id)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    collector_id INT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (collector_id) REFERENCES collectors(id)
);

-- Demo Data Seeding
INSERT INTO waste_categories (name, points_per_kg, icon) VALUES 
('Plastic', 10, 'Bottle'),
('Paper', 5, 'FileText'),
('Metal', 20, 'Box'),
('E-Waste', 30, 'Monitor'),
('Glass', 8, 'GlassWater');
