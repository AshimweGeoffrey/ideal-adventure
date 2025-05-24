#!/bin/bash
# Deploy Portfolio 26466 Stack
# Run this script on the Ubuntu VM (Manager Node) after swarm initialization

set -e

echo "🚀 Deploying Portfolio 26466 Stack..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME="portfolio-26466"
COMPOSE_FILE="docker-compose/docker-compose.yml"

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo -e "  Stack Name: ${STACK_NAME}"
echo -e "  Compose File: ${COMPOSE_FILE}"
echo ""

# Check if swarm is initialized
if ! docker node ls >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker Swarm is not initialized. Please run init-swarm.sh first.${NC}"
    exit 1
fi

# Build Docker images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
echo -e "${BLUE}Building backend image...${NC}"
docker build -t portfolio-backend-26466:latest ./backend/

echo -e "${BLUE}Building frontend image...${NC}"
docker build -t portfolio-frontend-26466:latest ./frontend/

echo -e "${GREEN}✅ Images built successfully${NC}"

# Create necessary directories for volumes
echo -e "${YELLOW}📁 Creating volume directories...${NC}"
sudo mkdir -p /opt/portfolio-26466/{traefik,mongo,redis}
sudo chown -R $USER:$USER /opt/portfolio-26466/

# Deploy the stack
echo -e "${YELLOW}🚢 Deploying stack...${NC}"
docker stack deploy -c ${COMPOSE_FILE} ${STACK_NAME}

echo -e "${GREEN}✅ Stack deployed successfully${NC}"

# Wait for services to start
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 30

# Check service status
echo -e "${YELLOW}📊 Service Status:${NC}"
docker stack services ${STACK_NAME}
echo ""

echo -e "${YELLOW}📊 Service Logs (last 10 lines):${NC}"
echo -e "${BLUE}Traefik logs:${NC}"
docker service logs --tail 10 ${STACK_NAME}_traefik-26466 2>/dev/null || echo "Traefik not ready yet"
echo ""

echo -e "${BLUE}Backend logs:${NC}"
docker service logs --tail 10 ${STACK_NAME}_backend-26466 2>/dev/null || echo "Backend not ready yet"
echo ""

echo -e "${BLUE}Frontend logs:${NC}"
docker service logs --tail 10 ${STACK_NAME}_frontend-26466 2>/dev/null || echo "Frontend not ready yet"
echo ""

# Display access information
echo -e "${GREEN}🎉 Portfolio 26466 Stack Deployed Successfully!${NC}"
echo -e "${BLUE}📋 Access Information:${NC}"
echo -e "  Frontend: https://portfolio-26466.local"
echo -e "  API: https://api-26466.local"
echo -e "  Traefik Dashboard: https://traefik-26466.local"
echo -e "  Note: Add these domains to your hosts file pointing to 192.168.1.69"
echo ""

echo -e "${YELLOW}📝 Add to /etc/hosts:${NC}"
echo "192.168.1.69 portfolio-26466.local"
echo "192.168.1.69 api-26466.local"
echo "192.168.1.69 traefik-26466.local"
echo ""

echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo -e "  Monitor stack: docker stack ps ${STACK_NAME}"
echo -e "  View logs: docker service logs ${STACK_NAME}_<service-name>"
echo -e "  Remove stack: docker stack rm ${STACK_NAME}"
