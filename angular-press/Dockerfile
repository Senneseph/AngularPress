# Build stage
FROM node:22.12.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using legacy-peer-deps for Angular 19 + NGXS compatibility)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application to nginx
COPY --from=builder /app/dist/angular-press/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

