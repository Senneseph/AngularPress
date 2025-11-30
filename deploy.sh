#!/bin/bash

# AngularPress Deployment Script
# This script deploys the AngularPress application to production

set -e  # Exit on error

echo "========================================="
echo "AngularPress - Production Deployment"
echo "========================================="
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please copy .env.production.example to .env.production and fill in the values."
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

echo "✅ Environment variables loaded"
echo ""

# Check if running on the server or locally
if [ "$1" == "local" ]; then
    echo "📦 Building and deploying locally..."
    echo ""
    
    # Stop existing containers
    echo "🛑 Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down
    
    # Build and start containers
    echo "🔨 Building containers..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    echo "🚀 Starting containers..."
    docker-compose -f docker-compose.prod.yml up -d
    
    echo ""
    echo "✅ Deployment complete!"
    echo "🌐 Application should be available at: https://${DOMAIN}"
    
else
    echo "🌐 Deploying to remote server..."
    echo ""
    
    # Check if SERVER_HOST is set
    if [ -z "$SERVER_HOST" ]; then
        echo "❌ Error: SERVER_HOST not set in .env.production"
        exit 1
    fi
    
    # Sync files to server
    echo "📤 Syncing files to server..."
    rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'coverage' \
        ./ ${SERVER_USER}@${SERVER_HOST}:/opt/angular-press/
    
    # Run deployment on server
    echo "🚀 Running deployment on server..."
    ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
        cd /opt/angular-press
        export $(cat .env.production | grep -v '^#' | xargs)
        docker-compose -f docker-compose.prod.yml down
        docker-compose -f docker-compose.prod.yml build --no-cache
        docker-compose -f docker-compose.prod.yml up -d
ENDSSH
    
    echo ""
    echo "✅ Remote deployment complete!"
    echo "🌐 Application should be available at: https://${DOMAIN}"
fi

echo ""
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

