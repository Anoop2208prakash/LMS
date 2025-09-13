
CREATE DATABASE IF NOT EXISTS auth_demo;
USE auth_demo;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- Plain text password (not recommended in production)
  role ENUM('admin', 'super_admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO users (username, email, password, role) VALUES
('admin1', 'admin@example.com', 'admin123', 'admin'),
('superman', 'super@example.com', 'super123', 'super_admin'),
('john', 'john@example.com', 'john123', 'user');
