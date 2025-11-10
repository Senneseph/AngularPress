# Angular Press API Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and update with your MySQL credentials
   - Default configuration:
     - DB_HOST=localhost
     - DB_PORT=3306
     - DB_USERNAME=root
     - DB_PASSWORD=
     - DB_DATABASE=angular_press

3. Create the database:
```bash
mysql -u root -p < scripts/init-db.sql
```

Or manually:
```sql
CREATE DATABASE angular_press CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "displayName": "John Doe"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Posts

#### Get All Posts
```
GET /api/posts?page=1&limit=10&status=published
```

#### Get Single Post
```
GET /api/posts/:id
```

#### Create Post
```
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "<p>This is the content</p>",
  "excerpt": "Short description",
  "status": "published",
  "slug": "my-first-post"
}
```

#### Update Post
```
PATCH /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<p>Updated content</p>"
}
```

#### Delete Post
```
DELETE /api/posts/:id
Authorization: Bearer <token>
```

## Database Schema

The API uses TypeORM with MySQL. Tables are created automatically based on WordPress schema:

- `wp_users` - User accounts
- `wp_posts` - Posts and pages
- `wp_terms` - Categories and tags
- `wp_term_taxonomy` - Taxonomy relationships
- `wp_term_relationships` - Post-term relationships

## Development

### Run in development mode
```bash
npm run start:dev
```

### Run tests
```bash
npm run test
```

### Build for production
```bash
npm run build
npm run start:prod
```

## Connecting Angular Frontend

Update your Angular services to point to `http://localhost:3000/api`

Example in `environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check credentials in `.env` file
- Verify database exists: `SHOW DATABASES;`

### CORS Issues
- Update `CORS_ORIGIN` in `.env` to match your Angular app URL
- Default is `http://localhost:4200`

### Port Already in Use
- Change `PORT` in `.env` file
- Default is `3000`

