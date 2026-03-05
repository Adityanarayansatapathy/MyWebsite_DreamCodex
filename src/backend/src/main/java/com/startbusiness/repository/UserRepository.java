package com.startbusiness.repository;

import com.startbusiness.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find user by email
    Optional<User> findByEmail(String email);
    
    // Check if email exists
    Boolean existsByEmail(String email);
    
    // Find users by role
    List<User> findByRole(User.Role role);
    
    // Find active/inactive users
    List<User> findByIsActive(Boolean isActive);
    
    // Find users by business category
    List<User> findByBusinessCategory(String businessCategory);
    
    // Find users created after a certain date
    List<User> findByCreatedAtAfter(LocalDateTime date);
    
    // Count total users
    @Query("SELECT COUNT(u) FROM User u")
    Long countTotalUsers();
    
    // Count active users
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    Long countActiveUsers();
    
    // Count users by role
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countUsersByRole(@Param("role") User.Role role);
    
    // Count new registrations in last 30 days
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :date")
    Long countNewRegistrations(@Param("date") LocalDateTime date);
    
    // Get distinct business categories
    @Query("SELECT DISTINCT u.businessCategory FROM User u")
    List<String> findDistinctBusinessCategories();
    
    // Search users by name or email
    @Query("SELECT u FROM User u WHERE u.name LIKE %:searchTerm% OR u.email LIKE %:searchTerm%")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);
    
    // Find users by multiple criteria
    @Query("SELECT u FROM User u WHERE " +
           "(:name IS NULL OR u.name LIKE %:name%) AND " +
           "(:email IS NULL OR u.email LIKE %:email%) AND " +
           "(:businessCategory IS NULL OR u.businessCategory = :businessCategory) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive)")
    List<User> findByCriteria(@Param("name") String name,
                             @Param("email") String email,
                             @Param("businessCategory") String businessCategory,
                             @Param("isActive") Boolean isActive);
}