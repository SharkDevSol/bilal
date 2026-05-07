-- Create the class_subjects table if it doesn't exist
CREATE TABLE IF NOT EXISTS school_schema_points.class_subjects (
  id SERIAL PRIMARY KEY,
  class_name VARCHAR(50) NOT NULL,
  subject_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_name, subject_name)
);
