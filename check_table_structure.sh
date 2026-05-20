#!/bin/bash
echo "=== Checking subject_class_mappings structure ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'subjects_of_school_schema' AND table_name = 'subject_class_mappings';"

echo ""
echo "=== Sample data from subject_class_mappings ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT * FROM subjects_of_school_schema.subject_class_mappings LIMIT 5;"
