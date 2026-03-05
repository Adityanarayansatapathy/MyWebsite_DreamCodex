package com.startbusiness.service;

import com.startbusiness.dto.DashboardStats;
import com.startbusiness.dto.SignupRequest;
import com.startbusiness.dto.UserResponse;
import com.startbusiness.entity.User;
import com.startbusiness.exception.UserAlreadyExistsException;
import com.startbusiness.exception.UserNotFoundException;
import com.startbusiness.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Create new user
    public User createUser(SignupRequest signupRequest) {
        logger.info("Creating new user with email: {}", signupRequest.getEmail());
        
        // Check if user already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new UserAlreadyExistsException("User with email " + signupRequest.getEmail() + " already exists");
        }
        
        // Validate password confirmation
        if (!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        
        // Create new user
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        user.setBusinessCategory(signupRequest.getBusinessCategory());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setRole(User.Role.USER);
        user.setIsActive(true);
        user.setIsEmailVerified(false); // Email not verified initially
        
        User savedUser = userRepository.save(user);
        logger.info("User created successfully with ID: {}", savedUser.getId());
        
        return savedUser;
    }
    
    // Find user by email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Find user by email (without Optional)
    public User findByEmailAddress(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    // Find user by ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    // Get all users
    public List<UserResponse> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get active users
    public List<UserResponse> getActiveUsers() {
        return userRepository.findByIsActive(true)
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    // Update user status
    public UserResponse updateUserStatus(Long userId, Boolean isActive) {
        logger.info("Updating user status for ID: {} to {}", userId, isActive);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        
        user.setIsActive(isActive);
        User updatedUser = userRepository.save(user);
        
        logger.info("User status updated successfully");
        return new UserResponse(updatedUser);
    }
    
    // Update user profile
    public UserResponse updateUserProfile(Long userId, UserResponse userRequest) {
        logger.info("Updating user profile for ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        
        // Update allowed fields
        if (userRequest.getName() != null) {
            user.setName(userRequest.getName());
        }
        if (userRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(userRequest.getPhoneNumber());
        }
        if (userRequest.getBusinessCategory() != null) {
            user.setBusinessCategory(userRequest.getBusinessCategory());
        }
        
        User updatedUser = userRepository.save(user);
        logger.info("User profile updated successfully");
        
        return new UserResponse(updatedUser);
    }
    
    // Change user password
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        logger.info("Changing password for user ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        
        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        logger.info("Password changed successfully for user ID: {}", userId);
    }
    
    // Delete user
    public void deleteUser(Long userId) {
        logger.info("Deleting user with ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        
        userRepository.delete(user);
        logger.info("User deleted successfully");
    }
    
    // Search users
    public List<UserResponse> searchUsers(String searchTerm) {
        logger.info("Searching users with term: {}", searchTerm);
        
        return userRepository.searchUsers(searchTerm)
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get dashboard statistics
    public DashboardStats getDashboardStats() {
        logger.info("Fetching dashboard statistics");
        
        Long totalUsers = userRepository.countTotalUsers();
        Long activeUsers = userRepository.countActiveUsers();
        Long inactiveUsers = totalUsers - activeUsers;
        
        // Get distinct business categories count
        List<String> businessCategories = userRepository.findDistinctBusinessCategories();
        Long totalBusinesses = (long) businessCategories.size();
        
        // Get new registrations in last 30 days
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        Long newRegistrations = userRepository.countNewRegistrations(thirtyDaysAgo);
        
        // Calculate growth rate (new registrations vs previous 30 days)
        LocalDateTime sixtyDaysAgo = LocalDateTime.now().minusDays(60);
        Long previousMonthRegistrations = userRepository.countNewRegistrations(sixtyDaysAgo) - newRegistrations;
        Double growthRate = previousMonthRegistrations > 0 ? 
            ((double) (newRegistrations - previousMonthRegistrations) / previousMonthRegistrations) * 100 : 0.0;
        
        DashboardStats stats = new DashboardStats(
            totalUsers, activeUsers, inactiveUsers,
            totalBusinesses, newRegistrations, 
            0L, // recentLogins - would need separate tracking
            growthRate
        );
        
        logger.info("Dashboard statistics fetched: {}", stats);
        return stats;
    }
    
    // Create admin user (for initialization)
    public User createAdminUser(String name, String email, String password) {
        logger.info("Creating admin user with email: {}", email);
        
        if (userRepository.existsByEmail(email)) {
            logger.warn("Admin user already exists with email: {}", email);
            return userRepository.findByEmail(email).orElse(null);
        }
        
        User admin = new User();
        admin.setName(name);
        admin.setEmail(email);
        admin.setPhoneNumber("+1111111111");
        admin.setBusinessCategory("Administration");
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole(User.Role.ADMIN);
        admin.setIsActive(true);
        
        User savedAdmin = userRepository.save(admin);
        logger.info("Admin user created successfully with ID: {}", savedAdmin.getId());
        
        return savedAdmin;
    }
    
    // Generate email verification token
    public String generateEmailVerificationToken(User user) {
        // Generate 6-digit OTP
        Random random = new Random();
        String token = String.format("%06d", random.nextInt(1000000));
        
        // Set token and expiry (15 minutes from now)
        user.setEmailVerificationToken(token);
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusMinutes(15));
        
        userRepository.save(user);
        
        logger.info("Email verification token generated for user: {}", user.getEmail());
        return token;
    }
    
    // Verify email with token
    public boolean verifyEmail(String email, String token) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            logger.warn("Email verification failed - user not found: {}", email);
            return false;
        }
        
        User user = userOpt.get();
        
        // Check if already verified
        if (user.getIsEmailVerified()) {
            logger.info("Email already verified for user: {}", email);
            return true;
        }
        
        // Check token
        if (user.getEmailVerificationToken() == null || 
            !user.getEmailVerificationToken().equals(token)) {
            logger.warn("Email verification failed - invalid token for user: {}", email);
            return false;
        }
        
        // Check expiry
        if (user.getEmailVerificationTokenExpiry() == null || 
            user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            logger.warn("Email verification failed - expired token for user: {}", email);
            return false;
        }
        
        // Mark as verified and clear token
        user.setIsEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);
        
        userRepository.save(user);
        
        logger.info("Email verified successfully for user: {}", email);
        return true;
    }
    
    // Update user profile with image
    public UserResponse updateUserProfile(Long userId, UserResponse userRequest, String profileImageUrl) {
        logger.info("Updating user profile for ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        
        // Update allowed fields
        if (userRequest.getName() != null) {
            user.setName(userRequest.getName());
        }
        if (userRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(userRequest.getPhoneNumber());
        }
        if (userRequest.getBusinessCategory() != null) {
            user.setBusinessCategory(userRequest.getBusinessCategory());
        }
        if (profileImageUrl != null) {
            user.setProfileImageUrl(profileImageUrl);
        }
        
        User updatedUser = userRepository.save(user);
        logger.info("User profile updated successfully");
        
        return new UserResponse(updatedUser);
    }
}