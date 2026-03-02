# Report Card Quick Start Guide

## 🎓 New Bilal School Report Card Design

The old Iqra Academy report card has been replaced with a new Bilal School design featuring:
- Three-page layout (Grading System, Student Info, Academic Performance)
- Multilingual support (Arabic, Oromo, Amharic, English)
- Student activities tracking
- Enhanced print and PDF capabilities

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Run Setup Script
```bash
node backend/setup-report-card.js
```

This will:
- Create the `student_activities` table
- Set up indexes
- Insert sample data
- Verify everything is working

### Step 2: Start the Server
```bash
cd backend
node server.js
```

### Step 3: Access Report Card
Open your browser and navigate to:
```
http://localhost:3000
```

Then go to: **Mark List → Report Card**

---

## 📝 Manual Setup (If Needed)

If the quick setup doesn't work, follow these steps:

### 1. Create Database Table
```bash
node backend/scripts/create-student-activities-table.js
```

### 2. Verify Server Configuration
Check that `backend/server.js` includes:
```javascript
const studentActivitiesRoutes = require('./routes/studentActivitiesRoutes');
app.use('/api/student-activities', studentActivitiesRoutes);
```

### 3. Test API
```bash
node backend/test-student-activities-api.js
```

---

## 🎨 Using the Report Card

### Viewing Report Cards
1. Navigate to **Mark List → Report Card**
2. Select a **Class** from the dropdown
3. Select a **Student** from the dropdown
4. Preview appears automatically

### Printing Options
- **Print Single**: Print the selected student's report card
- **Print All**: Print report cards for all students in the class
- **PDF**: Download as PDF file

### Print Settings
- Paper Size: **A5**
- Orientation: **Portrait**
- Margins: **None** (or minimal)

---

## 📊 Managing Student Activities

### Adding Activities via API

```bash
curl -X POST http://localhost:5000/api/student-activities/activities \
  -H "Content-Type: application/json" \
  -d '{
    "className": "Grade 10",
    "studentName": "Ahmed Ali",
    "termNumber": 1,
    "personalHygiene": "XC",
    "learningMaterialsCare": "G",
    "timeManagement": "SI",
    "workIndependently": "G",
    "obeysRules": "XC",
    "overallResponsibility": "G",
    "socialRelation": "XC"
  }'
```

### Activity Rating Values
- **XC** - Excellent
- **G** - Good
- **SI** - Satisfactory/Improved
- **NI** - Needs Improvement

### Activity Categories
1. Personal Hygiene
2. Learning Materials Care
3. Time Management
4. Work Independently
5. Obeys Rules
6. Overall Responsibility
7. Social Relation

---

## 🔧 Troubleshooting

### Report Card Not Loading
```bash
# Check if server is running
curl http://localhost:5000/api/health

# Check if table exists
psql -U your_username -d your_database -c "\d student_activities"

# Check server logs
tail -f backend/logs/server.log
```

### Activities Not Showing
```bash
# Test API endpoint
curl http://localhost:5000/api/student-activities/activities/Grade%2010/Ahmed%20Ali

# Check database
psql -U your_username -d your_database -c "SELECT * FROM student_activities LIMIT 5;"
```

### Print Issues
- Ensure browser print settings are set to A5 Portrait
- Try using the PDF download option instead
- Check browser console for errors (F12)

---

## 📁 File Locations

### Frontend
- Component: `app/src/PAGE/CreateMarklist/ReportCard/ReportCard.jsx`
- Styles: `app/src/PAGE/CreateMarklist/ReportCard/ReportCard.module.css`

### Backend
- Routes: `backend/routes/studentActivitiesRoutes.js`
- Database Schema: `backend/database/create_student_activities_table.sql`
- Setup Script: `backend/setup-report-card.js`

### Documentation
- Full Guide: `backend/REPORT_CARD_SETUP.md`
- This Guide: `REPORT_CARD_QUICK_START.md`

---

## 🆘 Getting Help

### Check Logs
```bash
# Server logs
tail -f backend/logs/server.log

# Database logs
tail -f /var/log/postgresql/postgresql.log
```

### Verify Setup
```bash
# Run all checks
node backend/setup-report-card.js

# Test API
node backend/test-student-activities-api.js
```

### Common Issues

**Issue**: "Table does not exist"
```bash
# Solution: Create the table
node backend/scripts/create-student-activities-table.js
```

**Issue**: "Cannot GET /api/student-activities"
```bash
# Solution: Restart the server
cd backend
node server.js
```

**Issue**: "Activities not showing on report card"
```bash
# Solution: Add sample data
node backend/setup-report-card.js
```

---

## ✅ Verification Checklist

- [ ] Database table created
- [ ] Server running without errors
- [ ] API endpoints responding
- [ ] Report card page loads
- [ ] Can select class and student
- [ ] Preview shows correctly
- [ ] Print works
- [ ] PDF download works
- [ ] Activities display (if added)

---

## 🎯 What Changed

### Old Design (Iqra Academy)
- Orange color scheme
- 2-page layout
- Basic activity table
- English-focused

### New Design (Bilal School)
- Blue color scheme (#2c5aa0)
- 3-page layout
- Detailed activity assessment
- Full multilingual support

---

## 📞 Support

For additional help, refer to:
- Full documentation: `backend/REPORT_CARD_SETUP.md`
- API documentation: Check route files
- Database schema: `backend/database/create_student_activities_table.sql`

---

**Last Updated**: February 2026
**Version**: 2.0 (Bilal School Design)
