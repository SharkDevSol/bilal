# Report Card Setup Guide

## Overview
The new Bilal School report card design has been integrated into the system. This guide explains how to set up and use the new report card features.

## Database Setup

### 1. Create Student Activities Table

Run the following command to create the required database table:

```bash
node backend/scripts/create-student-activities-table.js
```

This will create the `student_activities` table with the following structure:
- `id` - Primary key
- `class_name` - Class identifier
- `student_name` - Student name
- `term_number` - Term (1 or 2)
- `personal_hygiene` - Activity rating
- `learning_materials_care` - Activity rating
- `time_management` - Activity rating
- `work_independently` - Activity rating
- `obeys_rules` - Activity rating
- `overall_responsibility` - Activity rating
- `social_relation` - Activity rating
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Valid Activity Values
- `XC` - Excellent
- `G` - Good
- `SI` - Improved
- `NI` - Needs Improvement

## API Endpoints

### Get Student Activities
```
GET /api/student-activities/activities/:className/:studentName
```

Returns activities for a specific student in both terms.

**Example Response:**
```json
{
  "success": true,
  "activities": [
    {
      "term_number": 1,
      "personal_hygiene": "XC",
      "learning_materials_care": "G",
      "time_management": "SI",
      "work_independently": "G",
      "obeys_rules": "XC",
      "overall_responsibility": "G",
      "social_relation": "XC"
    },
    {
      "term_number": 2,
      "personal_hygiene": "XC",
      "learning_materials_care": "XC",
      "time_management": "G",
      "work_independently": "G",
      "obeys_rules": "XC",
      "overall_responsibility": "XC",
      "social_relation": "XC"
    }
  ]
}
```

### Get All Class Activities
```
GET /api/student-activities/activities/:className/all
```

Returns activities for all students in a class (used for "Print All" functionality).

### Save Student Activities
```
POST /api/student-activities/activities
```

**Request Body:**
```json
{
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
}
```

## Report Card Features

### New Design Elements
1. **Three-Page Layout:**
   - Back Page Left: Grading system in Oromo & English
   - Back Page Right: Student information
   - Front Page: Academic performance table

2. **Multilingual Support:**
   - Arabic (مدرسة بلال الإسلامية)
   - Oromo (MANA BARNOOTA BILAAL)
   - Amharic (ቢላል እስላማዊ)
   - English

3. **Student Activities Section:**
   - Personal Hygiene
   - Learning Materials Care
   - Time Management
   - Work Independently
   - Obeys Rules
   - Overall Responsibility
   - Social Relation

### Print Options
- **Print Single:** Print report card for selected student
- **Print All:** Print report cards for all students in the class
- **Download PDF:** Generate PDF file of report card(s)

## Frontend Integration

The report card component is located at:
```
app/src/PAGE/CreateMarklist/ReportCard/ReportCard.jsx
```

### Key Features:
- Automatic fetching of student data, marks, and activities
- Real-time preview
- A5 portrait format (148mm x 210mm)
- Print-optimized styling
- PDF generation with proper page breaks

## Testing

### 1. Verify Database Table
```bash
psql -U your_username -d your_database -c "\d student_activities"
```

### 2. Test API Endpoints
```bash
# Get activities for a student
curl http://localhost:5000/api/student-activities/activities/Grade%2010/Ahmed%20Ali

# Get all activities for a class
curl http://localhost:5000/api/student-activities/activities/Grade%2010/all
```

### 3. Test Report Card
1. Navigate to Mark List → Report Card
2. Select a class and student
3. Verify the preview shows the new Bilal School design
4. Test print and PDF download functionality

## Troubleshooting

### Activities Not Showing
- Ensure the `student_activities` table exists
- Check that activities have been entered for the student
- Verify the API endpoint is returning data

### Print Issues
- Check browser print settings (A5 portrait)
- Ensure print styles are loading correctly
- Try PDF download as an alternative

### API Errors
- Check server logs: `backend/server.js`
- Verify database connection
- Ensure route is registered in server.js

## Migration from Old Design

The old Iqra Academy design has been replaced with the new Bilal School design. Key differences:

| Feature | Old Design | New Design |
|---------|-----------|------------|
| School Name | Iqra Academy | Bilal School |
| Color Scheme | Orange (#f39c12) | Blue (#2c5aa0) |
| Layout | 2 pages | 3 pages |
| Activities | Basic table | Detailed assessment |
| Languages | 4 languages | 4 languages (different text) |

## Support

For issues or questions:
1. Check server logs
2. Verify database schema
3. Test API endpoints
4. Review browser console for frontend errors
