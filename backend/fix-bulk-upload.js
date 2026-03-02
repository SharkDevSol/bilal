/**
 * Simplified Bulk Upload Fix
 * Add this route to staffRoutes.js to replace the broken bulk-import
 */

// SIMPLIFIED BULK IMPORT - WORKING VERSION
router.post('/bulk-import-simple', async (req, res) => {
  const { staffType, className, staff } = req.body;
  
  if (!staffType || !className || !staff || !Array.isArray(staff) || staff.length === 0) {
    return res.status(400).json({ error: 'Staff type, class name, and staff array are required' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const schema = sanitizeStaffTypeToSchema(staffType);
    const sanitizedClassName = sanitizeClassName(className);
    
    // Verify table exists
    const tableCheck = await client.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2)`,
      [schema, sanitizedClassName]
    );
    
    if (!tableCheck.rows[0].exists) {
      throw new Error(`Table ${schema}.${sanitizedClassName} does not exist`);
    }
    
    // Get columns
    const columnsResult = await client.query(
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2',
      [schema, sanitizedClassName]
    );
    
    const validColumns = columnsResult.rows.map(row => row.column_name);
    const columnTypes = {};
    columnsResult.rows.forEach(row => {
      columnTypes[row.column_name] = row.data_type;
    });
    
    // Get current max staff_id
    const staffIdResult = await client.query(
      `SELECT COALESCE(MAX(staff_id), 0) as max_staff_id FROM "${schema}"."${sanitizedClassName}"`
    );
    let currentStaffId = staffIdResult.rows[0].max_staff_id || 0;
    
    const results = {
      successCount: 0,
      failedCount: 0,
      errors: [],
      credentials: []
    };
    
    // Process each staff member
    for (let i = 0; i < staff.length; i++) {
      const staffData = staff[i];
      
      try {
        // Validate required fields
        if (!staffData.name) {
          results.failedCount++;
          results.errors.push({ row: i + 2, error: 'Missing name' });
          continue;
        }
        
        // Get next global_staff_id
        const globalStaffId = await getNextGlobalStaffId();
        currentStaffId++;
        
        // Generate credentials
        const nameParts = staffData.name.toLowerCase().trim().split(/\s+/);
        const firstName = nameParts[0] || 'staff';
        const lastName = nameParts[nameParts.length - 1] || '';
        const username = lastName ? `${firstName}_${lastName}_${globalStaffId}` : `${firstName}_${globalStaffId}`;
        const password = `staff${globalStaffId}2024`;
        
        // Build insert data
        const insertData = {
          global_staff_id: globalStaffId,
          staff_id: currentStaffId,
          name: staffData.name,
          username: username,
          password: password
        };
        
        // Process other fields
        Object.keys(staffData).forEach(key => {
          if (validColumns.includes(key) && !insertData[key]) {
            const value = staffData[key];
            const dataType = columnTypes[key];
            
            switch (dataType) {
              case 'integer':
              case 'numeric':
                insertData[key] = value ? parseInt(value) : null;
                break;
              case 'boolean':
                insertData[key] = value === 'true' || value === true || value === 'TRUE' || value === 1;
                break;
              case 'date':
                insertData[key] = value || null;
                break;
              default:
                insertData[key] = value || null;
            }
          }
        });
        
        // Ensure staff_work_time
        if (!insertData.staff_work_time) {
          insertData.staff_work_time = 'Full Time';
        }
        
        // Insert into main table
        const columns = Object.keys(insertData).filter(key => validColumns.includes(key));
        const values = columns.map(key => insertData[key]);
        const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
        
        const insertQuery = `INSERT INTO "${schema}"."${sanitizedClassName}" (${columns.join(', ')}) VALUES (${placeholders})`;
        await client.query(insertQuery, values);
        
        // Insert into staff_users for login (SIMPLIFIED - no extra features)
        try {
          await client.query(`
            INSERT INTO public.staff_users 
            (global_staff_id, username, password_hash, password_plain, staff_type, class_name, name, role, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (global_staff_id) DO NOTHING
          `, [
            globalStaffId,
            username,
            password, // In production, hash this
            password,
            staffType,
            sanitizedClassName,
            staffData.name,
            staffData.role || 'Staff',
            true
          ]);
        } catch (userErr) {
          console.error(`User creation error for ${staffData.name}:`, userErr.message);
          // Continue anyway - main table insert succeeded
        }
        
        results.successCount++;
        results.credentials.push({
          name: staffData.name,
          username: username,
          password: password
        });
        
      } catch (err) {
        console.error(`Error at row ${i + 2}:`, err);
        results.failedCount++;
        results.errors.push({
          row: i + 2,
          staff: staffData.name || 'Unknown',
          error: err.message
        });
      }
    }
    
    await client.query('COMMIT');
    
    res.json({
      message: `Successfully imported ${results.successCount} staff members`,
      successCount: results.successCount,
      failedCount: results.failedCount,
      credentials: results.credentials,
      errors: results.errors.length > 0 ? results.errors : undefined
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Bulk import error:', err);
    res.status(500).json({ error: 'Failed to import staff', details: err.message });
  } finally {
    client.release();
  }
});
