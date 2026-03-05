package com.startbusiness.controller;

import com.startbusiness.dto.AuthResponse;
import com.startbusiness.dto.LoginRequest;
import com.startbusiness.dto.SignupRequest;
import com.startbusiness.entity.User;
import com.startbusiness.security.CustomUserDetailsService;
import com.startbusiness.security.JwtUtil;
import com.startbusiness.service.UserService;
import com.startbusiness.service.EmailService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private EmailService emailService;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for email: {}", loginRequest.getEmail());
        
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            
            // Get user details
            CustomUserDetailsService.CustomUserDetails userDetails = 
                (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
            
            User user = userDetails.getUser();
            
            // Generate JWT token with user information
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("role", user.getRole().name());
            claims.put("email", user.getEmail());
            
            String token = jwtUtil.generateToken(userDetails, claims);
            
            logger.info("Login successful for user: {}", loginRequest.getEmail());
            
            return ResponseEntity.ok(AuthResponse.success("Login successful", token, user));
            
        } catch (Exception ex) {
            logger.error("Login failed for email: {}", loginRequest.getEmail(), ex);
            return ResponseEntity.badRequest()
                .body(AuthResponse.error("Invalid email or password"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody SignupRequest signupRequest) {
        logger.info("Registration attempt for email: {}", signupRequest.getEmail());
        
        try {
            // Create new user (but not verified yet)
            User user = userService.createUser(signupRequest);
            
            // Generate and send email verification
            String verificationToken = userService.generateEmailVerificationToken(user);
            
            // Send verification email (or log it in demo mode)
            try {
                emailService.sendEmailVerification(user.getEmail(), user.getName(), verificationToken);
            } catch (Exception e) {
                // Fallback to console logging for demo
                emailService.logEmailInConsole("VERIFICATION", user.getEmail(), user.getName(), verificationToken);
            }
            
            logger.info("Registration initiated for user: {} - Verification email sent", signupRequest.getEmail());
            
            return ResponseEntity.ok(AuthResponse.success(
                "Registration successful! Please check your email for verification code.", 
                null, 
                user
            ));
            
        } catch (Exception ex) {
            logger.error("Registration failed for email: {}", signupRequest.getEmail(), ex);
            return ResponseEntity.badRequest()
                .body(AuthResponse.error(ex.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        // Clear security context
        SecurityContextHolder.clearContext();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        
        logger.info("User logged out successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                if (jwtUtil.validateToken(token)) {
                    String username = jwtUtil.extractUsername(token);
                    Long userId = jwtUtil.extractUserId(token);
                    String role = jwtUtil.extractUserRole(token);
                    
                    // Generate new token
                    Map<String, Object> claims = new HashMap<>();
                    claims.put("userId", userId);
                    claims.put("role", role);
                    claims.put("email", username);
                    
                    CustomUserDetailsService.CustomUserDetails userDetails = 
                        (CustomUserDetailsService.CustomUserDetails) 
                        new CustomUserDetailsService().loadUserByUsername(username);
                    
                    String newToken = jwtUtil.generateToken(userDetails, claims);
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("token", newToken);
                    response.put("message", "Token refreshed successfully");
                    
                    return ResponseEntity.ok(response);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid or expired token");
            
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception ex) {
            logger.error("Token refresh failed", ex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Token refresh failed");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(
            @RequestParam String email,
            @RequestParam String token) {
        
        logger.info("Email verification attempt for: {}", email);
        
        try {
            boolean isVerified = userService.verifyEmail(email, token);
            
            if (isVerified) {
                // Get verified user
                User user = userService.findByEmailAddress(email);
                
                // Generate JWT token now that email is verified
                CustomUserDetailsService.CustomUserDetails userDetails = 
                    new CustomUserDetailsService.CustomUserDetails(user);
                
                Map<String, Object> claims = new HashMap<>();
                claims.put("userId", user.getId());
                claims.put("role", user.getRole().name());
                claims.put("email", user.getEmail());
                
                String jwtToken = jwtUtil.generateToken(userDetails, claims);
                
                // Send welcome email
                try {
                    emailService.sendWelcomeEmail(user.getEmail(), user.getName());
                } catch (Exception e) {
                    emailService.logEmailInConsole("WELCOME", user.getEmail(), user.getName(), "");
                }
                
                logger.info("Email verification successful for: {}", email);
                
                return ResponseEntity.ok(AuthResponse.success(
                    "Email verified successfully! Welcome to StartBusiness!", 
                    jwtToken, 
                    user
                ));
            } else {
                return ResponseEntity.badRequest()
                    .body(AuthResponse.error("Invalid or expired verification token"));
            }
            
        } catch (Exception ex) {
            logger.error("Email verification failed for: {}", email, ex);
            return ResponseEntity.badRequest()
                .body(AuthResponse.error("Email verification failed"));
        }
    }
    
    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, Object>> resendVerification(@RequestParam String email) {
        logger.info("Resend verification request for: {}", email);
        
        try {
            User user = userService.findByEmailAddress(email);
            
            if (user == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (user.getIsEmailVerified()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email already verified");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Generate new verification token
            String verificationToken = userService.generateEmailVerificationToken(user);
            
            // Send verification email
            try {
                emailService.sendEmailVerification(user.getEmail(), user.getName(), verificationToken);
            } catch (Exception e) {
                emailService.logEmailInConsole("VERIFICATION", user.getEmail(), user.getName(), verificationToken);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Verification email sent successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception ex) {
            logger.error("Resend verification failed for: {}", email, ex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to resend verification email");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}