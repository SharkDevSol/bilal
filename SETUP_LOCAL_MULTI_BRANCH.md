# Setup Local Multi-Branch Database (pgAdmin4)

This guide will help you set up the multi-branch architecture on your local PostgreSQL database using pgAdmin4.

---

## 📋 Prerequisites

- ✅ PostgreSQL installed locally
- ✅ pgAdmin4 installed and running
- ✅ Local database: `almarkaz_school_management` (or your current database name)
- ✅ Database credentials: `postgres` / `Skoolific2024Pass`

---

## 🗄️ Step 1: Run Migration on Local Database

### Option A: Using pgAdmin4 Query Tool

1. **Open pgAdmin4**
2. **Connect to your local PostgreSQL server**
3. **Navigate to your database**: `almarkaz_school_management`
4. **Right-click** on the database → **Query Tool**
5. **Copy and paste** the following SQL:

```sql
-- Migration 001: Create branch configuration table
-- This table stores configuration for each school branch
-- Each branch will have its own separate PostgreSQL database

CREATE TABLE IF NOT EXISTS branch_config (
    id SERIAL PRIMARY KEY,
    branch_name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(10) UNIQUE NOT NULL, -- e.g., "AMA" for "Al Markaz Academy"
    database_name VARCHAR(100) UNIQUE NOT NULL,
    database_host VARCHAR(255) DEFAULT 'localhost',
    database_port INTEGER DEFAULT 5432,
    database_user VARCHAR(100),
    database_password VARCHAR(255), -- Should be encrypted in production
    is_active BOOLEAN DEFAULT true,
    school_address TEXT,
    school_phone VARCHAR(50),
    school_email VARCHAR(100),
    admin_name VARCHAR(255),
    admin_email VARCHAR(255),
    admin_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on branch_code for fast lookups
CREATE INDEX idx_branch_config_code ON branch_config(branch_code);
CREATE INDEX idx_branch_config_active ON branch_config(is_active);

-- Insert default branch (current school becomes first branch)
INSERT INTO branch_config (
    branch_name, 
    branch_code, 
    database_name,
    database_host,
    database_port,
    database_user,
    is_active
) VALUES (
    'Al Markaz Academy',
    'AMA',
    'almarkaz_school_management', -- Your current database
    'localhost',
    5432,
    'postgres',
    true
) ON CONFLICT (branch_code) DO NOTHING;

COMMENT ON TABLE branch_config IS 'Stores configuration for each school branch with separate database per branch';
COMMENT ON COLUMN branch_config.branch_code IS 'Unique 3-letter code generated from branch name (first letter + last 2 chars)';
COMMENT ON COLUMN branch_config.database_name IS 'Name of the PostgreSQL database for this branch';
```

6. **Click Execute** (F5 or play button)
7. **Verify**: You should see "Query returned successfully"

### Option B: Using SQL File

1. **Open pgAdmin4**
2. **Navigate to**: `backend/database/migrations/001_create_branch_config.sql`
3. **Right-click** on your database → **Query Tool**
4. **Click** File → Open → Select `001_create_branch_config.sql`
5. **Click Execute** (F5)

---

## ✅ Step 2: Verify Migration

Run this query in pgAdmin4 to verify the table was created:

```sql
-- Check if table exists
SELECT * FROM branch_config;

-- You should see 1 row with:
-- branch_name: Al Markaz Academy
-- branch_code: AMA
-- database_name: almarkaz_school_management
```

---

## 🔧 Step 3: Update Backend Configuration

Your backend is already configured correctly in `backend/.env`:

```env
DB_NAME=almarkaz_school_management
DB_USER=postgres
DB_PASSWORD=Skoolific2024Pass
DB_HOST=localhost
DB_PORT=5432
```

✅ **No changes needed!**

---

## 🚀 Step 4: Test Multi-Branch System

### 4.1 Start Your Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ DatabaseConnectionManager initialized
Server running on 0.0.0.0:5052
```

### 4.2 Test Branch Validation Endpoint

Open a new terminal and test:

```bash
# Test 1: Validate existing branch code
curl -X POST http://localhost:5052/api/v2/branches/validate \
  -H "Content-Type: application/json" \
  -d '{"branchCode": "AMA"}'

# Expected response:
# {
#   "valid": true,
#   "branchCode": "AMA",
#   "databaseName": "almarkaz_school_management",
#   "message": "Branch code is valid"
# }

# Test 2: Validate invalid branch code
curl -X POST http://localhost:5052/api/v2/branches/validate \
  -H "Content-Type: application/json" \
  -d '{"branchCode": "XYZ"}'

# Expected response:
# {
#   "valid": false,
#   "error": "Branch not found",
#   "message": "Branch with code \"XYZ\" not found"
# }
```

### 4.3 Test Branch Login Endpoint

```bash
# Test login with branch code
curl -X POST http://localhost:5052/api/v2/branches/login \
  -H "Content-Type: application/json" \
  -d '{
    "branchCode": "AMA",
    "username": "admin",
    "password": "your_password",
    "userType": "admin"
  }'

# Expected response (if credentials are correct):
# {
#   "success": true,
#   "message": "Login successful",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": 1,
#     "username": "admin",
#     "name": "Admin User",
#     "role": "admin",
#     "branchCode": "AMA"
#   }
# }
```

---

## 📊 Step 5: Add More Branches (Optional)

If you want to test with multiple branches, you can add more:

```sql
-- Add a second branch (example)
INSERT INTO branch_config (
    branch_name, 
    branch_code, 
    database_name,
    database_host,
    database_port,
    database_user,
    is_active,
    school_address,
    school_phone
) VALUES (
    'Sunrise School',
    'SOL',
    'sunrise_school_db', -- You need to create this database first
    'localhost',
    5432,
    'postgres',
    true,
    '123 Main Street, Addis Ababa',
    '+251-11-123-4567'
);

-- Add a third branch (example)
INSERT INTO branch_config (
    branch_name, 
    branch_code, 
    database_name,
    database_host,
    database_port,
    database_user,
    is_active,
    school_address,
    school_phone
) VALUES (
    'Tech Academy',
    'TYY',
    'tech_academy_db', -- You need to create this database first
    'localhost',
    5432,
    'postgres',
    true,
    '456 Tech Street, Addis Ababa',
    '+251-11-987-6543'
);
```

**Note**: For each new branch, you need to:
1. Create the database in PostgreSQL: `CREATE DATABASE sunrise_school_db;`
2. Run all your existing schema migrations on that database
3. Insert the branch record in `branch_config` table

---

## 🔍 Step 6: View All Branches

Query to see all configured branches:

```sql
SELECT 
    id,
    branch_name,
    branch_code,
    database_name,
    is_active,
    school_address,
    school_phone,
    created_at
FROM branch_config
ORDER BY branch_name;
```

---

## 🎯 Next Steps

Now that your local multi-branch database is set up, you can:

1. ✅ **Test branch validation** - Verify branch codes work
2. ✅ **Test branch login** - Login with branch code
3. ✅ **Create branch UI** - Add branch code input to login pages
4. ✅ **Update API client** - Add branch code to request headers
5. ✅ **Test with multiple branches** - Create additional test branches

---

## 🐛 Troubleshooting

### Issue: "relation 'branch_config' does not exist"
**Solution**: Run the migration SQL again in pgAdmin4

### Issue: "Branch with code 'AMA' not found"
**Solution**: Check if the INSERT statement ran successfully:
```sql
SELECT * FROM branch_config WHERE branch_code = 'AMA';
```

### Issue: "Failed to connect to branch database"
**Solution**: Verify your database credentials in `.env` file match your PostgreSQL setup

### Issue: "Connection refused"
**Solution**: Make sure PostgreSQL is running:
```bash
# Windows
services.msc → PostgreSQL service → Start

# Or check in pgAdmin4 if server is connected
```

---

## 📝 Summary

✅ **What you've done:**
- Created `branch_config` table in local database
- Inserted default branch (AMA → almarkaz_school_management)
- Backend routes are ready (`/api/v2/branches/*`)
- DatabaseConnectionManager is initialized

✅ **What's working:**
- Branch validation endpoint
- Branch login endpoint
- Multi-database connection pooling
- Branch code generation algorithm

✅ **What's next:**
- Create branch code input UI for login pages
- Update frontend API client to include branch code
- Test complete authentication flow with branch code

---

**Ready to continue with Phase 1 implementation!** 🚀
