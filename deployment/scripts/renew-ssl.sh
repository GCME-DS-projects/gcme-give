#!/bin/bash

# SSL Certificate Renewal Script
# This script handles SSL certificate renewal with nginx running

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

# Function to renew certificates
renew_certificates() {
    print_status "Starting SSL certificate renewal..."
    
    # Stop nginx temporarily
    print_status "Stopping nginx temporarily..."
    sudo systemctl stop nginx
    
    # Renew certificates using standalone method
    print_status "Renewing certificates..."
    sudo certbot renew --standalone --non-interactive
    
    # Start nginx again
    print_status "Starting nginx..."
    sudo systemctl start nginx
    
    # Reload nginx to use new certificates
    sudo systemctl reload nginx
    
    print_success "SSL certificate renewal completed"
}

# Function to test renewal
test_renewal() {
    print_status "Testing SSL certificate renewal..."
    
    # Stop nginx temporarily
    sudo systemctl stop nginx
    
    # Test renewal
    if sudo certbot renew --dry-run --standalone --non-interactive; then
        print_success "SSL certificate renewal test passed"
    else
        print_error "SSL certificate renewal test failed"
    fi
    
    # Start nginx again
    sudo systemctl start nginx
}

# Main function
main() {
    case "${1:-renew}" in
        "test")
            test_renewal
            ;;
        "renew")
            renew_certificates
            ;;
        *)
            echo "Usage: $0 [renew|test]"
            echo "  renew: Renew SSL certificates (default)"
            echo "  test:  Test renewal process"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
