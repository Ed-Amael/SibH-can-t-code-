import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
    },
  })

  // Create sample posts
  const post1 = await prisma.post.upsert({
    where: { id: 'post-1' },
    update: {},
    create: {
      id: 'post-1',
      title: 'Welcome to the Application',
      content: 'This is a sample post to demonstrate the application functionality.',
      published: true,
      authorId: user1.id,
    },
  })

  const post2 = await prisma.post.upsert({
    where: { id: 'post-2' },
    update: {},
    create: {
      id: 'post-2',
      title: 'Getting Started Guide',
      content: 'Here are some tips to get started with the application.',
      published: true,
      authorId: user2.id,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Users created:', { user1: user1.email, user2: user2.email })
  console.log('📝 Posts created:', { post1: post1.title, post2: post2.title })
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
