# Resconate Architecture Documentation

## Overview
Resconate is a Next.js-based HR management platform with a PostgreSQL database backend, supporting both marketing pages and full HR platform functionality.

## Technology Stack

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router
- **Authentication**: JWT tokens

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: bcryptjs + JWT
- **File Storage**: Local, AWS S3, or Cloudinary

### External Services
- **Email**: SendGrid / Mailgun
- **Payment**: Paystack / Flutterwave
- **Banking**: Flutterwave / Paystack APIs

## Project Structure

```
frontend/
├── pages/                    # Next.js pages (routes)
│   ├── api/                  # API endpoints
│   ├── index.js              # Home page
│   ├── hr-dashboard.js       # HR Dashboard
│   ├── admin-dashboard.js    # Admin Dashboard
│   └── employee-portal.js    # Employee Portal
├── src/
│   ├── components/           # React components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── ErrorBoundary.js
│   │   └── ...
│   ├── styles/               # CSS files
│   │   ├── main.css
│   │   ├── brand-colors.css
│   │   └── ...
│   └── utils/                # Utility functions
│       ├── api.js
│       └── scrollUtils.js
├── lib/                      # Backend services
│   ├── database.js           # Database connection
│   ├── auth.js               # Authentication
│   ├── emailService.js       # Email service
│   ├── paymentGateway.js     # Payment gateway
│   ├── bankingAPI.js         # Banking API
│   ├── fileUploadEnhanced.js # File upload
│   ├── migrations.js         # Database migrations
│   ├── performance.js        # Performance utilities
│   ├── i18n.js               # Internationalization
│   └── ...
└── __tests__/                # Test files
```

## Database Schema

### Core Tables
- `admins` - Admin users
- `employees` - Employee records
- `jobs` - Job postings
- `candidates` - Job candidates
- `interviews` - Interview scheduling
- `leave_requests` - Leave management
- `payroll` - Payroll records
- `performance_reviews` - Performance reviews
- `compliance_records` - Compliance tracking

### Additional Tables
- `audit_logs` - Activity logging
- `referrals` - Referral program
- `system_settings` - System configuration
- `bank_accounts` - Bank account information
- `payment_transactions` - Payment records
- `subscriptions` - Subscription management
- `invoices` - Invoice records
- `documents` - File documents
- `email_logs` - Email tracking
- `compliance_calculations` - Calculation history
- `schema_migrations` - Migration tracking

## Authentication Flow

1. User submits credentials
2. Backend validates against database
3. JWT token generated and returned
4. Token stored in localStorage/cookies
5. API requests include token in Authorization header
6. Middleware verifies token on protected routes

## API Architecture

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/me` - Get current user

### Employee Management
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/[id]` - Get employee
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Payment Processing
- `POST /api/payment/initialize` - Initialize payment
- `POST /api/payment/webhook` - Payment webhook
- `GET /api/payment-transactions` - List transactions

### Banking
- `POST /api/bank-accounts` - Add bank account
- `POST /api/bank-accounts/verify` - Verify account
- `GET /api/bank-accounts` - List accounts

## Security Features

1. **Authentication**: JWT-based authentication
2. **Authorization**: Role-based access control
3. **Rate Limiting**: Per-IP request limiting
4. **CSRF Protection**: Token-based CSRF protection
5. **Input Sanitization**: XSS prevention
6. **SQL Injection Prevention**: Parameterized queries
7. **Security Headers**: HSTS, X-Frame-Options, etc.

## Performance Optimizations

1. **Code Splitting**: Lazy loading of components
2. **Image Optimization**: Next.js Image component
3. **Caching**: API response caching
4. **Database Indexing**: Optimized queries
5. **Bundle Optimization**: Tree shaking and minification

## Internationalization

- Support for multiple languages (English, French, Ibibio, Arabic)
- Translation files in `lib/i18n.js`
- RTL support for Arabic
- Localized date/time/currency formatting

## Deployment

### Environment Variables Required
- Database connection details
- JWT secret
- Email service credentials
- Payment gateway keys
- Cloud storage credentials (optional)

### Build Process
```bash
npm install
npm run build
npm start
```

## Testing

- Unit tests: `__tests__/utils.test.js`
- Component tests: `__tests__/components.test.js`
- API tests: `__tests__/api.test.js`

Run tests: `npm test`

## Monitoring & Logging

- Audit logs in database
- Email logs tracking
- Error logging (ready for Sentry integration)
- Performance metrics

---

*Last Updated: December 30, 2024*

