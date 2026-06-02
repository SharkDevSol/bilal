#!/bin/bash
echo "=== Checking teachers_subjects table structure ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'subjects_of_school_schema' AND table_name = 'teachers_subjects';"

echo ""
echo "=== Checking teacher abebe shibru assignments ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT * FROM subjects_of_school_schema.teachers_subjects WHERE teacher_name = 'abebe shibru';"
