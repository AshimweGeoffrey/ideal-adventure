#!/bin/bash
# Local Testing Script for Portfolio 26466
# This script sets up and tests the application locally before deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Portfolio 26466 - Local Testing Setup${NC}"
echo "=========================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites met${NC}"

# Stop any running containers
echo -e "${YELLOW}🛑 Stopping any existing containers...${NC}"
docker-compose -f docker-compose-local.yml down --remove-orphans 2>/dev/null || true

# Build images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose -f docker-compose-local.yml build --no-cache

# Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose -f docker-compose-local.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 30

# Check service status
echo -e "${YELLOW}📊 Service Status:${NC}"
docker-compose -f docker-compose-local.yml ps

# Test connectivity
echo -e "${YELLOW}🌐 Testing connectivity...${NC}"

# Test MongoDB
echo -n "MongoDB: "
if docker exec mongo-26466-local mongosh --eval "db.adminCommand('ping')" --quiet >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Connected${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
fi

# Test Redis
echo -n "Redis: "
if docker exec redis-26466-local redis-cli -a portfolio26466redis ping >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Connected${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
fi

# Test Backend API
echo -n "Backend API: "
sleep 10  # Give backend time to start
if curl -s http://localhost:5000/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Responding${NC}"
    echo "  Health check response:"
    curl -s http://localhost:5000/health | jq '.' 2>/dev/null || curl -s http://localhost:5000/health
else
    echo -e "${RED}❌ Not responding${NC}"
    echo "  Backend logs:"
    docker logs backend-26466-local --tail 10
fi

# Test Frontend
echo -n "Frontend: "
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Responding${NC}"
else
    echo -e "${RED}❌ Not responding${NC}"
    echo "  Frontend logs:"
    docker logs frontend-26466-local --tail 10
fi

# Test Traefik
echo -n "Traefik Dashboard: "
if curl -s http://localhost:8080/api/overview >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Responding${NC}"
else
    echo -e "${RED}❌ Not responding${NC}"
fi

echo ""
echo -e "${BLUE}🎉 Local Testing Setup Complete!${NC}"
echo -e "${YELLOW}📋 Access Points:${NC}"
echo "  Frontend:           http://localhost:3000"
echo "  Backend API:        http://localhost:5000"
echo "  API Health Check:   http://localhost:5000/health"
echo "  Traefik Dashboard:  http://localhost:8080"
echo "  MongoDB:            localhost:27017"
echo "  Redis:              localhost:6379"

echo ""
echo -e "${YELLOW}🧪 Testing Commands:${NC}"
echo "# Test API health"
echo "curl http://localhost:5000/health"
echo ""
echo "# Test API with authentication"
echo "curl -H 'X-API-Key: portfolio26466apikey2025' http://localhost:5000/api/portfolio"
echo ""
echo "# View logs"
echo "docker-compose -f docker-compose-local.yml logs backend-26466-local"
echo "docker-compose -f docker-compose-local.yml logs frontend-26466-local"
echo ""
echo "# Stop all services"
echo "docker-compose -f docker-compose-local.yml down"

# Show final status
echo ""
echo -e "${YELLOW}📊 Final Status:${NC}"
docker-compose -f docker-compose-local.yml ps
