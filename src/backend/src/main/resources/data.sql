-- Default admin user (password: admin123)
-- This will only run if the user doesn't already exist
INSERT IGNORE INTO users (id, name, email, phone_number, business_category, password, role, is_active, created_at, updated_at)
VALUES (1, 'Super Admin', 'admin@startup.com', '+1111111111', 'Administration', 
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
        'ADMIN', true, NOW(), NOW());

-- Sample users for development (password: password123)
INSERT IGNORE INTO users (id, name, email, phone_number, business_category, password, role, is_active, created_at, updated_at)
VALUES 
(2, 'John Doe', 'john@example.com', '+1234567890', 'Technology', 
 '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSektzJcyOQT.9rZ8MHwJIi8u', -- password123
 'USER', true, NOW(), NOW()),

(3, 'Jane Smith', 'jane@example.com', '+0987654321', 'Retail', 
 '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSektzJcyOQT.9rZ8MHwJIi8u', -- password123
 'USER', true, NOW(), NOW()),

(4, 'Mike Johnson', 'mike@example.com', '+5555555555', 'Healthcare', 
 '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSektzJcyOQT.9rZ8MHwJIi8u', -- password123
 'USER', true, NOW(), NOW()),

(5, 'Sarah Wilson', 'sarah@example.com', '+7777777777', 'Finance', 
 '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSektzJcyOQT.9rZ8MHwJIi8u', -- password123
 'USER', false, NOW(), NOW());

-- Reset auto increment (optional)
-- ALTER TABLE users AUTO_INCREMENT = 6;