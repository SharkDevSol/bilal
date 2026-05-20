# Almarkaz CORS Error Fix - Summary

## Issue
Almarkaz frontend was making API calls to `https://iqrab3.skoolific.com` instead of `https://almarkaz.skoolific.com`, causing CORS errors.

## Root Cause
Multiple files had hardcoded `https://iqrab3.skoolific.com` URLs instead of using environment variables.

## Files Fixed

### 1. Main Configuration
- **APP/src/main.jsx**
  - Changed: `axios.defaults.baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://iqrab3.skoolific.com';`
  - To: `axios.defaults.baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';`

### 2. Mark List Management
- **APP/src/PAGE/CreateMarklist/MarkListManagement.jsx**
  - Changed: `const API_BASE_URL = 'https://iqrab3.skoolific.com/api';`
  - To: `const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';`

### 3. Evaluation Book Components
- **APP/src/PAGE/EvaluationBook/DailyEvaluationForm.jsx**
- **APP/src/PAGE/EvaluationBook/EvaluationBookReports.jsx**
- **APP/src/PAGE/EvaluationBook/TeacherAssignmentManager.jsx**
- **APP/src/PAGE/EvaluationBook/GuardianFeedbackForm.jsx**
- **APP/src/PAGE/EvaluationBook/EvaluationBookFormBuilder.jsx**
- **APP/src/PAGE/EvaluationBook/GuardianFeedbackView.jsx**
- **APP/src/PAGE/EvaluationBook/GuardianEvaluationInbox.jsx**
  - Changed: `const API_BASE = 'https://iqrab3.skoolific.com/api/evaluation-book';`
  - To: `const API_BASE = \`\${import.meta.env.VITE_API_URL || '/api'}/evaluation-book\`;`

### 4. Finance Components
- **APP/src/PAGE/Finance/ChartOfAccounts/AccountForm.jsx**
- **APP/src/PAGE/Finance/ChartOfAccounts/AccountList.jsx**
- **APP/src/PAGE/Finance/ChartOfAccounts/AccountSelector.jsx**
  - Changed: `const API_BASE = 'https://iqrab3.skoolific.com/api/finance/accounts';`
  - To: `const API_BASE = \`\${import.meta.env.VITE_API_URL || '/api'}/finance/accounts\`;`

### 5. Guardian Components
- **APP/src/Guardian/GuardianWards/GuardianWards.jsx**
  - Fixed API calls and image URLs to use environment variables
  - Added: `const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';`
  - Changed all hardcoded URLs to use `API_BASE` or `import.meta.env.VITE_API_URL`

- **APP/src/Guardian/GuardianAttendance/GuardianAttendance.jsx**
  - Changed: `https://iqrab3.skoolific.com/api/guardian-attendance/...`
  - To: `\${import.meta.env.VITE_API_URL || '/api'}/guardian-attendance/...`

- **APP/src/Guardian/GuardianMarks/GuardianMarks.jsx**
  - Changed: `https://iqrab3.skoolific.com/api/mark-list/...`
  - To: `\${import.meta.env.VITE_API_URL || '/api'}/mark-list/...`

- **APP/src/Guardian/GuardianMessages/GuardianMessages.jsx**
  - Added API base URL constants
  - Fixed all API calls and Socket.IO connection to use environment variables
  - Changed: Multiple hardcoded `https://iqrab3.skoolific.com/api/...` URLs
  - To: Use `API_URL` and `API_BASE` constants

## Environment Configuration
The `.env.production` file is correctly configured:
```
VITE_API_URL=https://almarkaz.skoolific.com/api
NODE_ENV=production
```

## Deployment
1. All files were fixed in the local repository
2. Frontend was rebuilt on VPS: `cd /var/www/almarkaz.skoolific.com/APP && npm run build`
3. Build completed successfully (3 times total)
4. API endpoint tested and confirmed working: `https://almarkaz.skoolific.com/api/mark-list/classes` returns HTTP 200

## Verification
- API calls now correctly go to `https://almarkaz.skoolific.com/api`
- CORS errors should be resolved
- All Guardian features (Wards, Attendance, Marks, Messages) now use correct API endpoints
- All Evaluation Book and Finance features now use correct API endpoints

## Status
✅ **COMPLETED** - All hardcoded URLs fixed and frontend rebuilt on VPS

## Date
April 21, 2026
