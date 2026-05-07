#!/bin/bash
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT class_name, term_number FROM subject_english_schema.form_config;"
