package com.startbusiness.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${app.mail.from:noreply@startbusiness.com}")
    private String fromEmail;
    
    @Value("${app.mail.enabled:false}")
    private boolean emailEnabled;
    
    public void sendEmailVerification(String toEmail, String userName, String verificationToken) {
        if (!emailEnabled || mailSender == null) {
            logger.warn("Email service is disabled or not configured. Skipping email for: {}", toEmail);
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to StartBusiness - Verify Your Email");
            
            String htmlContent = buildVerificationEmailTemplate(userName, verificationToken);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Verification email sent successfully to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send verification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
    
    public void sendPasswordResetEmail(String toEmail, String userName, String resetToken) {
        if (!emailEnabled || mailSender == null) {
            logger.warn("Email service is disabled or not configured. Skipping password reset email for: {}", toEmail);
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("StartBusiness - Password Reset Request");
            
            String htmlContent = buildPasswordResetEmailTemplate(userName, resetToken);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
    
    public void sendWelcomeEmail(String toEmail, String userName) {
        if (!emailEnabled || mailSender == null) {
            logger.warn("Email service is disabled or not configured. Skipping welcome email for: {}", toEmail);
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to StartBusiness - Your Business Journey Begins!");
            
            String htmlContent = buildWelcomeEmailTemplate(userName);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Welcome email sent successfully to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send welcome email to: {}", toEmail, e);
        }
    }
    
    private String buildVerificationEmailTemplate(String userName, String verificationToken) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "    <title>Email Verification</title>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }" +
                "        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }" +
                "        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }" +
                "        .header h1 { color: #ffffff; margin: 0; font-size: 28px; }" +
                "        .content { padding: 40px 30px; }" +
                "        .verification-box { background-color: #f8f9fa; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0; }" +
                "        .verification-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 20px 0; }" +
                "        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; margin: 20px 0; }" +
                "        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>🚀 StartBusiness</h1>" +
                "            <p style='color: #ffffff; margin: 10px 0; opacity: 0.9;'>Enterprise Solutions</p>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <h2 style='color: #343a40; margin-bottom: 20px;'>Welcome " + userName + "!</h2>" +
                "            <p style='color: #6c757d; font-size: 16px; line-height: 1.6;'>" +
                "                Thank you for joining StartBusiness! To complete your registration and start your business journey, " +
                "                please verify your email address using the verification code below." +
                "            </p>" +
                "            <div class='verification-box'>" +
                "                <h3 style='color: #343a40; margin-bottom: 10px;'>Your Verification Code</h3>" +
                "                <div class='verification-code'>" + verificationToken + "</div>" +
                "                <p style='color: #6c757d; font-size: 14px; margin-top: 15px;'>" +
                "                    This code will expire in 15 minutes for security purposes." +
                "                </p>" +
                "            </div>" +
                "            <div style='background-color: #e7f3ff; border-radius: 10px; padding: 20px; margin: 30px 0;'>" +
                "                <h4 style='color: #0066cc; margin-top: 0;'>🎯 What's Next?</h4>" +
                "                <ul style='color: #6c757d; padding-left: 20px;'>" +
                "                    <li>Access your comprehensive CRM dashboard</li>" +
                "                    <li>Set up your business profile</li>" +
                "                    <li>Start managing contacts and leads</li>" +
                "                    <li>Explore analytics and insights</li>" +
                "                </ul>" +
                "            </div>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>© 2024 StartBusiness. All rights reserved.</p>" +
                "            <p>Empowering entrepreneurs to build successful businesses.</p>" +
                "            <p>If you didn't create an account, please ignore this email.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
    
    private String buildPasswordResetEmailTemplate(String userName, String resetToken) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "    <title>Password Reset</title>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }" +
                "        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }" +
                "        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 20px; text-align: center; }" +
                "        .header h1 { color: #ffffff; margin: 0; font-size: 28px; }" +
                "        .content { padding: 40px 30px; }" +
                "        .reset-box { background-color: #fff5f5; border: 2px solid #ff6b6b; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0; }" +
                "        .reset-code { font-size: 32px; font-weight: bold; color: #ff6b6b; letter-spacing: 5px; margin: 20px 0; }" +
                "        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>🔐 Password Reset</h1>" +
                "            <p style='color: #ffffff; margin: 10px 0; opacity: 0.9;'>StartBusiness Security</p>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <h2 style='color: #343a40; margin-bottom: 20px;'>Hello " + userName + ",</h2>" +
                "            <p style='color: #6c757d; font-size: 16px; line-height: 1.6;'>" +
                "                We received a request to reset your password. Use the code below to create a new password:" +
                "            </p>" +
                "            <div class='reset-box'>" +
                "                <h3 style='color: #ff6b6b; margin-bottom: 10px;'>Password Reset Code</h3>" +
                "                <div class='reset-code'>" + resetToken + "</div>" +
                "                <p style='color: #6c757d; font-size: 14px; margin-top: 15px;'>" +
                "                    This code will expire in 15 minutes." +
                "                </p>" +
                "            </div>" +
                "            <div style='background-color: #fff3cd; border-radius: 10px; padding: 20px; margin: 30px 0;'>" +
                "                <h4 style='color: #856404; margin-top: 0;'>⚠️ Security Notice</h4>" +
                "                <p style='color: #856404; margin: 0;'>" +
                "                    If you didn't request this password reset, please ignore this email and your password will remain unchanged." +
                "                "</p>" +
                "            </div>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>© 2024 StartBusiness. All rights reserved.</p>" +
                "            <p>For security questions, contact our support team.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
    
    private String buildWelcomeEmailTemplate(String userName) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "    <title>Welcome to StartBusiness</title>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }" +
                "        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }" +
                "        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 20px; text-align: center; }" +
                "        .header h1 { color: #ffffff; margin: 0; font-size: 28px; }" +
                "        .content { padding: 40px 30px; }" +
                "        .feature-box { background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0; }" +
                "        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>🎉 Welcome to StartBusiness!</h1>" +
                "            <p style='color: #ffffff; margin: 10px 0; opacity: 0.9;'>Your business journey starts here</p>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <h2 style='color: #343a40; margin-bottom: 20px;'>Hello " + userName + "!</h2>" +
                "            <p style='color: #6c757d; font-size: 16px; line-height: 1.6;'>" +
                "                Congratulations! Your email has been verified and your StartBusiness account is now active. " +
                "                You're all set to explore our powerful business management platform." +
                "            </p>" +
                "            <div class='feature-box'>" +
                "                <h4 style='color: #28a745; margin-top: 0;'>🚀 What you can do now:</h4>" +
                "                <ul style='color: #6c757d; padding-left: 20px;'>" +
                "                    <li><strong>CRM Dashboard:</strong> Manage contacts and track leads</li>" +
                "                    <li><strong>Analytics:</strong> Get insights into your business performance</li>" +
                "                    <li><strong>Profile Management:</strong> Customize your business profile</li>" +
                "                    <li><strong>24/7 Support:</strong> Get help whenever you need it</li>" +
                "                "</ul>" +
                "            </div>" +
                "            <div style='text-align: center; margin: 30px 0;'>" +
                "                <p style='color: #6c757d; margin-bottom: 20px;'>Ready to get started?</p>" +
                "                <a href='#' style='display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold;'>" +
                "                    Access Your Dashboard" +
                "                "</a>" +
                "            </div>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>© 2024 StartBusiness. All rights reserved.</p>" +
                "            <p>Thank you for choosing StartBusiness for your entrepreneurial journey!</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
    
    // For demo purposes - simulate email sending
    public void logEmailInConsole(String type, String toEmail, String userName, String token) {
        logger.info("=".repeat(80));
        logger.info("📧 EMAIL SIMULATION - {} EMAIL", type.toUpperCase());
        logger.info("=".repeat(80));
        logger.info("To: {}", toEmail);
        logger.info("User: {}", userName);
        
        if ("VERIFICATION".equals(type)) {
            logger.info("Subject: Welcome to StartBusiness - Verify Your Email");
            logger.info("Verification Code: {}", token);
            logger.info("Message: Please use this code to verify your email address.");
        } else if ("PASSWORD_RESET".equals(type)) {
            logger.info("Subject: StartBusiness - Password Reset Request");
            logger.info("Reset Code: {}", token);
            logger.info("Message: Use this code to reset your password.");
        } else if ("WELCOME".equals(type)) {
            logger.info("Subject: Welcome to StartBusiness - Your Business Journey Begins!");
            logger.info("Message: Your email has been verified! Welcome to StartBusiness.");
        }
        
        logger.info("=".repeat(80));
    }
}