#!/bin/bash
echo "=== Finding tables with teacher assignments ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT table_schema, table_name FROM information_schema.tables WHERE table_name LIKE '%teacher%' OR table_name LIKE '%assignment%';"

echo ""
echo "=== Checking mark_list_assignments table ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT * FROM subjects_of_school_schema.mark_list_assignments WHERE teacher_name = 'abebe shibru' LIMIT 5;"
