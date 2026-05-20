# Manual Testing Guide: Branch Authentication System

## Overview
This guide provides step-by-step instructions for manually testing the branch authentication system across all login pages.

## Prerequisites

### 1. Database Setup
Ensure you have the following test branches in your database:

```sql
-- Connect to master database
psql -U postgres -d skoolific

-- Check existing branches
SELECT * FROM branch_config;

-- If needed, insert test branches
INSERT INTO branch_config (branch_code, branch_name, database_name) 
VALUES 
  ('MAI', 'Main Branch', 'skoolific_main_branch'),
  ('TST', 'Test Branch', 'skoolific_test_branch'),
  ('DEV', 'Dev Branch', 'skoolific_dev_branch')
ON CONFLICT (branch_code) DO NOTHING;
```

### 2. Test Users
Create test users in each branch database for all user types:
- Admin user
- Staff user
- Student user
- Guardian user

### 3. Server Running
Ensure both backend and frontend servers are running:

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd APP
npm run dev
```

---

## Test Suite 1: Branch Code Validation

### Test 1.1: Valid Branch Code Format
**Objective:** Verify that valid 3-letter uppercase branch codes are accepted

**Steps:**
1. Open Admin Login page: `http://localhost:5173/login`
2. Enter branch code: `MAI`
3. Click outside the input field (blur event)

**Expected Result:**
- ✅ Green checkmark icon appears
- ✅ Success message: "✓ Valid branch: skoolific_main_branch"
- ✅ Input border turns green

**Status:** [ ] Pass [ ] Fail

---

### Test 1.2: Invalid Branch Code Format (Lowercase)
**Objective:** Verify that lowercase letters are rejected

**Steps:**
1. Open Admin Login page
2. Enter branch code: `mai` (lowercase)
3. Click outside the input field

**Expected Result:**
- ❌ Red X icon appears
- ❌ Error message: "Branch code must be 3 uppercase letters"
- ❌ Input border turns red

**Status:** [ ] Pass [ ] Fail

---

### Test 1.3: Invalid Branch Code Format (Too Short)
**Objective:** Verify that codes shorter than 3 characters are rejected

**Steps:**
1. Open Admin Login page
2. Enter branch code: `MA`
3. Click outside the input field

**Expected Result:**
- ❌ Red X icon appears
- ❌ Error message: "Branch code must be 3 uppercase letters"

**Status:** [ ] Pass [ ] Fail

---

### Test 1.4: Invalid Branch Code Format (Too Long)
**Objective:** Verify that codes longer than 3 characters are rejected

**Steps:**
1. Open Admin Login page
2. Try to enter branch code: `MAIN`

**Expected Result:**
- ✅ Input automatically limits to 3 characters
- ✅ Only "MAI" is entered

**Status:** [ ] Pass [ ] Fail

---

### Test 1.5: Non-Existent Branch Code
**Objective:** Verify that valid format but non-existent codes are rejected

**Steps:**
1. Open Admin Login page
2. Enter branch code: `XXX`
3. Click outside the input field

**Expected Result:**
- ❌ Red X icon appears
- ❌ Error message: "Branch code not found"

**Status:** [ ] Pass [ ] Fail

---

### Test 1.6: Auto-Validation on Enter Key
**Objective:** Verify that pressing Enter triggers validation

**Steps:**
1. Open Admin Login page
2. Enter branch code: `MAI`
3. Press Enter key

**Expected Result:**
- ✅ Validation triggers immediately
- ✅ Green checkmark appears if valid

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 2: Login Flow - Admin

### Test 2.1: Successful Admin Login
**Objective:** Verify complete admin login flow with branch code

**Steps:**
1. Open Admin Login page: `http://localhost:5173/login`
2. Enter branch code: `MAI`
3. Wait for validation (green checkmark)
4. Enter username: `admin`
5. Enter password: `admin123`
6. Click "Sign In"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to admin dashboard
- ✅ Branch code saved to localStorage
- ✅ JWT token stored in localStorage

**Verification:**
```javascript
// Open browser console (F12)
localStorage.getItem('branchCode') // Should return "MAI"
localStorage.getItem('authToken') // Should return JWT token
localStorage.getItem('isLoggedIn') // Should return "true"
```

**Status:** [ ] Pass [ ] Fail

---

### Test 2.2: Login Without Branch Code
**Objective:** Verify that login is blocked without branch code

**Steps:**
1. Open Admin Login page
2. Leave branch code empty
3. Enter username: `admin`
4. Enter password: `admin123`
5. Click "Sign In"

**Expected Result:**
- ❌ Error message: "Please enter a branch code"
- ❌ Login blocked

**Status:** [ ] Pass [ ] Fail

---

### Test 2.3: Login With Invalid Branch Code
**Objective:** Verify that login is blocked with invalid branch code

**Steps:**
1. Open Admin Login page
2. Enter branch code: `XXX`
3. Wait for validation (red X)
4. Enter username: `admin`
5. Enter password: `admin123`
6. Click "Sign In"

**Expected Result:**
- ❌ Error message: "Please enter a valid branch code"
- ❌ Login blocked

**Status:** [ ] Pass [ ] Fail

---

### Test 2.4: Login With Wrong Credentials
**Objective:** Verify that wrong credentials are rejected

**Steps:**
1. Open Admin Login page
2. Enter branch code: `MAI`
3. Wait for validation
4. Enter username: `admin`
5. Enter password: `wrong_password`
6. Click "Sign In"

**Expected Result:**
- ❌ Error message: "Login failed. Please check your credentials."
- ❌ Login blocked

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 3: Login Flow - Staff

### Test 3.1: Successful Staff Login
**Objective:** Verify complete staff login flow

**Steps:**
1. Open Staff Login page: `http://localhost:5173/app/staff-login`
2. Enter branch code: `MAI`
3. Wait for validation
4. Enter username: `staff_user`
5. Enter password: `staff123`
6. Click "Login"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to staff dashboard
- ✅ Branch code saved to localStorage

**Status:** [ ] Pass [ ] Fail

---

### Test 3.2: Staff Login Rate Limiting
**Objective:** Verify rate limiting after multiple failed attempts

**Steps:**
1. Open Staff Login page
2. Enter branch code: `MAI`
3. Enter username: `staff_user`
4. Enter wrong password 5 times in a row

**Expected Result:**
- ❌ After 5 attempts, lockout message appears
- ❌ Countdown timer shows (e.g., "Wait 60s")
- ❌ Login button disabled during lockout

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 4: Login Flow - Student

### Test 4.1: Successful Student Login
**Objective:** Verify complete student login flow

**Steps:**
1. Open Student Login page: `http://localhost:5173/app/student-login`
2. Enter branch code: `MAI`
3. Wait for validation
4. Enter username: `student_user`
5. Enter password: `student123`
6. Click "Login"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to student profile
- ✅ Branch code saved to localStorage

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 5: Login Flow - Guardian

### Test 5.1: Successful Guardian Login
**Objective:** Verify complete guardian login flow

**Steps:**
1. Open Guardian Login page: `http://localhost:5173/app/guardian-login`
2. Enter branch code: `MAI`
3. Wait for validation
4. Enter username: `guardian_user`
5. Enter password: `guardian123`
6. Click "Login"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to guardian dashboard
- ✅ Branch code saved to localStorage

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 6: Branch Code Persistence

### Test 6.1: Branch Code Auto-Load
**Objective:** Verify that saved branch code is auto-loaded

**Steps:**
1. Complete a successful login (any user type)
2. Logout or close browser
3. Reopen the same login page

**Expected Result:**
- ✅ Branch code input is pre-filled with saved value
- ✅ Validation status may show (if auto-validate is enabled)

**Verification:**
```javascript
// Before reopening page
localStorage.getItem('branchCode') // Should return saved code
```

**Status:** [ ] Pass [ ] Fail

---

### Test 6.2: Clear Branch Code
**Objective:** Verify that clear button removes saved branch code

**Steps:**
1. Open login page with saved branch code (auto-filled)
2. Click "Clear saved branch code" button

**Expected Result:**
- ✅ Input field is cleared
- ✅ Validation status is reset
- ✅ localStorage is cleared

**Verification:**
```javascript
// After clicking clear
localStorage.getItem('branchCode') // Should return null
```

**Status:** [ ] Pass [ ] Fail

---

### Test 6.3: Branch Code Persistence Across User Types
**Objective:** Verify that branch code persists across different login pages

**Steps:**
1. Login as Admin with branch code `MAI`
2. Logout
3. Navigate to Staff Login page

**Expected Result:**
- ✅ Branch code `MAI` is pre-filled on Staff Login page
- ✅ Same branch code available on all login pages

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 7: Branch Switching

### Test 7.1: Switch Between Branches
**Objective:** Verify that users can switch between branches

**Steps:**
1. Login as Admin with branch code `MAI`
2. Logout
3. Login again with branch code `TST`

**Expected Result:**
- ✅ Login successful with new branch code
- ✅ JWT token contains new branch context
- ✅ localStorage updated with new branch code

**Verification:**
```javascript
// After second login
localStorage.getItem('branchCode') // Should return "TST"
// Decode JWT token to verify branch context
```

**Status:** [ ] Pass [ ] Fail

---

### Test 7.2: Branch Isolation
**Objective:** Verify that data is isolated between branches

**Steps:**
1. Login to branch `MAI` as Admin
2. Note the data visible (students, staff, etc.)
3. Logout
4. Login to branch `TST` as Admin
5. Compare the data

**Expected Result:**
- ✅ Different data sets visible in each branch
- ✅ No data leakage between branches

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 8: UI/UX Testing

### Test 8.1: Loading States
**Objective:** Verify loading indicators work correctly

**Steps:**
1. Open any login page
2. Enter branch code
3. Observe validation process
4. Enter credentials and submit

**Expected Result:**
- ✅ Spinner icon shows during validation
- ✅ "Validating branch code..." message appears
- ✅ "Logging in..." text on button during login
- ✅ All inputs disabled during loading

**Status:** [ ] Pass [ ] Fail

---

### Test 8.2: Responsive Design - Mobile
**Objective:** Verify UI works on mobile devices

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (e.g., iPhone 12)
4. Test login flow

**Expected Result:**
- ✅ All elements visible and properly sized
- ✅ Touch targets are large enough
- ✅ No horizontal scrolling
- ✅ Clear button wraps properly on small screens

**Status:** [ ] Pass [ ] Fail

---

### Test 8.3: Keyboard Navigation
**Objective:** Verify keyboard-only navigation works

**Steps:**
1. Open login page
2. Use only Tab key to navigate
3. Use Enter key to submit

**Expected Result:**
- ✅ Tab order is logical (branch code → username → password → button)
- ✅ Focus indicators are visible
- ✅ Enter key triggers validation and submission

**Status:** [ ] Pass [ ] Fail

---

### Test 8.4: Animations and Transitions
**Objective:** Verify animations are smooth

**Steps:**
1. Test all validation states (validating, valid, invalid)
2. Observe icon transitions
3. Observe message fade-in/out

**Expected Result:**
- ✅ Spinner rotates smoothly
- ✅ Checkmark scales in smoothly
- ✅ X icon shakes on error
- ✅ Messages fade in/out smoothly

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 9: Error Handling

### Test 9.1: Network Error During Validation
**Objective:** Verify graceful handling of network errors

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Enable "Offline" mode
4. Enter branch code and blur

**Expected Result:**
- ❌ Error message: "Failed to validate branch code. Please try again."
- ❌ Red X icon appears

**Status:** [ ] Pass [ ] Fail

---

### Test 9.2: Network Error During Login
**Objective:** Verify graceful handling of login network errors

**Steps:**
1. Enter valid branch code
2. Enter valid credentials
3. Enable "Offline" mode in DevTools
4. Click login

**Expected Result:**
- ❌ Error message displayed
- ❌ Login button re-enabled
- ❌ User can retry

**Status:** [ ] Pass [ ] Fail

---

### Test 9.3: Server Error (500)
**Objective:** Verify handling of server errors

**Steps:**
1. Temporarily modify backend to return 500 error
2. Attempt login

**Expected Result:**
- ❌ User-friendly error message
- ❌ No technical details exposed
- ❌ User can retry

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 10: Security Testing

### Test 10.1: JWT Token Security
**Objective:** Verify JWT token is properly secured

**Steps:**
1. Login successfully
2. Open browser console
3. Inspect JWT token

**Verification:**
```javascript
const token = localStorage.getItem('authToken');
// Decode token (use jwt.io or browser extension)
// Verify:
// - Token is signed
// - Contains branch context
// - Has expiration time
// - No sensitive data in payload
```

**Expected Result:**
- ✅ Token is properly signed
- ✅ Branch code and database name included
- ✅ Expiration time set (24 hours)
- ✅ No passwords or sensitive data

**Status:** [ ] Pass [ ] Fail

---

### Test 10.2: XSS Protection
**Objective:** Verify protection against XSS attacks

**Steps:**
1. Enter branch code: `<script>alert('XSS')</script>`
2. Observe behavior

**Expected Result:**
- ✅ Script not executed
- ✅ Input sanitized or rejected
- ✅ No alert popup

**Status:** [ ] Pass [ ] Fail

---

### Test 10.3: SQL Injection Protection
**Objective:** Verify protection against SQL injection

**Steps:**
1. Enter branch code: `MAI'; DROP TABLE branch_config; --`
2. Observe behavior

**Expected Result:**
- ❌ Invalid format error
- ✅ No database modification
- ✅ Input rejected

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 11: Cross-Browser Testing

### Test 11.1: Chrome
**Browser:** Google Chrome (latest version)

**Steps:** Run all test suites above

**Status:** [ ] Pass [ ] Fail

---

### Test 11.2: Firefox
**Browser:** Mozilla Firefox (latest version)

**Steps:** Run all test suites above

**Status:** [ ] Pass [ ] Fail

---

### Test 11.3: Edge
**Browser:** Microsoft Edge (latest version)

**Steps:** Run all test suites above

**Status:** [ ] Pass [ ] Fail

---

### Test 11.4: Safari
**Browser:** Safari (latest version, macOS/iOS)

**Steps:** Run all test suites above

**Status:** [ ] Pass [ ] Fail

---

## Test Summary

### Overall Results
- **Total Tests:** 40+
- **Passed:** ___
- **Failed:** ___
- **Skipped:** ___

### Critical Issues Found
1. 
2. 
3. 

### Minor Issues Found
1. 
2. 
3. 

### Recommendations
1. 
2. 
3. 

---

## Sign-Off

**Tester Name:** ___________________  
**Date:** ___________________  
**Signature:** ___________________

**Approved By:** ___________________  
**Date:** ___________________  
**Signature:** ___________________
