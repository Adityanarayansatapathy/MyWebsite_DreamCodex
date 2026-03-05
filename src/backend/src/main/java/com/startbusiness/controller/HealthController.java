package com.startbusiness.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {
    
    @Autowired
    private DataSource dataSource;
    
    @Autowired(required = false)
    private BuildProperties buildProperties;
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // Check database connectivity
            try (Connection connection = dataSource.getConnection()) {
                boolean isDbHealthy = connection.isValid(1);
                health.put("database", isDbHealthy ? "UP" : "DOWN");
            }
            
            // Application info
            health.put("status", "UP");
            health.put("timestamp", LocalDateTime.now());
            health.put("service", "StartBusiness Platform Backend");
            
            if (buildProperties != null) {
                health.put("version", buildProperties.getVersion());
                health.put("artifact", buildProperties.getArtifact());
            } else {
                health.put("version", "1.0.0");
                health.put("artifact", "business-platform");
            }
            
            // System info
            Runtime runtime = Runtime.getRuntime();
            Map<String, Object> system = new HashMap<>();
            system.put("totalMemory", runtime.totalMemory());
            system.put("freeMemory", runtime.freeMemory());
            system.put("maxMemory", runtime.maxMemory());
            system.put("processors", runtime.availableProcessors());
            health.put("system", system);
            
            return ResponseEntity.ok(health);
            
        } catch (Exception ex) {
            health.put("status", "DOWN");
            health.put("error", ex.getMessage());
            health.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(503).body(health);
        }
    }
    
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        Map<String, Object> info = new HashMap<>();
        
        info.put("app", "StartBusiness Platform Backend API");
        info.put("description", "Spring Boot backend for StartBusiness platform");
        info.put("timestamp", LocalDateTime.now());
        
        if (buildProperties != null) {
            info.put("version", buildProperties.getVersion());
            info.put("artifact", buildProperties.getArtifact());
            info.put("group", buildProperties.getGroup());
            info.put("buildTime", buildProperties.getTime());
        }
        
        // API endpoints info
        Map<String, Object> endpoints = new HashMap<>();
        endpoints.put("auth", "/auth/* - Authentication endpoints");
        endpoints.put("user", "/user/* - User profile endpoints");
        endpoints.put("admin", "/admin/* - Admin management endpoints");
        endpoints.put("health", "/health - Health check endpoint");
        info.put("endpoints", endpoints);
        
        return ResponseEntity.ok(info);
    }
}