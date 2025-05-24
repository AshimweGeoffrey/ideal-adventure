# Portfolio CRUD System - Student ID 26466

A containerized portfolio management system with Docker Swarm orchestration, Traefik load balancing, and multi-node deployment across Ubuntu and CentOS servers.

## 🏗️ Architecture Overview

### Infrastructure

- **Ubuntu VM (192.168.1.69)**: Docker Swarm Manager + Traefik Load Balancer
- **CentOS VM (192.168.1.70)**: Docker Swarm Worker Node
- **Load Balancing**: Traefik distributing traffic between nodes
- **SSL**: Let's Encrypt certificates for HTTPS
- **High Availability**: System remains functional with at least one node operational

### Services

- **Frontend**: React SPA with Bootstrap UI (Nginx)
- **Backend**: Node.js/Express API with MongoDB
- **Database**: MongoDB with authentication
- **Cache**: Redis for session management
- **Load Balancer**: Traefik with automatic service discovery

### Security Features

1. **TLS Encryption**: Let's Encrypt certificates for HTTPS
2. **API Key Authentication**: Secure API access
3. **JWT Token Management**: User session management
4. **Role-based Access Control**: Admin and user roles
5. **Rate Limiting**: Protection against abuse
6. **Security Headers**: CORS, XSS protection, etc.

## 🚀 Quick Start

### Prerequisites

- Docker installed on both VMs
- Docker Compose installed
- Firewall configured for Docker Swarm ports
- DNS resolution or hosts file configuration

### 1. Initialize Docker Swarm (Ubuntu VM)

```bash
cd ~/portfolio-26466
chmod +x deployment/swarm/*.sh
./deployment/swarm/init-swarm.sh
```

### 2. Setup Worker Node (CentOS VM)

```bash
# Transfer and run the worker setup script
./deployment/swarm/setup-worker.sh

# Join the swarm using the token from manager
docker swarm join --token <TOKEN> 192.168.1.69:2377
```

### 3. Deploy the Stack (Ubuntu VM)

```bash
./deployment/swarm/deploy-stack.sh
```

### 4. Configure DNS Resolution

Add to your `/etc/hosts` file:

```
192.168.1.69 portfolio-26466.local
192.168.1.69 api-26466.local
192.168.1.69 traefik-26466.local
```

## 📊 Monitoring & Management

### Monitor Stack Status

```bash
./deployment/swarm/monitor.sh
```

### View Service Logs

```bash
docker service logs portfolio-26466_backend-26466
docker service logs portfolio-26466_frontend-26466
docker service logs portfolio-26466_traefik-26466
```

### Scale Services

```bash
docker service scale portfolio-26466_backend-26466=3
docker service scale portfolio-26466_frontend-26466=2
```

## 🌐 Access Points

- **Frontend**: https://portfolio-26466.local
- **API**: https://api-26466.local
- **Traefik Dashboard**: https://traefik-26466.local
- **Health Check**: https://api-26466.local/health

## 🔐 Security Configuration

### API Key Authentication

- **Admin API Key**: `portfolio26466apikey2025`
- **Usage**: Include in request headers as `X-API-Key`

### Default Credentials

- **Admin User**: `admin26466`
- **Password**: `secret` (hashed with bcrypt)

### JWT Configuration

- **Secret**: `portfolio26466jwtsecret2025`
- **Expiration**: 7 days

## 📁 Project Structure

```
portfolio-26466/
├── backend/                 # Node.js API
│   ├── src/                # Source code
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication & error handling
│   ├── Dockerfile          # Backend container config
│   └── package.json        # Dependencies
├── frontend/               # React SPA
│   ├── src/               # React components
│   ├── public/            # Static assets
│   ├── Dockerfile         # Frontend container config
│   ├── nginx.conf         # Nginx configuration
│   └── package.json       # Dependencies
├── deployment/            # Deployment configurations
│   ├── traefik/          # Traefik configuration files
│   ├── swarm/            # Docker Swarm scripts
│   └── mongo-init.js     # MongoDB initialization
└── docker-compose/       # Docker Compose files
    └── docker-compose.yml # Stack definition
```

## 🔧 Troubleshooting

### Check Swarm Status

```bash
docker node ls
docker service ls
docker stack ps portfolio-26466
```

### View Detailed Logs

```bash
docker service logs --tail 100 portfolio-26466_<service-name>
```

### Test Connectivity

```bash
curl -k https://portfolio-26466.local/health
curl -k https://api-26466.local/health
```

### Restart Services

```bash
docker service update --force portfolio-26466_<service-name>
```

## 🔄 Updates & Maintenance

### Update Application

1. Build new images
2. Update stack deployment

```bash
docker build -t portfolio-backend-26466:latest ./backend/
docker build -t portfolio-frontend-26466:latest ./frontend/
docker stack deploy -c docker-compose/docker-compose.yml portfolio-26466
```

### Backup Data

```bash
docker run --rm -v portfolio-26466_mongo-26466-data:/data -v $(pwd):/backup alpine tar czf /backup/mongo-backup.tar.gz -C /data .
```

### Remove Stack

```bash
docker stack rm portfolio-26466
```

## 📋 Assignment Requirements Checklist

- ✅ Docker images include Student ID (26466)
- ✅ Frontend and database containerized
- ✅ Traefik load balancer configured
- ✅ Traffic distributed across Ubuntu and CentOS nodes
- ✅ High availability with multi-node setup
- ✅ TLS encryption with Let's Encrypt
- ✅ User authentication and authorization
- ✅ API key-based access control
- ✅ Role-based security implementation

## 🆘 Support

For issues or questions:

1. Check service logs using the monitoring script
2. Verify network connectivity between nodes
3. Ensure firewall ports are open
4. Check DNS resolution
5. Review Traefik dashboard for routing issues

---

**Student ID**: 26466  
**Project**: Portfolio CRUD System with Docker Swarm  
**Version**: 1.0.0
