#!/bin/bash

# Extract lines before the endpoint (1-278)
sed -n '1,278p' /var/www/almarkaz.skoolific.com/backend/routes/markListRoutes.js > /tmp/markListRoutes_new.js

# Add a blank line
echo "" >> /tmp/markListRoutes_new.js

# Append the new endpoint
cat /tmp/fix_endpoint_dual_save.js >> /tmp/markListRoutes_new.js

# Add a blank line
echo "" >> /tmp/markListRoutes_new.js

# Extract lines after the endpoint (362 to end)
sed -n '362,$p' /var/www/almarkaz.skoolific.com/backend/routes/markListRoutes.js >> /tmp/markListRoutes_new.js

# Replace the original file
mv /tmp/markListRoutes_new.js /var/www/almarkaz.skoolific.com/backend/routes/markListRoutes.js

echo "Endpoint replaced successfully"
