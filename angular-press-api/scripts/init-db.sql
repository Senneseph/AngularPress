-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS angular_press CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE angular_press;

-- The tables will be created automatically by TypeORM synchronize
-- This script is just to ensure the database exists

-- Optional: Create a default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt with 10 rounds
-- You can generate this using: bcrypt.hash('admin123', 10)
-- INSERT INTO wp_users (user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name)
-- VALUES ('admin', '$2b$10$YourHashedPasswordHere', 'admin', 'admin@example.com', '', NOW(), '', 0, 'Administrator');

