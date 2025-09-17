#!/bin/bash

# Production database setup script

set -e

echo "🗄️  Setting up production database..."

# Create database directory if it doesn't exist
mkdir -p db

# Set production environment
export NODE_ENV=production
export DATABASE_URL="file:./db/production.db"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📊 Pushing database schema..."
npx prisma db push

# Optional: Seed the database
echo "🌱 Seeding database (if seed script exists)..."
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
    npx prisma db seed
fi

echo "✅ Production database setup complete!"
echo "📁 Database location: ./db/production.db"
