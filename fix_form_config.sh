#!/bin/bash
# Fix the form_config query to use case-insensitive comparison
sed -i '645s/WHERE class_name = \$1/WHERE LOWER(class_name) = LOWER(\$1)/' /var/www/skoolific/iqrab3/backend/routes/markListRoutes.js

# Verify the change
echo "=== Line 645 after fix ==="
sed -n '645p' /var/www/skoolific/iqrab3/backend/routes/markListRoutes.js
