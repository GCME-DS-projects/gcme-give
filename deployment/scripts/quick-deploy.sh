#!/bin/bash

# Quick Deploy Script for GCME Give
# This script runs the complete deployment process

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

# Check if running from correct directory
check_directory() {
    if [ ! -f "deployment/scripts/deploy.sh" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
}

# Prompt for confirmation
confirm_deployment() {
    echo
    print_warning "This script will deploy GCME Give to production with the following domains:"
    print_status "- Web: https://give.dsethiopia.org"
    print_status "- API: https://api.give.dsethiopia.org"
    echo
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deployment cancelled"
        exit 0
    fi
}

# Main deployment function
main() {
    print_status "Starting GCME Give Quick Deployment..."
    
    check_directory
    confirm_deployment
    
    # Step 1: Initial server setup
    print_status "Step 1/4: Initial server setup..."
    if [ ! -f "/usr/local/bin/pm2" ]; then
        sudo ./deployment/scripts/initial-setup.sh
    else
        print_status "Server already configured, skipping initial setup"
    fi
    
    # Step 2: Database setup
    print_status "Step 2/4: Database setup..."
    if ! docker ps | grep -q gcme-postgres; then
        ./deployment/scripts/setup-database.sh
    else
        print_status "Database already running, skipping database setup"
    fi
    
    # Step 3: SSL setup
    print_status "Step 3/4: SSL certificate setup..."
    if [ ! -d "/etc/letsencrypt/live/give.dsethiopia.org" ]; then
        ./deployment/scripts/setup-ssl.sh
    else
        print_status "SSL certificates already exist, skipping SSL setup"
    fi
    
    # Step 4: Application deployment
    print_status "Step 4/4: Application deployment..."
    ./deployment/scripts/deploy.sh
    
    # Final verification
    print_status "Performing final verification..."
    sleep 10
    
    # Check if applications are running
    if pm2 list | grep -q "online"; then
        print_success "Applications are running successfully!"
    else
        print_error "Some applications may not be running properly"
        pm2 status
    fi
    
    # Check web access
    if curl -s -o /dev/null -w "%{http_code}" https://give.dsethiopia.org | grep -q "200\|301\|302"; then
        print_success "Web application is accessible"
    else
        print_warning "Web application may not be accessible yet"
    fi
    
    # Check API access
    if curl -s -o /dev/null -w "%{http_code}" https://api.give.dsethiopia.org | grep -q "200\|404"; then
        print_success "API application is accessible"
    else
        print_warning "API application may not be accessible yet"
    fi
    
    echo
    print_success "🎉 GCME Give deployment completed!"
    print_status "📱 Web Application: https://give.dsethiopia.org"
    print_status "🔗 API Endpoint: https://api.give.dsethiopia.org"
    echo
    print_status "Management commands:"
    print_status "- Check status: pm2 status"
    print_status "- View logs: pm2 logs"
    print_status "- Restart apps: pm2 restart all"
    echo
    print_status "For detailed documentation, see: deployment/README.md"
    print_status "For deployment checklist, see: deployment/DEPLOYMENT_CHECKLIST.md"
}

# Run main function
main "$@"
