-- Check eng subject schemas
SELECT table_schema 
FROM information_schema.tables 
WHERE table_name = 'form_config' 
AND table_schema LIKE 'subject_eng%';

-- Check what's in one of the eng form_configs
SELECT * FROM subject_engg10_schema.form_config LIMIT 5;
