// Test Staff Auto-Absent Marker
const pool = require('./backend/config/db');
const attendanceAutoMarker = require('./backend/services/attendanceAutoMarker');

console.log('🧪 Testing Staff Auto-Absent Marker...\n');

async function test() {
  try {
    // Check current time
    const now = new Date();
    console.log(`⏰ Current Time: ${now.toLocaleTimeString()}`);
    
    // Check settings
    const settings = await pool.query('SELECT * FROM hr_attendance_time_settings LIMIT 1');
    console.log('\n⚙️ Settings:');
    console.log(settings.rows[0]);
    
    // Check if any staff exist
    const staffCount = await pool.query(`
      SELECT COUNT(*) as count FROM staff_users WHERE is_active = true
    `);
    console.log(`\n👥 Active Staff Count: ${staffCount.rows[0].count}`);
    
    // Check today's attendance
    const today = new Date();
    const ethDate = {
      year: 2018,
      month: 6, // Yekatit
      day: 17
    };
    
    const attendance = await pool.query(`
      SELECT 
        staff_id,
        staff_name,
        status,
        check_in,
        check_out
      FROM hr_ethiopian_attendance
      WHERE ethiopian_year = $1 
        AND ethiopian_month = $2 
        AND ethiopian_day = $3
      ORDER BY staff_name
    `, [ethDate.year, ethDate.month, ethDate.day]);
    
    console.log(`\n📊 Today's Attendance Records: ${attendance.rows.length}`);
    attendance.rows.forEach(row => {
      console.log(`   ${row.staff_name}: ${row.status} (Check-in: ${row.check_in || 'N/A'})`);
    });
    
    // Manually trigger the auto-marker
    console.log('\n🤖 Manually triggering auto-marker...');
    await attendanceAutoMarker.checkAndMarkAttendance();
    
    // Check attendance again
    const attendanceAfter = await pool.query(`
      SELECT 
        staff_id,
        staff_name,
        status,
        check_in,
        check_out
      FROM hr_ethiopian_attendance
      WHERE ethiopian_year = $1 
        AND ethiopian_month = $2 
        AND ethiopian_day = $3
      ORDER BY staff_name
    `, [ethDate.year, ethDate.month, ethDate.day]);
    
    console.log(`\n📊 After Auto-Marker: ${attendanceAfter.rows.length} records`);
    attendanceAfter.rows.forEach(row => {
      console.log(`   ${row.staff_name}: ${row.status} (Check-in: ${row.check_in || 'N/A'})`);
    });
    
    await pool.end();
    console.log('\n✅ Test complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
  }
}

test();
