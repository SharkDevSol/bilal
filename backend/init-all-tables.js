/**
 * Master Database Initialization Script
 * Runs ALL initialization scripts in the correct order
 * Run this once after creating a fresh database
 */

require('dotenv').config();
const pool = require('./config/db');

async function initializeAllTables() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting complete database initialization...\n');

    // 1. Create schemas
    console.log('1️⃣ Creating schemas...');
    await client.query(`CREATE SCHEMA IF NOT EXISTS school_schema_points;`);
    await client.query(`CREATE SCHEMA IF NOT EXISTS subjects_of_school_schema;`);
    console.log('   ✓ Schemas created\n');

    // 2. Create global_machine_ids table
    console.log('2️⃣ Creating global_machine_ids table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS school_schema_points.global_machine_ids (
        id SERIAL PRIMARY KEY,
        person_id VARCHAR(50) NOT NULL,
        person_type VARCHAR(20) NOT NULL CHECK (person_type IN ('staff', 'student')),
        machine_user_id VARCHAR(100) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(person_id, person_type)
      );
    `);
    console.log('   ✓ global_machine_ids table created\n');

    // 3. Create user_machine_mapping table
    console.log('3️⃣ Creating user_machine_mapping table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_machine_mapping (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        person_id VARCHAR(50) NOT NULL,
        person_type VARCHAR(20) NOT NULL CHECK (person_type IN ('staff', 'student')),
        machine_id VARCHAR(50) NOT NULL,
        device_user_id VARCHAR(100),
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_synced_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('   ✓ user_machine_mapping table created\n');

    // 4. Create hr_ethiopian_attendance table
    console.log('4️⃣ Creating hr_ethiopian_attendance table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS hr_ethiopian_attendance (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        staff_id VARCHAR(255) NOT NULL,
        staff_name VARCHAR(255),
        ethiopian_date DATE NOT NULL,
        ethiopian_year INTEGER NOT NULL,
        ethiopian_month INTEGER NOT NULL,
        ethiopian_day INTEGER NOT NULL,
        gregorian_date DATE NOT NULL,
        check_in_time TIME,
        check_out_time TIME,
        status VARCHAR(50) DEFAULT 'present',
        late_minutes INTEGER DEFAULT 0,
        overtime_minutes INTEGER DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(staff_id, ethiopian_date)
      );
    `);
    console.log('   ✓ hr_ethiopian_attendance table created\n');

    // 5. Create shift_time_settings table
    console.log('5️⃣ Creating shift_time_settings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS shift_time_settings (
        id SERIAL PRIMARY KEY,
        shift_name VARCHAR(20) NOT NULL UNIQUE CHECK (shift_name IN ('shift1', 'shift2')),
        check_in_time TIME NOT NULL,
        check_out_time TIME NOT NULL,
        late_threshold INTEGER DEFAULT 15,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insert default shifts
    await client.query(`
      INSERT INTO shift_time_settings (shift_name, check_in_time, check_out_time, late_threshold)
      VALUES 
        ('shift1', '08:00:00', '14:00:00', 15),
        ('shift2', '14:00:00', '20:00:00', 15)
      ON CONFLICT (shift_name) DO NOTHING;
    `);
    console.log('   ✓ shift_time_settings table created\n');

    // 6. Create hr_attendance_time_settings table
    console.log('6️⃣ Creating hr_attendance_time_settings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS hr_attendance_time_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        standard_check_in TIME NOT NULL DEFAULT '08:00',
        standard_check_out TIME NOT NULL DEFAULT '17:00',
        late_threshold_minutes INTEGER DEFAULT 15,
        early_departure_threshold_minutes INTEGER DEFAULT 15,
        overtime_threshold_minutes INTEGER DEFAULT 30,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insert default settings
    await client.query(`
      INSERT INTO hr_attendance_time_settings (standard_check_in, standard_check_out, late_threshold_minutes)
      VALUES ('08:00', '17:00', 15)
      ON CONFLICT DO NOTHING;
    `);
    console.log('   ✓ hr_attendance_time_settings table created\n');

    // 7. Create class_teachers table
    console.log('7️⃣ Creating class_teachers table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS school_schema_points.class_teachers (
        id SERIAL PRIMARY KEY,
        global_staff_id INTEGER NOT NULL,
        class_name VARCHAR(255) NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(global_staff_id, class_name)
      );
    `);
    console.log('   ✓ class_teachers table created\n');

    // 8. Grant permissions
    console.log('8️⃣ Granting permissions...');
    await client.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO skoolific_user;`);
    await client.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO skoolific_user;`);
    await client.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA school_schema_points TO skoolific_user;`);
    await client.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA school_schema_points TO skoolific_user;`);
    await client.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA subjects_of_school_schema TO skoolific_user;`);
    await client.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA subjects_of_school_schema TO skoolific_user;`);
    console.log('   ✓ Permissions granted\n');

    console.log('✅ Complete database initialization finished!\n');
    
  } catch (error) {
    console.error('❌ Initialization error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  initializeAllTables()
    .then(() => {
      console.log('Done! You can now restart the backend.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeAllTables };
