package com.startbusiness.security;

import com.startbusiness.entity.User;
import com.startbusiness.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Loading user by email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });
        
        // Check if user is active
        if (!user.getIsActive()) {
            logger.error("User account is inactive: {}", email);
            throw new UsernameNotFoundException("User account is inactive");
        }
        
        logger.debug("User found: {} with role: {}", email, user.getRole());
        
        return new CustomUserDetails(user);
    }
    
    // Custom UserDetails implementation
    public static class CustomUserDetails implements UserDetails {
        
        private final User user;
        
        public CustomUserDetails(User user) {
            this.user = user;
        }
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            List<GrantedAuthority> authorities = new ArrayList<>();
            
            // Add role as authority
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
            
            // Add specific permissions based on role
            if (user.getRole() == User.Role.ADMIN) {
                authorities.add(new SimpleGrantedAuthority("ADMIN_READ"));
                authorities.add(new SimpleGrantedAuthority("ADMIN_WRITE"));
                authorities.add(new SimpleGrantedAuthority("USER_READ"));
                authorities.add(new SimpleGrantedAuthority("USER_WRITE"));
            } else if (user.getRole() == User.Role.USER) {
                authorities.add(new SimpleGrantedAuthority("USER_READ"));
                authorities.add(new SimpleGrantedAuthority("USER_WRITE"));
            }
            
            return authorities;
        }
        
        @Override
        public String getPassword() {
            return user.getPassword();
        }
        
        @Override
        public String getUsername() {
            return user.getEmail();
        }
        
        @Override
        public boolean isAccountNonExpired() {
            return true;
        }
        
        @Override
        public boolean isAccountNonLocked() {
            return user.getIsActive();
        }
        
        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }
        
        @Override
        public boolean isEnabled() {
            return user.getIsActive();
        }
        
        // Get the actual User entity
        public User getUser() {
            return user;
        }
        
        // Get user ID
        public Long getUserId() {
            return user.getId();
        }
        
        // Get user role
        public User.Role getUserRole() {
            return user.getRole();
        }
        
        // Check if user is admin
        public boolean isAdmin() {
            return user.getRole() == User.Role.ADMIN;
        }
    }
}