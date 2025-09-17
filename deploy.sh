#!/bin/bash

# Deployment script for Next.js application with Socket.IO and Prisma

set -e

echo "🚀 Starting deployment process..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create production database directory if it doesn't exist
mkdir -p db

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env file with your production values before continuing."
    echo "Press Enter to continue after updating .env file..."
    read
fi

# Build and start the application
echo "🔨 Building Docker image..."
docker-compose build

echo "🚀 Starting application..."
docker-compose up -d

# Wait for the application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Check if the application is running
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Application URL: http://localhost:3000"
    echo "🔌 Socket.IO endpoint: ws://localhost:3000/api/socketio"
else
    echo "❌ Application failed to start. Check logs with: docker-compose logs"
    exit 1
fi

echo "📊 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo "🔄 To restart: docker-compose restart"
