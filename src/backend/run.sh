#!/bin/bash

# StartBusiness Platform Backend Runner Script

echo "================================================"
echo "   StartBusiness Platform Backend Setup       "
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Java is installed
check_java() {
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
        echo -e "${GREEN}✓ Java found: $JAVA_VERSION${NC}"
        
        # Check if Java version is 17 or higher
        MAJOR_VERSION=$(echo $JAVA_VERSION | cut -d. -f1)
        if [ "$MAJOR_VERSION" -ge 17 ]; then
            echo -e "${GREEN}✓ Java version is compatible${NC}"
        else
            echo -e "${RED}✗ Java 17 or higher is required. Found: $JAVA_VERSION${NC}"
            exit 1
        fi
    else
        echo -e "${RED}✗ Java is not installed${NC}"
        echo "Please install Java 17 or higher"
        exit 1
    fi
}

# Check if Maven is installed
check_maven() {
    if command -v mvn &> /dev/null; then
        MAVEN_VERSION=$(mvn -version | head -n 1 | awk '{print $3}')
        echo -e "${GREEN}✓ Maven found: $MAVEN_VERSION${NC}"
    else
        echo -e "${RED}✗ Maven is not installed${NC}"
        echo "Please install Maven 3.6 or higher"
        exit 1
    fi
}

# Check if MySQL is running (optional)
check_mysql() {
    if command -v mysql &> /dev/null; then
        if mysqladmin ping -h localhost --silent; then
            echo -e "${GREEN}✓ MySQL is running${NC}"
        else
            echo -e "${YELLOW}⚠ MySQL is not running${NC}"
            echo -e "${BLUE}You can use H2 database for development (dev profile)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ MySQL not found${NC}"
        echo -e "${BLUE}You can use H2 database for development (dev profile)${NC}"
    fi
}

# Create database if using MySQL
setup_database() {
    read -p "Do you want to setup MySQL database? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter MySQL username (default: root): " MYSQL_USER
        MYSQL_USER=${MYSQL_USER:-root}
        
        read -s -p "Enter MySQL password: " MYSQL_PASS
        echo
        
        echo -e "${BLUE}Creating database 'startup_business'...${NC}"
        mysql -u $MYSQL_USER -p$MYSQL_PASS -e "CREATE DATABASE IF NOT EXISTS startup_business;" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Database created successfully${NC}"
        else
            echo -e "${RED}✗ Failed to create database${NC}"
            echo -e "${YELLOW}You can create it manually or use H2 for development${NC}"
        fi
    fi
}

# Build the application
build_app() {
    echo -e "${BLUE}Building the application...${NC}"
    mvn clean compile
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Build successful${NC}"
    else
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    fi
}

# Run the application
run_app() {
    echo -e "${BLUE}Choose running mode:${NC}"
    echo "1. Development mode (H2 database)"
    echo "2. Production mode (MySQL database)"
    echo "3. Custom profile"
    
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            echo -e "${BLUE}Starting in development mode...${NC}"
            echo -e "${YELLOW}H2 Console will be available at: http://localhost:8080/api/h2-console${NC}"
            mvn spring-boot:run -Dspring-boot.run.profiles=dev
            ;;
        2)
            echo -e "${BLUE}Starting in production mode...${NC}"
            mvn spring-boot:run -Dspring-boot.run.profiles=prod
            ;;
        3)
            read -p "Enter profile name: " profile
            echo -e "${BLUE}Starting with profile: $profile${NC}"
            mvn spring-boot:run -Dspring-boot.run.profiles=$profile
            ;;
        *)
            echo -e "${RED}Invalid choice. Starting in development mode...${NC}"
            mvn spring-boot:run -Dspring-boot.run.profiles=dev
            ;;
    esac
}

# Package the application
package_app() {
    echo -e "${BLUE}Packaging the application...${NC}"
    mvn clean package -DskipTests
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Package created successfully${NC}"
        echo -e "${BLUE}JAR file location: target/business-platform-1.0.0.jar${NC}"
        echo -e "${BLUE}To run: java -jar target/business-platform-1.0.0.jar${NC}"
    else
        echo -e "${RED}✗ Packaging failed${NC}"
        exit 1
    fi
}

# Show help
show_help() {
    echo "Usage: ./run.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  build     - Build the application"
    echo "  run       - Run the application (interactive mode)"
    echo "  package   - Package the application as JAR"
    echo "  dev       - Run in development mode (H2 database)"
    echo "  prod      - Run in production mode (MySQL database)"
    echo "  help      - Show this help message"
    echo ""
    echo "Default credentials:"
    echo "  Admin: admin@startup.com / admin123"
    echo "  User:  john@example.com / password123"
    echo ""
    echo "API Base URL: http://localhost:8080/api"
}

# Main execution
main() {
    echo -e "${BLUE}Checking prerequisites...${NC}"
    check_java
    check_maven
    check_mysql
    
    case "${1:-run}" in
        "build")
            build_app
            ;;
        "run")
            build_app
            run_app
            ;;
        "package")
            package_app
            ;;
        "dev")
            build_app
            echo -e "${BLUE}Starting in development mode...${NC}"
            mvn spring-boot:run -Dspring-boot.run.profiles=dev
            ;;
        "prod")
            build_app
            echo -e "${BLUE}Starting in production mode...${NC}"
            mvn spring-boot:run -Dspring-boot.run.profiles=prod
            ;;
        "setup")
            setup_database
            ;;
        "help")
            show_help
            ;;
        *)
            echo -e "${YELLOW}Unknown option: $1${NC}"
            show_help
            ;;
    esac
}

# Make sure we're in the right directory
if [ ! -f "pom.xml" ]; then
    echo -e "${RED}Error: pom.xml not found. Please run this script from the backend directory.${NC}"
    exit 1
fi

# Run main function
main "$@"