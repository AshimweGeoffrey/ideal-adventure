#!/bin/bash
# Pre-deployment Checklist for Portfolio 26466
# Run this script to verify system readiness before deployment

set -e

echo "🔍 Portfolio 26466 - Pre-deployment Checklist"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0

# Function to check and report
check_requirement() {
    local description="$1"
    local command="$2"
    local expected="$3"
    
    echo -n "Checking: $description... "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        if [ -n "$expected" ]; then
            echo -e "  ${YELLOW}Expected: $expected${NC}"
        fi
        ((FAILED++))
    fi
}

echo ""
echo -e "${BLUE}📋 System Requirements:${NC}"

# Docker installation
check_requirement "Docker installed" "command -v docker" "Docker command available"
check_requirement "Docker service running" "systemctl is-active docker" "Docker service active"
check_requirement "Docker version" "docker --version | grep -E '2[0-9]\.[0-9]+'" "Docker version 20+"

# Network connectivity
check_requirement "Internet connectivity" "ping -c 1 8.8.8.8" "Can reach external DNS"
check_requirement "Ubuntu VM reachable" "ping -c 1 192.168.1.69" "Ubuntu VM responds"
check_requirement "CentOS VM reachable" "ping -c 1 192.168.1.70" "CentOS VM responds"

# Project structure
echo ""
echo -e "${BLUE}📁 Project Structure:${NC}"
check_requirement "Backend Dockerfile exists" "test -f backend/Dockerfile"
check_requirement "Frontend Dockerfile exists" "test -f frontend/Dockerfile"
check_requirement "Docker Compose file exists" "test -f docker-compose/docker-compose.yml"
check_requirement "Traefik config exists" "test -f deployment/traefik/traefik.yml"
check_requirement "MongoDB init script exists" "test -f deployment/mongo-init.js"

# Backend requirements
echo ""
echo -e "${BLUE}🔧 Backend Requirements:${NC}"
check_requirement "Backend package.json exists" "test -f backend/package.json"
check_requirement "Backend app.js exists" "test -f backend/app.js"
check_requirement "Auth routes exist" "test -f backend/routes/auth.js"
check_requirement "Portfolio routes exist" "test -f backend/routes/portfolio.js"

# Frontend requirements
echo ""
echo -e "${BLUE}🎨 Frontend Requirements:${NC}"
check_requirement "Frontend package.json exists" "test -f frontend/package.json"
check_requirement "React App.js exists" "test -f frontend/src/App.js"
check_requirement "Nginx config exists" "test -f frontend/nginx.conf"

# Deployment scripts
echo ""
echo -e "${BLUE}🚀 Deployment Scripts:${NC}"
check_requirement "Swarm init script exists" "test -f deployment/swarm/init-swarm.sh"
check_requirement "Deploy script exists" "test -f deployment/swarm/deploy-stack.sh"
check_requirement "Monitor script exists" "test -f deployment/swarm/monitor.sh"
check_requirement "Worker setup script exists" "test -f deployment/swarm/setup-worker.sh"

# Permissions
echo ""
echo -e "${BLUE}🔐 Permissions:${NC}"
check_requirement "Swarm init script executable" "test -x deployment/swarm/init-swarm.sh"
check_requirement "Deploy script executable" "test -x deployment/swarm/deploy-stack.sh"
check_requirement "Monitor script executable" "test -x deployment/swarm/monitor.sh"
check_requirement "Worker setup script executable" "test -x deployment/swarm/setup-worker.sh"

# Port availability
echo ""
echo -e "${BLUE}🌐 Port Availability:${NC}"
check_requirement "Port 80 available" "! netstat -tuln | grep -q ':80 '"
check_requirement "Port 443 available" "! netstat -tuln | grep -q ':443 '"
check_requirement "Port 8080 available" "! netstat -tuln | grep -q ':8080 '"

# Summary
echo ""
echo "=============================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready for deployment.${NC}"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Run: ./deployment/swarm/init-swarm.sh"
    echo "2. Setup worker node with the join token"
    echo "3. Run: ./deployment/swarm/deploy-stack.sh"
    echo "4. Configure hosts file for domain resolution"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please fix the issues before deployment.${NC}"
    exit 1
fi
