#!/bin/bash
# Remove old G8 classes from the system

psql -U postgres -d school_management10 << EOF

-- Remove mappings for old G8 classes
DELETE FROM subjects_of_school_schema.subject_class_mappings 
WHERE class_name IN ('g8a', 'g8b', 'G8A', 'G8B', 'G8A_backup', 'G8B_backup');

-- Drop the old class tables
DROP TABLE IF EXISTS classes_schema.g8a CASCADE;
DROP TABLE IF EXISTS classes_schema.g8b CASCADE;
DROP TABLE IF EXISTS classes_schema."G8A" CASCADE;
DROP TABLE IF EXISTS classes_schema."G8B" CASCADE;
DROP TABLE IF EXISTS classes_schema."G8A_backup" CASCADE;
DROP TABLE IF EXISTS classes_schema."G8B_backup" CASCADE;

-- Show remaining classes
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'classes_schema' 
ORDER BY table_name;

EOF
