# Local Testing Guide for Portfolio 26466

## 🧪 Step-by-Step Local Testing

### Prerequisites

- Docker and Docker Compose installed
- Ports 3000, 5000, 6379, 8080, 27017 available
- At least 4GB RAM available for containers

### Step 1: Verify Project Structure

```bash
cd ~/portfolio-26466
ls -la
# Should see: backend/, frontend/, docker-compose-local.yml, test-local.sh
```

### Step 2: Run the Local Test Setup

```bash
# Make sure you're in the project directory
cd ~/portfolio-26466

# Run the local testing script
./test-local.sh
```

This script will:

- Build all Docker images
- Start all services (MongoDB, Redis, Backend, Frontend, Traefik)
- Test connectivity to all services
- Display access points and testing commands

### Step 3: Manual Testing

#### Test the Frontend

1. Open browser: http://localhost:3000
2. You should see the Portfolio React application
3. Test navigation and UI components

#### Test the Backend API

```bash
# Health check
curl http://localhost:5000/health

# Expected response:
# {"status":"healthy","timestamp":"...","studentId":"26466","service":"portfolio-backend"}

# Test API with authentication
curl -H 'X-API-Key: portfolio26466apikey2025' http://localhost:5000/api/portfolio
```

#### Test Database Connectivity

```bash
# Connect to MongoDB
docker exec -it mongo-26466-local mongosh -u admin -p portfolio26466pass --authenticationDatabase admin

# In the MongoDB shell:
use portfolio_26466
show collections
db.users.find()
```

### Step 4: Run API Tests

```bash
./test-api.sh
```

This will test:

- User registration and login
- Portfolio CRUD operations
- API key authentication
- Error handling

### Step 5: View Service Logs

```bash
# View all services
docker-compose -f docker-compose-local.yml logs

# View specific service logs
docker-compose -f docker-compose-local.yml logs backend-26466-local
docker-compose -f docker-compose-local.yml logs frontend-26466-local
docker-compose -f docker-compose-local.yml logs mongo-26466-local
```

### Step 6: Access Dashboards

#### Traefik Dashboard

- URL: http://localhost:8080
- Shows service discovery and routing information

#### Direct Database Access

- MongoDB: localhost:27017
- Redis: localhost:6379

### Step 7: Stop Services

```bash
# Stop all services
docker-compose -f docker-compose-local.yml down

# Remove volumes (if needed)
docker-compose -f docker-compose-local.yml down -v
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using the port
sudo netstat -tulpn | grep :5000

# Kill the process if needed
sudo kill -9 <PID>
```

#### Service Not Starting

```bash
# Check service logs
docker-compose -f docker-compose-local.yml logs <service-name>

# Restart specific service
docker-compose -f docker-compose-local.yml restart <service-name>
```

#### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker exec mongo-26466-local mongosh --eval "db.adminCommand('ping')"

# Reset MongoDB data
docker-compose -f docker-compose-local.yml down
docker volume rm portfolio-26466_mongo-26466-local-data
docker-compose -f docker-compose-local.yml up -d
```

#### Frontend Build Issues

```bash
# Rebuild frontend
docker-compose -f docker-compose-local.yml build --no-cache frontend-26466-local
docker-compose -f docker-compose-local.yml up -d frontend-26466-local
```

## 🚀 Next Steps

Once local testing is successful:

1. **Deploy to Swarm**: Use `./deployment/swarm/deploy-stack.sh`
2. **Configure DNS**: Add domain entries to `/etc/hosts`
3. **Test Production**: Access via HTTPS domains
4. **Monitor**: Use `./deployment/swarm/monitor.sh`

## 📊 Expected Test Results

### Successful Local Test Output:

```
✅ Prerequisites met
✅ MongoDB: Connected
✅ Redis: Connected
✅ Backend API: Responding
✅ Frontend: Responding
✅ Traefik Dashboard: Responding

Access Points:
  Frontend:           http://localhost:3000
  Backend API:        http://localhost:5000
  API Health Check:   http://localhost:5000/health
  Traefik Dashboard:  http://localhost:8080
```

### API Test Success:

```
✅ Health Check: 200
✅ User Registration: 201
✅ User Login: 200
✅ Portfolio List (With API Key): 200
✅ Create Portfolio Item: 201
```

This confirms your application is working correctly and ready for production deployment!
