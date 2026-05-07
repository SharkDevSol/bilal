const fs = require('fs');

const filePath = '/var/www/skoolific/iqrab3/backend/routes/markListRoutes.js';
const content = fs.readFileSync(filePath, 'utf8');

// Find lines containing "form_config"
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('form_config') && line.includes('WHERE')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
