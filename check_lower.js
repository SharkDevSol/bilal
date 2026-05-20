const fs = require('fs');

const filePath = '/var/www/skoolific/iqrab3/backend/routes/markListRoutes.js';
const content = fs.readFileSync(filePath, 'utf8');

// Check for LOWER() pattern
if (content.includes('LOWER(class_name)')) {
  console.log('✓ File already has LOWER(class_name) - fix is already applied!');
} else {
  console.log('✗ File does NOT have LOWER(class_name) - needs fixing');
}

// Find the update-marks route
const lines = content.split('\n');
let inUpdateMarks = false;
lines.forEach((line, index) => {
  if (line.includes("router.put('/update-marks'")) {
    inUpdateMarks = true;
    console.log(`\nFound update-marks route at line ${index + 1}`);
  }
  if (inUpdateMarks && line.includes('form_config')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
    if (index < lines.length - 2) {
      console.log(`Line ${index + 2}: ${lines[index + 1].trim()}`);
      console.log(`Line ${index + 3}: ${lines[index + 2].trim()}`);
    }
    inUpdateMarks = false;
  }
});
