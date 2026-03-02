// Quick script to check if classes exist in the database
require('dotenv').config();
const pool = require('./config/db');

async function checkClasses() {
  try {
    console.log('🔍 Checking for classes in database...\n');

    // Check if classes_schema exists
    const schemaCheck = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'classes_schema'
    `);

    if (schemaCheck.rows.length === 0) {
      console.log('❌ classes_schema does not exist!');
      console.log('\n💡 Solution: You need to create classes first.');
      console.log('   Go to: Registration → Register Student');
      console.log('   Or create classes manually in the database.');
      process.exit(1);
    }

    console.log('✅ classes_schema exists\n');

    // Get all classes
    const result = await pool.query(`
      SELECT table_name AS class_name 
      FROM information_schema.tables 
      WHERE table_schema = 'classes_schema'
      ORDER BY table_name
    `);

    if (result.rows.length === 0) {
      console.log('❌ No classes found in classes_schema!');
      console.log('\n💡 Solution: You need to register students to create classes.');
      console.log('   1. Go to: Registration → Register Student');
      console.log('   2. Fill in student details including class name');
      console.log('   3. Submit the form');
      console.log('   4. The class will be created automatically');
      process.exit(1);
    }

    console.log(`✅ Found ${result.rows.length} classes:\n`);
    result.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.class_name}`);
    });

    // Check students in first class
    if (result.rows.length > 0) {
      const firstClass = result.rows[0].class_name;
      console.log(`\n📊 Checking students in "${firstClass}"...`);
      
      const studentsResult = await pool.query(`
        SELECT COUNT(*) as count 
        FROM classes_schema."${firstClass}"
      `);
      
      console.log(`   Students: ${studentsResult.rows[0].count}`);
    }

    console.log('\n✅ Database check complete!');
    console.log('   The /api/mark-list/classes endpoint should work now.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking classes:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check database connection in .env');
    console.error('   2. Ensure PostgreSQL is running');
    console.error('   3. Verify database credentials');
    process.exit(1);
  }
}

checkClasses();
