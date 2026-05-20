-- Check for form_config tables
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name = 'form_config' 
AND table_schema LIKE 'subject_%' 
LIMIT 10;
