# Quick Start Guide - Multi-Branch Setup

**Your Database Configuration:**
- 🗄️ Database: `skoolific`
- 👤 User: `root`
- 🔑 Password: `12345678`
- 🌐 Host: `localhost`
- 🔌 Port: `5432`

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Run Migration in pgAdmin4

1. **Open pgAdmin4**
2. **Connect to PostgreSQL** (localhost:5432)
3. **Right-click** on database `skoolific` → **Query Tool**
4. **Copy and paste** this SQL:

```sql
-- Migration 001: Create branch configuration table
CREATE TABLE IF NOT EXISTS branch_config (
    id SERIAL PRIMARY KEY,
    branch_name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(10) UNIQUE NOT NULL,
    database_name VARCHAR(100) UNIQUE NOT NULL,
    database_host VARCHAR(255) DEFAULT 'localhost',
    database_port INTEGER DEFAULT 5432,
    database_user VARCHAR(100),
    database_password VARCHAR(255),
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

-- Create indexes
CREATE INDEX idx_branch_config_code ON branch_config(branch_code);
CREATE INDEX idx_branch_config_active ON branch_config(is_active);

-- Insert default branch
INSERT INTO branch_config (
    branch_name, 
    branch_code, 
    database_name,
    database_host,
    database_port,
    database_user,
    is_active
) VALUES (
    'Main Branch',
    'MAI',
    'skoolific',
    'localhost',
    5432,
    'root',
    true
) ON CONFLICT (branch_code) DO NOTHING;
```

5. **Click Execute** (F5 or ▶️ button)
6. **Verify**: Run this query:
   ```sql
   SELECT * FROM branch_config;
   ```
   You should see 1 row with branch_code = 'MAI'

---

### Step 2: Start Backend Server

```bash
cd backend
npm start
```

**Expected output:**
```
✅ DatabaseConnectionManager initialized
Server running on 0.0.0.0:5052
Local access: http://localhost:5052
```

---

### Step 3: Test Branch Validation

Open a new terminal and run:

```bash
curl -X POST http://localhost:5052/api/v2/branches/validate -H "Content-Type: application/json" -d "{\"branchCode\": \"MAI\"}"
```

**Expected response:**
```json
{
  "valid": true,
  "branchCode": "MAI",
  "databaseName": "skoolific",
  "message": "Branch code is valid"
}
```

✅ **If you see this response, your multi-branch system is working!**

---

## 🎯 What's Next?

Once the above 3 steps are complete, I'll help you with:

1. ✅ Create branch code input UI for login pages
2. ✅ Update frontend API client to include branch code
3. ✅ Test complete authentication flow
4. ✅ Add more branches (if needed)

---

## 🐛 Troubleshooting

### Error: "relation 'branch_config' does not exist"
**Solution**: Run the migration SQL again in pgAdmin4

### Error: "password authentication failed for user 'root'"
**Solution**: Your `.env` file is already updated with correct credentials ✅

### Error: "database 'skoolific' does not exist"
**Solution**: Create the database in pgAdmin4:
```sql
CREATE DATABASE skoolific;
```

### Error: "Connection refused"
**Solution**: Make sure PostgreSQL is running (check pgAdmin4 connection)

---

## 📝 Summary

✅ **Backend configured** with your database credentials  
✅ **Migration SQL ready** to create branch_config table  
✅ **Default branch** will be created: MAI → skoolific  
✅ **Branch routes** are registered at `/api/v2/branches`  

**Just run the migration in pgAdmin4 and you're ready to go!** 🚀
