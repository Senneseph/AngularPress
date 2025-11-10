# Start Angular Press locally (without Docker)
# Requires MySQL to be running locally

Write-Host "Starting Angular Press (Local Development)" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Check if MySQL is running
Write-Host "Checking MySQL connection..." -ForegroundColor Yellow
$mysqlRunning = $false
try {
    $null = & mysql -h localhost -u root -e "SELECT 1" 2>&1
    $mysqlRunning = $true
    Write-Host "✓ MySQL is running" -ForegroundColor Green
} catch {
    Write-Host "✗ MySQL is not running or not accessible" -ForegroundColor Red
    Write-Host "  Please start MySQL or use Docker: docker compose -f docker-compose.dev.yml up" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Start API in background
Write-Host "Starting NestJS API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd angular-press-api; npm run start:dev" -WindowStyle Normal

# Wait a bit for API to start
Start-Sleep -Seconds 5

# Start Angular frontend
Write-Host "Starting Angular Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd angular-press; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Angular Press is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "API:      http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the services" -ForegroundColor Yellow

