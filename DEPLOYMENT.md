# AngularPress - Production Deployment Guide

This guide walks you through deploying AngularPress to production at https://angularpress.iffuso.com

## 📋 Prerequisites

- DigitalOcean droplet (or any Linux server) with:
  - Docker and Docker Compose installed
  - Ports 80 and 443 open
  - Domain pointing to server IP
- SSH access to the server
- Git installed on the server

## 🚀 Quick Deployment

### Step 1: Prepare Environment Variables

1. Copy the example environment file:
```bash
cp .env.production.example .env.production
```

2. Edit `.env.production` and fill in secure values:
```bash
# Generate secure passwords
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
MYSQL_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 48)

# Set your email for SSL
SSL_EMAIL=your-email@example.com
```

### Step 2: Deploy to Server

#### Option A: Deploy from Local Machine

1. Add server details to `.env.production`:
```bash
SERVER_HOST=your-server-ip-or-domain
SERVER_USER=root  # or your SSH user
```

2. Run deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Option B: Deploy Directly on Server

1. SSH into your server:
```bash
ssh root@your-server-ip
```

2. Clone the repository:
```bash
cd /opt
git clone https://github.com/Senneseph/wp-angular-app.git angularpress
cd angularpress
```

3. Create `.env.production` file with your values

4. Run deployment:
```bash
chmod +x deploy.sh
./deploy.sh local
```

### Step 3: Initialize SSL Certificates

Run the SSL initialization script:
```bash
chmod +x init-ssl.sh
./init-ssl.sh
```

This will:
- Obtain SSL certificates from Let's Encrypt
- Configure nginx with HTTPS
- Set up automatic certificate renewal

### Step 4: Verify Deployment

1. Check container status:
```bash
docker-compose -f docker-compose.prod.yml ps
```

All containers should be "Up" and healthy.

2. Check logs:
```bash
# API logs
docker logs angularpress-api-prod

# Frontend logs
docker logs angularpress-frontend-prod

# Nginx logs
docker logs angularpress-nginx-prod
```

3. Test the application:
- Visit: https://angularpress.iffuso.com
- Login at: https://angularpress.iffuso.com/ap-admin/login
- Default credentials: admin / admin (change immediately!)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `secure-password-123` |
| `MYSQL_DATABASE` | Database name | `angular_press` |
| `MYSQL_USER` | Database user | `angular_press_user` |
| `MYSQL_PASSWORD` | Database password | `secure-password-456` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-super-secret-jwt-key` |
| `JWT_EXPIRATION` | JWT token expiration | `7d` |
| `DOMAIN` | Your domain name | `angularpress.iffuso.com` |
| `SSL_EMAIL` | Email for Let's Encrypt | `admin@example.com` |

### Nginx Configuration

The nginx reverse proxy handles:
- SSL/TLS termination
- HTTP to HTTPS redirect
- API proxying to `/api/*`
- Frontend serving for all other routes
- Static asset caching
- Security headers

Configuration files:
- `nginx/nginx.conf` - Main nginx config
- `nginx/conf.d/angularpress.conf` - Site-specific config

## 📊 Monitoring

### View Logs

```bash
# All containers
docker-compose -f docker-compose.prod.yml logs -f

# Specific container
docker logs -f angularpress-api-prod
docker logs -f angularpress-frontend-prod
docker logs -f angularpress-nginx-prod
docker logs -f angularpress-mysql-prod
```

### Container Status

```bash
docker-compose -f docker-compose.prod.yml ps
```

### Resource Usage

```bash
docker stats
```

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest code
git pull origin master

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Database Backup

```bash
# Backup
docker exec angularpress-mysql-prod mysqldump -u root -p${MYSQL_ROOT_PASSWORD} angular_press > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i angularpress-mysql-prod mysql -u root -p${MYSQL_ROOT_PASSWORD} angular_press < backup_20250101.sql
```

### SSL Certificate Renewal

Certificates auto-renew via the certbot container. To manually renew:

```bash
docker-compose -f docker-compose.prod.yml run --rm certbot renew
docker-compose -f docker-compose.prod.yml restart nginx
```

## 🐛 Troubleshooting

### Application Not Loading

1. Check if containers are running:
```bash
docker-compose -f docker-compose.prod.yml ps
```

2. Check nginx logs:
```bash
docker logs angularpress-nginx-prod
```

3. Verify DNS is pointing to server:
```bash
nslookup angularpress.iffuso.com
```

### API Connection Issues

1. Check API container logs:
```bash
docker logs angularpress-api-prod
```

2. Verify database connection:
```bash
docker exec angularpress-api-prod npm run typeorm migration:show
```

3. Check CORS settings in docker-compose.prod.yml

### SSL Certificate Issues

1. Verify domain is accessible via HTTP:
```bash
curl http://angularpress.iffuso.com
```

2. Re-run SSL initialization:
```bash
./init-ssl.sh
```

3. Check certbot logs:
```bash
docker logs angularpress-certbot
```

## 🔒 Security Checklist

- [ ] Changed default admin password
- [ ] Set strong MySQL passwords
- [ ] Set secure JWT secret (min 32 characters)
- [ ] SSL certificates installed and working
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] Regular backups configured
- [ ] Monitoring and alerts set up
- [ ] Keep Docker images updated

## 📞 Support

For issues or questions:
- Check logs first
- Review this documentation
- Check GitHub issues
- Contact: senneseph@gmail.com

