# Branch Management Guide

## Overview

Your Skoolific system uses a **multi-branch architecture** where each school branch has its own separate database. This guide explains how to manage branches, view branch codes, and add new branches.

---

## Current Database Configuration

### Master Database
- **Database Name:** `skoolific`
- **Host:** `localhost`
- **Port:** `5432`
- **User:** `postgres`
- **Password:** `12345678`

### Current Branches
| Branch Name | Branch Code | Database | Status |
|------------|-------------|----------|--------|
| Main Branch | **MAI** | skoolific | ACTIVE |

---

## Branch Code Generation Algorithm

Branch codes are **automatically generated** from the branch name using this algorithm:

**Formula:** First letter + Last 2 characters (uppercase)

### Examples:
```
"Al Markaz Academy"                    → AMY
"Sunrise School"                       → SOL
"Tech Institute"                       → TTE
"Green Valley High School"             → GOL
"St. Mary's College"                   → SGE
"International School of Excellence"   → ICE
"ABC"                                  → ABC
"XY"                                   → XYX
"Z"                                    → ZXX
```

---

## How to View Branch Codes

### Method 1: Run the Test Script (Easiest)
```bash
node backend/scripts/test-database-connection.js
```

This will show:
- Database connection status
- All branches with their codes
- Branch code generation examples
- Instructions for adding new branches

### Method 2: SQL Query
```sql
SELECT 
  branch_name, 
  branch_code, 
  database_name, 
  is_active,
  created_at
FROM branch_config 
ORDER BY branch_name;
```

### Method 3: API Endpoint
```http
GET http://localhost:3000/api/v2/branches
Headers:
  Authorization: Bearer <admin_token>
```

Response:
```json
{
  "success": true,
  "branches": [
    {
      "id": 1,
      "branch_name": "Main Branch",
      "branch_code": "MAI",
      "database_name": "skoolific",
      "is_active": true,
      "created_at": "2026-05-12T15:11:04.000Z"
    }
  ]
}
```

---

## How to Add a New Branch

### Method 1: Using the Script (Recommended)

```bash
node backend/scripts/add-new-branch.js "Branch Name" "database_name"
```

**Example:**
```bash
node backend/scripts/add-new-branch.js "Sunrise School" "sunrise_db"
```

**Output:**
```
========================================
ADD NEW BRANCH
========================================

Branch Information:
  Branch Name: Sunrise School
  Database Name: sunrise_db
  Branch Code (auto-generated): SOL

Creating branch...
✅ Branch created successfully!

Branch Details:
  ID: 2
  Branch Name: Sunrise School
  Branch Code: SOL
  Database: sunrise_db
  Host: localhost:5432
  Status: ACTIVE
  Created: 5/12/2026, 6:15:00 PM

📝 IMPORTANT: Save this branch code!
   Branch Code: SOL

Next Steps:
  1. Create the database: sunrise_db
     psql -U postgres -c "CREATE DATABASE sunrise_db;"
  2. Run migrations on the new database
  3. Use branch code SOL to login
```

### Method 2: Using SQL (Direct)

```sql
INSERT INTO branch_config (
  branch_name, 
  branch_code, 
  database_name,
  database_host,
  database_port,
  database_user,
  database_password,
  is_active
) VALUES (
  'Sunrise School',      -- Branch name
  'SOL',                 -- Branch code (auto-generated or manual)
  'sunrise_db',          -- Database name
  'localhost',           -- Database host
  5432,                  -- Database port
  'postgres',            -- Database user
  '12345678',            -- Database password
  true                   -- Active status
);
```

### Method 3: Using the API

```http
POST http://localhost:3000/api/v2/branches/create
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "branchName": "Sunrise School",
  "databaseName": "sunrise_db",
  "databaseHost": "localhost",
  "databasePort": 5432,
  "databaseUser": "postgres",
  "databasePassword": "12345678",
  "schoolAddress": "123 Main St",
  "schoolPhone": "+1234567890",
  "schoolEmail": "school@example.com",
  "adminName": "Admin Name",
  "adminEmail": "admin@example.com",
  "adminPhone": "+1234567890"
}
```

Response:
```json
{
  "success": true,
  "branch": {
    "id": 2,
    "branch_name": "Sunrise School",
    "branch_code": "SOL",
    "database_name": "sunrise_db",
    "database_host": "localhost",
    "database_port": 5432,
    "is_active": true,
    "created_at": "2026-05-12T15:15:00.000Z"
  }
}
```

### Method 4: Using Node.js Code

```javascript
const dbManager = require('./backend/services/DatabaseConnectionManager');

async function addBranch() {
  const newBranch = await dbManager.createBranch({
    branchName: 'Sunrise School',
    databaseName: 'sunrise_db',
    databaseHost: 'localhost',
    databasePort: 5432,
    databaseUser: 'postgres',
    databasePassword: '12345678',
    schoolAddress: '123 Main St',
    schoolPhone: '+1234567890',
    schoolEmail: 'school@example.com',
    adminName: 'Admin Name',
    adminEmail: 'admin@example.com',
    adminPhone: '+1234567890'
  });
  
  console.log('Branch Code:', newBranch.branch_code); // Auto-generated!
  
  await dbManager.closeAll();
}

addBranch();
```

---

## After Adding a New Branch

### Step 1: Create the Database
```bash
psql -U postgres -c "CREATE DATABASE your_database_name;"
```

### Step 2: Run Migrations
Copy the schema from the master database or run your migration scripts on the new database.

### Step 3: Test Login
Use the auto-generated branch code to login:
- **Branch Code:** (e.g., SOL)
- **Username:** admin
- **Password:** admin123

---

## Important Notes

### Branch Code Rules
1. **Auto-generated** from branch name (first letter + last 2 chars)
2. **Always uppercase** (e.g., SOL, AMY, TTE)
3. **Must be unique** across all branches
4. **3 characters long** (padded with X if name is too short)

### Database Requirements
1. Each branch **must have its own database**
2. Database name **must be unique**
3. Database **must exist** before the branch can be used
4. All branches can use the **same PostgreSQL server** (different databases)

### Security Considerations
1. Store database passwords securely
2. Use different passwords for production branches
3. Limit database user permissions per branch
4. Enable SSL for production databases

---

## Troubleshooting

### "Branch not found" Error
- Check if the branch code exists: `SELECT * FROM branch_config WHERE branch_code = 'XXX';`
- Verify the branch is active: `is_active = true`

### "Database connection failed" Error
- Verify the database exists: `psql -U postgres -l | grep database_name`
- Check database credentials in `branch_config` table
- Test connection manually: `psql -U postgres -d database_name`

### Duplicate Branch Code
- Branch codes are auto-generated and may collide
- Manually update the branch code if needed:
  ```sql
  UPDATE branch_config 
  SET branch_code = 'NEW' 
  WHERE id = 2;
  ```

---

## Useful Scripts

### Test Database Connection
```bash
node backend/scripts/test-database-connection.js
```

### Add New Branch
```bash
node backend/scripts/add-new-branch.js "Branch Name" "database_name"
```

### Create branch_config Table
```bash
node backend/scripts/create-branch-config-table.js
```

### List All Branches (SQL)
```sql
SELECT 
  id,
  branch_name,
  branch_code,
  database_name,
  is_active,
  created_at
FROM branch_config 
ORDER BY branch_name;
```

### Update Branch Status
```sql
-- Deactivate a branch
UPDATE branch_config 
SET is_active = false 
WHERE branch_code = 'XXX';

-- Activate a branch
UPDATE branch_config 
SET is_active = true 
WHERE branch_code = 'XXX';
```

---

## API Endpoints

### Get All Branches
```http
GET /api/v2/branches
Authorization: Bearer <token>
```

### Validate Branch Code
```http
POST /api/v2/branches/validate
Content-Type: application/json

{
  "branchCode": "MAI"
}
```

### Create New Branch
```http
POST /api/v2/branches/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "branchName": "Branch Name",
  "databaseName": "database_name",
  ...
}
```

### Login with Branch Code
```http
POST /api/v2/branches/login
Content-Type: application/json

{
  "branchCode": "MAI",
  "username": "admin",
  "password": "admin123",
  "userType": "admin"
}
```

---

## Summary

✅ **Current Setup:**
- Master Database: `skoolific`
- Default Branch: `MAI` (Main Branch)
- Database Connection: Working

✅ **To View Branch Codes:**
- Run: `node backend/scripts/test-database-connection.js`

✅ **To Add New Branch:**
- Run: `node backend/scripts/add-new-branch.js "Branch Name" "database_name"`
- Branch code is **auto-generated**
- Save the branch code for login

✅ **Login Credentials:**
- Branch Code: `MAI`
- Username: `admin`
- Password: `admin123`
