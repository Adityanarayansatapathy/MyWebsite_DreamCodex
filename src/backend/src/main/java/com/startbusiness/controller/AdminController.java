package com.startbusiness.controller;

import com.startbusiness.dto.DashboardStats;
import com.startbusiness.dto.UserResponse;
import com.startbusiness.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        logger.info("Admin fetching all users");
        
        try {
            List<UserResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
            
        } catch (Exception ex) {
            logger.error("Failed to fetch all users", ex);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/users/active")
    public ResponseEntity<List<UserResponse>> getActiveUsers() {
        logger.info("Admin fetching active users");
        
        try {
            List<UserResponse> users = userService.getActiveUsers();
            return ResponseEntity.ok(users);
            
        } catch (Exception ex) {
            logger.error("Failed to fetch active users", ex);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long userId, 
            @RequestParam Boolean isActive) {
        
        logger.info("Admin updating user status - ID: {}, Active: {}", userId, isActive);
        
        try {
            UserResponse updatedUser = userService.updateUserStatus(userId, isActive);
            return ResponseEntity.ok(updatedUser);
            
        } catch (Exception ex) {
            logger.error("Failed to update user status", ex);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long userId) {
        logger.info("Admin deleting user with ID: {}", userId);
        
        try {
            userService.deleteUser(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception ex) {
            logger.error("Failed to delete user", ex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete user");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/users/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String query) {
        logger.info("Admin searching users with query: {}", query);
        
        try {
            List<UserResponse> users = userService.searchUsers(query);
            return ResponseEntity.ok(users);
            
        } catch (Exception ex) {
            logger.error("Failed to search users", ex);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        logger.info("Admin fetching dashboard statistics");
        
        try {
            DashboardStats stats = userService.getDashboardStats();
            return ResponseEntity.ok(stats);
            
        } catch (Exception ex) {
            logger.error("Failed to fetch dashboard statistics", ex);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/users/{userId}/promote")
    public ResponseEntity<Map<String, Object>> promoteUserToAdmin(@PathVariable Long userId) {
        logger.info("Admin promoting user to admin - ID: {}", userId);
        
        try {
            // This would require additional logic in UserService
            // For now, returning a placeholder response
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Feature not implemented yet");
            
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception ex) {
            logger.error("Failed to promote user", ex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to promote user");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}