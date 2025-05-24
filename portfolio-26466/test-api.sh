#!/bin/bash
# API Testing Script for Portfolio 26466
# Tests all API endpoints locally

set -e

BASE_URL="http://localhost:5000"
API_KEY="portfolio26466apikey2025"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Portfolio 26466 - API Testing${NC}"
echo "=================================="

# Check if backend service is running
echo -e "${YELLOW}📋 Checking if services are running...${NC}"
if ! docker ps | grep -q "backend-26466-local"; then
    echo -e "${RED}❌ Backend service is not running!${NC}"
    echo -e "${YELLOW}💡 Please run './test-local.sh' first to start all services${NC}"
    exit 1
fi

if ! curl -s --max-time 5 http://localhost:5000/health >/dev/null 2>&1; then
    echo -e "${RED}❌ Backend API is not responding!${NC}"
    echo -e "${YELLOW}💡 Checking backend logs...${NC}"
    docker logs backend-26466-local --tail 20
    exit 1
fi

echo -e "${GREEN}✅ Services are running${NC}"

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local headers=$4
    local data=$5
    
    echo -n "Testing: $description... "
    
    # Add timeout and better error handling
    local curl_cmd="curl -s --max-time 10 -X $method"
    
    if [ -n "$headers" ]; then
        curl_cmd="$curl_cmd -H \"$headers\""
    fi
    
    if [ -n "$data" ]; then
        curl_cmd="$curl_cmd -H \"Content-Type: application/json\" -d '$data'"
    fi
    
    curl_cmd="$curl_cmd \"$BASE_URL$endpoint\" -w \"%{http_code}\""
    
    # Execute the curl command
    if response=$(eval $curl_cmd 2>/dev/null); then
        http_code="${response: -3}"
        body="${response%???}"
        
        if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
            echo -e "${GREEN}✅ $http_code${NC}"
            if [ -n "$body" ] && [ "$body" != "null" ] && [ ${#body} -gt 0 ]; then
                echo "    Response: $(echo "$body" | head -c 100)..."
            fi
        else
            echo -e "${RED}❌ $http_code${NC}"
            if [ -n "$body" ]; then
                echo "    Error: $(echo "$body" | head -c 100)..."
            fi
        fi
    else
        echo -e "${RED}❌ Connection failed${NC}"
        echo "    Could not connect to $BASE_URL$endpoint"
    fi
}

echo ""
echo -e "${YELLOW}🏥 Health Checks:${NC}"
test_endpoint "GET" "/health" "Health Check"

echo ""
echo -e "${YELLOW}🔐 Authentication Tests:${NC}"
test_endpoint "POST" "/api/auth/register" "User Registration" "" '{"username":"testuser26466","email":"test@portfolio26466.local","password":"testpass123"}'
test_endpoint "POST" "/api/auth/login" "User Login" "" '{"email":"test@portfolio26466.local","password":"testpass123"}'

echo ""
echo -e "${YELLOW}🛡️ API Key Tests:${NC}"
test_endpoint "GET" "/api/portfolio" "Portfolio List (No Auth)" 
test_endpoint "GET" "/api/portfolio" "Portfolio List (With API Key)" "X-API-Key: $API_KEY"

echo ""
echo -e "${YELLOW}📊 Portfolio CRUD Tests:${NC}"
test_endpoint "POST" "/api/portfolio" "Create Portfolio Item" "X-API-Key: $API_KEY" '{"title":"Test Project 26466","description":"A test portfolio project","technologies":["Docker","Node.js"],"status":"completed"}'
test_endpoint "GET" "/api/portfolio" "Get All Portfolio Items" "X-API-Key: $API_KEY"

echo ""
echo -e "${BLUE}🎉 API Testing Complete!${NC}"
echo ""
echo -e "${YELLOW}💡 Manual Test Commands:${NC}"
echo "# Register a new user"
echo "curl -X POST -H 'Content-Type: application/json' \\"
echo "  -d '{\"username\":\"user26466\",\"email\":\"user@test.com\",\"password\":\"password123\"}' \\"
echo "  $BASE_URL/api/auth/register"
echo ""
echo "# Login"
echo "curl -X POST -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"user@test.com\",\"password\":\"password123\"}' \\"
echo "  $BASE_URL/api/auth/login"
echo ""
echo "# Create portfolio item"
echo "curl -X POST -H 'Content-Type: application/json' -H 'X-API-Key: $API_KEY' \\"
echo "  -d '{\"title\":\"My Project\",\"description\":\"Test project\",\"technologies\":[\"React\",\"Node.js\"]}' \\"
echo "  $BASE_URL/api/portfolio"
