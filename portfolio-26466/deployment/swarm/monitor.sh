#!/bin/bash
# Monitor Portfolio 26466 Stack
# This script provides monitoring and management utilities

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

STACK_NAME="portfolio-26466"

# Function to display header
show_header() {
    echo -e "${BLUE}===============================================${NC}"
    echo -e "${BLUE}    Portfolio 26466 Stack Monitor${NC}"
    echo -e "${BLUE}===============================================${NC}"
    echo ""
}

# Function to check swarm status
check_swarm() {
    echo -e "${YELLOW}🔍 Docker Swarm Status:${NC}"
    if docker node ls >/dev/null 2>&1; then
        docker node ls
        echo ""
    else
        echo -e "${RED}❌ Docker Swarm is not initialized${NC}"
        exit 1
    fi
}

# Function to check stack services
check_services() {
    echo -e "${YELLOW}📊 Stack Services Status:${NC}"
    if docker stack ls | grep -q ${STACK_NAME}; then
        docker stack services ${STACK_NAME}
        echo ""
        
        echo -e "${YELLOW}📈 Service Details:${NC}"
        docker stack ps ${STACK_NAME} --no-trunc
        echo ""
    else
        echo -e "${RED}❌ Stack ${STACK_NAME} is not deployed${NC}"
    fi
}

# Function to show service logs
show_logs() {
    local service=$1
    local lines=${2:-50}
    
    echo -e "${YELLOW}📝 Logs for ${service} (last ${lines} lines):${NC}"
    docker service logs --tail ${lines} ${STACK_NAME}_${service} 2>/dev/null || echo "Service not found or not ready"
    echo ""
}

# Function to check network connectivity
check_connectivity() {
    echo -e "${YELLOW}🌐 Network Connectivity Check:${NC}"
    
    # Check if overlay network exists
    if docker network ls | grep -q portfolio-26466-network; then
        echo -e "${GREEN}✅ Overlay network exists${NC}"
    else
        echo -e "${RED}❌ Overlay network not found${NC}"
    fi
    
    # Test endpoints
    endpoints=(
        "https://portfolio-26466.local"
        "https://api-26466.local/health"
        "https://traefik-26466.local"
    )
    
    for endpoint in "${endpoints[@]}"; do
        if curl -k -s --max-time 5 "${endpoint}" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ ${endpoint} - Accessible${NC}"
        else
            echo -e "${RED}❌ ${endpoint} - Not accessible${NC}"
        fi
    done
    echo ""
}

# Function to show resource usage
show_resources() {
    echo -e "${YELLOW}💾 Resource Usage:${NC}"
    docker system df
    echo ""
    
    echo -e "${YELLOW}🔧 Container Stats:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep -E "(CONTAINER|26466)" || echo "No containers found"
    echo ""
}

# Function to restart services
restart_service() {
    local service=$1
    echo -e "${YELLOW}🔄 Restarting service: ${service}${NC}"
    docker service update --force ${STACK_NAME}_${service}
    echo -e "${GREEN}✅ Service restart initiated${NC}"
}

# Function to scale services
scale_service() {
    local service=$1
    local replicas=$2
    echo -e "${YELLOW}📈 Scaling ${service} to ${replicas} replicas${NC}"
    docker service scale ${STACK_NAME}_${service}=${replicas}
    echo -e "${GREEN}✅ Service scaling initiated${NC}"
}

# Main menu
show_menu() {
    echo -e "${PURPLE}Select an option:${NC}"
    echo "1. Check all services"
    echo "2. View service logs"
    echo "3. Check connectivity"
    echo "4. Show resource usage"
    echo "5. Restart service"
    echo "6. Scale service"
    echo "7. Deploy/Update stack"
    echo "8. Remove stack"
    echo "9. Exit"
    echo ""
}

# Main execution
show_header
check_swarm

case "${1:-menu}" in
    "status"|"1")
        check_services
        ;;
    "logs"|"2")
        show_logs traefik-26466
        show_logs backend-26466
        show_logs frontend-26466
        ;;
    "connectivity"|"3")
        check_connectivity
        ;;
    "resources"|"4")
        show_resources
        ;;
    "restart"|"5")
        if [ -n "$2" ]; then
            restart_service $2
        else
            echo "Usage: $0 restart <service-name>"
        fi
        ;;
    "scale"|"6")
        if [ -n "$2" ] && [ -n "$3" ]; then
            scale_service $2 $3
        else
            echo "Usage: $0 scale <service-name> <replicas>"
        fi
        ;;
    "deploy"|"7")
        ./deployment/swarm/deploy-stack.sh
        ;;
    "remove"|"8")
        echo -e "${RED}⚠️  Removing stack ${STACK_NAME}...${NC}"
        docker stack rm ${STACK_NAME}
        echo -e "${GREEN}✅ Stack removed${NC}"
        ;;
    "menu"|*)
        while true; do
            show_menu
            read -p "Enter your choice [1-9]: " choice
            case $choice in
                1) check_services ;;
                2) 
                    echo "Available services: traefik-26466, backend-26466, frontend-26466, mongo-26466"
                    read -p "Enter service name: " service
                    read -p "Number of lines [50]: " lines
                    lines=${lines:-50}
                    show_logs $service $lines
                    ;;
                3) check_connectivity ;;
                4) show_resources ;;
                5)
                    echo "Available services: traefik-26466, backend-26466, frontend-26466"
                    read -p "Enter service name: " service
                    restart_service $service
                    ;;
                6)
                    echo "Available services: backend-26466, frontend-26466"
                    read -p "Enter service name: " service
                    read -p "Number of replicas: " replicas
                    scale_service $service $replicas
                    ;;
                7) ./deployment/swarm/deploy-stack.sh ;;
                8)
                    read -p "Are you sure you want to remove the stack? (y/N): " confirm
                    if [[ $confirm =~ ^[Yy]$ ]]; then
                        docker stack rm ${STACK_NAME}
                        echo -e "${GREEN}✅ Stack removed${NC}"
                    fi
                    ;;
                9) exit 0 ;;
                *) echo -e "${RED}Invalid option${NC}" ;;
            esac
            echo ""
        done
        ;;
esac
