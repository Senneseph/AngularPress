#!/bin/bash

# SSL Certificate Initialization Script
# This script obtains SSL certificates from Let's Encrypt

set -e

echo "========================================="
echo "AngularPress - SSL Certificate Setup"
echo "========================================="
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Check required variables
if [ -z "$DOMAIN" ] || [ -z "$SSL_EMAIL" ]; then
    echo "❌ Error: DOMAIN and SSL_EMAIL must be set in .env.production"
    exit 1
fi

echo "🌐 Domain: $DOMAIN"
echo "📧 Email: $SSL_EMAIL"
echo ""

# Create directories
mkdir -p nginx/ssl/live/$DOMAIN
mkdir -p /var/www/certbot

# Create temporary nginx config for HTTP only (for Let's Encrypt challenge)
cat > nginx/conf.d/temp.conf << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'SSL setup in progress...';
        add_header Content-Type text/plain;
    }
}
EOF

echo "🚀 Starting temporary nginx for SSL challenge..."
docker-compose -f docker-compose.prod.yml up -d nginx

echo "⏳ Waiting for nginx to start..."
sleep 5

echo "🔐 Obtaining SSL certificate..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $SSL_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Remove temporary config
rm nginx/conf.d/temp.conf

echo ""
echo "✅ SSL certificate obtained successfully!"
echo "🔄 Restarting nginx with SSL configuration..."

docker-compose -f docker-compose.prod.yml restart nginx

echo ""
echo "✅ SSL setup complete!"
echo "🌐 Your site should now be available at: https://$DOMAIN"

