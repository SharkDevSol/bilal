# Machine Integration Guide - Student Attendance

## ✅ YES! The Machine Will Automatically Capture Logs

Your system is fully configured to receive attendance logs from the biometric machine. Here's how it works:

## How It Works

### 1. Machine Setup
Your AI06 biometric device is configured to connect to:
- **WebSocket Port**: 7788
- **Device IP**: 192.168.1.2 (configured in .env)
- **Service Status**: ✅ ENABLED

### 2. Automatic Log Capture Flow

```
Student checks in on machine
         ↓
Machine sends log via WebSocket (port 7788)
         ↓
Backend AI06 Service receives the log
         ↓
System checks: Is this a student? (using smachine_id)
         ↓
If YES → Saves to academic_student_attendance table
         ↓
Attendance page auto-refreshes every 30 seconds
         ↓
You see the attendance record!
```

### 3. What Happens When Student Checks In

1. **Student scans face/fingerprint** on the biometric machine
2. **Machine sends data** to your backend server (port 7788)
3. **Backend identifies student** by matching `smachine_id` (Machine ID)
4. **System calculates**:
   - Ethiopian calendar date
   - Check-in time
   - Status (Present/Late based on time settings)
5. **Record is saved** to database
6. **Attendance page updates** automatically (refreshes every 30 seconds)

## Student Machine ID Setup

For the system to recognize students, each student MUST have a `smachine_id` set:

### Check if Students Have Machine IDs
```sql
-- On VPS
sudo -u postgres psql -d school_management2

-- Check students in a class
SELECT student_name, smachine_id 
FROM classes_schema."GRADE10" 
WHERE smachine_id IS NOT NULL;
```

### How to Set Machine IDs

**Option 1: During Student Registration**
- When registering a student, there's a field for "Machine ID"
- Enter the ID that's assigned to the student on the biometric device

**Option 2: Bulk Update via Excel**
- Export students
- Add `smachine_id` column with their machine IDs
- Re-import

**Option 3: Manual Update**
```sql
-- Update single student
UPDATE classes_schema."GRADE10" 
SET smachine_id = '1234' 
WHERE student_name = 'Ahmed Ali';
```

## Verify Machine Connection

### 1. Check Backend Logs
```bash
# On VPS
pm2 logs skoolific-backend --lines 50
```

Look for:
- `✅ AI06 WebSocket Service enabled on port 7788`
- `🔌 AI06 WebSocket Server started on port 7788`
- `📡 Waiting for AI06 devices to connect...`

### 2. Test Machine Connection
When a student checks in, you should see in the logs:
```
📥 Received attendance log from machine
👤 Student detected: Ahmed Ali (Machine ID: 1234)
✅ Saved to academic_student_attendance
```

### 3. Check Attendance Records
```sql
-- See recent attendance from machine
SELECT 
  student_name,
  ethiopian_day || '/' || ethiopian_month || '/' || ethiopian_year as date,
  check_in_time,
  status
FROM academic_student_attendance
WHERE created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC
LIMIT 20;
```

## Troubleshooting

### Machine Not Sending Logs?

**1. Check Network Connection**
```bash
# From VPS, ping the machine
ping 192.168.1.2
```

**2. Check Machine Configuration**
On the AI06 device settings:
- Server IP: Your VPS IP (76.13.48.245)
- Server Port: 7788
- Push Mode: Enabled
- Protocol: WebSocket

**3. Check Firewall**
```bash
# On VPS, allow port 7788
sudo ufw allow 7788
sudo ufw status
```

**4. Check Backend Service**
```bash
# Restart backend
pm2 restart skoolific-backend

# Check if port 7788 is listening
sudo netstat -tulpn | grep 7788
```

### Students Not Appearing in Attendance?

**1. Verify Machine ID is Set**
```sql
SELECT student_name, smachine_id 
FROM classes_schema."GRADE10" 
WHERE student_name = 'Ahmed Ali';
```

**2. Check Machine ID Matches**
- The `smachine_id` in database MUST match the User ID on the biometric device
- They are case-sensitive and must be exact

**3. Check Auto-Marker Settings**
```sql
-- View settings
SELECT * FROM academic_student_attendance_settings;
```

Make sure:
- `auto_absent_enabled` = true
- `school_days` includes the current day
- Time settings are correct

## Auto-Refresh Feature

The attendance page automatically refreshes every 30 seconds to show new check-ins from the machine. You don't need to manually refresh!

Look for this in the browser console:
```
Auto-refreshing attendance data...
```

## Manual Refresh

If you want to see updates immediately:
1. Click the "🔄 Refresh" button on the attendance page
2. Or press F5 to reload the page

## Testing the Integration

### Test Script Available
```bash
# On VPS
cd /var/www/skoolific/iqrab3/backend
node test-ai06-device.js
```

This simulates a machine check-in to verify the integration works.

## Summary

✅ **Machine integration is ENABLED and READY**
✅ **System will automatically capture logs**
✅ **Attendance page auto-refreshes every 30 seconds**
✅ **Students need `smachine_id` set to be recognized**

When you connect the machine and students check in, their attendance will automatically appear on the attendance page!
