#!/bin/bash
grep -n 'WHERE class_name = $1 AND term_number = $2' /var/www/skoolific/iqrab3/backend/routes/markListRoutes.js
