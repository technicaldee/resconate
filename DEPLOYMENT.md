# Deployment Guide - Resconate to Vercel

This guide will help you deploy both the frontend and backend to Vercel as a single Next.js application.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A PostgreSQL database (you can use Vercel Postgres, Supabase, or any PostgreSQL provider)
3. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Database

1. Set up a PostgreSQL database (recommended: Vercel Postgres or Supabase)
2. Note down your database connection string or credentials

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` (if your Next.js app is in the frontend folder)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (default)

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel
```

5. For production:
```bash
vercel --prod
```

## Step 3: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

### Required Variables:

1. **DATABASE_URL** (recommended)
   - Format: `postgresql://user:password@host:port/database`
   - Example: `postgresql://user:pass@db.example.com:5432/mydb`

   OR use individual variables:

2. **DB_USER** - Database username
3. **DB_HOST** - Database host
4. **DB_NAME** - Database name
5. **DB_PASSWORD** - Database password
6. **DB_PORT** - Database port (usually 5432)

7. **JWT_SECRET** - A secure random string for JWT token signing
   - Generate one: `openssl rand -base64 32`

### How to Add Environment Variables:

1. Go to your project in Vercel dashboard
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add each variable:
   - Name: `DATABASE_URL`
   - Value: Your connection string
   - Environment: Production, Preview, Development (select all)
5. Click "Save"

## Step 4: Verify Deployment

1. After deployment, visit your Vercel URL
2. Check that the homepage loads
3. Test API endpoints:
   - `https://your-app.vercel.app/api/health` should return `{"status":"OK"}`
4. Test login:
   - Go to `/hr-login`
   - Use default credentials: `admin` / `admin123`

## Step 5: Database Initialization

The database tables will be automatically created on the first API call. The system will:
- Create all necessary tables
- Seed a default admin user (admin/admin123)

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check that your database allows connections from Vercel's IPs
- For Vercel Postgres, use the connection string from the Vercel dashboard

### Build Errors

- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (Vercel uses Node 18.x by default)
- Check build logs in Vercel dashboard

### API Routes Not Working

- Verify environment variables are set correctly
- Check function logs in Vercel dashboard
- Ensure database is accessible from Vercel

## Post-Deployment

1. **Change Default Credentials**: After first login, change the default admin password
2. **Set Up Custom Domain**: Add your custom domain in Vercel project settings
3. **Enable Analytics**: Consider enabling Vercel Analytics for monitoring
4. **Set Up Monitoring**: Add error tracking (e.g., Sentry)

## File Structure

```
frontend/
├── pages/
│   ├── api/          # All API routes (backend)
│   └── *.js          # Frontend pages
├── lib/              # Backend utilities
├── src/              # React components
└── public/           # Static assets
```

## Important Notes

- All API routes are serverless functions that run on Vercel's edge network
- Database connections are pooled and managed automatically
- Environment variables are encrypted and secure
- The application auto-scales based on traffic

## Support

For issues:
1. Check Vercel function logs
2. Check database connection
3. Verify environment variables
4. Review Next.js build output


