# PowerShell deployment script for Next.js application with Socket.IO and Prisma

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Create production database directory if it doesn't exist
if (-not (Test-Path "db")) {
    New-Item -ItemType Directory -Path "db"
}

# Copy environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "⚠️  Please update .env file with your production values before continuing." -ForegroundColor Yellow
    Read-Host "Press Enter to continue after updating .env file"
}

# Build and start the application
Write-Host "🔨 Building Docker image..." -ForegroundColor Blue
docker-compose build

Write-Host "🚀 Starting application..." -ForegroundColor Blue
docker-compose up -d

# Wait for the application to start
Write-Host "⏳ Waiting for application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if the application is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Application is running successfully!" -ForegroundColor Green
        Write-Host "🌐 Application URL: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "🔌 Socket.IO endpoint: ws://localhost:3000/api/socketio" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Application failed to start. Check logs with: docker-compose logs" -ForegroundColor Red
    exit 1
}

Write-Host "📊 To view logs: docker-compose logs -f" -ForegroundColor White
Write-Host "🛑 To stop: docker-compose down" -ForegroundColor White
Write-Host "🔄 To restart: docker-compose restart" -ForegroundColor White
