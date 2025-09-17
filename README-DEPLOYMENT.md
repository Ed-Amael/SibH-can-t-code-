# Deployment Guide

This guide will help you deploy your Next.js application with Socket.IO and Prisma to production.

## Prerequisites

- Docker and Docker Compose installed
- Git (for version control)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone and navigate to the project:**
   ```bash
   git clone <your-repo-url>
   cd SIH
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your production values
   ```

3. **Deploy using the provided script:**
   
   **On Windows (PowerShell):**
   ```powershell
   .\deploy.ps1
   ```
   
   **On Linux/macOS:**
   ```bash
   ./deploy.sh
   ```

4. **Access your application:**
   - Web application: http://localhost:3000
   - Socket.IO endpoint: ws://localhost:3000/api/socketio
   - Health check: http://localhost:3000/api/health

### Option 2: Manual Docker Commands

1. **Build the Docker image:**
   ```bash
   docker-compose build
   ```

2. **Start the application:**
   ```bash
   docker-compose up -d
   ```

3. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

## Environment Variables

Create a `.env` file based on `env.example`:

```env
# Database
DATABASE_URL="file:./db/production.db"

# Next.js
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Add your custom variables here
```

## Production Considerations

### Database
- The application uses SQLite by default (stored in `./db/production.db`)
- For production, consider using PostgreSQL or MySQL
- Update `DATABASE_URL` in your `.env` file accordingly

### Security
- Update default secrets and keys
- Configure proper CORS settings
- Set up SSL/TLS certificates for HTTPS

### Scaling
- Use a reverse proxy (nginx) for load balancing
- Consider using Docker Swarm or Kubernetes for orchestration
- Set up monitoring and logging

## Management Commands

```bash
# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Restart application
docker-compose restart

# Rebuild and restart
docker-compose up --build -d

# Access container shell
docker-compose exec app sh
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change the port in `docker-compose.yml`
   - Kill the process using the port: `lsof -ti:3000 | xargs kill -9`

2. **Database connection issues:**
   - Check if the database file exists in the `db` directory
   - Verify `DATABASE_URL` in `.env` file

3. **Build failures:**
   - Check Docker logs: `docker-compose logs`
   - Ensure all dependencies are properly installed

4. **Socket.IO connection issues:**
   - Verify the Socket.IO path configuration
   - Check firewall settings

### Health Checks

The application includes a health check endpoint:
- URL: `http://localhost:3000/api/health`
- Returns: `{"status": "ok"}` when healthy

## Cloud Deployment

### AWS
- Use AWS ECS with Fargate
- Set up RDS for database
- Use Application Load Balancer

### Google Cloud
- Use Cloud Run
- Set up Cloud SQL
- Use Cloud Load Balancing

### Azure
- Use Container Instances
- Set up Azure Database
- Use Application Gateway

### DigitalOcean
- Use App Platform
- Set up managed database
- Use load balancer

## Monitoring

Consider setting up:
- Application performance monitoring (APM)
- Log aggregation (ELK stack)
- Uptime monitoring
- Database monitoring

## Backup Strategy

1. **Database backups:**
   ```bash
   # For SQLite
   cp db/production.db db/backup-$(date +%Y%m%d).db
   ```

2. **Docker volume backups:**
   ```bash
   docker run --rm -v SIH_db:/data -v $(pwd):/backup alpine tar czf /backup/db-backup.tar.gz -C /data .
   ```

## Support

For issues and questions:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Check Docker and Docker Compose versions
4. Review the application code for any custom configurations
