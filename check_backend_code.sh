#!/bin/bash
echo "=== Checking if is_locked update is in the backend code ==="
grep -n "is_locked" /var/www/skoolific/iqrab3/backend/routes/markListRoutes.js | head -20
