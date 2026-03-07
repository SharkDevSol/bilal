# Staff Profile Faults Tab - Class Dropdown Fix

## Issue
The Staff Profile Faults tab was showing database table names (like `academic_class_shift_assignment`, `admin_users`, `backup_metadata`, etc.) instead of actual class names (like "Class 1", "Grade 10-A", etc.) in the "Select Class" dropdown.

## Root Cause
The `fetchFaultClasses` function in StaffProfile.jsx was using the `/api/faults/classes` endpoint with authentication, which was returning database table names instead of actual class names from the student records.

## Solution
Updated StaffProfile.jsx to use the same endpoint as the student list (`/api/student-list/classes`) to fetch proper class names.

### Changes Made

**File**: `bilal/APP/src/COMPONENTS/StaffProfile.jsx`

**Before**:
```javascript
const fetchFaultClasses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/faults/classes`, getAuthConfig());
    const classes = Array.isArray(response.data) ? response.data : [];
    setFaultClasses(classes);
    // Don't auto-select first class - let user choose
  } catch (error) {
    console.error('Error fetching fault classes:', error);
    setFaultClasses([]); // Set empty array on error
    // Don't show error toast on initial load - it's not critical
  }
};
```

**After**:
```javascript
const fetchFaultClasses = async () => {
  try {
    // Use the same endpoint as student list to get proper class names
    const response = await axios.get(`${API_BASE_URL}/student-list/classes`);
    const classes = Array.isArray(response.data) ? response.data : [];
    setFaultClasses(classes);
    // Don't auto-select first class - let user choose
  } catch (error) {
    console.error('Error fetching fault classes:', error);
    setFaultClasses([]); // Set empty array on error
    // Don't show error toast on initial load - it's not critical
  }
};
```

## Key Changes
1. ✅ Changed endpoint from `/api/faults/classes` to `/api/student-list/classes`
2. ✅ Removed `getAuthConfig()` as the student-list endpoint doesn't require authentication
3. ✅ Now shows actual class names instead of database table names

## Deployment Details

- **Commit**: c7fd255 - "fix: Use student-list/classes endpoint in StaffProfile Faults tab"
- **Build Hash**: Changed from `index-2cbf5f07.js` to `index-19dd7518.js`
- **Build Time**: 43.17s
- **Deployed**: March 7, 2026
- **Server**: 76.13.48.245
- **Status**: ✅ LIVE

## Testing Steps

1. ✅ Navigate to https://bilal.skoolific.com/app/staff
2. ✅ Log in as a teacher or class teacher
3. ✅ Click on the "Faults" tab in the bottom navigation
4. ✅ Click on the "Select Class" dropdown
5. ✅ Verify it shows actual class names (e.g., "Class 1", "Grade 10-A") instead of database table names
6. ✅ Select a class and verify students load correctly
7. ✅ Test reporting a fault
8. ✅ Test viewing fault history

## Before vs After

### Before (Incorrect)
```
Select Class dropdown showed:
- academic_class_shift_assignment
- academic_student_attendance
- admin_sub_accounts
- admin_users
- backup_metadata
- branding_settings
- budgets
- class_message_attachments
- conversations
- device_user_conflicts
- evaluation_areas
- ...
```

### After (Correct)
```
Select Class dropdown shows:
- Class 1
- Class 2
- Class 3
- Grade 10-A
- Grade 10-B
- Grade 11-Science
- ...
(Actual class names from your database)
```

## Related Components

This fix ensures consistency across:
1. ✅ **FaultsPage** (`/faults`) - Admin view
2. ✅ **StaffProfile Faults Tab** (`/app/staff`) - Teacher view
3. ✅ **ListStudent** (`/list-student`) - Student list view

All three now use the same `/api/student-list/classes` endpoint.

## Cache Clearing

Since the bundle hash changed, users may need to clear their cache:

### Quick Method
Visit: https://bilal.skoolific.com/force-refresh.html

### Manual Method
- **Windows/Linux**: Ctrl + Shift + R
- **Mac**: Cmd + Shift + R

## API Endpoints Used

### Get Classes
```
GET /api/student-list/classes
Response: ["Class 1", "Class 2", "Class 3", ...]
```

### Get Students by Class
```
GET /api/faults/students/:className
Response: [{ student_name, school_id, class_id, ... }]
```

### Get Faults by Class
```
GET /api/faults/faults/:className
Response: [{ id, student_name, fault_type, description, date, ... }]
```

### Report Fault
```
POST /api/faults/add-fault
Body: FormData with className, student_name, fault_type, description, date, reported_by
```

## Files Modified
- `bilal/APP/src/COMPONENTS/StaffProfile.jsx` - Updated fetchFaultClasses function

## Benefits

1. **User Experience**: Teachers see familiar class names they recognize
2. **Consistency**: Same class names across all parts of the application
3. **Reliability**: Uses well-tested student-list endpoint
4. **Simplicity**: Removed unnecessary authentication for class list
5. **Accuracy**: Shows only classes that have students, not database tables

## Status
✅ **DEPLOYED AND FUNCTIONAL**

Teachers can now properly select classes from the dropdown and report/view student faults using the correct class names.

## Access URL
https://bilal.skoolific.com/app/staff → Faults Tab
