# StartBusiness Platform Backend

Complete Spring Boot backend for the StartBusiness platform with JWT authentication, MySQL database, and admin panel.

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (or use H2 for development)

### 1. Clone & Setup
```bash
cd backend
```

### 2. Database Setup (MySQL)
```sql
CREATE DATABASE startup_business;
USE startup_business;
```

### 3. Configure Database
Update `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/startup_business
    username: your_username
    password: your_password
```

### 4. Run the Application

#### Option 1: Using Maven
```bash
mvn clean install
mvn spring-boot:run
```

#### Option 2: Using Java
```bash
mvn clean package
java -jar target/business-platform-1.0.0.jar
```

#### Option 3: Development Mode (H2 Database)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## 🔧 Configuration

### Environment Profiles

#### Development Profile (`dev`)
- Uses H2 in-memory database
- H2 Console available at: `http://localhost:8080/api/h2-console`
- Database URL: `jdbc:h2:mem:testdb`
- Username: `sa`, Password: `password`

#### Production Profile (`prod`)
- Uses MySQL database
- Enhanced security settings
- Minimal logging

### Default Credentials

#### Super Admin
- **Email:** admin@startup.com
- **Password:** admin123

#### Demo Users
- **Email:** john@example.com, **Password:** password123
- **Email:** jane@example.com, **Password:** password123

## 📡 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints
```
POST /auth/login      - User login
POST /auth/register   - User registration
POST /auth/logout     - User logout
POST /auth/refresh    - Refresh JWT token
```

### User Endpoints
```
GET  /user/profile           - Get current user profile
PUT  /user/profile           - Update user profile
POST /user/change-password   - Change password
DELETE /user/account         - Delete user account
```

### Admin Endpoints (Requires ADMIN role)
```
GET  /admin/users            - Get all users
GET  /admin/users/active     - Get active users
PUT  /admin/users/{id}/status - Update user status
DELETE /admin/users/{id}     - Delete user
GET  /admin/users/search     - Search users
GET  /admin/stats            - Get dashboard statistics
```

### System Endpoints
```
GET /health - Health check
GET /info   - Application information
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login/Register** returns a JWT token
2. **Include token** in subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Token expires** in 24 hours (configurable)
4. **Refresh endpoint** available for token renewal

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    business_category VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🛠️ Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package -Pprod
```

### Environment Variables
```bash
export DB_USERNAME=your_username
export DB_PASSWORD=your_password
export JWT_SECRET=your-secret-key
```

## 🔧 Configuration Options

### JWT Settings
```yaml
jwt:
  secret: your-secret-key-here
  expiration: 86400000  # 24 hours
```

### CORS Settings
```yaml
spring:
  web:
    cors:
      allowed-origins: "http://localhost:3000"
      allowed-methods: "GET,POST,PUT,DELETE,OPTIONS"
      allowed-headers: "*"
      allow-credentials: true
```

## 📝 API Usage Examples

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@startup.com",
    "password": "admin123"
  }'
```

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "phoneNumber": "+1234567890",
    "businessCategory": "Technology",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Get Profile (with JWT)
```bash
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Admin - Get All Users
```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-alpine
COPY target/business-platform-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Application Properties for Production
```yaml
server:
  port: 8080
spring:
  profiles:
    active: prod
  datasource:
    url: ${DATABASE_URL:jdbc:mysql://localhost:3306/startup_business}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
jwt:
  secret: ${JWT_SECRET:your-production-secret}
  expiration: ${JWT_EXPIRATION:86400000}
```

## 🔍 Monitoring & Health

### Health Check
```bash
curl http://localhost:8080/api/health
```

### Application Info
```bash
curl http://localhost:8080/api/info
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify credentials in application.yml
   - Ensure database exists

2. **JWT Token Issues**
   - Check token expiration
   - Verify JWT secret configuration
   - Ensure proper Authorization header format

3. **CORS Issues**
   - Update allowed origins in SecurityConfig
   - Check preflight OPTIONS requests

4. **Permission Denied**
   - Verify user role (USER/ADMIN)
   - Check endpoint security configuration

### Logs
Application logs are available in the console. For production, configure file logging:

```yaml
logging:
  file:
    name: logs/app.log
  level:
    com.startbusiness: INFO
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.