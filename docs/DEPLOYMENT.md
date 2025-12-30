# Deployment Guide

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Environment variables configured

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resconate
DB_USER=postgres
DB_HOST=localhost
DB_NAME=resconate
DB_PASSWORD=your_password
DB_PORT=5432

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Email (optional)
EMAIL_PROVIDER=smtp
EMAIL_API_KEY=your_email_api_key
FROM_EMAIL=noreply@resconate.com
FROM_NAME=Resconate

# Storage (optional)
STORAGE_TYPE=local
UPLOAD_DIR=./uploads

# App
APP_URL=http://localhost:3000
NODE_ENV=production
```

## Local Development

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up database:
```bash
# Ensure PostgreSQL is running
# Database tables will be created automatically on first run
```

3. Run development server:
```bash
npm run dev
```

4. Access the application:
```
http://localhost:3000
```

## Production Build

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Database Setup

The database tables are created automatically when the application starts. The default admin credentials are:
- Username: `admin`
- Password: `admin123`

**Important:** Change the default admin password in production!

## Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t resconate .
docker run -p 3000:3000 resconate
```

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Configure HTTPS
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Enable security headers
- [ ] Configure file upload limits
- [ ] Set up monitoring and logging

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Port Already in Use
- Change PORT in `.env` or use: `PORT=3001 npm run dev`

