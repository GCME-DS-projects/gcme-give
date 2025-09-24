#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt
# This script sets up SSL certificates for both domains

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

# Install Certbot
install_certbot() {
    print_status "Installing Certbot..."
    
    if ! command_exists certbot; then
        # Update package list
        sudo apt update
        
        # Install snapd if not installed
        if ! command_exists snap; then
            sudo apt install -y snapd
        fi
        
        # Install certbot via snap
        sudo snap install --classic certbot
        
        # Create symlink
        sudo ln -sf /snap/bin/certbot /usr/bin/certbot
        
        print_success "Certbot installed successfully"
    else
        print_status "Certbot is already installed"
    fi
}

# Setup SSL certificates
setup_ssl_certificates() {
    print_status "Setting up SSL certificates..."
    
    # Stop nginx temporarily
    sudo systemctl stop nginx
    
    # Get certificate for main domain
    print_status "Getting SSL certificate for give.dsethiopia.org..."
    sudo certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email admin@dsethiopia.org \
        -d give.dsethiopia.org \
        -d www.give.dsethiopia.org
    
    # Get certificate for API domain
    print_status "Getting SSL certificate for apigive.dsethiopia.org..."
    sudo certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email admin@dsethiopia.org \
        -d apigive.dsethiopia.org
    
    # Start nginx
    sudo systemctl start nginx
    
    print_success "SSL certificates obtained successfully"
}

# Setup automatic renewal
setup_auto_renewal() {
    print_status "Setting up automatic SSL certificate renewal..."
    
    # Create renewal hook script
    sudo tee /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh > /dev/null <<EOF
#!/bin/bash
systemctl reload nginx
EOF
    
    # Make the hook script executable
    sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh
    
    # Test automatic renewal
    print_status "Testing automatic renewal..."
    sudo certbot renew --dry-run
    
    print_success "Automatic renewal setup completed"
}

# Main function
main() {
    print_status "Starting SSL certificate setup..."
    
    # Check if running as root or with sudo
    if [[ $EUID -eq 0 ]]; then
        print_warning "Running as root. This is not recommended for security reasons."
    fi
    
    install_certbot
    setup_ssl_certificates
    setup_auto_renewal
    
    print_success "SSL setup completed successfully!"
    print_status "Certificates are valid for 90 days and will auto-renew"
    print_status "Certificate locations:"
    print_status "- give.dsethiopia.org: /etc/letsencrypt/live/give.dsethiopia.org/"
    print_status "- apigive.dsethiopia.org: /etc/letsencrypt/live/apigive.dsethiopia.org/"
}

# Run main function
main "$@"
