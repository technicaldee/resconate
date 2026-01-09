// Load environment variables from .env file if it exists
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'postgres',
        password: process.env.DB_PASSWORD || 'Test1234',
        port: process.env.DB_PORT || 5432,
      }
);

const runMigrations = async (client) => {
  try {
    // Use DO block for PostgreSQL to handle errors gracefully
    await client.query(`
      DO $$ 
      BEGIN
        -- Add employment_type column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='jobs' AND column_name='employment_type'
        ) THEN
          ALTER TABLE jobs ADD COLUMN employment_type VARCHAR(50);
          RAISE NOTICE 'Added employment_type column to jobs table';
        END IF;
        
        -- Add benefits column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='jobs' AND column_name='benefits'
        ) THEN
          ALTER TABLE jobs ADD COLUMN benefits JSONB DEFAULT '[]';
          RAISE NOTICE 'Added benefits column to jobs table';
        END IF;
        
        -- Make type column nullable if it exists and is NOT NULL
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='jobs' AND column_name='type' AND is_nullable='NO'
        ) THEN
          ALTER TABLE jobs ALTER COLUMN type DROP NOT NULL;
          RAISE NOTICE 'Made type column nullable in jobs table';
        END IF;
        
        -- Add resume_url column to candidates table if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='candidates' AND column_name='resume_url'
        ) THEN
          ALTER TABLE candidates ADD COLUMN resume_url TEXT;
          RAISE NOTICE 'Added resume_url column to candidates table';
        END IF;
        
        -- Add phone column to candidates table if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='candidates' AND column_name='phone'
        ) THEN
          ALTER TABLE candidates ADD COLUMN phone VARCHAR(20);
          RAISE NOTICE 'Added phone column to candidates table';
        END IF;
        
        -- Add notes column to candidates table if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='candidates' AND column_name='notes'
        ) THEN
          ALTER TABLE candidates ADD COLUMN notes TEXT;
          RAISE NOTICE 'Added notes column to candidates table';
        END IF;
        
        -- Add scheduled_date column to interviews table if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='interviews' AND column_name='scheduled_date'
        ) THEN
          ALTER TABLE interviews ADD COLUMN scheduled_date TIMESTAMP;
          RAISE NOTICE 'Added scheduled_date column to interviews table';
        END IF;
        
        -- Add created_at column to candidates table if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='candidates' AND column_name='created_at'
        ) THEN
          ALTER TABLE candidates ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
          RAISE NOTICE 'Added created_at column to candidates table';
        END IF;
        
        -- Add applied_date column to candidates table if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='candidates' AND column_name='applied_date'
        ) THEN
          ALTER TABLE candidates ADD COLUMN applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
          RAISE NOTICE 'Added applied_date column to candidates table';
        END IF;
        
        -- Add interviewer_id column to interviews table if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='interviews' AND column_name='interviewer_id'
        ) THEN
          ALTER TABLE interviews ADD COLUMN interviewer_id INTEGER REFERENCES admins(id);
          RAISE NOTICE 'Added interviewer_id column to interviews table';
        END IF;
        
        -- Add updated_at column to interviews table if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='interviews' AND column_name='updated_at'
        ) THEN
          ALTER TABLE interviews ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
          RAISE NOTICE 'Added updated_at column to interviews table';
        END IF;
        
        -- Ensure payroll table has correct columns
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='payroll' AND column_name='employee_id'
        ) THEN
          -- Check if old schema exists and migrate
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='payroll' AND column_name='employee_ids'
          ) THEN
            -- Old schema detected, add new columns
            ALTER TABLE payroll ADD COLUMN employee_id INTEGER REFERENCES employees(id);
            ALTER TABLE payroll ADD COLUMN pay_period_start DATE;
            ALTER TABLE payroll ADD COLUMN pay_period_end DATE;
            ALTER TABLE payroll ADD COLUMN gross_salary DECIMAL(12,2);
            ALTER TABLE payroll ADD COLUMN net_salary DECIMAL(12,2);
            ALTER TABLE payroll ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
            RAISE NOTICE 'Added new columns to payroll table for migration';
          ELSE
            -- No old schema, just add the column
            ALTER TABLE payroll ADD COLUMN employee_id INTEGER REFERENCES employees(id);
            RAISE NOTICE 'Added employee_id column to payroll table';
          END IF;
        END IF;
        
        -- Add pay_period_start if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='payroll' AND column_name='pay_period_start'
        ) THEN
          ALTER TABLE payroll ADD COLUMN pay_period_start DATE;
          RAISE NOTICE 'Added pay_period_start column to payroll table';
        END IF;
        
        -- Add pay_period_end if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='payroll' AND column_name='pay_period_end'
        ) THEN
          ALTER TABLE payroll ADD COLUMN pay_period_end DATE;
          RAISE NOTICE 'Added pay_period_end column to payroll table';
        END IF;
        
        -- Add gross_salary if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='payroll' AND column_name='gross_salary'
        ) THEN
          ALTER TABLE payroll ADD COLUMN gross_salary DECIMAL(12,2);
          RAISE NOTICE 'Added gross_salary column to payroll table';
        END IF;
        
        -- Add net_salary if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='payroll' AND column_name='net_salary'
        ) THEN
          ALTER TABLE payroll ADD COLUMN net_salary DECIMAL(12,2);
          RAISE NOTICE 'Added net_salary column to payroll table';
        END IF;
        
        -- Ensure deductions is JSONB if it exists as another type
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='payroll' AND column_name='deductions' AND data_type != 'jsonb'
        ) THEN
          -- Convert to JSONB if needed (this might need data migration)
          ALTER TABLE payroll ALTER COLUMN deductions TYPE JSONB USING deductions::text::jsonb;
          RAISE NOTICE 'Converted deductions column to JSONB in payroll table';
        END IF;
        
        -- Make period column nullable if it has NOT NULL constraint
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='payroll' AND column_name='period' AND is_nullable='NO'
        ) THEN
          ALTER TABLE payroll ALTER COLUMN period DROP NOT NULL;
          RAISE NOTICE 'Made period column nullable in payroll table';
        END IF;
        
        -- Ensure performance_reviews table has review_period_start column
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='performance_reviews' AND column_name='review_period_start'
        ) THEN
          ALTER TABLE performance_reviews ADD COLUMN review_period_start DATE;
          RAISE NOTICE 'Added review_period_start column to performance_reviews table';
        END IF;
        
        -- Ensure performance_reviews table has review_period_end column
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='performance_reviews' AND column_name='review_period_end'
        ) THEN
          ALTER TABLE performance_reviews ADD COLUMN review_period_end DATE;
          RAISE NOTICE 'Added review_period_end column to performance_reviews table';
        END IF;
        
        -- Ensure performance_reviews table has rating column
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='performance_reviews' AND column_name='rating'
        ) THEN
          ALTER TABLE performance_reviews ADD COLUMN rating INTEGER;
          RAISE NOTICE 'Added rating column to performance_reviews table';
        END IF;
        
        -- Ensure performance_reviews table has comments column
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='performance_reviews' AND column_name='comments'
        ) THEN
          ALTER TABLE performance_reviews ADD COLUMN comments TEXT;
          RAISE NOTICE 'Added comments column to performance_reviews table';
        END IF;
        
        -- Ensure performance_reviews table has created_at column
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='performance_reviews' AND column_name='created_at'
        ) THEN
          ALTER TABLE performance_reviews ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
          RAISE NOTICE 'Added created_at column to performance_reviews table';
        END IF;
        
        -- Ensure employees table has password_hash column
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='employees' AND column_name='password_hash'
        ) THEN
          ALTER TABLE employees ADD COLUMN password_hash VARCHAR(255);
          RAISE NOTICE 'Added password_hash column to employees table';
        END IF;
        
        -- Ensure leave_requests table has updated_at column
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='leave_requests' AND column_name='updated_at'
        ) THEN
          ALTER TABLE leave_requests ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
          RAISE NOTICE 'Added updated_at column to leave_requests table';
        END IF;
      END $$;
    `);
    console.log('Migration: Verified jobs, candidates, interviews, and payroll table columns');
  } catch (migrationError) {
    console.error('Migration error:', migrationError.message);
    // Fallback: try individual column additions
    try {
      const employmentTypeCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='jobs' AND column_name='employment_type';
      `);
      if (employmentTypeCheck.rows.length === 0) {
        await client.query(`ALTER TABLE jobs ADD COLUMN employment_type VARCHAR(50);`);
        console.log('Migration: Added employment_type column');
      }
      
      const benefitsCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='jobs' AND column_name='benefits';
      `);
      if (benefitsCheck.rows.length === 0) {
        await client.query(`ALTER TABLE jobs ADD COLUMN benefits JSONB DEFAULT '[]';`);
        console.log('Migration: Added benefits column');
      }
      
      // Make type column nullable
      const typeCheck = await client.query(`
        SELECT column_name, is_nullable
        FROM information_schema.columns 
        WHERE table_name='jobs' AND column_name='type';
      `);
      if (typeCheck.rows.length > 0 && typeCheck.rows[0].is_nullable === 'NO') {
        await client.query(`ALTER TABLE jobs ALTER COLUMN type DROP NOT NULL;`);
        console.log('Migration: Made type column nullable');
      }
      
      // Add resume_url column to candidates table
      const resumeUrlCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='candidates' AND column_name='resume_url';
      `);
      if (resumeUrlCheck.rows.length === 0) {
        await client.query(`ALTER TABLE candidates ADD COLUMN resume_url TEXT;`);
        console.log('Migration: Added resume_url column to candidates table');
      }
      
      // Add phone column to candidates table
      const phoneCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='candidates' AND column_name='phone';
      `);
      if (phoneCheck.rows.length === 0) {
        await client.query(`ALTER TABLE candidates ADD COLUMN phone VARCHAR(20);`);
        console.log('Migration: Added phone column to candidates table');
      }
      
      // Add notes column to candidates table
      const notesCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='candidates' AND column_name='notes';
      `);
      if (notesCheck.rows.length === 0) {
        await client.query(`ALTER TABLE candidates ADD COLUMN notes TEXT;`);
        console.log('Migration: Added notes column to candidates table');
      }
      
      // Add scheduled_date column to interviews table
      const scheduledDateCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='interviews' AND column_name='scheduled_date';
      `);
      if (scheduledDateCheck.rows.length === 0) {
        await client.query(`ALTER TABLE interviews ADD COLUMN scheduled_date TIMESTAMP;`);
        console.log('Migration: Added scheduled_date column to interviews table');
      }
      
      // Add created_at column to candidates table
      const createdAtCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='candidates' AND column_name='created_at';
      `);
      if (createdAtCheck.rows.length === 0) {
        await client.query(`ALTER TABLE candidates ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
        console.log('Migration: Added created_at column to candidates table');
      }
      
      // Add applied_date column to candidates table
      const appliedDateCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='candidates' AND column_name='applied_date';
      `);
      if (appliedDateCheck.rows.length === 0) {
        await client.query(`ALTER TABLE candidates ADD COLUMN applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
        console.log('Migration: Added applied_date column to candidates table');
      }
      
      // Add interviewer_id column to interviews table
      const interviewerIdCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='interviews' AND column_name='interviewer_id';
      `);
      if (interviewerIdCheck.rows.length === 0) {
        await client.query(`ALTER TABLE interviews ADD COLUMN interviewer_id INTEGER REFERENCES admins(id);`);
        console.log('Migration: Added interviewer_id column to interviews table');
      }
      
      // Add updated_at column to interviews table
      const updatedAtCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='interviews' AND column_name='updated_at';
      `);
      if (updatedAtCheck.rows.length === 0) {
        await client.query(`ALTER TABLE interviews ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
        console.log('Migration: Added updated_at column to interviews table');
      }
      
      // Ensure payroll table has correct columns
      const payrollEmployeeIdCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='payroll' AND column_name='employee_id';
      `);
      if (payrollEmployeeIdCheck.rows.length === 0) {
        await client.query(`ALTER TABLE payroll ADD COLUMN employee_id INTEGER REFERENCES employees(id);`);
        console.log('Migration: Added employee_id column to payroll table');
      }
      
      const payrollPeriodStartCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='payroll' AND column_name='pay_period_start';
      `);
      if (payrollPeriodStartCheck.rows.length === 0) {
        await client.query(`ALTER TABLE payroll ADD COLUMN pay_period_start DATE;`);
        console.log('Migration: Added pay_period_start column to payroll table');
      }
      
      const payrollPeriodEndCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='payroll' AND column_name='pay_period_end';
      `);
      if (payrollPeriodEndCheck.rows.length === 0) {
        await client.query(`ALTER TABLE payroll ADD COLUMN pay_period_end DATE;`);
        console.log('Migration: Added pay_period_end column to payroll table');
      }
      
      const payrollGrossSalaryCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='payroll' AND column_name='gross_salary';
      `);
      if (payrollGrossSalaryCheck.rows.length === 0) {
        await client.query(`ALTER TABLE payroll ADD COLUMN gross_salary DECIMAL(12,2);`);
        console.log('Migration: Added gross_salary column to payroll table');
      }
      
      const payrollNetSalaryCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='payroll' AND column_name='net_salary';
      `);
      if (payrollNetSalaryCheck.rows.length === 0) {
        await client.query(`ALTER TABLE payroll ADD COLUMN net_salary DECIMAL(12,2);`);
        console.log('Migration: Added net_salary column to payroll table');
      }
      
      const payrollCreatedAtCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='payroll' AND column_name='created_at';
      `);
      if (payrollCreatedAtCheck.rows.length === 0) {
        await client.query(`ALTER TABLE payroll ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
        console.log('Migration: Added created_at column to payroll table');
      }
      
      // Make period column nullable if it has NOT NULL constraint
      const periodCheck = await client.query(`
        SELECT column_name, is_nullable
        FROM information_schema.columns 
        WHERE table_name='payroll' AND column_name='period';
      `);
      if (periodCheck.rows.length > 0 && periodCheck.rows[0].is_nullable === 'NO') {
        await client.query(`ALTER TABLE payroll ALTER COLUMN period DROP NOT NULL;`);
        console.log('Migration: Made period column nullable in payroll table');
      }
      
      // Ensure performance_reviews table has review_period_start column
      const perfPeriodStartCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='performance_reviews' AND column_name='review_period_start';
      `);
      if (perfPeriodStartCheck.rows.length === 0) {
        await client.query(`ALTER TABLE performance_reviews ADD COLUMN review_period_start DATE;`);
        console.log('Migration: Added review_period_start column to performance_reviews table');
      }
      
      // Ensure performance_reviews table has review_period_end column
      const perfPeriodEndCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='performance_reviews' AND column_name='review_period_end';
      `);
      if (perfPeriodEndCheck.rows.length === 0) {
        await client.query(`ALTER TABLE performance_reviews ADD COLUMN review_period_end DATE;`);
        console.log('Migration: Added review_period_end column to performance_reviews table');
      }
      
      // Ensure performance_reviews table has rating column
      const perfRatingCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='performance_reviews' AND column_name='rating';
      `);
      if (perfRatingCheck.rows.length === 0) {
        await client.query(`ALTER TABLE performance_reviews ADD COLUMN rating INTEGER;`);
        console.log('Migration: Added rating column to performance_reviews table');
      }
      
      // Ensure performance_reviews table has comments column
      const perfCommentsCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='performance_reviews' AND column_name='comments';
      `);
      if (perfCommentsCheck.rows.length === 0) {
        await client.query(`ALTER TABLE performance_reviews ADD COLUMN comments TEXT;`);
        console.log('Migration: Added comments column to performance_reviews table');
      }
      
      // Ensure performance_reviews table has created_at column
      const perfCreatedAtCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='performance_reviews' AND column_name='created_at';
      `);
      if (perfCreatedAtCheck.rows.length === 0) {
        await client.query(`ALTER TABLE performance_reviews ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
        console.log('Migration: Added created_at column to performance_reviews table');
      }
      
      // Ensure employees table has password_hash column
      const passwordHashCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='employees' AND column_name='password_hash';
      `);
      if (passwordHashCheck.rows.length === 0) {
        await client.query(`ALTER TABLE employees ADD COLUMN password_hash VARCHAR(255);`);
        console.log('Migration: Added password_hash column to employees table');
      }
      
      // Ensure leave_requests table has updated_at column
      const leaveUpdatedAtCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='leave_requests' AND column_name='updated_at';
      `);
      if (leaveUpdatedAtCheck.rows.length === 0) {
        await client.query(`ALTER TABLE leave_requests ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
        console.log('Migration: Added updated_at column to leave_requests table');
      }
    } catch (fallbackError) {
      console.error('Fallback migration error:', fallbackError.message);
    }
  }
};

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        department VARCHAR(100),
        position VARCHAR(100),
        salary DECIMAL(12,2),
        phone VARCHAR(20),
        address TEXT,
        emergency_contact JSONB,
        start_date DATE,
        status VARCHAR(20) DEFAULT 'active',
        benefits JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        department VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        employment_type VARCHAR(50),
        description TEXT,
        requirements TEXT,
        benefits JSONB DEFAULT '[]',
        status VARCHAR(20) DEFAULT 'active',
        posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        salary VARCHAR(100)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        resume_url TEXT,
        job_id INTEGER REFERENCES jobs(id),
        status VARCHAR(50) DEFAULT 'applied',
        applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS interviews (
        id SERIAL PRIMARY KEY,
        candidate_id INTEGER REFERENCES candidates(id),
        job_id INTEGER REFERENCES jobs(id),
        interviewer_id INTEGER REFERENCES admins(id),
        scheduled_date TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        leave_type VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        days_requested INTEGER,
        reason TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        approved_by INTEGER REFERENCES admins(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS payroll (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        pay_period_start DATE NOT NULL,
        pay_period_end DATE NOT NULL,
        gross_salary DECIMAL(12,2),
        deductions JSONB DEFAULT '[]',
        net_salary DECIMAL(12,2),
        status VARCHAR(50) DEFAULT 'pending',
        payslip_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS performance_reviews (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        reviewer_id INTEGER REFERENCES admins(id),
        review_period_start DATE,
        review_period_end DATE,
        rating INTEGER,
        comments TEXT,
        goals JSONB DEFAULT '[]',
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS compliance_records (
        id SERIAL PRIMARY KEY,
        record_type VARCHAR(100) NOT NULL,
        employee_id INTEGER REFERENCES employees(id),
        compliance_date DATE,
        score INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Audit logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        user_type VARCHAR(20),
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50),
        resource_id INTEGER,
        details JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Referrals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS referrals (
        id SERIAL PRIMARY KEY,
        referrer_id INTEGER REFERENCES employees(id),
        referred_email VARCHAR(100) NOT NULL,
        referred_name VARCHAR(200),
        referral_code VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        reward_type VARCHAR(50),
        reward_amount VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // System settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type VARCHAR(50) DEFAULT 'string',
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Bank accounts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        bank_name VARCHAR(100) NOT NULL,
        bank_code VARCHAR(10),
        account_number VARCHAR(20) NOT NULL,
        account_name VARCHAR(200),
        is_verified BOOLEAN DEFAULT FALSE,
        verification_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Payment transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        bank_account_id INTEGER REFERENCES bank_accounts(id),
        amount DECIMAL(12,2) NOT NULL,
        transaction_type VARCHAR(50) DEFAULT 'payroll',
        status VARCHAR(50) DEFAULT 'pending',
        reference VARCHAR(100) UNIQUE,
        payment_provider VARCHAR(50),
        provider_reference VARCHAR(100),
        failure_reason TEXT,
        processed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(200),
        plan_type VARCHAR(50) DEFAULT 'premium',
        amount DECIMAL(12,2),
        billing_cycle VARCHAR(20) DEFAULT 'monthly',
        status VARCHAR(50) DEFAULT 'active',
        payment_method VARCHAR(50),
        payment_provider VARCHAR(50),
        next_billing_date DATE,
        auto_renewal BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Invoices table
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER REFERENCES subscriptions(id),
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        due_date DATE,
        paid_date DATE,
        payment_reference VARCHAR(100),
        pdf_url TEXT,
        receipt_pdf_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Payment reminders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_reminders (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER REFERENCES subscriptions(id),
        invoice_id INTEGER REFERENCES invoices(id),
        reminder_type VARCHAR(20) NOT NULL,
        days_before_due INTEGER,
        sent_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Demo bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS demo_bookings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        company_name VARCHAR(200),
        preferred_date DATE,
        preferred_time TIME,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Trial accounts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trial_accounts (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        company_name VARCHAR(200),
        name VARCHAR(200),
        phone VARCHAR(20),
        trial_start_date DATE NOT NULL,
        trial_end_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        converted_to_paid BOOLEAN DEFAULT FALSE,
        converted_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Compliance calendar table
    await client.query(`
      CREATE TABLE IF NOT EXISTS compliance_calendar (
        id SERIAL PRIMARY KEY,
        compliance_type VARCHAR(100) NOT NULL,
        deadline_date DATE NOT NULL,
        description TEXT,
        reminder_days INTEGER[] DEFAULT ARRAY[7, 3, 1],
        is_recurring BOOLEAN DEFAULT TRUE,
        recurrence_period VARCHAR(50),
        status VARCHAR(50) DEFAULT 'upcoming',
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Bulk payment batches table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bulk_payment_batches (
        id SERIAL PRIMARY KEY,
        batch_reference VARCHAR(100) UNIQUE NOT NULL,
        total_amount DECIMAL(12,2),
        total_transactions INTEGER,
        successful_transactions INTEGER DEFAULT 0,
        failed_transactions INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        uploaded_by INTEGER REFERENCES admins(id),
        file_name VARCHAR(255),
        reconciliation_status VARCHAR(50) DEFAULT 'pending',
        reconciled_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Documents table
    await client.query(`
        CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        document_type VARCHAR(100) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        uploaded_by INTEGER REFERENCES admins(id),
        description TEXT,
        storage_type VARCHAR(50) DEFAULT 'local',
        version INTEGER DEFAULT 1,
        previous_version_id INTEGER REFERENCES documents(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Email logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id SERIAL PRIMARY KEY,
        recipient_email VARCHAR(100) NOT NULL,
        recipient_name VARCHAR(200),
        subject VARCHAR(255) NOT NULL,
        email_type VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        sent_at TIMESTAMP,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Compliance calculations history
    await client.query(`
      CREATE TABLE IF NOT EXISTS compliance_calculations (
        id SERIAL PRIMARY KEY,
        salary DECIMAL(12,2) NOT NULL,
        state VARCHAR(50),
        calculator_type VARCHAR(50),
        calculation_result JSONB,
        created_by INTEGER REFERENCES admins(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // RBAC System - Admin Dashboards
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_dashboards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        layout_config JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT TRUE,
        created_by INTEGER REFERENCES admins(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Dashboard Features/Modules
    await client.query(`
      CREATE TABLE IF NOT EXISTS dashboard_features (
        id SERIAL PRIMARY KEY,
        dashboard_id INTEGER REFERENCES admin_dashboards(id) ON DELETE CASCADE,
        feature_key VARCHAR(100) NOT NULL,
        feature_name VARCHAR(255) NOT NULL,
        feature_description TEXT,
        component_path VARCHAR(255),
        icon VARCHAR(100),
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(dashboard_id, feature_key)
      );
    `);

    // Admin Dashboard Access (which admins can access which dashboards)
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_dashboard_access (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
        dashboard_id INTEGER REFERENCES admin_dashboards(id) ON DELETE CASCADE,
        granted_by INTEGER REFERENCES admins(id),
        granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(admin_id, dashboard_id)
      );
    `);

    // Admin Feature Permissions (granular permissions within dashboards)
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_feature_permissions (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
        dashboard_id INTEGER REFERENCES admin_dashboards(id) ON DELETE CASCADE,
        feature_id INTEGER REFERENCES dashboard_features(id) ON DELETE CASCADE,
        can_view BOOLEAN DEFAULT TRUE,
        can_create BOOLEAN DEFAULT FALSE,
        can_edit BOOLEAN DEFAULT FALSE,
        can_delete BOOLEAN DEFAULT FALSE,
        can_export BOOLEAN DEFAULT FALSE,
        custom_permissions JSONB DEFAULT '{}',
        granted_by INTEGER REFERENCES admins(id),
        granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(admin_id, dashboard_id, feature_id)
      );
    `);

    // Update admins table to add is_superadmin
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'admins' AND column_name = 'is_superadmin'
        ) THEN
          ALTER TABLE admins ADD COLUMN is_superadmin BOOLEAN DEFAULT FALSE;
        END IF;
      END $$;
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_dashboard_access_admin ON admin_dashboard_access(admin_id);
      CREATE INDEX IF NOT EXISTS idx_admin_dashboard_access_dashboard ON admin_dashboard_access(dashboard_id);
      CREATE INDEX IF NOT EXISTS idx_admin_feature_permissions_admin ON admin_feature_permissions(admin_id);
      CREATE INDEX IF NOT EXISTS idx_admin_feature_permissions_dashboard ON admin_feature_permissions(dashboard_id);
      CREATE INDEX IF NOT EXISTS idx_dashboard_features_dashboard ON dashboard_features(dashboard_id);
      CREATE INDEX IF NOT EXISTS idx_admins_superadmin ON admins(is_superadmin);
    `);

    // Payment reminders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_reminders (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE CASCADE,
        invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
        reminder_type VARCHAR(50) NOT NULL,
        days_before_due INTEGER,
        status VARCHAR(50) DEFAULT 'pending',
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(subscription_id, invoice_id, reminder_type)
      );
    `);

    // Demo requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS demo_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        company VARCHAR(200),
        employees VARCHAR(50),
        preferred_date DATE,
        preferred_time VARCHAR(10),
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Trial subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trial_subscriptions (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        company_name VARCHAR(200),
        trial_start_date DATE NOT NULL,
        trial_end_date DATE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        converted_to_paid BOOLEAN DEFAULT FALSE,
        subscription_id INTEGER REFERENCES subscriptions(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Onboarding progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS onboarding_progress (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
        employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
        step_key VARCHAR(100) NOT NULL,
        step_name VARCHAR(255) NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        data JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(COALESCE(admin_id, 0), COALESCE(employee_id, 0), step_key)
      );
    `);

    // Compliance calendar events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS compliance_calendar_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        deadline_date DATE NOT NULL,
        frequency VARCHAR(50) NOT NULL,
        priority VARCHAR(50) DEFAULT 'medium',
        category VARCHAR(50),
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        reminder_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Run migrations
    await runMigrations(client);

    console.log('Tables ensured');
  } finally {
    client.release();
  }
};

const createDefaultAdmin = async () => {
  const bcrypt = require('bcryptjs');
  const client = await pool.connect();
  try {
    const existing = await client.query('SELECT id FROM admins WHERE username=$1', ['admin']);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO admins (username, email, password_hash, role, is_superadmin) VALUES ($1,$2,$3,$4,$5)',
        ['admin', 'admin@resconate.local', hash, 'super_admin', true]
      );
      console.log('Seeded default admin (admin/admin123)');
    }
  } finally {
    client.release();
  }
};

const initializeDatabase = async () => {
  await createTables();
  await createDefaultAdmin();
};

// Initialize on module load (only once)
if (typeof window === 'undefined') {
  initializeDatabase().catch((error) => {
    console.error('Database initialization error:', error);
    console.error('Database connection details:', {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      dbHost: process.env.DB_HOST || 'localhost',
      dbName: process.env.DB_NAME || 'postgres',
      dbUser: process.env.DB_USER || 'postgres',
      dbPort: process.env.DB_PORT || 5432,
    });
  });
  
  // Test connection
  pool.query('SELECT NOW()').then(() => {
    console.log('Database connection successful');
  }).catch((error) => {
    console.error('Database connection test failed:', error.message);
  });
}

module.exports = { pool, initializeDatabase };



