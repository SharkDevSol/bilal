# Quick Test Guide - Skoolific V2

## 🎉 System Status

### ✅ Backend Server
- **Running on**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **Status**: Operational

### ✅ Frontend Server
- **Running on**: http://localhost:5052
- **Status**: Operational

## 🚀 How to Test

### Step 1: Open the Web Application
Open your browser and go to:
```
http://localhost:5052
```

### Step 2: Choose a Login Portal

#### 🔐 Admin Portal
**URL**: http://localhost:5052/admin-login
- Username: `admin`
- Password: `admin123`
- **Features to Test**:
  - Dashboard with statistics
  - Student management (add, edit, view students)
  - Staff management
  - Attendance marking
  - Mark entry
  - Fee management
  - Reports

#### 👨‍🏫 Staff Portal
**URL**: http://localhost:5052/staff-login
- Username: `teacher1`
- Password: `teacher123`
- **Features to Test**:
  - View assigned classes
  - Mark attendance
  - Enter marks/grades
  - View schedule
  - Post announcements

#### 🎓 Student Portal
**URL**: http://localhost:5052/student-login
- Username: `student1`
- Password: `student123`
- **Features to Test**:
  - View attendance
  - View marks/grades
  - View schedule
  - View announcements

#### 👨‍👩‍👧 Guardian Portal
**URL**: http://localhost:5052/guardian-login
- Username: `guardian1`
- Password: `guardian123`
- **Features to Test**:
  - View child's attendance
  - View child's marks
  - View payment history
  - Receive notifications

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Login works for all user types
- [ ] Dashboard loads correctly
- [ ] Navigation menu works
- [ ] Logout works

### Student Management
- [ ] View student list
- [ ] Add new student
- [ ] Edit student details
- [ ] Search students

### Attendance
- [ ] Mark student attendance
- [ ] View attendance reports
- [ ] Mark staff attendance

### Academic
- [ ] Enter marks/grades
- [ ] View mark lists
- [ ] Create evaluations

### Finance
- [ ] View fee structures
- [ ] Record payments
- [ ] Generate invoices
- [ ] View payment reports

### Communication
- [ ] Create posts/announcements
- [ ] Send messages
- [ ] View notifications

## 🔍 Troubleshooting

### Backend Not Responding
1. Check if backend is running:
   ```bash
   cd backend
   npm start
   ```

2. Verify backend health:
   - Open: http://localhost:3000/api/health
   - Should return: `{"status":"OK","message":"Server is running"}`

### Frontend Not Loading
1. Check if frontend is running:
   ```bash
   cd APP
   npm run dev
   ```

2. Clear browser cache (Ctrl+Shift+Delete)
3. Try incognito/private mode

### API Errors in Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Check for errors
4. Verify API calls are going to `http://localhost:3000/api/...`

### Login Fails
1. Check browser console for errors
2. Verify backend is running
3. Try default credentials listed above
4. Check if database is accessible

## 📊 Database Status

The backend shows some warnings about missing tables during startup. These are **non-critical** and expected for a fresh setup:
- `academic_student_attendance_settings`
- `hr_ethiopian_attendance`
- `user_machine_mapping`

These tables will be created automatically when you use the respective features.

## 🎯 Key Features to Test

### 1. Multi-Branch Support
- The system supports multiple school branches
- Each branch has its own database
- Branch code is required for authentication

### 2. Ethiopian Calendar
- The system uses Ethiopian calendar for dates
- Attendance and academic records use Ethiopian dates

### 3. Real-Time Updates
- Socket.IO is enabled for real-time notifications
- Attendance updates appear instantly
- Chat messages are delivered in real-time

### 4. Offline Support
- The frontend has offline capabilities
- Data is cached for offline access
- Sync happens when connection is restored

### 5. Mobile Support
- The application is responsive
- Works on mobile devices
- PWA (Progressive Web App) support

## 📝 Test Data

All test credentials are in: `APP/e2e/fixtures/test-data.js`

You can create additional test users through the Admin portal after logging in.

## 🆘 Need Help?

If you encounter any issues:
1. Check `BACKEND_FIX_SUMMARY.md` for detailed fix information
2. Check browser console for errors
3. Check backend terminal for error messages
4. Verify both servers are running

## ✅ Success Indicators

You'll know the system is working correctly when:
- ✅ You can log in successfully
- ✅ Dashboard loads with data
- ✅ You can navigate between pages
- ✅ API calls succeed (check Network tab in DevTools)
- ✅ No console errors in browser
- ✅ Backend shows no critical errors

Happy Testing! 🎉
