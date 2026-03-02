#!/usr/bin/env node
// Complete setup script for the new report card system
const pool = require('./config/db');
const fs = require('fs');
const path = require('path');

async function setupReportCard() {
  console.log('🎓 Setting up Bilal School Report Card System...\n');

  try {
    // Step 1: Create student_activities table
    console.log('📋 Step 1: Creating student_activities table...');
    const sqlPath = path.join(__dirname, 'database/create_student_activities_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await pool.query(sql);
    console.log('✅ Table created successfully!\n');

    // Step 2: Verify table structure
    console.log('🔍 Step 2: Verifying table structure...');
    const tableCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'student_activities'
      ORDER BY ordinal_position;
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Table structure verified:');
      tableCheck.rows.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
      console.log('');
    } else {
      throw new Error('Table was not created properly');
    }

    // Step 3: Check indexes
    console.log('📊 Step 3: Checking indexes...');
    const indexCheck = await pool.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'student_activities';
    `);
    console.log(`✅ Found ${indexCheck.rows.length} indexes`);
    indexCheck.rows.forEach(idx => {
      console.log(`   - ${idx.indexname}`);
    });
    console.log('');

    // Step 4: Insert sample data (optional)
    console.log('📝 Step 4: Inserting sample data...');
    const sampleData = [
      {
        class_name: 'Grade 10',
        student_name: 'Ahmed Ali',
        term_number: 1,
        personal_hygiene: 'XC',
        learning_materials_care: 'G',
        time_management: 'SI',
        work_independently: 'G',
        obeys_rules: 'XC',
        overall_responsibility: 'G',
        social_relation: 'XC'
      },
      {
        class_name: 'Grade 10',
        student_name: 'Ahmed Ali',
        term_number: 2,
        personal_hygiene: 'XC',
        learning_materials_care: 'XC',
        time_management: 'G',
        work_independently: 'XC',
        obeys_rules: 'XC',
        overall_responsibility: 'XC',
        social_relation: 'XC'
      }
    ];

    for (const data of sampleData) {
      await pool.query(`
        INSERT INTO student_activities (
          class_name, student_name, term_number,
          personal_hygiene, learning_materials_care, time_management,
          work_independently, obeys_rules, overall_responsibility, social_relation
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (class_name, student_name, term_number) DO NOTHING
      `, [
        data.class_name, data.student_name, data.term_number,
        data.personal_hygiene, data.learning_materials_care, data.time_management,
        data.work_independently, data.obeys_rules, data.overall_responsibility,
        data.social_relation
      ]);
    }
    console.log('✅ Sample data inserted\n');

    // Step 5: Verify data
    console.log('🔎 Step 5: Verifying sample data...');
    const dataCheck = await pool.query(`
      SELECT class_name, student_name, term_number, personal_hygiene
      FROM student_activities
      LIMIT 5;
    `);
    console.log(`✅ Found ${dataCheck.rows.length} sample records:`);
    dataCheck.rows.forEach(row => {
      console.log(`   - ${row.student_name} (${row.class_name}) - Term ${row.term_number}: ${row.personal_hygiene}`);
    });
    console.log('');

    // Success summary
    console.log('🎉 Setup completed successfully!\n');
    console.log('📚 Next Steps:');
    console.log('   1. Start the server: node backend/server.js');
    console.log('   2. Test the API: node backend/test-student-activities-api.js');
    console.log('   3. Access report card: http://localhost:3000/mark-list/report-card');
    console.log('');
    console.log('📖 Documentation: backend/REPORT_CARD_SETUP.md');
    console.log('');
    console.log('✨ The new Bilal School report card design is ready to use!');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check database connection in backend/.env');
    console.error('   2. Ensure PostgreSQL is running');
    console.error('   3. Verify database credentials');
    console.error('   4. Check if table already exists');
    console.error('\nError details:', error);
    process.exit(1);
  }
}

// Run setup
setupReportCard();
