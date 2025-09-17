# PowerShell script for production database setup

Write-Host "🗄️  Setting up production database..." -ForegroundColor Green

# Create database directory if it doesn't exist
if (-not (Test-Path "db")) {
    New-Item -ItemType Directory -Path "db"
}

# Set production environment
$env:NODE_ENV = "production"
$env:DATABASE_URL = "file:./db/production.db"

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Blue
npx prisma generate

# Push database schema
Write-Host "📊 Pushing database schema..." -ForegroundColor Blue
npx prisma db push

# Optional: Seed the database
Write-Host "🌱 Seeding database (if seed script exists)..." -ForegroundColor Blue
if ((Test-Path "prisma/seed.ts") -or (Test-Path "prisma/seed.js")) {
    npx prisma db seed
}

Write-Host "✅ Production database setup complete!" -ForegroundColor Green
Write-Host "📁 Database location: ./db/production.db" -ForegroundColor Cyan
