#!/bin/bash
# Test HR routes on VPS

echo "Testing HR Routes..."
echo ""

echo "1. Testing shift-settings route:"
curl -s http://localhost:5000/api/hr/shift-settings | jq '.'
echo ""

echo "2. Testing attendance time-settings route (requires auth):"
echo "   (This will fail without token, but should not be 500)"
curl -s http://localhost:5000/api/hr/attendance/time-settings
echo ""

echo "3. Checking if tables exist:"
sudo -u postgres psql -d school_management2 -c "SELECT COUNT(*) as shift_settings_count FROM shift_time_settings;"
sudo -u postgres psql -d school_management2 -c "SELECT COUNT(*) as hr_attendance_settings_count FROM hr_attendance_time_settings;"

echo ""
echo "Done!"
