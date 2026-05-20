#!/bin/bash
# Fix the form_config query in update-marks route (around line 644)
# Change: WHERE class_name = $1 AND term_number = $2
# To: WHERE LOWER(class_name) = LOWER($1) AND term_number = $2

cd /var/www/skoolific/iqrab3/backend/routes

# Create backup
cp markListRoutes.js markListRoutes.js.before_fix

# Fix the line - use perl for better regex support
perl -i -pe 's/WHERE class_name = \$1 AND term_number = \$2/WHERE LOWER(class_name) = LOWER(\$1) AND term_number = \$2/g' markListRoutes.js

echo "Fix applied. Checking changes:"
diff markListRoutes.js.before_fix markListRoutes.js | head -20
