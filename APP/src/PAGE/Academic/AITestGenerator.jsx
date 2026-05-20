import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiTrash2, FiEdit2, FiSave, FiRefreshCw, 
  FiCheckCircle, FiAlertCircle, FiLoader 
} from 'react-icons/fi';
import styles from './AITestGenerator.module.css';
import { useApp } from '../../context/AppContext';
import axios from 'axios';
import API_CONFIG from '../../config/api.config';

const AITestGenerator = () => {
  const { t, theme } = useApp();
  
  // Form state for exam configuration
  const [examConfig, setExamConfig] = useState({
    class: '',
    subject: '',
    term: '',
    component: '',
    language: 'English',
    difficulty: 'Medium',
    description: '',
    timeLimit: '',
    bonusQuestions: false,
    bonusCount: 0,
    bonusMarksEach: 0
  });

  // Question type distribution state
  const [questionTypes, setQuestionTypes] = useState([
    { type: 'multiple_choice', count: 0, marksEach: 0 },
    { type: 'true_false', count: 0, marksEach: 0 },
    { type: 'multiple_true_false', count: 0, marksEach: 0 },
    { type: 'matching', count: 0, marksEach: 0 },
    { type: 'numeric', count: 0, marksEach: 0 },
    { type: 'fill_blank', count: 0, marksEach: 0 },
    { type: 'short_answer', count: 0, marksEach: 0 },
    { type: 'essay', count: 0, marksEach: 0 },
    { type: 'transformation', count: 0, marksEach: 0 }
  ]);

  // Generated exam state
  const [generatedExam, setGeneratedExam] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dropdown data
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [terms, setTerms] = useState([]);
  
  // Edit mode state
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedQuestionData, setEditedQuestionData] = useState(null);

  // Manual question addition state
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualQuestion, setManualQuestion] = useState({
    type: 'multiple_choice',
    question: '',
    marks: 0,
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: ''
  });

  const languages = ['English', 'Arabic', 'Amharic', 'Oromo', 'Somali', 'French'];
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];
  const components = ['Test 1', 'Test 2', 'Final Exam', 'Mid-term', 'Quiz'];

  const questionTypeLabels = {
    multiple_choice: 'Multiple Choice',
    true_false: 'True/False',
    multiple_true_false: 'Multiple True/False',
    matching: 'Matching',
    numeric: 'Numeric Response',
    fill_blank: 'Fill in the Blank',
    short_answer: 'Short Answer',
    essay: 'Essay',
    transformation: 'Transformation/Error Correction'
  };

  // Fetch classes, subjects, and terms on mount
  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchTerms();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.baseURL}/api/classes`);
      setClasses(response.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.baseURL}/api/subjects`);
      setSubjects(response.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const fetchTerms = async () => {
    // Fetch terms from Task1 configuration
    try {
      const response = await axios.get(`${API_CONFIG.baseURL}/api/school-config/terms`);
      setTerms(response.data);
    } catch (err) {
      console.error('Error fetching terms:', err);
      // Default terms if API fails
      setTerms(['Term 1', 'Term 2', 'Term 3']);
    }
  };

  const handleConfigChange = (field, value) => {
    setExamConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionTypeChange = (index, field, value) => {
    const updated = [...questionTypes];
    updated[index][field] = parseInt(value) || 0;
    setQuestionTypes(updated);
  };

  const calculateTotalMarks = () => {
    let total = 0;
    questionTypes.forEach(qt => {
      total += qt.count * qt.marksEach;
    });
    if (examConfig.bonusQuestions) {
      total += examConfig.bonusCount * examConfig.bonusMarksEach;
    }
    return total;
  };

  const handleGenerateExam = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate configuration
      if (!examConfig.class || !examConfig.subject || !examConfig.term || !examConfig.component) {
        throw new Error('Please fill in all required fields (Class, Subject, Term, Component)');
      }

      const activeQuestionTypes = questionTypes.filter(qt => qt.count > 0);
      if (activeQuestionTypes.length === 0) {
        throw new Error('Please specify at least one question type with count > 0');
      }

      // Prepare request payload
      const payload = {
        ...examConfig,
        questionTypes: activeQuestionTypes,
        totalMarks: calculateTotalMarks()
      };

      // Call backend API to generate exam
      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/ai-tests/generate`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      setGeneratedExam(response.data.exam);
      setSuccess('Exam generated successfully! Review and approve below.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate exam');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateExam = async () => {
    setGeneratedExam(null);
    await handleGenerateExam();
  };

  const handleEditQuestion = (questionIndex) => {
    const question = generatedExam.questions[questionIndex];
    setEditingQuestion(questionIndex);
    setEditedQuestionData({ ...question });
  };

  const handleSaveEdit = () => {
    const updated = { ...generatedExam };
    updated.questions[editingQuestion] = editedQuestionData;
    setGeneratedExam(updated);
    setEditingQuestion(null);
    setEditedQuestionData(null);
    setSuccess('Question updated successfully');
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditedQuestionData(null);
  };

  const handleDeleteQuestion = (questionIndex) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updated = { ...generatedExam };
      updated.questions.splice(questionIndex, 1);
      setGeneratedExam(updated);
      setSuccess('Question deleted successfully');
    }
  };

  const handleAddManualQuestion = () => {
    if (!manualQuestion.question || manualQuestion.marks <= 0) {
      setError('Please fill in question text and marks');
      return;
    }

    const newQuestion = {
      id: generatedExam ? generatedExam.questions.length + 1 : 1,
      ...manualQuestion
    };

    if (generatedExam) {
      const updated = { ...generatedExam };
      updated.questions.push(newQuestion);
      setGeneratedExam(updated);
    } else {
      setGeneratedExam({
        title: examConfig.component + ' - ' + examConfig.subject,
        instructions: 'Answer all questions',
        totalMarks: manualQuestion.marks,
        questions: [newQuestion]
      });
    }

    // Reset manual question form
    setManualQuestion({
      type: 'multiple_choice',
      question: '',
      marks: 0,
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    });
    setShowManualAdd(false);
    setSuccess('Question added successfully');
  };

  const handleApproveAndSave = async () => {
    if (!generatedExam || generatedExam.questions.length === 0) {
      setError('No exam to save. Please generate or add questions first.');
      return;
    }

    try {
      const payload = {
        ...examConfig,
        exam: generatedExam,
        totalMarks: calculateTotalMarks()
      };

      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/ai-tests/save`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      setSuccess('Exam saved successfully! You can now publish it to students.');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setGeneratedExam(null);
        setExamConfig({
          class: '',
          subject: '',
          term: '',
          component: '',
          language: 'English',
          difficulty: 'Medium',
          description: '',
          timeLimit: '',
          bonusQuestions: false,
          bonusCount: 0,
          bonusMarksEach: 0
        });
        setQuestionTypes([
          { type: 'multiple_choice', count: 0, marksEach: 0 },
          { type: 'true_false', count: 0, marksEach: 0 },
          { type: 'multiple_true_false', count: 0, marksEach: 0 },
          { type: 'matching', count: 0, marksEach: 0 },
          { type: 'numeric', count: 0, marksEach: 0 },
          { type: 'fill_blank', count: 0, marksEach: 0 },
          { type: 'short_answer', count: 0, marksEach: 0 },
          { type: 'essay', count: 0, marksEach: 0 },
          { type: 'transformation', count: 0, marksEach: 0 }
        ]);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save exam');
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <h1 className={styles.title}>AI Test Generator</h1>
        <p className={styles.subtitle}>
          Generate exams automatically using AI or create them manually
        </p>
      </motion.div>

      {/* Alert Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.alert + ' ' + styles.alertError}
          >
            <FiAlertCircle /> {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.alert + ' ' + styles.alertSuccess}
          >
            <FiCheckCircle /> {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam Configuration Form */}
      {!generatedExam && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.configSection}
        >
          <h2 className={styles.sectionTitle}>Exam Configuration</h2>
          
          <div className={styles.formGrid}>
            {/* Class Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Class *</label>
              <select
                className={styles.select}
                value={examConfig.class}
                onChange={(e) => handleConfigChange('class', e.target.value)}
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.name}>{cls.name}</option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Subject *</label>
              <select
                className={styles.select}
                value={examConfig.subject}
                onChange={(e) => handleConfigChange('subject', e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjects.map(subj => (
                  <option key={subj.id} value={subj.name}>{subj.name}</option>
                ))}
              </select>
            </div>

            {/* Term Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Term *</label>
              <select
                className={styles.select}
                value={examConfig.term}
                onChange={(e) => handleConfigChange('term', e.target.value)}
              >
                <option value="">Select Term</option>
                {terms.map((term, idx) => (
                  <option key={idx} value={term}>{term}</option>
                ))}
              </select>
            </div>

            {/* Component Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Component *</label>
              <select
                className={styles.select}
                value={examConfig.component}
                onChange={(e) => handleConfigChange('component', e.target.value)}
              >
                <option value="">Select Component</option>
                {components.map((comp, idx) => (
                  <option key={idx} value={comp}>{comp}</option>
                ))}
              </select>
            </div>

            {/* Language Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Language</label>
              <select
                className={styles.select}
                value={examConfig.language}
                onChange={(e) => handleConfigChange('language', e.target.value)}
              >
                {languages.map((lang, idx) => (
                  <option key={idx} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Level */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Difficulty Level</label>
              <select
                className={styles.select}
                value={examConfig.difficulty}
                onChange={(e) => handleConfigChange('difficulty', e.target.value)}
              >
                {difficultyLevels.map((level, idx) => (
                  <option key={idx} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Time Limit */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Time Limit (minutes)</label>
              <input
                type="number"
                className={styles.input}
                value={examConfig.timeLimit}
                onChange={(e) => handleConfigChange('timeLimit', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Exam Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Exam Description / Context</label>
            <textarea
              className={styles.textarea}
              value={examConfig.description}
              onChange={(e) => handleConfigChange('description', e.target.value)}
              placeholder="Provide context or specific topics to focus on..."
              rows={4}
            />
          </div>

          {/* Bonus Questions Configuration */}
          <div className={styles.bonusSection}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={examConfig.bonusQuestions}
                onChange={(e) => handleConfigChange('bonusQuestions', e.target.checked)}
              />
              <span>Include Bonus Questions</span>
            </label>

            {examConfig.bonusQuestions && (
              <div className={styles.bonusConfig}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Bonus Question Count</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={examConfig.bonusCount}
                    onChange={(e) => handleConfigChange('bonusCount', e.target.value)}
                    min="0"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Marks Each</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={examConfig.bonusMarksEach}
                    onChange={(e) => handleConfigChange('bonusMarksEach', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Question Type Distribution */}
          <h2 className={styles.sectionTitle}>Question Type Distribution</h2>
          <div className={styles.questionTypesGrid}>
            {questionTypes.map((qt, index) => (
              <div key={qt.type} className={styles.questionTypeCard}>
                <h3 className={styles.questionTypeTitle}>
                  {questionTypeLabels[qt.type]}
                </h3>
                <div className={styles.questionTypeInputs}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Count</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={qt.count}
                      onChange={(e) => handleQuestionTypeChange(index, 'count', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Marks Each</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={qt.marksEach}
                      onChange={(e) => handleQuestionTypeChange(index, 'marksEach', e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Marks Display */}
          <div className={styles.totalMarks}>
            <strong>Total Marks:</strong> {calculateTotalMarks()}
          </div>

          {/* Generate Button */}
          <div className={styles.actionButtons}>
            <motion.button
              className={styles.generateBtn}
              onClick={handleGenerateExam}
              disabled={isGenerating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? (
                <>
                  <FiLoader className={styles.spinning} /> Generating...
                </>
              ) : (
                <>
                  <FiRefreshCw /> Generate Exam with AI
                </>
              )}
            </motion.button>

            <motion.button
              className={styles.manualBtn}
              onClick={() => setShowManualAdd(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus /> Add Question Manually
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Exam Preview */}
      {generatedExam && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.previewSection}
        >
          <div className={styles.previewHeader}>
            <h2 className={styles.sectionTitle}>Exam Preview</h2>
            <div className={styles.previewActions}>
              <motion.button
                className={styles.regenerateBtn}
                onClick={handleRegenerateExam}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiRefreshCw /> Regenerate
              </motion.button>
              <motion.button
                className={styles.addQuestionBtn}
                onClick={() => setShowManualAdd(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus /> Add Question
              </motion.button>
              <motion.button
                className={styles.approveBtn}
                onClick={handleApproveAndSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiCheckCircle /> Approve & Save
              </motion.button>
            </div>
          </div>

          <div className={styles.examInfo}>
            <h3>{generatedExam.title}</h3>
            <p>{generatedExam.instructions}</p>
            <p><strong>Total Marks:</strong> {generatedExam.totalMarks || calculateTotalMarks()}</p>
          </div>

          <div className={styles.questionsList}>
            {generatedExam.questions.map((question, index) => (
              <motion.div
                key={index}
                className={styles.questionCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {editingQuestion === index ? (
                  // Edit Mode
                  <div className={styles.editMode}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Question</label>
                      <textarea
                        className={styles.textarea}
                        value={editedQuestionData.question}
                        onChange={(e) => setEditedQuestionData({
                          ...editedQuestionData,
                          question: e.target.value
                        })}
                        rows={3}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Marks</label>
                      <input
                        type="number"
                        className={styles.input}
                        value={editedQuestionData.marks}
                        onChange={(e) => setEditedQuestionData({
                          ...editedQuestionData,
                          marks: parseInt(e.target.value)
                        })}
                      />
                    </div>
                    {editedQuestionData.options && (
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Options</label>
                        {editedQuestionData.options.map((opt, optIdx) => (
                          <input
                            key={optIdx}
                            type="text"
                            className={styles.input}
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...editedQuestionData.options];
                              newOptions[optIdx] = e.target.value;
                              setEditedQuestionData({
                                ...editedQuestionData,
                                options: newOptions
                              });
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <div className={styles.editActions}>
                      <button className={styles.saveEditBtn} onClick={handleSaveEdit}>
                        <FiSave /> Save
                      </button>
                      <button className={styles.cancelEditBtn} onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className={styles.questionHeader}>
                      <span className={styles.questionNumber}>Q{index + 1}</span>
                      <span className={styles.questionType}>{questionTypeLabels[question.type]}</span>
                      <span className={styles.questionMarks}>{question.marks} marks</span>
                      <div className={styles.questionActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditQuestion(index)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteQuestion(index)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <div className={styles.questionContent}>
                      <p className={styles.questionText}>{question.question}</p>
                      {question.options && (
                        <ul className={styles.optionsList}>
                          {question.options.map((opt, optIdx) => (
                            <li key={optIdx}>{opt}</li>
                          ))}
                        </ul>
                      )}
                      <p className={styles.correctAnswer}>
                        <strong>Correct Answer:</strong> {
                          Array.isArray(question.correctAnswer) 
                            ? question.correctAnswer.join(', ') 
                            : question.correctAnswer
                        }
                      </p>
                      {question.explanation && (
                        <p className={styles.explanation}>
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Manual Question Addition Modal */}
      <AnimatePresence>
        {showManualAdd && (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h2 className={styles.modalTitle}>Add Question Manually</h2>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Question Type</label>
                <select
                  className={styles.select}
                  value={manualQuestion.type}
                  onChange={(e) => setManualQuestion({
                    ...manualQuestion,
                    type: e.target.value
                  })}
                >
                  {Object.keys(questionTypeLabels).map(type => (
                    <option key={type} value={type}>{questionTypeLabels[type]}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Question Text</label>
                <textarea
                  className={styles.textarea}
                  value={manualQuestion.question}
                  onChange={(e) => setManualQuestion({
                    ...manualQuestion,
                    question: e.target.value
                  })}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Marks</label>
                <input
                  type="number"
                  className={styles.input}
                  value={manualQuestion.marks}
                  onChange={(e) => setManualQuestion({
                    ...manualQuestion,
                    marks: parseInt(e.target.value) || 0
                  })}
                />
              </div>

              {['multiple_choice', 'matching'].includes(manualQuestion.type) && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Options (one per line)</label>
                  {manualQuestion.options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      className={styles.input}
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...manualQuestion.options];
                        newOptions[idx] = e.target.value;
                        setManualQuestion({
                          ...manualQuestion,
                          options: newOptions
                        });
                      }}
                      placeholder={`Option ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>Correct Answer</label>
                <input
                  type="text"
                  className={styles.input}
                  value={manualQuestion.correctAnswer}
                  onChange={(e) => setManualQuestion({
                    ...manualQuestion,
                    correctAnswer: e.target.value
                  })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Explanation (optional)</label>
                <textarea
                  className={styles.textarea}
                  value={manualQuestion.explanation}
                  onChange={(e) => setManualQuestion({
                    ...manualQuestion,
                    explanation: e.target.value
                  })}
                  rows={2}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  className={styles.addBtn}
                  onClick={handleAddManualQuestion}
                >
                  <FiPlus /> Add Question
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowManualAdd(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITestGenerator;
