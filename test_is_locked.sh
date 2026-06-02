#!/bin/bash
echo "=== Testing is_locked field ==="
echo ""
echo "1. Checking a sample mark list table:"
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT id, student_name, is_locked FROM subject_engg10_schema.grade10_term_1 LIMIT 5;"

echo ""
echo "2. Checking if any students are locked:"
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT COUNT(*) as locked_count FROM subject_engg10_schema.grade10_term_1 WHERE is_locked = TRUE;"
