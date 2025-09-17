import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupProductionDatabase() {
  console.log('🗄️  Setting up production database...')

  try {
    // Generate Prisma client
    console.log('🔧 Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit' })

    // Push database schema
    console.log('📊 Pushing database schema...')
    execSync('npx prisma db push', { stdio: 'inherit' })

    // Seed the database
    console.log('🌱 Seeding database...')
    execSync('npx prisma db seed', { stdio: 'inherit' })

    console.log('✅ Production database setup complete!')
    console.log('📁 Database location: ./db/production.db')

  } catch (error) {
    console.error('❌ Error setting up production database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupProductionDatabase()
