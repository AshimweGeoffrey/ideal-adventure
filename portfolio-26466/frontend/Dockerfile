# Multi-stage build for frontend-26466
# Use pre-built React app and serve with Nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application (assuming build directory exists)
COPY build /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /tmp/nginx.pid && \
    chown nginx:nginx /tmp/nginx.pid

# Switch to non-root user
USER nginx

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Add labels
LABEL maintainer="Student 26466"
LABEL version="1.0.0"
LABEL description="Portfolio Frontend for Student ID 26466"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
