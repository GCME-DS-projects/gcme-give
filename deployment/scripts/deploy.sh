#!/bin/bash

# GCME Give Deployment Script
# This script deploys both API and Web applications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/root/gcme-give"
DEPLOYMENT_DIR="$PROJECT_ROOT/deployment"
API_DIR="$PROJECT_ROOT/api"
WEB_DIR="$PROJECT_ROOT/web"

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

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command_exists pnpm; then
        print_error "pnpm is not installed. Installing..."
        npm install -g pnpm
    fi
    
    if ! command_exists pm2; then
        print_error "PM2 is not installed. Installing..."
        npm install -g pm2
    fi
    
    if ! command_exists nginx; then
        print_error "Nginx is not installed. Installing..."
        apt update && apt install -y nginx
    fi
    
    print_success "Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install API dependencies
    print_status "Installing API dependencies..."
    cd "$API_DIR"
    pnpm install --frozen-lockfile
    
    # Install Web dependencies
    print_status "Installing Web dependencies..."
    cd "$WEB_DIR"
    pnpm install --frozen-lockfile
    
    print_success "Dependencies installed"
}

# Build applications
build_applications() {
    print_status "Building applications..."
    
    # Build API
    print_status "Building API..."
    cd "$API_DIR"
    pnpm run build
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Build Web
    print_status "Building Web application..."
    cd "$WEB_DIR"
    # Copy environment file
    cp "$DEPLOYMENT_DIR/configs/web.env" .env.local
    # Build with linting disabled for deployment
    ESLINT_NO_DEV_ERRORS=true pnpm run build
    
    # Copy static assets to standalone build
    print_status "Copying static assets to standalone build..."
    cp -r .next/static .next/standalone/web/.next/ 2>/dev/null || true
    cp -r public/* .next/standalone/web/public/ 2>/dev/null || true
    
    print_success "Applications built successfully"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    cd "$API_DIR"
    # Copy environment file
    cp "$DEPLOYMENT_DIR/configs/api.env" .env
    
    # Run database migrations
    print_status "Running database migrations..."
    npx prisma migrate deploy
    
    print_success "Database setup completed"
}

# Setup PM2
setup_pm2() {
    print_status "Setting up PM2..."
    
    # Create PM2 log directory
    sudo mkdir -p /var/log/pm2
    sudo chown -R $USER:$USER /var/log/pm2
    
    # Stop existing PM2 processes
    pm2 delete all 2>/dev/null || true
    
    # Start applications with PM2
    pm2 start "$DEPLOYMENT_DIR/configs/ecosystem.config.js"
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    pm2 startup systemd -u $USER --hp $HOME
    
    print_success "PM2 setup completed"
}

# Setup Nginx
setup_nginx() {
    print_status "Setting up Nginx..."
    
    # Copy nginx configuration
    sudo cp "$DEPLOYMENT_DIR/nginx/gcme-give.conf" /etc/nginx/sites-available/
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/gcme-give.conf /etc/nginx/sites-enabled/
    
    # Remove default site if exists
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    sudo nginx -t
    
    # Reload nginx
    sudo systemctl reload nginx
    
    print_success "Nginx setup completed"
}

# Main deployment function
main() {
    print_status "Starting GCME Give deployment..."
    
    check_prerequisites
    install_dependencies
    build_applications
    setup_database
    setup_pm2
    setup_nginx
    
    print_success "Deployment completed successfully!"
    print_status "Applications are running:"
    print_status "- API: https://api.give.dsethiopia.org"
    print_status "- Web: https://give.dsethiopia.org"
    print_status ""
    print_status "To check application status: pm2 status"
    print_status "To view logs: pm2 logs"
    print_status "To restart applications: pm2 restart all"
}

# Run main function
main "$@"
