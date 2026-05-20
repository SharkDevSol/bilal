#!/bin/bash
echo "=== Checking available schemas ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'subject_%';"

echo ""
echo "=== Checking tables in subject schemas ==="
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management2 -c "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema LIKE 'subject_%' AND table_name = 'form_config';"
