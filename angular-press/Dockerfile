# Build stage
FROM node:22.12.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using legacy-peer-deps for Angular 19 + NGXS compatibility)
RUN npm ci --legacy-peer-deps

# Install sharp for image generation (needs build tools on Alpine)
# Also install fonts for proper SVG text rendering
RUN apk add --no-cache python3 make g++ fontconfig ttf-dejavu ttf-liberation font-noto && \
    fc-cache -f && \
    npm install sharp --save-dev

# Copy source code
COPY . .

# Generate favicon and OG images from SVG sources
RUN node scripts/generate-images.js

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

