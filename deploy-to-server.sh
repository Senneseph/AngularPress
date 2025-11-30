#!/bin/bash

# AngularPress - Server Deployment Script
# Deploys to DigitalOcean droplet at 167.71.191.234

set -e

SERVER_HOST="167.71.191.234"
SERVER_USER="root"
SSH_KEY="$HOME/.ssh/a-icon-deploy"
DEPLOY_DIR="/opt/angularpress"

echo "========================================="
echo "AngularPress - Server Deployment"
echo "========================================="
echo ""
echo "Server: $SERVER_HOST"
echo "Deploy Directory: $DEPLOY_DIR"
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create it with your production credentials."
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Create deploy directory on server if it doesn't exist
echo "📁 Creating deployment directory on server..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_HOST "mkdir -p $DEPLOY_DIR"

# Sync files to server (excluding node_modules, .git, coverage, etc.)
echo "📤 Syncing files to server..."
rsync -avz --progress \
    -e "ssh -i $SSH_KEY" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'coverage' \
    --exclude 'dist' \
    --exclude '.angular' \
    --exclude '*.log' \
    ./ $SERVER_USER@$SERVER_HOST:$DEPLOY_DIR/

echo ""
echo "✅ Files synced successfully"
echo ""

# Deploy on server
echo "🚀 Running deployment on server..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_HOST << 'ENDSSH'
    set -e
    cd /opt/angularpress

    echo "📦 Loading environment variables..."
    export $(cat .env.production | grep -v '^#' | xargs)

    echo "🛑 Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down || true

    echo "🔨 Building containers..."
    docker-compose -f docker-compose.prod.yml build --no-cache

    echo "🚀 Starting containers..."
    docker-compose -f docker-compose.prod.yml up -d

    echo "⏳ Waiting for containers to be healthy..."
    sleep 10

    echo "📊 Container status:"
    docker-compose -f docker-compose.prod.yml ps

    echo ""
    echo "📝 Updating nginx configuration..."
    cp nginx-server.conf /etc/nginx/sites-available/angularpress.iffuso.com

    echo "🔄 Testing nginx configuration..."
    nginx -t

    echo "♻️  Reloading nginx..."
    systemctl reload nginx

    echo ""
    echo "✅ Deployment complete!"
ENDSSH

echo ""
echo "========================================="
echo "✅ Deployment Successful!"
echo "========================================="
echo ""
echo "🌐 Application URL: https://angularpress.iffuso.com"
echo "🔐 Admin Login: https://angularpress.iffuso.com/ap-admin/login"
echo ""
echo "📊 Check status:"
echo "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST 'cd $DEPLOY_DIR && docker-compose -f docker-compose.prod.yml ps'"
echo ""
echo "📋 View logs:"
echo "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST 'cd $DEPLOY_DIR && docker-compose -f docker-compose.prod.yml logs -f'"
echo ""

