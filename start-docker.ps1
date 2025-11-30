# Start AngularPress with Docker Compose

Write-Host "Starting AngularPress (Docker)" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    $null = & docker ps 2>&1
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running" -ForegroundColor Red
    Write-Host "  Please start Docker Desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Starting services with Docker Compose..." -ForegroundColor Yellow
Write-Host ""

# Start Docker Compose in development mode
docker compose -f docker-compose.dev.yml up --build

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "To stop: Press Ctrl+C" -ForegroundColor Yellow
Write-Host "To remove: docker compose -f docker-compose.dev.yml down -v" -ForegroundColor Yellow

