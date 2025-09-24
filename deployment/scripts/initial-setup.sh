#!/bin/bash

# Initial Server Setup Script for GCME Give
# This script prepares a fresh Ubuntu server for deployment

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

# Update system
update_system() {
    print_status "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    print_success "System updated"
}

# Install essential packages
install_essentials() {
    print_status "Installing essential packages..."
    sudo apt install -y \
        curl \
        wget \
        git \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        build-essential \
        nginx \
        ufw
    print_success "Essential packages installed"
}

# Install Node.js
install_nodejs() {
    print_status "Installing Node.js..."
    
    if ! command_exists node; then
        # Install Node.js 18.x
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
        
        # Install pnpm
        npm install -g pnpm
        
        # Install PM2
        npm install -g pm2
        
        print_success "Node.js, pnpm, and PM2 installed"
    else
        print_status "Node.js is already installed"
    fi
}

# Setup firewall
setup_firewall() {
    print_status "Setting up firewall..."
    
    # Reset UFW to defaults
    sudo ufw --force reset
    
    # Set default policies
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # Allow SSH
    sudo ufw allow ssh
    
    # Allow HTTP and HTTPS
    sudo ufw allow 'Nginx Full'
    
    # Allow specific ports
    sudo ufw allow 22    # SSH
    sudo ufw allow 80    # HTTP
    sudo ufw allow 443   # HTTPS
    
    # Enable firewall
    sudo ufw --force enable
    
    print_success "Firewall configured"
}

# Setup swap file (if not exists)
setup_swap() {
    print_status "Setting up swap file..."
    
    if ! swapon --show | grep -q '/swapfile'; then
        # Create 2GB swap file
        sudo fallocate -l 2G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        
        # Make swap permanent
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
        
        # Configure swappiness
        echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
        
        print_success "Swap file created and configured"
    else
        print_status "Swap file already exists"
    fi
}

# Setup user and permissions
setup_user() {
    print_status "Setting up user permissions..."
    
    # Add current user to necessary groups
    sudo usermod -aG www-data $USER
    
    # Create project directory
    sudo mkdir -p /root/gcme-give
    sudo chown -R $USER:$USER /root/gcme-give
    
    print_success "User permissions configured"
}

# Clone repository (if not exists)
clone_repository() {
    print_status "Checking repository..."
    
    if [ ! -d "/root/gcme-give/.git" ]; then
        print_status "Repository not found. Please clone your repository manually:"
        print_status "git clone <your-repo-url> /root/gcme-give"
        print_warning "Skipping repository clone"
    else
        print_status "Repository already exists"
    fi
}

# Setup systemd services
setup_systemd() {
    print_status "Setting up systemd services..."
    
    # Create systemd service for PM2
    sudo tee /etc/systemd/system/gcme-pm2.service > /dev/null <<EOF
[Unit]
Description=GCME Give PM2 Service
After=network.target

[Service]
Type=forking
User=$USER
Environment=PATH=/usr/bin:/usr/local/bin
Environment=PM2_HOME=/home/$USER/.pm2
ExecStart=/usr/local/bin/pm2 resurrect
ExecReload=/usr/local/bin/pm2 reload all
ExecStop=/usr/local/bin/pm2 kill
Restart=always

[Install]
WantedBy=multi-user.target
EOF

    # Enable services
    sudo systemctl daemon-reload
    sudo systemctl enable nginx
    sudo systemctl enable gcme-pm2
    
    print_success "Systemd services configured"
}

# Setup log rotation
setup_log_rotation() {
    print_status "Setting up log rotation..."
    
    sudo tee /etc/logrotate.d/gcme-give > /dev/null <<EOF
/var/log/pm2/*.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    create 0644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}

/var/log/nginx/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 www-data adm
    postrotate
        systemctl reload nginx
    endscript
}
EOF

    print_success "Log rotation configured"
}

# Main function
main() {
    print_status "Starting initial server setup for GCME Give..."
    print_warning "This script requires sudo privileges"
    
    update_system
    install_essentials
    install_nodejs
    setup_firewall
    setup_swap
    setup_user
    clone_repository
    setup_systemd
    setup_log_rotation
    
    print_success "Initial server setup completed!"
    print_status ""
    print_status "Next steps:"
    print_status "1. Clone your repository to /root/gcme-give (if not done already)"
    print_status "2. Run: ./deployment/scripts/setup-database.sh"
    print_status "3. Run: ./deployment/scripts/setup-ssl.sh"
    print_status "4. Run: ./deployment/scripts/deploy.sh"
    print_status ""
    print_status "For CI/CD setup, configure these GitHub secrets:"
    print_status "- SSH_PRIVATE_KEY: Your server's SSH private key"
    print_status "- SSH_USER: Your server username (current: $USER)"
    print_status "- SERVER_HOST: Your server's IP address or hostname"
}

# Run main function
main "$@"
