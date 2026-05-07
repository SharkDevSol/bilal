#!/bin/bash
export PGPASSWORD='Bilal2026SchoolSecurePass'

echo "=== Before saving marks ==="
psql -U postgres -d school_management2 -c "SELECT id, student_name, practical_1, is_locked FROM subject_engg10_schema.grade10_term_1 WHERE id = 2;"

echo ""
echo "=== Simulating mark save (setting practical_1 = 3 and is_locked = TRUE) ==="
psql -U postgres -d school_management2 -c "UPDATE subject_engg10_schema.grade10_term_1 SET practical_1 = 3.00, is_locked = TRUE WHERE id = 2;"

echo ""
echo "=== After saving marks ==="
psql -U postgres -d school_management2 -c "SELECT id, student_name, practical_1, is_locked FROM subject_engg10_schema.grade10_term_1 WHERE id = 2;"

echo ""
echo "✅ Test complete! Student ID 2 should now be locked."
