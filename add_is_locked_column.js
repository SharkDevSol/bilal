const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'school_management2',
  password: 'Bilal2026SchoolSecurePass',
  port: 5432,
});

async function addIsLockedColumn() {
  const client = await pool.connect();
  try {
    // Get all subject schemas
    const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name LIKE 'subject_%_schema'
    `);

    console.log(`Found ${schemasResult.rows.length} subject schemas`);

    for (const row of schemasResult.rows) {
      const schemaName = row.schema_name;
      console.log(`\nProcessing schema: ${schemaName}`);

      // Get all tables in this schema (mark list tables)
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = $1 
          AND table_name LIKE '%_term_%'
      `, [schemaName]);

      console.log(`  Found ${tablesResult.rows.length} mark list tables`);

      for (const tableRow of tablesResult.rows) {
        const tableName = tableRow.table_name;
        
        // Check if is_locked column already exists
        const columnCheck = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = $1 
            AND table_name = $2 
            AND column_name = 'is_locked'
        `, [schemaName, tableName]);

        if (columnCheck.rows.length === 0) {
          // Add is_locked column
          await client.query(`
            ALTER TABLE ${schemaName}.${tableName} 
            ADD COLUMN is_locked BOOLEAN DEFAULT FALSE
          `);
          console.log(`    ✓ Added is_locked column to ${tableName}`);
        } else {
          console.log(`    - is_locked column already exists in ${tableName}`);
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addIsLockedColumn();
