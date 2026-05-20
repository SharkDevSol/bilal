#!/bin/bash
echo "=== Checking teacher assignments ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT teacher_name, subject_name, class_name FROM subjects_of_school_schema.subject_class_mappings WHERE teacher_name = 'abebe shibru';"
