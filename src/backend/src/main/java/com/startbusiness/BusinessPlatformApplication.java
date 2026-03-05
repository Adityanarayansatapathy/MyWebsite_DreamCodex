package com.startbusiness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BusinessPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(BusinessPlatformApplication.class, args);
        System.out.println("\n" +
                "================================================\n" +
                "   StartBusiness Platform Backend Started!    \n" +
                "   Server running on: http://localhost:8080   \n" +
                "   API Base URL: http://localhost:8080/api    \n" +
                "   H2 Console: http://localhost:8080/api/h2-console (dev profile)\n" +
                "   Health Check: http://localhost:8080/api/health\n" +
                "================================================\n");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}