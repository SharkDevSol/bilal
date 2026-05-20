#!/bin/bash
cd /var/www/skoolific/iqrab3/backend/routes

# Create backup
cp markListRoutes.js markListRoutes.js.before_is_locked

# Use sed to add is_locked = TRUE to the update query
# Find the line with "updated_at = CURRENT_TIMESTAMP" and add is_locked after it
sed -i "/updateColumns.push(\`updated_at = CURRENT_TIMESTAMP\`);/a\    updateColumns.push(\`is_locked = TRUE\`); // Lock the student after saving marks" markListRoutes.js

echo "✅ Backend updated!"
echo ""
echo "Verifying the change:"
grep -A 2 "updated_at = CURRENT_TIMESTAMP" markListRoutes.js | head -6
