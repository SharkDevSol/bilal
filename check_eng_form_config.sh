#!/bin/bash
echo "=== Checking form_config for engG10 ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT class_name, term_number, mark_components FROM subject_engg10_schema.form_config;"

echo ""
echo "=== Checking form_config for engG11 ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT class_name, term_number, mark_components FROM subject_engg11_schema.form_config;"

echo ""
echo "=== Checking form_config for engG12 ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT class_name, term_number, mark_components FROM subject_engg12_schema.form_config;"
