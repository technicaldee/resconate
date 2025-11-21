# Resconate - Next.js Application

This is a Next.js application that combines the frontend and backend into a single deployable application for Vercel.

## Project Structure

```
frontend/
├── pages/
│   ├── api/              # API routes (backend)
│   │   ├── auth/
│   │   ├── employee/
│   │   ├── hr/
│   │   └── ...
│   ├── index.js          # Home page
│   ├── hr-login.js       # HR login page
│   ├── employee-login.js # Employee login page
│   └── ...
├── src/
│   ├── components/       # React components
│   ├── styles/           # CSS files
│   └── utils/            # Utility functions
├── lib/                  # Backend utilities (database, auth, validation)
├── public/               # Static assets
└── package.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the `frontend` directory:
```env
DATABASE_URL=your_postgres_connection_string
# OR use individual variables:
DB_USER=postgres
DB_HOST=localhost
DB_NAME=postgres
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Start production server:
```bash
npm start
```

## Deployment to Vercel

1. Push your code to GitHub/GitLab/Bitbucket

2. Import your repository in Vercel

3. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL` (or individual DB variables)
   - `JWT_SECRET`

4. Deploy! Vercel will automatically:
   - Detect Next.js
   - Build the application
   - Deploy both frontend and API routes

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string (preferred)
- OR individual database variables:
  - `DB_USER`
  - `DB_HOST`
  - `DB_NAME`
  - `DB_PASSWORD`
  - `DB_PORT`
- `JWT_SECRET`: Secret key for JWT token signing

## API Routes

All API routes are available under `/api/*`:
- `/api/auth/login` - Admin login
- `/api/auth/me` - Get current admin
- `/api/employee/login` - Employee login
- `/api/hr/jobs` - Job management
- `/api/employees` - Employee management
- `/api/analytics` - Dashboard analytics
- And more...

## Default Credentials

- Admin: `admin` / `admin123`

## Notes

- The database will be automatically initialized on first API call
- All API routes are serverless functions on Vercel
- Static assets are served from the `public` directory


