#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${YELLOW}ℹ${NC} $1"; }

# Check if PUBLIC_IP is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <public_ip>"
    echo "Example: $0 129.213.123.456"
    exit 1
fi

PUBLIC_IP=$1

print_info "Deploying updates to termsite at ${PUBLIC_IP}..."

# Check if we can connect
if ! ssh -o ConnectTimeout=5 ubuntu@${PUBLIC_IP} "echo 'Connection test'" > /dev/null 2>&1; then
    print_error "Cannot connect to ubuntu@${PUBLIC_IP}"
    print_info "Make sure:"
    echo "  1. The IP address is correct"
    echo "  2. Your SSH key is configured"
    echo "  3. Security list allows SSH on port 22"
    exit 1
fi

print_success "Connected to server"

# Pull latest image and restart
print_info "Pulling latest Docker image..."
ssh ubuntu@${PUBLIC_IP} "cd /opt/termsite && sudo docker compose pull"

print_info "Restarting termsite service..."
ssh ubuntu@${PUBLIC_IP} "sudo systemctl restart termsite"

# Wait a moment for service to start
sleep 3

# Check if service is running
print_info "Checking service status..."
if ssh ubuntu@${PUBLIC_IP} "sudo systemctl is-active --quiet termsite"; then
    print_success "Termsite service is running!"
    print_success "You can now connect with: ssh -p 2222 anyuser@${PUBLIC_IP}"
else
    print_error "Service failed to start. Checking logs..."
    ssh ubuntu@${PUBLIC_IP} "sudo journalctl -u termsite -n 50 --no-pager"
    exit 1
fi

# Show recent logs
print_info "Recent logs:"
ssh ubuntu@${PUBLIC_IP} "sudo docker compose -f /opt/termsite/docker-compose.yml logs --tail=20"

print_success "Deployment complete!"
