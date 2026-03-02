# Machine Integration - Quick Summary

## ✅ YES! Machine Will Automatically Capture Logs

Your system is fully configured and ready to receive attendance logs from the biometric machine.

## How It Works (Simple)

1. **Student checks in** on biometric machine (face/fingerprint scan)
2. **Machine sends log** to your backend server (port 7788)
3. **System recognizes student** by Machine ID (`smachine_id`)
4. **Attendance is saved** automatically
5. **Page refreshes** every 30 seconds to show new attendance

## What You Need to Do

### 1. Make Sure Students Have Machine IDs

Each student needs a `smachine_id` that matches their User ID on the biometric device.

**Check on VPS:**
```bash
sudo -u postgres psql -d school_management2 -c "SELECT student_name, smachine_id FROM classes_schema.\"GRADE10\" LIMIT 10;"
```

**If students don't have Machine IDs:**
- Set them during student registration
- Or update them in the database
- Or use bulk Excel import

### 2. Configure the Biometric Machine

On the AI06 device settings:
- **Server IP**: 76.13.48.245 (your VPS IP)
- **Server Port**: 7788
- **Push Mode**: Enabled
- **Protocol**: WebSocket

### 3. Allow Port 7788 on Firewall

```bash
# On VPS
sudo ufw allow 7788
sudo ufw status
```

## Verify It's Working

### Check Backend Logs
```bash
pm2 logs skoolific-backend --lines 20
```

You should see:
- `✅ AI06 WebSocket Service enabled on port 7788`
- `🔌 AI06 WebSocket Server started on port 7788`

### When Student Checks In
You'll see in logs:
- `📥 Received attendance log from machine`
- `👤 Student detected: [Name]`
- `✅ Saved to academic_student_attendance`

### Check Attendance Page
- Go to Student Attendance page
- Select the class and current week
- Attendance will appear automatically (refreshes every 30 seconds)

## Important Notes

✅ **Auto-refresh**: Page updates every 30 seconds automatically
✅ **Machine ID required**: Students MUST have `smachine_id` set
✅ **Ethiopian calendar**: System automatically converts dates
✅ **Status calculation**: Present/Late determined by time settings
✅ **No manual entry needed**: Everything is automatic!

## Troubleshooting

**Machine not connecting?**
1. Check network connection (ping 192.168.1.2)
2. Verify firewall allows port 7788
3. Check machine configuration
4. Restart backend: `pm2 restart skoolific-backend`

**Students not appearing?**
1. Verify `smachine_id` is set in database
2. Check Machine ID matches device User ID exactly
3. Check backend logs for errors

## Files Created

- `MACHINE_INTEGRATION_GUIDE.md` - Detailed guide
- `CHECK_STUDENT_MACHINE_IDS.sql` - SQL queries to verify setup

## Ready to Go!

Once you:
1. Set Machine IDs for students
2. Configure the biometric device
3. Connect the machine

The system will automatically capture and display attendance!
