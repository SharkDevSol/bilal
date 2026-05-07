#!/bin/bash
export PGPASSWORD='Bilal2026SchoolSecurePass'

echo "=== Checking locked status for student 'abdikarim mahamed hode' ==="
echo ""
echo "engG10 - GRADE10 - Term 1:"
psql -U postgres -d school_management2 -c "SELECT id, student_name, practical_1, is_locked FROM subject_engg10_schema.grade10_term_1 WHERE student_name = 'abdikarim mahamed hode';"
