@echo off
:: StartBusiness Platform Backend Runner Script for Windows

echo ================================================
echo    StartBusiness Platform Backend Setup       
echo ================================================

:: Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
) else (
    echo [OK] Java is installed
)

:: Check if Maven is installed
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Maven is not installed or not in PATH
    echo Please install Maven 3.6 or higher
    pause
    exit /b 1
) else (
    echo [OK] Maven is installed
)

:: Check if we're in the right directory
if not exist "pom.xml" (
    echo [ERROR] pom.xml not found. Please run this script from the backend directory.
    pause
    exit /b 1
)

:: Handle command line arguments
if "%1"=="build" goto build
if "%1"=="package" goto package
if "%1"=="dev" goto dev
if "%1"=="prod" goto prod
if "%1"=="help" goto help
if "%1"=="setup" goto setup

:: Default: interactive run
goto interactive_run

:build
echo [INFO] Building the application...
mvn clean compile
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [OK] Build successful
goto end

:package
echo [INFO] Packaging the application...
mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Packaging failed
    pause
    exit /b 1
)
echo [OK] Package created successfully
echo [INFO] JAR file location: target\business-platform-1.0.0.jar
echo [INFO] To run: java -jar target\business-platform-1.0.0.jar
goto end

:dev
echo [INFO] Building the application...
mvn clean compile
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [INFO] Starting in development mode...
echo [INFO] H2 Console will be available at: http://localhost:8080/api/h2-console
mvn spring-boot:run -Dspring-boot.run.profiles=dev
goto end

:prod
echo [INFO] Building the application...
mvn clean compile
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [INFO] Starting in production mode...
mvn spring-boot:run -Dspring-boot.run.profiles=prod
goto end

:interactive_run
echo [INFO] Building the application...
mvn clean compile
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [OK] Build successful
echo.
echo Choose running mode:
echo 1. Development mode (H2 database)
echo 2. Production mode (MySQL database)
echo 3. Package as JAR
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo [INFO] Starting in development mode...
    echo [INFO] H2 Console will be available at: http://localhost:8080/api/h2-console
    mvn spring-boot:run -Dspring-boot.run.profiles=dev
) else if "%choice%"=="2" (
    echo [INFO] Starting in production mode...
    mvn spring-boot:run -Dspring-boot.run.profiles=prod
) else if "%choice%"=="3" (
    goto package
) else (
    echo [WARNING] Invalid choice. Starting in development mode...
    mvn spring-boot:run -Dspring-boot.run.profiles=dev
)
goto end

:setup
echo [INFO] Database Setup Guide:
echo.
echo For MySQL:
echo 1. Install MySQL 8.0+
echo 2. Create database: CREATE DATABASE startup_business;
echo 3. Update credentials in src\main\resources\application.yml
echo.
echo For H2 (Development):
echo 1. Use dev profile: run.bat dev
echo 2. Access H2 Console: http://localhost:8080/api/h2-console
echo 3. URL: jdbc:h2:mem:testdb, User: sa, Password: password
echo.
goto end

:help
echo Usage: run.bat [OPTION]
echo.
echo Options:
echo   build     - Build the application
echo   package   - Package the application as JAR
echo   dev       - Run in development mode (H2 database)
echo   prod      - Run in production mode (MySQL database)
echo   setup     - Show database setup guide
echo   help      - Show this help message
echo.
echo Default credentials:
echo   Admin: admin@startup.com / admin123
echo   User:  john@example.com / password123
echo.
echo API Base URL: http://localhost:8080/api
echo Health Check: http://localhost:8080/api/health
echo.
goto end

:end
if "%1"=="" pause