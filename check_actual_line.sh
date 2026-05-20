#!/bin/bash
echo "=== Checking lines around update-marks route ==="
grep -A 20 "router.put('/update-marks'" /var/www/skoolific/iqrab3/backend/routes/markListRoutes.js | head -25
