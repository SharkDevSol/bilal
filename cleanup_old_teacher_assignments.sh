#!/bin/bash
# Clean up old teacher assignments for deleted G8A/G8B classes

psql -U postgres -d school_management10 << EOF

-- Delete teacher assignments for old G8 classes
DELETE FROM subjects_of_school_schema.teacher_subject_assignments 
WHERE subject_class LIKE '%G8A%' OR subject_class LIKE '%G8B%' 
   OR subject_class LIKE '%g8a%' OR subject_class LIKE '%g8b%';

-- Show remaining assignments
SELECT COUNT(*) as remaining_assignments 
FROM subjects_of_school_schema.teacher_subject_assignments;

EOF
