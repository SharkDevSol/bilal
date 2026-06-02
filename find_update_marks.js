const fs = require('fs');

const filePath = '/var/www/skoolific/iqrab3/backend/routes/markListRoutes.js';
const content = fs.readFileSync(filePath, 'utf8');

// Find all occurrences of "update-marks"
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('update-marks') || line.includes('update marks')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});

console.log('\n=== Searching for form_config queries ===');
lines.forEach((line, index) => {
  if (line.includes('form_config') && line.includes('SELECT')) {
    console.log(`\nLine ${index + 1}:`);
    for (let i = Math.max(0, index - 2); i < Math.min(lines.length, index + 3); i++) {
      console.log(`  ${i + 1}: ${lines[i]}`);
    }
  }
});
