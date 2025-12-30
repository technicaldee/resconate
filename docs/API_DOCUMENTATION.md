# Resconate API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/[id]` - Get employee by ID
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Jobs
- `GET /api/hr/jobs` - List all jobs
- `POST /api/hr/jobs` - Create job posting
- `GET /api/hr/jobs/[id]` - Get job by ID
- `PUT /api/hr/jobs/[id]` - Update job
- `DELETE /api/hr/jobs/[id]` - Delete job

### Candidates
- `GET /api/recruitment/candidates` - List candidates
- `POST /api/recruitment/candidates` - Create candidate
- `PUT /api/recruitment/candidates/[id]` - Update candidate

### Payroll
- `GET /api/payroll` - List payroll records
- `POST /api/payroll` - Create payroll record
- `GET /api/payroll/[id]` - Get payroll by ID

### Leave Management
- `GET /api/leave` - List leave requests
- `POST /api/leave` - Create leave request
- `PUT /api/leave/[id]` - Update leave request

### Admin Endpoints
- `GET /api/admin/audit` - Get audit logs
- `GET /api/admin/settings` - Get system settings
- `POST /api/admin/settings` - Update system settings

### Export/Import
- `GET /api/export/employees` - Export employees as CSV
- `POST /api/import/employees` - Import employees from CSV

### Banking
- `GET /api/bank-accounts` - List bank accounts
- `POST /api/bank-accounts` - Add bank account
- `PUT /api/bank-accounts` - Update bank account

### Payment Transactions
- `GET /api/payment-transactions` - List payment transactions
- `POST /api/payment-transactions` - Create payment transaction

### Subscriptions
- `GET /api/subscriptions` - List subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions` - Update subscription

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice

### Referrals
- `GET /api/referrals` - List referrals
- `POST /api/referrals` - Create referral
- `PUT /api/referrals` - Update referral

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document
- `DELETE /api/documents` - Delete document

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

