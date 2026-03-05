package com.startbusiness.controller;

import com.startbusiness.dto.UserResponse;
import com.startbusiness.entity.User;
import com.startbusiness.security.CustomUserDetailsService;
import com.startbusiness.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getCurrentUser() {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetailsService.CustomUserDetails userDetails = 
                (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
            
            User user = userDetails.getUser();
            logger.info("Fetching profile for user: {}", user.getEmail());
            
            return ResponseEntity.ok(new UserResponse(user));
            
        } catch (Exception ex) {
            logger.error("Failed to fetch current user profile", ex);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody UserResponse userRequest) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetailsService.CustomUserDetails userDetails = 
                (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
            
            Long userId = userDetails.getUserId();
            logger.info("Updating profile for user ID: {}", userId);
            
            UserResponse updatedUser = userService.updateUserProfile(userId, userRequest);
            
            return ResponseEntity.ok(updatedUser);
            
        } catch (Exception ex) {
            logger.error("Failed to update user profile", ex);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> passwordRequest) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetailsService.CustomUserDetails userDetails = 
                (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
            
            Long userId = userDetails.getUserId();
            String oldPassword = passwordRequest.get("oldPassword");
            String newPassword = passwordRequest.get("newPassword");
            
            logger.info("Changing password for user ID: {}", userId);
            
            // Validate input
            if (oldPassword == null || newPassword == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Old password and new password are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            userService.changePassword(userId, oldPassword, newPassword);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password changed successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception ex) {
            logger.error("Failed to change password", ex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", ex.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/account")
    public ResponseEntity<Map<String, Object>> deleteAccount() {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetailsService.CustomUserDetails userDetails = 
                (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
            
            Long userId = userDetails.getUserId();
            logger.info("Deleting account for user ID: {}", userId);
            
            userService.deleteUser(userId);
            
            // Clear security context
            SecurityContextHolder.clearContext();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Account deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception ex) {
            logger.error("Failed to delete account", ex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete account");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}