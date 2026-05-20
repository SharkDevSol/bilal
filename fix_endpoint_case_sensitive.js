router.post('/map-subjects-classes', async (req, res) => {
  const { mappings } = req.body; // Array of { className, subjectName }

  if (!mappings || !Array.isArray(mappings)) {
    return res.status(400).json({ error: 'Mappings array is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Ensure both tables exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects_of_school_schema.subject_class_mappings (
        id SERIAL PRIMARY KEY,
        subject_name VARCHAR(100) NOT NULL,
        class_name VARCHAR(50) NOT NULL,
        subject_class VARCHAR(150) GENERATED ALWAYS AS (subject_name || ' Class ' || class_name) STORED,        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(subject_name, class_name)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS school_schema_points.class_subjects (
        id SERIAL PRIMARY KEY,
        class_name VARCHAR(50) NOT NULL,
        subject_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(class_name, subject_name)
      )
    `);

    // Delete only the mappings that are NOT in the new list (user unchecked them)
    // First get all existing mappings from both tables
    const existingResult1 = await client.query(
      'SELECT subject_name, class_name FROM subjects_of_school_schema.subject_class_mappings'
    );
    const existingResult2 = await client.query(
      'SELECT subject_name, class_name FROM school_schema_points.class_subjects'
    );
    
    const newSet = new Set(mappings.map(m => `${m.subjectName}||${m.className}`));
    
    // Delete from first table
    for (const row of existingResult1.rows) {
      const key = `${row.subject_name}||${row.class_name}`;
      if (!newSet.has(key)) {
        await client.query(
          'DELETE FROM subjects_of_school_schema.subject_class_mappings WHERE subject_name=$1 AND class_name=$2',
          [row.subject_name, row.class_name]
        );
      }
    }
    
    // Delete from second table
    for (const row of existingResult2.rows) {
      const key = `${row.subject_name}||${row.class_name}`;
      if (!newSet.has(key)) {
        await client.query(
          'DELETE FROM school_schema_points.class_subjects WHERE subject_name=$1 AND class_name=$2',
          [row.subject_name, row.class_name]
        );
      }
    }

    // Validate and insert new mappings into BOTH tables
    for (const mapping of mappings) {
      if (!mapping.className || !mapping.subjectName) {
        continue;
      }

      // Validate class exists in classes_schema (case-sensitive)
      const classResult = await client.query(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'classes_schema' AND table_name = $1`,
        [mapping.className]
      );
      if (classResult.rows.length === 0) {
        console.warn(`Class ${mapping.className} not found in classes_schema, skipping`);
        continue; // Skip instead of throwing error
      }

      // Validate subject exists
      const subjectResult = await client.query(
        'SELECT subject_name FROM subjects_of_school_schema.subjects WHERE subject_name = $1',
        [mapping.subjectName]
      );
      if (subjectResult.rows.length === 0) {
        console.warn(`Subject ${mapping.subjectName} not found, skipping`);
        continue; // Skip instead of throwing error
      }

      // Insert mapping into FIRST table (subjects_of_school_schema.subject_class_mappings)
      await client.query(
        'INSERT INTO subjects_of_school_schema.subject_class_mappings (class_name, subject_name) VALUES ($1, $2) ON CONFLICT (subject_name, class_name) DO NOTHING',
        [mapping.className, mapping.subjectName]
      );

      // Insert mapping into SECOND table (school_schema_points.class_subjects)
      await client.query(
        'INSERT INTO school_schema_points.class_subjects (class_name, subject_name) VALUES ($1, $2) ON CONFLICT (class_name, subject_name) DO NOTHING',
        [mapping.className, mapping.subjectName]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Subject-class mappings saved successfully to both tables' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error mapping subjects to classes:', error);
    res.status(500).json({ error: 'Failed to map subjects to classes', details: error.message });
  } finally {
    client.release();
  }
});
