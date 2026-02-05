#!/bin/bash
set -e

# Get project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Load environment variables from .env
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Check if environment variables are set
if [ -z "$GH_USERNAME" ]; then
    log_error "GH_USERNAME not set. Add it to .env file or export GH_USERNAME=..."
    exit 1
fi

if [ -z "$GH_TOKEN" ]; then
    log_error "GH_TOKEN not set. Add it to .env file or export GH_TOKEN=ghp_..."
    exit 1
fi

# Ensure user is authenticated with GitHub CLI
if ! gh auth status >/dev/null 2>&1; then
    log_error "Not authenticated with GitHub CLI. Run 'gh auth login' first."
    exit 1
fi

# Configuration
IMAGE_NAME="ghcr.io/${GH_USERNAME}/termsite:latest"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging helpers
log_info() { echo -e "${YELLOW}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; exit 1; }

# Get server IP from Terraform
get_server_ip() {
    if [ ! -f "terraform.tfstate" ]; then
        log_error "No terraform.tfstate found. Run 'terraform apply' first."
    fi
    
    SERVER_IP=$(terraform output -raw public_ip 2>/dev/null)
    if [ -z "$SERVER_IP" ]; then
        log_error "Could not get public IP from Terraform output"
    fi
    
    echo "$SERVER_IP"
}

# Login to GitHub Container Registry
login_docker() {
    log_info "Logging into GitHub Container Registry..."
    echo "$GH_TOKEN" | docker login ghcr.io -u "$GH_USERNAME" --password-stdin
    log_success "Docker login successful"
}

# Build Docker image
build_image() {
    log_info "Building Docker image: ${IMAGE_NAME}"
    docker build -t "${IMAGE_NAME}" .
    log_success "Image built successfully"
}

# Push to GitHub Container Registry
push_image() {
    log_info "Pushing image to GHCR..."
    docker push "${IMAGE_NAME}"
    log_success "Image pushed to ${IMAGE_NAME}"
}

# Deploy to OCI server
deploy_to_oci() {
    local SERVER_IP=$(get_server_ip)
    log_info "Deploying to ${SERVER_IP}..."
    
    # Test SSH connection on port 2200
    local SSH_PORT=2200
    log_info "Testing SSH connection on port 2200..."
    if ! ssh -p ${SSH_PORT} -o ConnectTimeout=5 -o StrictHostKeyChecking=accept-new ubuntu@${SERVER_IP} "echo 'ok'" >/dev/null 2>&1; then
        log_error "Cannot connect to ubuntu@${SERVER_IP} on port 2200. Check SSH configuration."
    fi
    log_success "Connected to server on port ${SSH_PORT}"
    
    # Setup deployment directory
    ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ubuntu@${SERVER_IP} "sudo mkdir -p /opt/termsite && sudo chown ubuntu:ubuntu /opt/termsite"
    
    # Generate SSH host key if needed
    if ! ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ubuntu@${SERVER_IP} "test -f /opt/termsite/host.key"; then
        log_info "Generating SSH host key..."
        ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ubuntu@${SERVER_IP} "ssh-keygen -t ed25519 -f /opt/termsite/host.key -N '' -C 'termsite-host-key' && chmod 600 /opt/termsite/host.key"
        log_success "SSH host key generated"
    fi
    
    # Wait for Docker to be ready (in case cloud-init just finished)
    log_info "Checking if Docker is ready..."
    for i in {1..30}; do
        if ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ubuntu@${SERVER_IP} "sudo docker --version" >/dev/null 2>&1; then
            break
        fi
        if [ $i -eq 30 ]; then
            log_error "Docker is not available on the server.."
        fi
        sleep 2
    done
    
    # Pull latest image
    log_info "Pulling image..."
    ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ubuntu@${SERVER_IP} "sudo docker pull ${IMAGE_NAME}"
    
    # Stop and remove old container
    log_info "Stopping old container..."
    ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ubuntu@${SERVER_IP} "sudo docker stop termsite 2>/dev/null || true && sudo docker rm termsite 2>/dev/null || true"
    
    # Start new container
    log_info "Starting new container..."
    ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ubuntu@${SERVER_IP} "sudo docker run -d \
        --name termsite \
        --restart unless-stopped \
        --cap-add=NET_BIND_SERVICE \
        -p 22:22 \
        -v /opt/termsite/host.key:/app/host.key \
        -e NODE_ENV=production \
        -e PORT=22 \
        ${IMAGE_NAME}"
    
    # Verify deployment
    sleep 5
    if ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ubuntu@${SERVER_IP} "sudo docker ps | grep termsite" >/dev/null; then
        log_success "Deployment complete!"
        log_info "Connect to application with: ssh anyuser@${SERVER_IP}"
        log_info "Connect to server admin with: ssh -p 2200 ubuntu@${SERVER_IP}"
    else
        log_error "Container failed to start. Check logs with: ssh -p ${SSH_PORT} ubuntu@${SERVER_IP} 'sudo docker logs termsite'"
    fi
}

# Main execution
main() {
    echo ""
    log_info "Starting release process..."
    echo ""
    
    #login_docker
    #build_image
    #push_image
    deploy_to_oci
    
    echo ""
    log_success "Release complete! 🚀"
}

main
