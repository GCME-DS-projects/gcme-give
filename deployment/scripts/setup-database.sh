#!/bin/bash

# Database Setup Script
# This script sets up PostgreSQL database using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install Docker
install_docker() {
    print_status "Checking Docker installation..."
    
    if ! command_exists docker; then
        print_status "Installing Docker..."
        
        # Update package index
        sudo apt update
        
        # Install required packages
        sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
        
        # Add Docker's official GPG key
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        
        # Set up stable repository
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        # Update package index again
        sudo apt update
        
        # Install Docker Engine
        sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        
        # Add current user to docker group
        sudo usermod -aG docker $USER
        
        print_success "Docker installed successfully"
        print_warning "Please log out and log back in for group changes to take effect"
    else
        print_status "Docker is already installed"
    fi
    
    if ! command_exists docker-compose; then
        print_status "Installing Docker Compose..."
        sudo apt install -y docker-compose
    fi
}

# Setup PostgreSQL with Docker
setup_postgresql() {
    print_status "Setting up PostgreSQL database..."
    
    # Create docker-compose file for PostgreSQL
    cat > /tmp/docker-compose.db.yml <<EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: gcme-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d
    networks:
      - gcme-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d mydb"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Optional: PostgreSQL Admin (pgAdmin)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: gcme-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@dsethiopia.org
      PGADMIN_DEFAULT_PASSWORD: admin123
      PGADMIN_LISTEN_PORT: 5050
    ports:
      - "5050:5050"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    networks:
      - gcme-network
    depends_on:
      - postgres

volumes:
  postgres_data:
    driver: local
  pgadmin_data:
    driver: local

networks:
  gcme-network:
    driver: bridge
EOF

    # Create init directory for database initialization scripts
    mkdir -p /tmp/init
    
    # Create initialization script
    cat > /tmp/init/01-init.sql <<EOF
-- Create additional databases if needed
-- CREATE DATABASE gcme_test;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE mydb TO postgres;
EOF

    # Stop existing containers if running
    docker-compose -f /tmp/docker-compose.db.yml down 2>/dev/null || true
    
    # Start PostgreSQL
    docker-compose -f /tmp/docker-compose.db.yml up -d
    
    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Check if PostgreSQL is running
    if docker ps | grep -q gcme-postgres; then
        print_success "PostgreSQL is running successfully"
        print_status "Database connection details:"
        print_status "- Host: localhost"
        print_status "- Port: 5432"
        print_status "- Database: mydb"
        print_status "- Username: postgres"
        print_status "- Password: password"
        print_status ""
        print_status "pgAdmin is available at: http://localhost:5050"
        print_status "- Email: admin@dsethiopia.org"
        print_status "- Password: admin123"
    else
        print_error "Failed to start PostgreSQL"
        exit 1
    fi
    
    # Move docker-compose file to deployment directory
    mv /tmp/docker-compose.db.yml /root/gcme-give/deployment/configs/
    mv /tmp/init /root/gcme-give/deployment/configs/
}

# Create database backup script
create_backup_script() {
    print_status "Creating database backup script..."
    
    cat > /root/gcme-give/deployment/scripts/backup-db.sh <<'EOF'
#!/bin/bash

# Database Backup Script
BACKUP_DIR="/root/gcme-give/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="gcme_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
docker exec gcme-postgres pg_dump -U postgres -d mydb > "$BACKUP_DIR/$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup created: $BACKUP_FILE.gz"
EOF

    chmod +x /root/gcme-give/deployment/scripts/backup-db.sh
    
    # Create cron job for daily backups
    (crontab -l 2>/dev/null; echo "0 2 * * * /root/gcme-give/deployment/scripts/backup-db.sh") | crontab -
    
    print_success "Database backup script created and scheduled"
}

# Main function
main() {
    print_status "Starting database setup..."
    
    install_docker
    setup_postgresql
    create_backup_script
    
    print_success "Database setup completed successfully!"
    print_status "To manage the database:"
    print_status "- Start: docker-compose -f /root/gcme-give/deployment/configs/docker-compose.db.yml up -d"
    print_status "- Stop: docker-compose -f /root/gcme-give/deployment/configs/docker-compose.db.yml down"
    print_status "- Backup: /root/gcme-give/deployment/scripts/backup-db.sh"
}

# Run main function
main "$@"
