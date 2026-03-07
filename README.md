# 🎓 Skoolific - Complete School Management System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-14%2B-blue.svg)](https://www.postgresql.org/)

A comprehensive, modern school management system built with React, Node.js, and PostgreSQL. Designed for Ethiopian schools with full support for Ethiopian calendar, Amharic language, and local educational requirements.

## 🌟 Key Features

### 📚 Academic Management
- **Student Registration & Management**
  - Dynamic form builder for custom student fields
  - Bulk import/export functionality
  - Student profiles with photos and credentials
  - Active/inactive student tracking
  - Class-wise student organization

- **Staff Management**
  - Teacher and administrative staff registration
  - Role-based access control
  - Staff profiles with credentials
  - Department and position tracking

- **Evaluation System**
  - Customizable evaluation templates
  - Multi-criteria assessment
  - Area-based evaluation (Academic, Behavioral, Social)
  - Student performance tracking
  - Evaluation reports and analytics

- **Evaluation Book**
  - Daily student evaluations
  - Template-based assessments
  - Teacher assignments by class
  - Guardian feedback system
  - Comprehensive evaluation reports

- **Mark List Management**
  - Subject-wise mark entry
  - Term-based assessments
  - Configurable mark components (Tests, Assignments, Exams)
  - Pass/fail status calculation
  - Progress tracking

- **Report Cards**
  - Automated report card generation
  - Customizable templates
  - Multi-term support
  - Grade calculation
  - Performance analytics

- **Schedule Management**
  - Class timetable creation
  - Teacher schedule management
  - Subject allocation
  - Period-wise scheduling
  - Shift management

### 👥 Attendance Management

#### Student Attendance
- **Weekly Attendance System**
  - Class teacher attendance marking
  - Day-wise attendance tracking
  - Attendance status (Present, Absent, Late, Half-Day)
  - Weekly attendance tables
  - Historical attendance records

- **Time-Based Attendance**
  - Check-in/check-out tracking
  - Late arrival detection
  - Configurable time settings
  - Attendance reports

#### Staff Attendance
- **Biometric Integration**
  - Fingerprint device support
  - Real-time attendance capture
  - Device status monitoring
  - Multiple device management

- **Manual Attendance**
  - Web-based check-in/check-out
  - GPS location tracking
  - Photo verification
  - Attendance corrections

- **Attendance Settings**
  - Shift time configuration
  - Staff-specific timing
  - Deduction rules (Late, Absent, Half-Day)
  - Grace period settings

### 💰 Finance Management

#### Fee Management
- **Fee Structure**
  - Multiple fee types (Tuition, Transport, Books, etc.)
  - Class-wise fee configuration
  - Term-based fees
  - Custom fee categories

- **Monthly Payments**
  - Ethiopian calendar integration
  - Month-wise payment tracking
  - Payment locking/unlocking
  - Bulk payment processing
  - Payment history

- **Invoice System**
  - Automated invoice generation
  - Multiple payment methods
  - Partial payment support
  - Invoice templates
  - Receipt generation

- **Payment Tracking**
  - Student balance monitoring
  - Payment reminders
  - Overdue tracking
  - Payment reports

#### Budget & Expenses
- **Budget Management**
  - Department-wise budgets
  - Budget allocation
  - Budget vs actual tracking
  - Budget reports

- **Expense Management**
  - Expense recording
  - Category-wise tracking
  - Approval workflow
  - Expense reports

#### Payroll System
- **Salary Management**
  - Staff salary configuration
  - Allowances and deductions
  - Attendance-based deductions
  - Salary slip generation
  - Payment history

- **Payroll Processing**
  - Monthly payroll calculation
  - Bulk salary processing
  - Tax calculations
  - Bank transfer integration

### 🏢 HR Management

- **Staff Records**
  - Complete staff database
  - Employment history
  - Document management
  - Performance records

- **Leave Management**
  - Leave request system
  - Leave approval workflow
  - Leave balance tracking
  - Leave types (Sick, Annual, Emergency)

- **Performance Management**
  - Performance evaluations
  - Goal setting
  - Performance reviews
  - Rating system

- **HR Reports**
  - Staff statistics
  - Attendance reports
  - Payroll reports
  - Performance analytics

### 👨‍👩‍👧 Guardian Portal

- **Guardian Dashboard**
  - Multiple ward management
  - Real-time updates
  - Notification center

- **Ward Information**
  - Student profiles
  - Academic performance
  - Attendance records
  - Fee status

- **Communication**
  - Direct messaging with teachers
  - Class announcements
  - Event notifications
  - Emergency alerts

- **Evaluation Feedback**
  - View daily evaluations
  - Provide feedback
  - Track progress
  - Communication with teachers

### 🚨 Student Faults Management

- **Fault Reporting**
  - 60+ predefined fault types across 14 categories:
    - Attendance Issues (Late, Truancy, Skipping)
    - Academic Infractions (Homework, Cheating, Unprepared)
    - Behavioral Issues (Disruptive, Disrespect, Insubordination)
    - Bullying & Harassment
    - Physical Altercations (Fighting, Aggression)
    - Language & Communication (Profanity, Inappropriate Language)
    - Dress Code & Appearance
    - Technology Misuse
    - Property & Vandalism
    - Safety Violations
    - Food & Cafeteria
    - Substance Related
    - Dishonesty
    - Other
  - Detailed incident descriptions
  - Date and reporter tracking
  - Severity levels (Minor, Moderate, Serious, Severe)

- **Fault Tracking**
  - Student-wise fault history
  - Offense numbering (1st, 2nd, 3rd offense)
  - Class-wise fault reports
  - Teacher fault reporting
  - Admin fault management

- **Fault Analytics**
  - Total faults statistics
  - Students with faults count
  - Recent faults (last 7 days)
  - Most common fault types
  - Class-wise fault distribution

- **Fault Filtering & Export**
  - Filter by class
  - Filter by fault type
  - Date range filtering
  - Student name search
  - CSV export functionality

### 📱 Communication System

- **Admin Communications**
  - Broadcast messages
  - Class-specific messages
  - Individual messaging
  - Message attachments

- **Teacher Communications**
  - Class communication
  - Parent messaging
  - Student messaging
  - Announcement system

- **Guardian Notifications**
  - Push notifications
  - SMS integration
  - Email notifications
  - In-app notifications

### 📊 Reports & Analytics

#### Student Reports
- Student statistics
- Class-wise distribution
- Gender distribution
- Age distribution
- Enrollment trends

#### Academic Reports
- Performance analytics
- Subject-wise analysis
- Class performance
- Term comparisons
- Grade distribution

#### Attendance Reports
- Daily attendance
- Monthly summaries
- Class attendance rates
- Student attendance history
- Late arrival reports

#### Behavior Reports
- Fault statistics
- Behavioral trends
- Student discipline records
- Incident reports

#### Financial Reports
- Fee collection reports
- Outstanding payments
- Payment trends
- Revenue analysis
- Expense reports

### 🔐 Security & Access Control

- **Role-Based Access Control (RBAC)**
  - Admin roles
  - Sub-admin accounts
  - Teacher permissions
  - Guardian access
  - Student access

- **Permission System**
  - Granular permissions
  - Module-level access
  - Action-level permissions
  - Custom permission sets

- **Authentication**
  - JWT token-based auth
  - Secure password hashing
  - Session management
  - Auto-logout

### 🌍 Multi-Language Support

- **Languages**
  - English
  - Amharic (አማርኛ)
  - Arabic (العربية)

- **Ethiopian Calendar**
  - Full Ethiopian calendar support
  - Date conversion
  - Month names in Amharic
  - Holiday management

### 📱 Mobile & Desktop Apps

- **Progressive Web App (PWA)**
  - Installable on mobile devices
  - Offline support
  - Push notifications
  - App-like experience

- **Separate Apps**
  - Student App
  - Guardian App
  - Staff App

- **Desktop Apps**
  - Windows application
  - macOS application
  - Linux application

### 🎨 User Interface

- **Modern Design**
  - Material Design principles
  - Responsive layout
  - Mobile-first approach
  - Dark mode support

- **Customization**
  - Branding settings
  - Color themes
  - Logo customization
  - School information

- **User Experience**
  - Intuitive navigation
  - Quick actions
  - Search functionality
  - Keyboard shortcuts

## 🏗️ Technical Architecture

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.5.14
- **Routing**: React Router v6
- **State Management**: React Context API + Redux
- **Styling**: CSS Modules
- **Icons**: React Icons (Feather Icons)
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Date Handling**: Custom Ethiopian Calendar

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS
- **Process Manager**: PM2

### Database Schema
- **Classes Schema**: Student records by class
- **Public Schema**: System tables
- **Fault Schema**: Student fault records
- **Finance Schema**: Payment and invoice records
- **HR Schema**: Staff and payroll records

## 📁 Project Structure

```
bilal/
├── APP/                          # Frontend Application
│   ├── public/                   # Static assets
│   │   ├── downloads/           # Desktop app installers
│   │   ├── manifest.json        # PWA manifest
│   │   └── service-worker.js    # Service worker
│   ├── src/
│   │   ├── COMPONENTS/          # Reusable components
│   │   │   ├── mobile/         # Mobile-specific components
│   │   │   ├── StaffProfile.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   └── GuardianProfile.jsx
│   │   ├── PAGE/               # Page components
│   │   │   ├── Academic/       # Academic features
│   │   │   ├── Finance/        # Finance features
│   │   │   ├── HR/            # HR features
│   │   │   ├── Faults/        # Faults management
│   │   │   ├── Reports/       # Report pages
│   │   │   └── ...
│   │   ├── context/           # React Context
│   │   ├── config/            # Configuration
│   │   ├── utils/             # Utility functions
│   │   └── App.jsx            # Main app component
│   ├── .env.production        # Production environment
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Backend API
│   ├── routes/                 # API routes
│   │   ├── academic/          # Academic routes
│   │   ├── finance/           # Finance routes
│   │   ├── hr/               # HR routes
│   │   ├── studentFaultsRoutes.js
│   │   └── ...
│   ├── middleware/            # Express middleware
│   ├── config/               # Configuration
│   ├── database/             # Database utilities
│   ├── migrations/           # Database migrations
│   ├── .env                  # Environment variables
│   ├── server.js             # Main server file
│   └── package.json
│
├── README.md                   # This file
└── package.json

```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 14+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/SharkDevSol/bilal.git
cd bilal
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.production.template .env

# Configure database connection in .env
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=school_db
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your_jwt_secret
# PORT=5011

# Run database migrations (if available)
npm run migrate

# Start the backend server
npm start

# Or use PM2 for production
pm2 start server.js --name bilal-backend
```

### 3. Frontend Setup
```bash
cd APP

# Install dependencies
npm install

# Create .env file
cp .env.example .env.production

# Configure API URL in .env.production
# VITE_API_URL=http://localhost:5011/api

# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### 4. Database Setup

Create the required schemas:
```sql
-- Create schemas
CREATE SCHEMA IF NOT EXISTS classes_schema;
CREATE SCHEMA IF NOT EXISTS class_students_fault;

-- Create classes table in public schema
CREATE TABLE IF NOT EXISTS public.classes (
    class_name VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 Deployment

### Production Deployment (VPS/Server)

1. **Server Requirements**
   - Ubuntu 20.04+ or similar Linux distribution
   - Node.js 16+
   - PostgreSQL 14+
   - Nginx (for reverse proxy)
   - PM2 (for process management)

2. **Clone and Setup**
   ```bash
   cd /var/www
   git clone https://github.com/SharkDevSol/bilal.git bilal-school
   cd bilal-school
   ```

3. **Backend Deployment**
   ```bash
   cd backend
   npm install --production
   
   # Configure .env with production settings
   nano .env
   
   # Start with PM2
   pm2 start server.js --name bilal-backend
   pm2 save
   pm2 startup
   ```

4. **Frontend Deployment**
   ```bash
   cd APP
   npm install
   npm run build
   
   # Copy build to web directory
   cp -r dist/* /var/www/bilal.skoolific.com/
   ```

5. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name bilal.skoolific.com;
       
       root /var/www/bilal.skoolific.com;
       index index.html;
       
       # Frontend
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:5011;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo certbot --nginx -d bilal.skoolific.com
   ```

### Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Server
PORT=5011
NODE_ENV=production

# JWT
JWT_SECRET=your_jwt_secret_key_here

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS (optional)
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=SCHOOL
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://bilal.skoolific.com/api
```

## 📖 Usage Guide

### Admin Access
1. Navigate to `https://your-domain.com/login`
2. Login with admin credentials
3. Access all features from the dashboard

### Teacher Access
1. Navigate to `https://your-domain.com/app/staff-login`
2. Login with teacher credentials
3. Access teacher-specific features

### Guardian Access
1. Navigate to `https://your-domain.com/app/guardian-login`
2. Login with guardian credentials
3. View ward information and communicate with teachers

### Student Access
1. Navigate to `https://your-domain.com/app/student-login`
2. Login with student credentials
3. View personal information and academic records

## 🔧 Configuration

### Branding
Update school branding in Settings:
- School name
- Logo
- Primary color
- Secondary color
- Contact information

### Permissions
Configure role-based permissions:
- Admin permissions
- Sub-admin permissions
- Teacher permissions
- Custom permission sets

### Academic Settings
- Term configuration
- Grading system
- Mark components
- Evaluation templates

### Financial Settings
- Fee types
- Payment methods
- Invoice templates
- Currency settings

## 🐛 Troubleshooting

### Common Issues

1. **"No routes matched location" Error**
   - Clear browser cache (Ctrl + Shift + R)
   - Visit `/force-refresh.html` to auto-clear cache

2. **"Failed to load students" Error**
   - Check database schema (should be `classes_schema`)
   - Verify class table exists
   - Check backend logs

3. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

4. **API Connection Error**
   - Check backend server is running
   - Verify `VITE_API_URL` in frontend `.env`
   - Check CORS settings

## 📝 API Documentation

### Authentication
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### Students
```
GET    /api/student-list/classes
GET    /api/student-list/students/:className
POST   /api/student-list/student
PUT    /api/student-list/student/:className/:schoolId/:classId
DELETE /api/student-list/student/:className/:schoolId/:classId
```

### Faults
```
GET  /api/faults/classes
GET  /api/faults/students/:className
GET  /api/faults/faults/:className
POST /api/faults/add-fault
```

### Finance
```
GET  /api/finance/fee-types
POST /api/finance/invoice
GET  /api/finance/payments
POST /api/finance/payment
```

### HR
```
GET  /api/hr/staff
POST /api/hr/attendance
GET  /api/hr/payroll
POST /api/hr/salary
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **SharkDevSol** - *Initial work* - [GitHub](https://github.com/SharkDevSol)

## 🙏 Acknowledgments

- ALKHWARIZMI - School Management System Framework
- React Community
- Node.js Community
- PostgreSQL Community

## 📞 Support

For support, email support@skoolific.com or join our Slack channel.

## 🔗 Links

- **Live Demo**: https://bilal.skoolific.com
- **Documentation**: https://docs.skoolific.com
- **GitHub**: https://github.com/SharkDevSol/bilal
- **Issues**: https://github.com/SharkDevSol/bilal/issues

## 📊 Project Status

- ✅ Core Features: Complete
- ✅ Student Management: Complete
- ✅ Staff Management: Complete
- ✅ Attendance System: Complete
- ✅ Finance Module: Complete
- ✅ HR Module: Complete
- ✅ Faults System: Complete
- ✅ Guardian Portal: Complete
- ✅ Reports: Complete
- 🚧 Inventory Module: Coming Soon
- 🚧 Asset Management: Coming Soon
- 🚧 Library Management: Coming Soon

## 🎯 Roadmap

### Version 2.0 (Upcoming)
- [ ] Inventory Management System
- [ ] Asset Management System
- [ ] Library Management System
- [ ] Transport Management
- [ ] Hostel Management
- [ ] Online Examination System
- [ ] Video Conferencing Integration
- [ ] Mobile App (Native)

### Version 2.1
- [ ] AI-Powered Analytics
- [ ] Predictive Student Performance
- [ ] Automated Report Generation
- [ ] Advanced Biometric Integration
- [ ] Blockchain Certificates

---

**Made with ❤️ for Ethiopian Schools**

*Empowering Education Through Technology*
