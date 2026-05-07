#!/bin/bash
psql -U postgres -d school_management10 << EOF
SELECT subject_name, class_name 
FROM subjects_of_school_schema.subject_class_mappings 
WHERE class_name LIKE 'g8%' 
ORDER BY id DESC 
LIMIT 20;
EOF
