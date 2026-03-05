package com.startbusiness.dto;

import com.startbusiness.entity.User;

public class AuthResponse {
    
    private boolean success;
    private String message;
    private String token;
    private UserResponse user;
    
    // Default constructor
    public AuthResponse() {}
    
    // Constructor for success response
    public AuthResponse(boolean success, String message, String token, User user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user != null ? new UserResponse(user) : null;
    }
    
    // Constructor for error response
    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    // Static factory methods
    public static AuthResponse success(String message, String token, User user) {
        return new AuthResponse(true, message, token, user);
    }
    
    public static AuthResponse error(String message) {
        return new AuthResponse(false, message);
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserResponse getUser() {
        return user;
    }
    
    public void setUser(UserResponse user) {
        this.user = user;
    }
    
    @Override
    public String toString() {
        return "AuthResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", token='" + (token != null ? "***" : null) + '\'' +
                ", user=" + user +
                '}';
    }
}