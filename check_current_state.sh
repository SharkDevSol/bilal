#!/bin/bash
export PGPASSWORD='Bilal2026SchoolSecurePass'

echo "=== Current state of students in engG10 GRADE10 Term 1 ==="
psql -U postgres -d school_management2 -c "SELECT id, student_name, practical_1, total, is_locked FROM subject_engg10_schema.grade10_term_1 WHERE practical_1 > 0 OR is_locked = TRUE ORDER BY id;"

echo ""
echo "=== Checking if any students are locked ==="
psql -U postgres -d school_management2 -c "SELECT COUNT(*) as locked_students FROM subject_engg10_schema.grade10_term_1 WHERE is_locked = TRUE;"
