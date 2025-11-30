# AngularPress - Server Deployment Script (PowerShell)
# Deploys to DigitalOcean droplet at 167.71.191.234

$ErrorActionPreference = "Stop"

$SERVER_HOST = "167.71.191.234"
$SERVER_USER = "root"
$SSH_KEY = "$env:USERPROFILE\.ssh\a-icon-deploy"
$DEPLOY_DIR = "/opt/angularpress"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "AngularPress - Server Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server: $SERVER_HOST"
Write-Host "Deploy Directory: $DEPLOY_DIR"
Write-Host ""

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "❌ Error: .env.production file not found!" -ForegroundColor Red
    Write-Host "Please create it with your production credentials."
    exit 1
}

Write-Host "✅ Environment file found" -ForegroundColor Green
Write-Host ""

# Create deploy directory on server
Write-Host "📁 Creating deployment directory on server..." -ForegroundColor Yellow
ssh -i $SSH_KEY ${SERVER_USER}@${SERVER_HOST} "mkdir -p $DEPLOY_DIR"

# Sync files to server using scp
Write-Host "📤 Syncing files to server..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

# Create a temporary archive to transfer
Write-Host "Creating archive..." -ForegroundColor Gray
$excludeDirs = @("node_modules", ".git", "coverage", "dist", ".angular")
$tempArchive = "angularpress-deploy.tar.gz"

# Use tar to create archive (excluding specified directories)
$excludeArgs = $excludeDirs | ForEach-Object { "--exclude=$_" }
tar -czf $tempArchive $excludeArgs .

Write-Host "Uploading archive..." -ForegroundColor Gray
scp -i $SSH_KEY $tempArchive ${SERVER_USER}@${SERVER_HOST}:${DEPLOY_DIR}/

Write-Host "Extracting on server..." -ForegroundColor Gray
ssh -i $SSH_KEY ${SERVER_USER}@${SERVER_HOST} "cd $DEPLOY_DIR && tar -xzf $tempArchive && rm $tempArchive"

# Clean up local archive
Remove-Item $tempArchive

Write-Host ""
Write-Host "✅ Files synced successfully" -ForegroundColor Green
Write-Host ""

# Deploy on server
Write-Host "🚀 Running deployment on server..." -ForegroundColor Yellow

$deployScript = @'
    set -e
    cd /opt/angularpress

    echo "📦 Loading environment variables..."
    export $(cat .env.production | grep -v '^#' | xargs)

    echo "🛑 Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down || true

    echo "🔨 Building containers (this will take several minutes)..."
    docker-compose -f docker-compose.prod.yml build --no-cache

    echo "🚀 Starting containers..."
    docker-compose -f docker-compose.prod.yml up -d

    echo "⏳ Waiting for containers to be healthy..."
    sleep 15

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
'@

ssh -i $SSH_KEY ${SERVER_USER}@${SERVER_HOST} $deployScript

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Deployment Successful!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application URL: https://angularpress.iffuso.com" -ForegroundColor Cyan
Write-Host "Admin Login: https://angularpress.iffuso.com/ap-admin/login" -ForegroundColor Cyan
Write-Host ""

