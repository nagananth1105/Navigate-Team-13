import AssignmentIcon from '@mui/icons-material/Assignment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Alert, Box, Button, Card, CardContent, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, List, ListItem, Paper, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios'; // Import axios instead of using fetch
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook
import AssessmentPatternSelector from './AssessmentPatternSelector';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios instance with base URL and default timeout
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000 // 30 second timeout
});

// Create axios interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const steps = [
  'Upload Syllabus',
  'Select Pattern & Generate Quiz',
  'Customize Questions', 
  'Settings & Review'
];

const SyllabusUpload = () => {
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file');
  const [syllabusAnalysis, setSyllabusAnalysis] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [generatedAssessment, setGeneratedAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [generatingAssessment, setGeneratingAssessment] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [apiAccessible, setApiAccessible] = useState(false);
  const [syllabusTopics, setSyllabusTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const { currentUser, token } = useAuth(); // Get auth context
  const navigate = useNavigate(); // Initialize navigate hook

  const patternSectionRef = useRef(null);

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await api.get('/health');
        if (response.status === 200) {
          setApiAccessible(true);
        } else {
          setApiAccessible(false);
        }
      } catch (error) {
        console.error('Error checking API connection:', error);
        setApiAccessible(false);
      }
    };

    checkApiConnection();
  }, []);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);

      if (selectedFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTextContent(e.target.result);
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  const handleTextChange = (event) => {
    setTextContent(event.target.value);
    setError(null);
  };

  const handleAnalyzeSyllabus = async () => {
    try {
      setError(null);
      setAnalyzing(true);

      let syllabusContent = '';

      if (uploadMethod === 'file' && file) {
        if (file.type === 'text/plain') {
          syllabusContent = textContent;
        } else {
          const formData = new FormData();
          formData.append('file', file);
          
          const uploadResponse = await api.post('/assessment/upload-syllabus', formData);
          
          if (uploadResponse.status !== 200) {
            throw new Error(`File upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
          }
          
          const uploadData = uploadResponse.data;
          syllabusContent = uploadData.syllabusContent || '';
        }
      } else if (uploadMethod === 'text' && textContent) {
        syllabusContent = textContent;
      } else {
        throw new Error('Please upload a file or enter text content');
      }

      if (!syllabusContent || syllabusContent.trim().length < 10) {
        console.error('Syllabus content too short:', syllabusContent);
        throw new Error('The syllabus content appears to be too short or empty. Please ensure you have uploaded a complete syllabus document.');
      }

      console.log(`Analyzing syllabus. Content length: ${syllabusContent.length} characters`);
      
      const analysisResponse = await api.post('/assessment/analyze-syllabus', { syllabusContent });
      
      if (analysisResponse.status !== 200) {
        throw new Error(`API error: ${analysisResponse.status} ${analysisResponse.statusText}`);
      }
      
      const analysisData = analysisResponse.data;
      
      if (!analysisData.success || !analysisData.syllabusAnalysis) {
        throw new Error(analysisData.message || 'Failed to analyze syllabus');
      }
      
      setSyllabusAnalysis(analysisData.syllabusAnalysis);
      
      if (analysisData.syllabusTopics && Array.isArray(analysisData.syllabusTopics)) {
        setSyllabusTopics(analysisData.syllabusTopics);
        setSelectedTopics(analysisData.syllabusTopics);
      } else {
        const fallbackTopics = analysisData.syllabusAnalysis.learningOutcomes?.keyTopics || [];
        setSyllabusTopics(fallbackTopics);
        setSelectedTopics(fallbackTopics);
      }
      
      setSuccess('Syllabus successfully analyzed! Proceeding to pattern selection.');
      
      setActiveStep(1);
    } catch (err) {
      console.error('Error analyzing syllabus:', err);
      
      if (err.message.includes('too short') || err.message.includes('empty')) {
        setError('The syllabus content is too short. Please upload a complete syllabus document with sufficient content for analysis.');
      } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Authentication error. Please log in again to continue.');
      } else {
        setError(err.message || 'Error analyzing syllabus. Please try again.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateAssessment = async () => {
    if (!selectedPattern) {
      setError('Please select an assessment pattern first');
      return;
    }

    try {
      setError(null);
      setGeneratingAssessment(true);

      console.log("Generating assessment with pattern using Gemini API:", selectedPattern.name);
      
      const response = await api.post('/assessment/generate-questions', {
        syllabusAnalysis: syllabusAnalysis,
        pattern: {
          ...selectedPattern,
          topicFocus: selectedTopics,
          modelName: process.env.REACT_APP_GEMINI_MODEL || 'gemini-1.5-flash'
        }
      });

      if (response.status !== 200) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = response.data;
      
      if (!data.success || !data.assessment) {
        throw new Error(data.message || 'Failed to generate assessment');
      }
      
      setGeneratedAssessment(data.assessment);
      setSuccess('Assessment successfully generated!');
      setActiveStep(2);
    } catch (err) {
      console.error('Error generating assessment:', err);
      setError(err.message || 'Error generating assessment. Please try again.');
    } finally {
      setGeneratingAssessment(false);
    }
  };

  useEffect(() => {
    if (activeStep === 1 && !syllabusAnalysis && (file || textContent)) {
      handleAnalyzeSyllabus();
    }
  }, [activeStep, syllabusAnalysis]);

  const handleBackToUpload = () => {
    setActiveStep(0);
  };
  
  const handleOpenTopicDialog = () => {
    setTopicDialogOpen(true);
  };
  
  const handleCloseTopicDialog = () => {
    setTopicDialogOpen(false);
  };
  
  const handleToggleTopic = (topic) => {
    setSelectedTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        return [...prev, topic];
      }
    });
  };
  
  const handleSelectAllTopics = () => {
    setSelectedTopics([...syllabusTopics]);
  };
  
  const handleDeselectAllTopics = () => {
    setSelectedTopics([]);
  };
  
  const renderTopicSelector = () => (
    <Box mt={2} mb={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Selected Topics ({selectedTopics.length}/{syllabusTopics.length})</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleOpenTopicDialog}
        >
          Manage Topics
        </Button>
      </Box>
      
      <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
        {selectedTopics.map((topic, index) => (
          <Chip 
            key={index} 
            label={topic} 
            color="primary" 
            variant="outlined" 
          />
        ))}
        {selectedTopics.length === 0 && (
          <Typography color="text.secondary" variant="body2">No topics selected. Click "Manage Topics" to select topics for your assessment.</Typography>
        )}
      </Box>
      
      <Dialog open={topicDialogOpen} onClose={handleCloseTopicDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Select Topics for Assessment</Typography>
          <Typography variant="body2" color="text.secondary">
            Choose which topics to include in your assessment
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box mb={2} display="flex" justifyContent="space-between">
            <Button size="small" onClick={handleSelectAllTopics}>Select All</Button>
            <Button size="small" onClick={handleDeselectAllTopics}>Deselect All</Button>
          </Box>
          <List sx={{ pt: 0 }}>
            {syllabusTopics.map((topic, index) => (
              <ListItem key={index} disablePadding>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={selectedTopics.includes(topic)}
                      onChange={() => handleToggleTopic(topic)}
                    />
                  }
                  label={topic}
                  sx={{ width: '100%', py: 0.5 }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTopicDialog} color="primary">Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderUploadSyllabusStep = () => (
    <Box>
      <Typography variant="body1" paragraph>
        Upload your course syllabus to move to the next step where you can select a pattern and generate assessment questions.
      </Typography>

      <Box mb={3}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Button
            variant={uploadMethod === 'file' ? 'contained' : 'outlined'}
            onClick={() => setUploadMethod('file')}
            sx={{ mr: 1 }}
          >
            File Upload
          </Button>
          <Button
            variant={uploadMethod === 'text' ? 'contained' : 'outlined'}
            onClick={() => setUploadMethod('text')}
          >
            Enter Text
          </Button>
        </Box>

        {uploadMethod === 'file' ? (
          <Box sx={{ mb: 2 }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mb: 1 }}
            >
              Upload Syllabus
              <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {file.name}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Supported formats: PDF, DOC, DOCX, TXT
            </Typography>
          </Box>
        ) : (
          <TextField
            multiline
            rows={6}
            fullWidth
            placeholder="Paste syllabus content here..."
            value={textContent}
            onChange={handleTextChange}
            sx={{ mb: 2 }}
            variant="outlined"
          />
        )}
      </Box>

      {(!file && uploadMethod === 'file') && (
        <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Sample Content (for testing):
          </Typography>
          <Box sx={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.75rem' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              Unit 1: Introduction to Python Programming
              Unit 2: Variables, Data Types, and Operators
              Unit 3: Control Flow and Looping Statements
              Unit 4: Functions and Modular Programming
              Unit 5: Data Structures and String Manipulation
            </pre>
          </Box>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setActiveStep(1)}
          disabled={(uploadMethod === 'file' && !file) || (uploadMethod === 'text' && !textContent)}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );

  const renderPatternSelectionStep = () => (
    <Box>
      <Typography variant="body1" paragraph>
        Select an assessment pattern or create a custom pattern. The selected pattern will determine the structure and types of questions generated.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {syllabusTopics.length > 0 && renderTopicSelector()}

      <Box ref={patternSectionRef} mb={3}>
        <AssessmentPatternSelector
          courseId={null}
          syllabusAnalysis={syllabusAnalysis}
          onPatternSelect={setSelectedPattern}
          onCustomPatternChange={() => {}}
          selectedPattern={selectedPattern}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBackToUpload}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateAssessment}
          disabled={!selectedPattern || generatingAssessment}
        >
          {generatingAssessment ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Generating...
            </>
          ) : (
            'Generate Assessment'
          )}
        </Button>
      </Box>
    </Box>
  );

  const renderQuestionsCustomizationStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Assessment Preview
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {generatedAssessment ? (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {generatedAssessment.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {generatedAssessment.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={`Total: ${generatedAssessment.totalPoints} points`} />
                <Chip label={`Time: ${generatedAssessment.timeLimit} minutes`} />
                <Chip label={`Questions: ${generatedAssessment.questions?.length || 0}`} />
                <Chip 
                  label={`Generated by: ${generatedAssessment.generatedBy || 'GPT-2'}`} 
                  color="secondary" 
                />
              </Box>
            </CardContent>
          </Card>

          <Typography variant="h6" gutterBottom>
            Generated Questions
          </Typography>

          {generatedAssessment.questions?.map((question, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Question {index + 1}: {question.questionType || question.type}
                  </Typography>
                  <Chip 
                    size="small" 
                    label={`${question.points || 0} points`} 
                    color="primary" 
                    variant="outlined" 
                  />
                </Box>
                <Typography variant="body1" paragraph>
                  {question.question}
                </Typography>

                {(question.options && question.options.length > 0) && (
                  <Box sx={{ ml: 2 }}>
                    {question.options.map((option, optIndex) => (
                      <Typography 
                        key={optIndex} 
                        variant="body2" 
                        sx={{ 
                          mb: 1,
                          fontWeight: option === question.correctAnswer ? 'bold' : 'normal',
                          color: option === question.correctAnswer ? 'success.main' : 'text.primary'
                        }}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {option === question.correctAnswer && ' ✓'}
                      </Typography>
                    ))}
                  </Box>
                )}

                {(!question.options || question.options.length === 0) && question.correctAnswer && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2">
                      Sample Answer:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {question.correctAnswer}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip size="small" label={`Topic: ${question.topic || 'General'}`} />
                  <Chip size="small" label={`Difficulty: ${question.difficulty || 'Medium'}`} />
                  {question.bloomLevel && (
                    <Chip 
                      size="small" 
                      label={`Bloom's Level: ${question.bloomLevel}`} 
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setActiveStep(1)}
        >
          Back to Patterns
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setActiveStep(3)}
          disabled={!generatedAssessment}
        >
          Continue to Settings
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={3}>
        {activeStep === 0 && renderUploadSyllabusStep()}
        {activeStep === 1 && renderPatternSelectionStep()}
        {activeStep === 2 && renderQuestionsCustomizationStep()}
        {activeStep === 3 && (
          <SettingsAndReviewStep 
            generatedAssessment={generatedAssessment}
            syllabusAnalysis={syllabusAnalysis}
            loading={loading}
            setLoading={setLoading}
            success={success}
            setSuccess={setSuccess}
            navigate={navigate}
            setActiveStep={setActiveStep}
          />
        )}
      </Box>
    </Box>
  );
};

const SettingsAndReviewStep = ({ 
  generatedAssessment, 
  syllabusAnalysis, 
  loading, 
  setLoading, 
  success, 
  setSuccess, 
  navigate, 
  setActiveStep 
}) => {
  const [courseId, setCourseId] = useState('');
  const [assignToAll, setAssignToAll] = useState(true);
  const [formError, setFormError] = useState(null);
  
  const handleSaveAssessment = async () => {
    try {
      setFormError(null);
      setLoading(true);
      
      if (!generatedAssessment) {
        throw new Error('Please generate an assessment first');
      }
      
      if (!courseId) {
        setFormError('Please select a course');
        setLoading(false);
        return;
      }
      
      // Prepare assessment data
      const assessmentData = {
        id: `assessment-${Date.now()}`,
        title: generatedAssessment.title,
        description: generatedAssessment.description || 'Assessment generated from syllabus analysis',
        courseId: courseId,
        questions: generatedAssessment.questions,
        timeLimit: generatedAssessment.timeLimit || 60,
        totalPoints: generatedAssessment.totalPoints || generatedAssessment.questions.reduce((sum, q) => sum + (q.points || 0), 0),
        assignToAllStudents: assignToAll,
        syllabusTitle: syllabusAnalysis.title || 'Generated Assessment',
        visibility: {
          instructorCanSeeAnswers: true,
          studentsCanSeeAnswers: false,
          studentsCanSeeSyllabusTitle: false,
          showResultsImmediately: true
        },
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Set due date 1 week in the future
        createdAt: new Date().toISOString()
      };
      
      try {
        // Try to save to API
        const response = await api.post('/assessment/save', assessmentData);
        console.log("API response:", response.data);
      } catch (apiError) {
        console.warn("API save failed, using localStorage instead:", apiError);
      }
      
      // Even if API fails, save to localStorage as fallback
      try {
        // Get existing saved assessments from localStorage
        const savedAssessmentsString = localStorage.getItem('savedAssessments');
        let savedAssessments = [];
        if (savedAssessmentsString) {
          savedAssessments = JSON.parse(savedAssessmentsString);
        }
        
        // Add the new assessment
        savedAssessments.push(assessmentData);
        
        // Save back to localStorage
        localStorage.setItem('savedAssessments', JSON.stringify(savedAssessments));
        console.log("Assessment saved to localStorage:", assessmentData);
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
      }
      
      // Show success message
      setSuccess(`Assessment saved successfully. ${assignToAll ? 'Assessment has been assigned to all students in the course.' : 'Assessment saved as draft.'}`);
      
      // Reset the form or navigate to the course page
      setTimeout(() => {
        navigate(`/instructor/courses/${courseId}`);
      }, 2000);
    } catch (err) {
      console.error('Error saving assessment:', err);
      setFormError(err.message || 'Error saving assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Settings & Review
      </Typography>

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box mb={3}>
        <TextField
          label="Course ID"
          fullWidth
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={assignToAll}
              onChange={(e) => setAssignToAll(e.target.checked)}
            />
          }
          label="Assign to all students in the course"
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setActiveStep(2)}
        >
          Back to Questions
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveAssessment}
          disabled={loading}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Saving...
            </>
          ) : (
            'Save Assessment'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default SyllabusUpload;
