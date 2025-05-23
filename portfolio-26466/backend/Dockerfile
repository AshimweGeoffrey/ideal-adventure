# Portfolio Backend 26466 - Dockerfile
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Add package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Add source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { \
    process.exit(res.statusCode === 200 ? 0 : 1) \
  }).on('error', () => process.exit(1))"

# Expose port
EXPOSE 5000

# Set labels
LABEL maintainer="Student 26466"
LABEL version="1.0.0"
LABEL description="Portfolio Backend API for Student ID 26466"

# Start application
CMD ["npm", "start"]
