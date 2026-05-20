const fs = require('fs');

const filePath = '/var/www/skoolific/iqrab3/backend/routes/markListRoutes.js';
const content = fs.readFileSync(filePath, 'utf8');

// Find all router definitions
const lines = content.split('\n');
console.log('=== All router definitions ===');
lines.forEach((line, index) => {
  if (line.trim().startsWith('router.')) {
    console.log(`Line ${index + 1}: ${line.trim().substring(0, 80)}`);
  }
});
