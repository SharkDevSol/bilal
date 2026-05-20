#!/bin/bash
export PGPASSWORD='Bilal2026SchoolSecurePass'

echo "=== Adding is_locked column to all mark list tables ==="

# Get all subject schemas
SCHEMAS=$(psql -U postgres -d school_management2 -t -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'subject_%_schema'")

for SCHEMA in $SCHEMAS; do
  echo ""
  echo "Processing schema: $SCHEMA"
  
  # Get all mark list tables in this schema
  TABLES=$(psql -U postgres -d school_management2 -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = '$SCHEMA' AND table_name LIKE '%_term_%'")
  
  for TABLE in $TABLES; do
    # Check if is_locked column exists
    COLUMN_EXISTS=$(psql -U postgres -d school_management2 -t -c "SELECT column_name FROM information_schema.columns WHERE table_schema = '$SCHEMA' AND table_name = '$TABLE' AND column_name = 'is_locked'")
    
    if [ -z "$COLUMN_EXISTS" ]; then
      # Add is_locked column
      psql -U postgres -d school_management2 -c "ALTER TABLE $SCHEMA.$TABLE ADD COLUMN is_locked BOOLEAN DEFAULT FALSE"
      echo "  ✓ Added is_locked column to $TABLE"
    else
      echo "  - is_locked column already exists in $TABLE"
    fi
  done
done

echo ""
echo "✅ Migration completed!"
