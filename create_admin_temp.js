const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'skoolific_user',
  host: 'localhost',
  database: 'school_management2',
  password: 'Skoolific2024Pass',
  port: 5432,
});

async function createAdmin() {
  try {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    
    console.log('Generated hash:', hash);
    
    // Delete existing admin
    await pool.query('DELETE FROM admin_users WHERE username = $1', ['admin']);
    
    // Insert new admin
    const result = await pool.query(
      'INSERT INTO admin_users (username, password_hash, name, email, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username',
      ['admin', hash, 'System Administrator', 'admin@school.com', 'admin']
    );
    
    console.log('✅ Admin created successfully:', result.rows[0]);
    console.log('Username: admin');
    console.log('Password: admin123');
    
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await pool.end();
    process.exit(1);
  }
}

createAdmin();
