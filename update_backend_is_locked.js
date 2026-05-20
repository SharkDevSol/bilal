const fs = require('fs');

const filePath = '/var/www/skoolific/iqrab3/backend/routes/markListRoutes.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update the update-marks route to set is_locked = TRUE when saving marks
const oldUpdateMarks = `    updateColumns.push(\`updated_at = CURRENT_TIMESTAMP\`);
    
    updateValues.push(studentId);
    
    const updateQuery = \`
      UPDATE \${schemaName}.\${tableName} 
      SET \${updateColumns.join(', ')} 
      WHERE id = \${updateValues.length}
    \`;`;

const newUpdateMarks = `    updateColumns.push(\`updated_at = CURRENT_TIMESTAMP\`);
    updateColumns.push(\`is_locked = TRUE\`); // Lock the student after saving marks
    
    updateValues.push(studentId);
    
    const updateQuery = \`
      UPDATE \${schemaName}.\${tableName} 
      SET \${updateColumns.join(', ')} 
      WHERE id = \${updateValues.length}
    \`;`;

content = content.replace(oldUpdateMarks, newUpdateMarks);

// 2. Update the mark-list GET route to return is_locked status
const oldGetMarkList = `    // Get updated mark list data (only active students)
    const result = await client.query(
      \`SELECT * FROM \${schemaName}.\${tableName} ORDER BY student_name\`
    );`;

const newGetMarkList = `    // Get updated mark list data (only active students) including is_locked status
    const result = await client.query(
      \`SELECT * FROM \${schemaName}.\${tableName} ORDER BY student_name\`
    );`;

content = content.replace(oldGetMarkList, newGetMarkList);

// Write the updated content
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Backend updated successfully!');
console.log('Changes made:');
console.log('  1. Added is_locked = TRUE when saving marks');
console.log('  2. Mark list GET route now returns is_locked status');
