# Complete Deployment Guide

This guide provides multiple deployment options for your Next.js application with Socket.IO and Prisma.

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
1. **Install Docker Desktop** from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Install Git** from [git-scm.com](https://git-scm.com/)

### Deployment Steps

1. **Clone and navigate to the project:**
   ```bash
   git clone <your-repo-url>
   cd SIH
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   copy env.example .env
   
   # Edit .env with your production values
   notepad .env
   ```

3. **Deploy using Docker Compose:**
   ```bash
   # Build and start the application
   docker-compose up --build -d
   
   # Check if it's running
   docker-compose ps
   
   # View logs
   docker-compose logs -f
   ```

4. **Access your application:**
   - Web application: http://localhost:3000
   - Socket.IO endpoint: ws://localhost:3000/api/socketio
   - Health check: http://localhost:3000/api/health

## 🛠️ Alternative Deployment Methods

### Method 1: Using Node.js (If Available)

1. **Install Node.js** from [nodejs.org](https://nodejs.org/) (LTS version recommended)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   copy env.example .env
   # Edit .env file
   ```

4. **Set up database:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Build and start:**
   ```bash
   npm run build
   npm run start
   ```

### Method 2: Cloud Deployment

#### Vercel (Easiest for Next.js)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

#### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with one click

#### DigitalOcean App Platform
1. Create a new app
2. Connect your repository
3. Configure environment variables
4. Deploy

## 📋 Environment Variables

Create a `.env` file with these variables:

```env
# Database
DATABASE_URL="file:./db/production.db"

# Next.js
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Optional: Add your custom variables
# NEXTAUTH_SECRET=your-secret-key
# NEXTAUTH_URL=http://localhost:3000
```

## 🐳 Docker Commands Reference

```bash
# Build the image
docker-compose build

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Restart the application
docker-compose restart

# Rebuild and restart
docker-compose up --build -d

# Access container shell
docker-compose exec app sh
```

## 🔧 Troubleshooting

### Common Issues

1. **Port 3000 already in use:**
   ```bash
   # Find and kill the process using port 3000
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```

2. **Docker not starting:**
   - Ensure Docker Desktop is running
   - Check if virtualization is enabled in BIOS
   - Restart Docker Desktop

3. **Database connection issues:**
   - Check if the `db` directory exists
   - Verify `DATABASE_URL` in `.env` file
   - Ensure the database file is writable

4. **Build failures:**
   - Check Docker logs: `docker-compose logs`
   - Ensure all files are present
   - Check for syntax errors in code

### Health Checks

Test if your application is running:
```bash
# Check health endpoint
curl http://localhost:3000/api/health

# Or open in browser
start http://localhost:3000/api/health
```

## 🌐 Production Considerations

### Security
- [ ] Update default secrets and keys
- [ ] Configure proper CORS settings
- [ ] Set up SSL/TLS certificates
- [ ] Use environment variables for sensitive data

### Database
- [ ] Consider using PostgreSQL or MySQL for production
- [ ] Set up database backups
- [ ] Configure connection pooling

### Monitoring
- [ ] Set up application monitoring
- [ ] Configure log aggregation
- [ ] Set up uptime monitoring
- [ ] Monitor database performance

### Scaling
- [ ] Use a reverse proxy (nginx)
- [ ] Consider container orchestration (Kubernetes)
- [ ] Set up load balancing
- [ ] Configure auto-scaling

## 📊 Management Commands

### Docker Commands
```bash
# View all containers
docker ps -a

# View application logs
docker-compose logs app

# Restart specific service
docker-compose restart app

# Scale application
docker-compose up --scale app=3 -d
```

### Database Commands
```bash
# Access database shell
docker-compose exec app npx prisma studio

# Reset database
docker-compose exec app npx prisma migrate reset

# Generate new migration
docker-compose exec app npx prisma migrate dev --name <migration_name>
```

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up --build -d

# Check status
docker-compose ps
```

### Database Backups
```bash
# Create backup
docker-compose exec app cp db/production.db db/backup-$(date +%Y%m%d).db

# Restore from backup
docker-compose exec app cp db/backup-YYYYMMDD.db db/production.db
```

## 📞 Support

If you encounter issues:

1. **Check the logs:**
   ```bash
   docker-compose logs -f
   ```

2. **Verify environment variables:**
   ```bash
   docker-compose exec app env | grep DATABASE_URL
   ```

3. **Test database connection:**
   ```bash
   docker-compose exec app npx prisma db push
   ```

4. **Check application health:**
   ```bash
   curl http://localhost:3000/api/health
   ```

## 🎯 Next Steps

After successful deployment:

1. **Set up a domain name** (if needed)
2. **Configure SSL certificates** for HTTPS
3. **Set up monitoring and alerting**
4. **Implement backup strategies**
5. **Configure CI/CD pipeline** for automated deployments

---

**Need help?** Check the logs first, then review this guide, or consult the application documentation.
