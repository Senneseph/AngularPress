# AngularPress - Setup Complete! 🎉

## What's Running

Your AngularPress application is now fully operational with Docker Compose!

### Services Running:

1. **MySQL Database** (Port 3306)
   - Database: `angular_press`
   - User: `angular_press_user`
   - Password: `angular_press_pass`
   - Root Password: `rootpassword`
   - WordPress-compatible tables created automatically

2. **NestJS API** (Port 3000)
   - URL: http://localhost:3000/api
   - JWT Authentication enabled
   - TypeORM with MySQL connection
   - Hot reload enabled for development

3. **Angular Frontend** (Port 4200)
   - URL: http://localhost:4200
   - Angular 19.2.0 with standalone components
   - NGXS state management
   - Hot reload enabled for development

## Database Tables Created

TypeORM automatically created the following WordPress-compatible tables:

- `wp_users` - User accounts with bcrypt password hashing
- `wp_posts` - Posts, pages, and custom post types
- `wp_terms` - Categories and tags
- `wp_term_taxonomy` - Taxonomy definitions
- `wp_term_relationships` - Post-term relationships

## API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires JWT)

### Posts
- `GET /api/posts` - List all posts (with pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (requires JWT)
- `PATCH /api/posts/:id` - Update post (requires JWT)
- `DELETE /api/posts/:id` - Delete post (requires JWT)

## Test User Created

A test admin user has been created:
- **Username:** admin
- **Email:** admin@example.com
- **Password:** admin123

## How to Use

### Start the Application
```bash
docker compose -f docker-compose.dev.yml up
```

### Stop the Application
```bash
docker compose -f docker-compose.dev.yml down
```

### View Logs
```bash
# All services
docker compose -f docker-compose.dev.yml logs -f

# Specific service
docker compose -f docker-compose.dev.yml logs -f api
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f mysql
```

### Rebuild Containers
```bash
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up
```

## Testing the API

### Register a New User
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"testuser","email":"test@example.com","password":"test123","displayName":"Test User"}'
```

### Login
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"admin123"}'
```

### Get Current User (with JWT token)
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"}
```

### Create a Post (with JWT token)
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
Invoke-WebRequest -Uri "http://localhost:3000/api/posts" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $token"} `
  -Body '{"post_title":"My First Post","post_content":"This is the content","post_status":"publish"}'
```

## Database Access

### Connect to MySQL from Host
```bash
mysql -h 127.0.0.1 -P 3306 -u angular_press_user -p
# Password: angular_press_pass
```

### Connect to MySQL from Docker
```bash
docker compose -f docker-compose.dev.yml exec mysql mysql -u angular_press_user -p angular_press
```

### Backup Database
```bash
docker compose -f docker-compose.dev.yml exec mysql mysqldump -u angular_press_user -pangular_press_pass angular_press > backup.sql
```

### Restore Database
```bash
docker compose -f docker-compose.dev.yml exec -T mysql mysql -u angular_press_user -pangular_press_pass angular_press < backup.sql
```

## Development Workflow

### Frontend Development
- Files are mounted as volumes, so changes are reflected immediately
- Angular dev server has hot reload enabled
- Edit files in `angular-press/src/` and see changes in browser

### Backend Development
- Files are mounted as volumes, so changes are reflected immediately
- NestJS has watch mode enabled
- Edit files in `angular-press-api/src/` and server restarts automatically

### Database Changes
- TypeORM synchronize is enabled in development
- Entity changes are automatically applied to database
- **WARNING:** This can cause data loss - disable in production!

## Next Steps

### 1. Connect Angular Frontend to Backend
The Angular services currently use mock data. Update them to call the real API:

- Update `AuthService` to use `/api/auth/login` and `/api/auth/register`
- Update `PostService` to use `/api/posts` endpoints
- Add JWT interceptor to attach token to requests
- Update environment files with API URL

### 2. Complete Backend Modules
Create additional modules for full WordPress functionality:

- Categories module (CRUD for categories)
- Tags module (CRUD for tags)
- Users module (user management)
- Media module (file uploads)
- Comments module
- Settings module

### 3. Database Seeding
Create a seeding script to populate initial data:

- Default categories (Uncategorized)
- Sample posts
- Admin user with proper roles
- Default settings

### 4. Fix Remaining Frontend Tests
- 74 tests are still failing
- Fix async/observable timeout issues
- Mock theme service file loading
- Add missing observables to components
- Achieve 100% code coverage goal

### 5. Production Deployment
When ready for production:

- Use `docker-compose.yml` (production config)
- Disable TypeORM synchronize
- Use proper database migrations
- Set strong passwords and JWT secrets
- Enable HTTPS
- Configure proper CORS origins
- Set up reverse proxy (nginx)

## Troubleshooting

### Port Already in Use
If ports 3000, 3306, or 4200 are already in use:
```bash
# Stop the containers
docker compose -f docker-compose.dev.yml down

# Find and kill the process using the port
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Issues
```bash
# Check if MySQL is healthy
docker compose -f docker-compose.dev.yml ps

# View MySQL logs
docker compose -f docker-compose.dev.yml logs mysql

# Restart MySQL
docker compose -f docker-compose.dev.yml restart mysql
```

### Frontend Build Issues
```bash
# Clear node_modules and rebuild
docker compose -f docker-compose.dev.yml down
docker volume rm wp-angular-app_mysql_data_dev
docker compose -f docker-compose.dev.yml build --no-cache frontend
docker compose -f docker-compose.dev.yml up
```

## Documentation

- **BuildSpec.md** - Complete project specification
- **README.md** - Project overview and quick start
- **DOCKER_SETUP.md** - Detailed Docker setup guide
- **angular-press-api/API_SETUP.md** - API documentation

## Success! ✅

Your AngularPress application is now running with:
- ✅ MySQL database with WordPress-compatible schema
- ✅ NestJS API with JWT authentication
- ✅ Angular 19 frontend with hot reload
- ✅ Docker Compose orchestration
- ✅ Working login system
- ✅ Test user created and verified

You can now access:
- Frontend: http://localhost:4200
- API: http://localhost:3000/api
- MySQL: localhost:3306

Happy coding! 🚀

