# Phase 1 Action Plan - Fresh Start

## 🎯 Goal: Complete Multi-Branch Architecture Foundation

**Current Progress**: 20% (10/48 tasks)  
**Estimated Time**: 1-2 weeks  
**Priority**: HIGH - Everything else depends on this

---

## ✅ Step 1: Database Setup (DO THIS NOW!)

### 1.1 Fresh Database in pgAdmin4

```sql
-- Open pgAdmin4 → Query Tool → Run this:

-- Disconnect all connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'skoolific' AND pid <> pg_backend_pid();

-- Drop and recreate
DROP DATABASE IF EXISTS skoolific;
CREATE DATABASE skoolific;
```

### 1.2 Run Branch Config Migration

1. Connect to the new `skoolific` database
2. Open Query Tool
3. Run the SQL from: `backend/database/migrations/001_create_branch_config.sql`
4. Verify: `SELECT * FROM branch_config;`
   - Should return 1 row: MAI → skoolific

### 1.3 Start Backend

```bash
cd backend
npm start
```

**Expected output:**
```
✅ DatabaseConnectionManager initialized
Server running on 0.0.0.0:5052
```

### 1.4 Test Branch Validation

```powershell
Invoke-RestMethod -Uri "http://localhost:5052/api/v2/branches/validate" -Method POST -ContentType "application/json" -Body '{"branchCode": "MAI"}'
```

**Expected response:**
```json
{
  "valid": true,
  "branchCode": "MAI",
  "databaseName": "skoolific"
}
```

✅ **If this works, you're ready for Step 2!**

---

## 📋 Step 2: Complete Phase 1.6 (2 remaining tasks)

### Task 1.6.6: Create database creation script for new branches

**File**: `backend/scripts/create-branch-database.js`

```javascript
// Script to create a new branch database with full schema
const { Pool } = require('pg');
const dbManager = require('../services/DatabaseConnectionManager');

async function createBranchDatabase(branchName, databaseName) {
  // 1. Create new PostgreSQL database
  // 2. Run all schema migrations on new database
  // 3. Insert branch record in branch_config
  // 4. Test connection
}

module.exports = { createBranchDatabase };
```

**Acceptance Criteria:**
- Script creates new database
- Runs all migrations automatically
- Inserts branch_config record
- Tests connection successfully

### Task 1.6.7: Test connection manager with multiple branch databases

**Steps:**
1. Create a second test database: `skoolific_test`
2. Add branch record for test database
3. Test switching between databases
4. Verify connection pooling works
5. Test concurrent connections

**Acceptance Criteria:**
- Can connect to multiple branches
- Connection pooling works correctly
- No connection leaks
- Performance is acceptable

---

## 📋 Step 3: Complete Phase 1.7 (4 remaining tasks)

### Task 1.7.5: Update all protected routes to use new authentication middleware

**Files to Update:**
- All routes in `backend/routes/*.js`
- Replace old auth middleware with `authenticateWithBranch`

**Example:**
```javascript
// Before:
const { authenticateToken } = require('../middleware/auth');
router.get('/students', authenticateToken, async (req, res) => {
  // Use default pool
});

// After:
const { authenticateWithBranch } = require('../middleware/branchAuth');
router.get('/students', authenticateWithBranch, async (req, res) => {
  // Use req.branchPool instead of default pool
  const result = await req.branchPool.query('SELECT * FROM students');
});
```

**Acceptance Criteria:**
- All protected routes use `authenticateWithBranch`
- All routes use `req.branchPool` for database queries
- JWT tokens include branch context
- Tests pass

### Task 1.7.6: Create branch code input UI component

**File**: `APP/src/COMPONENTS/BranchCodeInput.jsx`

```jsx
import React, { useState } from 'react';
import api from '../utils/api';

export default function BranchCodeInput({ onValidated }) {
  const [branchCode, setBranchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValidate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/v2/branches/validate', { branchCode });
      if (response.data.valid) {
        localStorage.setItem('branchCode', branchCode);
        onValidated(branchCode);
      }
    } catch (err) {
      setError('Invalid branch code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        value={branchCode}
        onChange={(e) => setBranchCode(e.target.value.toUpperCase())}
        placeholder="Enter Branch Code (e.g., MAI)"
        maxLength={3}
      />
      <button onClick={handleValidate} disabled={loading}>
        {loading ? 'Validating...' : 'Continue'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
```

**Acceptance Criteria:**
- Component validates branch code
- Shows loading state
- Shows error messages
- Stores branch code in localStorage
- Calls onValidated callback

### Task 1.7.7: Implement branch code persistence in local storage

**File**: `APP/src/utils/branchStorage.js`

```javascript
export const branchStorage = {
  set: (branchCode) => {
    localStorage.setItem('branchCode', branchCode);
  },
  
  get: () => {
    return localStorage.getItem('branchCode');
  },
  
  clear: () => {
    localStorage.removeItem('branchCode');
  },
  
  exists: () => {
    return !!localStorage.getItem('branchCode');
  }
};
```

**Update**: `APP/src/utils/api.js`

```javascript
import { branchStorage } from './branchStorage';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  const branchCode = branchStorage.get();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (branchCode) {
    config.headers['x-branch-code'] = branchCode;
  }
  
  return config;
});
```

**Acceptance Criteria:**
- Branch code persists across page refreshes
- Branch code included in all API requests
- Branch code cleared on logout
- Works with authentication flow

### Task 1.7.8: Test authentication flow with multiple branches

**Test Scenarios:**
1. Login with branch code MAI
2. Verify JWT token includes branch context
3. Make API calls with branch code header
4. Switch to different branch
5. Verify database connection switches
6. Test invalid branch code
7. Test missing branch code
8. Test expired token with branch code

**Acceptance Criteria:**
- All test scenarios pass
- No errors in console
- Database connections switch correctly
- Authentication works end-to-end

---

## 📋 Step 4: Update Login Pages (Part of 1.7.6)

### Files to Update:

1. **Admin Login**: `APP/src/PAGE/Login/Login.jsx`
2. **Staff Login**: `APP/src/COMPONENTS/StaffLogin.jsx`
3. **Student Login**: `APP/src/COMPONENTS/StudentLogin.jsx`
4. **Guardian Login**: `APP/src/COMPONENTS/GuardianLogin.jsx`

### Implementation Pattern:

```jsx
import BranchCodeInput from './BranchCodeInput';

function Login() {
  const [branchValidated, setBranchValidated] = useState(false);
  const [branchCode, setBranchCode] = useState('');

  if (!branchValidated) {
    return (
      <BranchCodeInput 
        onValidated={(code) => {
          setBranchCode(code);
          setBranchValidated(true);
        }}
      />
    );
  }

  return (
    <div>
      <p>Branch: {branchCode}</p>
      {/* Existing login form */}
    </div>
  );
}
```

**Acceptance Criteria:**
- All login pages require branch code first
- Branch code validated before showing login form
- Branch code displayed on login page
- Can go back to change branch code

---

## 📊 Phase 1 Completion Checklist

### Multi-Branch Database (1.6)
- [x] 1.6.1 Create branch_config table ✅
- [x] 1.6.2 Implement DatabaseConnectionManager ✅
- [x] 1.6.3 Implement branch code generation ✅
- [x] 1.6.4 Create getPool() method ✅
- [x] 1.6.5 Implement resolveDatabaseName() ✅
- [ ] 1.6.6 Create database creation script
- [ ] 1.6.7 Test with multiple branches
- [x] 1.6.8 Implement connection pool monitoring ✅

### Branch Authentication (1.7)
- [x] 1.7.1 Create validation endpoint ✅
- [x] 1.7.2 Update login endpoint ✅
- [x] 1.7.3 Implement JWT with branch context ✅
- [x] 1.7.4 Create authentication middleware ✅
- [ ] 1.7.5 Update all protected routes
- [ ] 1.7.6 Create branch code UI component
- [ ] 1.7.7 Implement branch code persistence
- [ ] 1.7.8 Test authentication flow

### Other Phase 1 Tasks (Optional for now)
- [ ] 1.1: Project Setup (6 tasks) - Can skip if already set up
- [ ] 1.2: Backend API Configuration (6 tasks) - Can skip if working
- [ ] 1.3: Tauri Desktop Apps (10 tasks) - Can do later
- [ ] 1.4: Capacitor Mobile Apps (10 tasks) - Can do later
- [ ] 1.5: Ethiopian Calendar (10 tasks) - Files exist, test later
- [ ] 1.8: Database Schema Auto-Creation (17 tasks) - Can do later

---

## 🎯 Success Criteria for Phase 1

### Minimum Viable Phase 1:
1. ✅ Database setup complete
2. ✅ Branch validation works
3. ✅ Multi-branch connections work
4. ✅ Branch code UI implemented
5. ✅ Authentication flow works end-to-end
6. ✅ Can switch between branches

### Nice to Have:
- Database creation script
- All routes updated
- Desktop/mobile apps
- Ethiopian calendar integration

---

## ⏱️ Estimated Timeline

| Task | Time | Priority |
|------|------|----------|
| Database Setup | 30 min | 🔴 URGENT |
| Task 1.6.6 (DB script) | 2 hours | 🟡 Medium |
| Task 1.6.7 (Testing) | 1 hour | 🟡 Medium |
| Task 1.7.5 (Update routes) | 4 hours | 🟠 High |
| Task 1.7.6 (Branch UI) | 3 hours | 🔴 URGENT |
| Task 1.7.7 (Persistence) | 1 hour | 🔴 URGENT |
| Task 1.7.8 (Testing) | 2 hours | 🟠 High |
| **Total** | **~14 hours** | **~2 days** |

---

## 🚀 Let's Get Started!

**Right now, do this:**

1. Open pgAdmin4
2. Drop and recreate `skoolific` database
3. Run `001_create_branch_config.sql`
4. Start backend: `npm start`
5. Test branch validation endpoint

**Once that works, let me know and I'll help you with the next tasks!** 🎉
