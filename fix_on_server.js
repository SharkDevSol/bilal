const fs = require('fs');

const filePath = '/var/www/skoolific/iqrab3/backend/routes/markListRoutes.js';

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Replace all occurrences of the pattern
const oldPattern = /WHERE class_name = \$1 AND term_number = \$2/g;
const newPattern = 'WHERE LOWER(class_name) = LOWER($1) AND term_number = $2';

const newContent = content.replace(oldPattern, newPattern);

// Write back
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('File fixed successfully!');
console.log('Replacements made:', (content.match(oldPattern) || []).length);
