#!/bin/bash
# Docker Swarm Setup Script for Portfolio 26466
# Run this script on the Ubuntu VM (Manager Node)

set -e

echo "🚀 Setting up Docker Swarm for Portfolio 26466..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MANAGER_IP="192.168.1.69"
WORKER_IP="192.168.1.70"
NETWORK_NAME="portfolio-26466-network"

echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  Manager IP: ${MANAGER_IP}"
echo -e "  Worker IP: ${WORKER_IP}"
echo -e "  Network: ${NETWORK_NAME}"
echo ""

# Initialize Docker Swarm
echo -e "${YELLOW}🔧 Initializing Docker Swarm...${NC}"
if docker node ls >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker Swarm is already initialized${NC}"
else
    docker swarm init --advertise-addr ${MANAGER_IP}
    echo -e "${GREEN}✅ Docker Swarm initialized successfully${NC}"
fi

# Get join token
echo -e "${YELLOW}🔑 Getting worker join token...${NC}"
JOIN_TOKEN=$(docker swarm join-token worker -q)
echo -e "${GREEN}Worker join token: ${JOIN_TOKEN}${NC}"

# Create overlay network
echo -e "${YELLOW}🌐 Creating overlay network...${NC}"
if docker network ls | grep -q ${NETWORK_NAME}; then
    echo -e "${GREEN}✅ Network ${NETWORK_NAME} already exists${NC}"
else
    docker network create \
        --driver overlay \
        --attachable \
        --subnet=10.0.26.0/24 \
        ${NETWORK_NAME}
    echo -e "${GREEN}✅ Network ${NETWORK_NAME} created successfully${NC}"
fi

# Add node labels for service placement
echo -e "${YELLOW}🏷️  Adding node labels...${NC}"
NODE_ID=$(docker node ls --format "{{.ID}}" --filter "role=manager")
docker node update --label-add database=true ${NODE_ID}
docker node update --label-add cache=true ${NODE_ID}
echo -e "${GREEN}✅ Node labels added${NC}"

# Create secrets for sensitive data
echo -e "${YELLOW}🔐 Creating Docker secrets...${NC}"
echo "portfolio26466jwtsecret2025" | docker secret create jwt_secret_26466 - 2>/dev/null || echo "Secret jwt_secret_26466 already exists"
echo "portfolio26466apikey2025" | docker secret create api_key_26466 - 2>/dev/null || echo "Secret api_key_26466 already exists"
echo "portfolio26466pass" | docker secret create mongo_password_26466 - 2>/dev/null || echo "Secret mongo_password_26466 already exists"
echo -e "${GREEN}✅ Secrets created${NC}"

# Display join command for worker node
echo -e "${BLUE}📝 To join the worker node (CentOS), run this command on ${WORKER_IP}:${NC}"
echo -e "${YELLOW}docker swarm join --token ${JOIN_TOKEN} ${MANAGER_IP}:2377${NC}"
echo ""

# Check swarm status
echo -e "${YELLOW}📊 Docker Swarm Status:${NC}"
docker node ls
echo ""

echo -e "${GREEN}🎉 Docker Swarm setup completed!${NC}"
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "  1. Run the join command on the CentOS worker node"
echo -e "  2. Build and deploy the application stack"
echo -e "  3. Configure DNS or hosts file for domain resolution"
