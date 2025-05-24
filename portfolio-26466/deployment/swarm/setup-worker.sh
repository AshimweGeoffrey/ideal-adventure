#!/bin/bash
# Docker Swarm Worker Setup Script for CentOS (Portfolio 26466)
# Run this script on the CentOS VM (192.168.1.70)

set -e

echo "🚀 Setting up CentOS as Docker Swarm Worker for Portfolio 26466..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MANAGER_IP="192.168.1.69"
WORKER_IP="192.168.1.70"

echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  Manager IP: ${MANAGER_IP}"
echo -e "  Worker IP: ${WORKER_IP}"
echo ""

# Check if Docker is installed and running
echo -e "${YELLOW}🔍 Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! systemctl is-active --quiet docker; then
    echo -e "${YELLOW}🔧 Starting Docker service...${NC}"
    sudo systemctl start docker
    sudo systemctl enable docker
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if already part of a swarm
if docker info | grep -q "Swarm: active"; then
    echo -e "${GREEN}✅ Node is already part of a swarm${NC}"
    docker node ls 2>/dev/null || echo "Worker node - cannot list nodes"
else
    echo -e "${YELLOW}⚠️  Node is not part of a swarm${NC}"
    echo -e "${BLUE}Please run the join command provided by the manager node:${NC}"
    echo -e "${YELLOW}docker swarm join --token <TOKEN> ${MANAGER_IP}:2377${NC}"
    echo ""
    echo -e "${BLUE}You can get the token by running this on the manager:${NC}"
    echo -e "${YELLOW}docker swarm join-token worker${NC}"
fi

# Install additional tools if needed
echo -e "${YELLOW}📦 Installing additional tools...${NC}"
if command -v yum &> /dev/null; then
    sudo yum update -y
    sudo yum install -y curl wget htop
elif command -v dnf &> /dev/null; then
    sudo dnf update -y
    sudo dnf install -y curl wget htop
fi

# Configure firewall for Docker Swarm
echo -e "${YELLOW}🔥 Configuring firewall for Docker Swarm...${NC}"
if command -v firewall-cmd &> /dev/null; then
    # Docker Swarm ports
    sudo firewall-cmd --permanent --add-port=2376/tcp  # Docker daemon
    sudo firewall-cmd --permanent --add-port=2377/tcp  # Swarm management
    sudo firewall-cmd --permanent --add-port=7946/tcp  # Node communication
    sudo firewall-cmd --permanent --add-port=7946/udp  # Node communication
    sudo firewall-cmd --permanent --add-port=4789/udp  # Overlay network
    
    # Application ports
    sudo firewall-cmd --permanent --add-port=80/tcp    # HTTP
    sudo firewall-cmd --permanent --add-port=443/tcp   # HTTPS
    sudo firewall-cmd --permanent --add-port=8080/tcp  # Traefik dashboard
    
    sudo firewall-cmd --reload
    echo -e "${GREEN}✅ Firewall configured${NC}"
else
    echo -e "${YELLOW}⚠️  Firewall not found, please configure manually${NC}"
fi

# Optimize Docker for production
echo -e "${YELLOW}⚙️  Optimizing Docker configuration...${NC}"
sudo mkdir -p /etc/docker

# Create Docker daemon configuration
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "exec-opts": ["native.cgroupdriver=systemd"],
  "live-restore": true,
  "userland-proxy": false,
  "experimental": false
}
EOF

# Restart Docker to apply configuration
sudo systemctl restart docker
echo -e "${GREEN}✅ Docker configuration optimized${NC}"

# Create directories for portfolio data
echo -e "${YELLOW}📁 Creating portfolio directories...${NC}"
sudo mkdir -p /opt/portfolio-26466/{logs,data}
sudo chown -R $USER:$USER /opt/portfolio-26466/
echo -e "${GREEN}✅ Directories created${NC}"

# Set node labels (will be applied when node joins swarm)
echo -e "${YELLOW}🏷️  Node will be labeled for worker tasks${NC}"

# Display system information
echo -e "${YELLOW}📊 System Information:${NC}"
echo -e "  OS: $(cat /etc/redhat-release 2>/dev/null || echo 'Unknown')"
echo -e "  Kernel: $(uname -r)"
echo -e "  Docker: $(docker --version)"
echo -e "  IP Address: ${WORKER_IP}"
echo ""

echo -e "${GREEN}🎉 CentOS Worker Node Setup Completed!${NC}"
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "  1. Get the join token from the manager node"
echo -e "  2. Run: docker swarm join --token <TOKEN> ${MANAGER_IP}:2377"
echo -e "  3. Verify connection from manager with: docker node ls"
echo ""

echo -e "${YELLOW}📝 Useful Commands:${NC}"
echo -e "  Check swarm status: docker info | grep Swarm"
echo -e "  Leave swarm: docker swarm leave"
echo -e "  View node info: docker node ls (from manager)"
