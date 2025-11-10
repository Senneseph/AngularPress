# Angular Press - Docker Setup Guide

This guide explains how to run the entire Angular Press stack (MySQL, API, and Frontend) using Docker Compose.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- At least 4GB of available RAM
- Ports 3000, 3306, and 4200 available on your machine

## Quick Start

### Development Mode (with hot reload)

```bash
# Start all services
docker compose -f docker-compose.dev.yml up --build

# Or run in detached mode (background)
docker compose -f docker-compose.dev.yml up -d --build
```

This will start:
- **MySQL** on `localhost:3306`
- **NestJS API** on `http://localhost:3000`
- **Angular Frontend** on `http://localhost:4200`

### Production Mode

```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up -d --build
```

## Services

### MySQL Database
- **Port**: 3306
- **Database**: angular_press
- **Root Password**: rootpassword
- **User**: angular_press_user
- **Password**: angular_press_pass

### NestJS API
- **Port**: 3000
- **Base URL**: http://localhost:3000/api
- **Health Check**: http://localhost:3000

### Angular Frontend
- **Port**: 4200 (dev) / 80 (production)
- **URL**: http://localhost:4200

## Common Commands

### Start services
```bash
# Development
docker compose -f docker-compose.dev.yml up

# Production
docker compose up
```

### Stop services
```bash
# Development
docker compose -f docker-compose.dev.yml down

# Production
docker compose down
```

### Stop and remove volumes (clean slate)
```bash
# Development
docker compose -f docker-compose.dev.yml down -v

# Production
docker compose down -v
```

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f frontend
docker compose logs -f mysql
```

### Rebuild a specific service
```bash
docker compose -f docker-compose.dev.yml up --build api
```

### Execute commands in containers
```bash
# Access MySQL
docker exec -it angular-press-mysql-dev mysql -u angular_press_user -pangular_press_pass angular_press

# Access API container shell
docker exec -it angular-press-api-dev sh

# Access Frontend container shell
docker exec -it angular-press-frontend-dev sh
```

## Database Management

### Connect to MySQL from host machine
```bash
mysql -h 127.0.0.1 -P 3306 -u angular_press_user -pangular_press_pass angular_press
```

### Run SQL scripts
```bash
docker exec -i angular-press-mysql-dev mysql -u angular_press_user -pangular_press_pass angular_press < your-script.sql
```

### Backup database
```bash
docker exec angular-press-mysql-dev mysqldump -u angular_press_user -pangular_press_pass angular_press > backup.sql
```

### Restore database
```bash
docker exec -i angular-press-mysql-dev mysql -u angular_press_user -pangular_press_pass angular_press < backup.sql
```

## Development Workflow

### Making Code Changes

**Development mode** uses volume mounts, so changes to your code are automatically reflected:

- **API**: Changes to `angular-press-api/src` trigger NestJS hot reload
- **Frontend**: Changes to `angular-press/src` trigger Angular hot reload

### Installing New Dependencies

If you add new npm packages, you need to rebuild the containers:

```bash
# Stop containers
docker compose -f docker-compose.dev.yml down

# Rebuild with new dependencies
docker compose -f docker-compose.dev.yml up --build
```

## Troubleshooting

### Port Already in Use
If you get port conflicts, either:
1. Stop the service using that port
2. Change the port mapping in `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:3000"  # Use 3001 on host instead of 3000
   ```

### MySQL Connection Issues
- Wait for MySQL to be fully ready (health check takes ~30 seconds)
- Check logs: `docker compose logs mysql`
- Verify credentials in `docker-compose.yml`

### API Not Starting
- Check if MySQL is healthy: `docker compose ps`
- View API logs: `docker compose logs api`
- Ensure `.env` file doesn't conflict with docker-compose environment variables

### Frontend Build Errors
- Clear node_modules: `docker compose down -v` then rebuild
- Check Angular version compatibility
- View logs: `docker compose logs frontend`

### Container Won't Start
```bash
# Remove all containers and volumes
docker compose down -v

# Remove dangling images
docker image prune -f

# Rebuild from scratch
docker compose up --build
```

## Environment Variables

You can override environment variables by creating a `.env` file in the root directory:

```env
# MySQL
MYSQL_ROOT_PASSWORD=your-root-password
MYSQL_DATABASE=angular_press
MYSQL_USER=your-user
MYSQL_PASSWORD=your-password

# API
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:4200

# Ports
API_PORT=3000
FRONTEND_PORT=4200
MYSQL_PORT=3306
```

## Production Deployment

For production deployment:

1. **Update environment variables** with secure values
2. **Use production compose file**: `docker-compose.yml`
3. **Set up reverse proxy** (nginx/traefik) for SSL
4. **Configure backups** for MySQL volume
5. **Set resource limits** in docker-compose.yml:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 1G
   ```

## Network Architecture

All services run on a custom bridge network (`angular-press-network`):
- Services can communicate using service names (e.g., `mysql`, `api`)
- Frontend → API: `http://api:3000`
- API → MySQL: `mysql:3306`

## Volume Persistence

Data is persisted in Docker volumes:
- `mysql_data` (production) or `mysql_data_dev` (development)

To backup volumes:
```bash
docker run --rm -v mysql_data_dev:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz /data
```

## First Time Setup

After starting the containers for the first time:

1. **Wait for all services to be healthy** (~1 minute)
2. **Access the frontend**: http://localhost:4200
3. **Register a new user** via the API or frontend
4. **Login** and start using Angular Press!

### Create Admin User via API

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "displayName": "Administrator"
  }'
```

## Monitoring

### Check service health
```bash
docker compose ps
```

### Resource usage
```bash
docker stats
```

### Container inspection
```bash
docker inspect angular-press-api-dev
```

## Cleanup

### Remove everything (containers, networks, volumes)
```bash
docker compose -f docker-compose.dev.yml down -v
docker system prune -a --volumes
```

## Support

For issues or questions:
1. Check logs: `docker compose logs -f`
2. Verify all services are running: `docker compose ps`
3. Review this documentation
4. Check the main README.md for application-specific help

