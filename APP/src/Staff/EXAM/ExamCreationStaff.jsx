import React from 'react';
import AITestGenerator from '../../PAGE/Academic/AITestGenerator';
import styles from './ExamCreationStaff.module.css';

/**
 * Exam Creation component for Staff app
 * Wraps the AITestGenerator component with Staff app styling
 */
const ExamCreationStaff = () => {
  return (
    <div className={styles.examCreationContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create Exam</h1>
        <p className={styles.subtitle}>
          Generate AI-powered exams or create them manually for your classes
        </p>
      </div>
      
      <div className={styles.content}>
        <AITestGenerator />
      </div>
    </div>
  );
};

export default ExamCreationStaff;