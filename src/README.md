# StartBusiness Platform

A comprehensive business startup platform with React frontend and Spring Boot backend integration.

## 🚀 Features

### Frontend Features
- **Modern React Application** with TypeScript and Tailwind CSS
- **User Authentication** with JWT token management
- **Responsive Design** optimized for desktop and mobile
- **Professional Landing Page** with business features showcase
- **User Registration & Login** with form validation
- **CRM Dashboard** for business users with analytics
- **Super Admin Panel** with user management capabilities
- **Real-time API Integration** with Spring Boot backend
- **Error Handling & Loading States** for better UX
- **Session Management** with automatic token refresh

### Backend Integration
- **Spring Boot REST API** with MySQL database
- **JWT Authentication** with role-based access control
- **Security Configuration** with BCrypt password encryption
- **User Management System** with admin controls
- **Comprehensive Validation** and error handling
- **Production-ready Architecture** with proper layering

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Shadcn/ui** components
- **Lucide React** icons
- **Sonner** for notifications
- **Custom Hooks** for API integration

### Backend
- **Java Spring Boot 3.2**
- **Spring Security** with JWT
- **Spring Data JPA**
- **MySQL** database
- **Maven** build tool
- **BCrypt** password hashing

## 📦 Installation & Setup

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd startup-business-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   Update the `.env.local` file with your API URL:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Backend Setup

1. **Prerequisites**
   - Java 17 or higher
   - Maven 3.6+
   - MySQL 8.0+

2. **Database Setup**
   ```sql
   CREATE DATABASE startup_business;
   USE startup_business;
   
   -- Run the schema provided in /backend/SpringBootCode.md
   ```

3. **Application Configuration**
   Update `application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/startup_business
       username: your_username
       password: your_password
   ```

4. **Build and Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

## 🔐 Default Credentials

### Super Admin
- **Email:** admin@startup.com
- **Password:** admin123

### Demo User
- **Email:** john@example.com
- **Password:** password123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh

### User Management
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/change-password` - Change password

### Admin Operations
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/stats` - Get dashboard statistics
- `PUT /api/admin/users/{id}/status` - Update user status

## 🏗️ Project Structure

```
├── components/           # React components
│   ├── ui/              # Shadcn/ui components
│   ├── LandingPage.tsx  # Landing page component
│   ├── LoginForm.tsx    # Login form
│   ├── SignupForm.tsx   # Registration form
│   ├── CrmDashboard.tsx # User dashboard
│   └── SuperAdminDashboard.tsx # Admin panel
├── context/             # React context providers
│   └── AuthContext.tsx  # Authentication context
├── hooks/               # Custom React hooks
│   └── useApi.ts        # API integration hooks
├── services/            # API service layer
│   └── api.ts           # API calls and configuration
├── types/               # TypeScript type definitions
│   └── index.ts         # Application types
├── utils/               # Utility functions
│   ├── apiConfig.ts     # API configuration
│   ├── tokenManager.ts  # JWT token management
│   └── validation.ts    # Form validation utilities
└── backend/             # Spring Boot backend code
    └── SpringBootCode.md # Complete backend implementation
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development
REACT_APP_ENABLE_LOGGING=true
```

### Backend Configuration
Update `application.yml` for your environment:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/startup_business
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
  
jwt:
  secret: ${JWT_SECRET:your-secret-key}
  expiration: 86400000 # 24 hours
```

## 🔒 Security Features

- **JWT Token Authentication** with automatic refresh
- **Role-based Access Control** (User/Admin)
- **Password Encryption** using BCrypt
- **Session Management** with expiration warnings
- **CORS Configuration** for cross-origin requests
- **Input Validation** on both frontend and backend
- **XSS Protection** with input sanitization

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first Design** approach
- **Adaptive Layouts** for different screen sizes
- **Touch-friendly Interface** for mobile devices
- **Progressive Enhancement** for better performance

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the build folder to your hosting service
```

### Backend Deployment
```bash
mvn clean package
java -jar target/business-startup-1.0.0.jar
```

### Docker Deployment (Optional)
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]

# Backend Dockerfile
FROM openjdk:17-jdk-alpine
COPY target/business-startup-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 Support

For support, email support@startbusiness.com or join our Slack channel.

## 🎯 Roadmap

- [ ] Email notifications and verification
- [ ] File upload and document management
- [ ] Advanced analytics and reporting
- [ ] Mobile application
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Real-time notifications
- [ ] Advanced user permissions
- [ ] API rate limiting

## 📊 Performance

- **Frontend**: Optimized with code splitting and lazy loading
- **Backend**: Connection pooling and caching strategies
- **Database**: Indexed queries and optimized schema
- **Security**: Rate limiting and input validation

## 🔍 Monitoring

The application includes:
- **Health Check Endpoints** for monitoring
- **Error Boundary** for graceful error handling
- **Logging** for debugging and monitoring
- **Performance Metrics** tracking

---

Built with ❤️ using React, Spring Boot, and modern web technologies.