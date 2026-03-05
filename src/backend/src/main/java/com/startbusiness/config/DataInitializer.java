package com.startbusiness.config;

import com.startbusiness.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserService userService;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting data initialization...");
        
        try {
            // Create default admin user if it doesn't exist
            if (userService.findByEmail("admin@startup.com").isEmpty()) {
                logger.info("Creating default admin user...");
                userService.createAdminUser("Super Admin", "admin@startup.com", "admin123");
                logger.info("Default admin user created successfully");
            } else {
                logger.info("Default admin user already exists");
            }
            
            logger.info("Data initialization completed successfully");
            
        } catch (Exception ex) {
            logger.error("Error during data initialization", ex);
        }
    }
}