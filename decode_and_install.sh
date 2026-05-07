#!/bin/bash
# Decode the base64 file and install it
base64 -d /tmp/markListRoutes_base64.txt > /var/www/skoolific/iqrab3/backend/routes/markListRoutes.js

# Check if decode was successful
if [ $? -eq 0 ]; then
  echo "File decoded and installed successfully"
  echo "First 5 lines:"
  head -5 /var/www/skoolific/iqrab3/backend/routes/markListRoutes.js
else
  echo "Error decoding file"
  exit 1
fi
