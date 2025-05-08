import {
    AccessTime as AccessTimeIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon,
    Flag as FlagIcon,
    Help as HelpIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider // Added missing Divider import
    ,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Mock assessment data
const mockAssessment = {
  id: '1',
  title: 'Midterm Exam',
  courseId: '1',
  courseName: 'Data Structures and Algorithms',
  description: 'Comprehensive evaluation of your understanding of data structures',
  dueDate: '2025-10-15T23:59:00',
  timeLimit: 90, // in minutes
  totalPoints: 100,
  randomizeQuestions: true,
  showAnswers: false,
  questions: [
    {
      id: 'q1',
      text: 'Which data structure uses LIFO (Last In First Out) principle?',
      type: 'multiple-choice',
      options: ['Queue', 'Stack', 'Linked List', 'Tree'],
      correctAnswer: 'Stack',
      points: 5
    },
    {
      id: 'q2',
      text: 'What is the time complexity of binary search?',
      type: 'multiple-choice',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 'O(log n)',
      points: 5
    },
    {
      id: 'q3',
      text: 'Explain the difference between a stack and a queue.',
      type: 'short-answer',
      correctAnswer: 'A stack follows LIFO (Last In First Out) principle where elements are added and removed from the same end, while a queue follows FIFO (First In First Out) principle where elements are added at one end and removed from the other end.',
      points: 10
    },
    {
      id: 'q4',
      text: 'Which of the following are valid operations on a binary search tree? (Select all that apply)',
      type: 'multiple-select',
      options: ['Insertion', 'Deletion', 'In-order traversal', 'Level order traversal'],
      correctAnswer: ['Insertion', 'Deletion', 'In-order traversal', 'Level order traversal'],
      points: 10
    },
    {
      id: 'q5',
      text: 'True or False: A hash table provides O(1) average time complexity for insertions and lookups.',
      type: 'true-false',
      correctAnswer: true,
      points: 5
    }
  ]
};

const AssessmentTake = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch the assessment from an API
    setTimeout(() => {
      setAssessment(mockAssessment);
      setLoading(false);
      
      if (mockAssessment.timeLimit) {
        setTimeRemaining(mockAssessment.timeLimit * 60); // Convert to seconds
      }
    }, 1000);
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [assessmentId]);
  
  useEffect(() => {
    if (testStarted && timeRemaining !== null && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(interval);
      
      return () => clearInterval(interval);
    }
  }, [testStarted, timeRemaining]);
  
  const startTest = () => {
    setTestStarted(true);
  };
  
  // Format the remaining time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
  };
  
  // Calculate progress percentage
  const progressPercentage = () => {
    const totalQuestions = assessment?.questions.length || 0;
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / totalQuestions) * 100;
  };
  
  // Handle answer change
  const handleAnswerChange = (value) => {
    const questionId = assessment.questions[currentQuestionIndex].id;
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Toggle flagged status of current question
  const toggleFlagged = () => {
    const questionId = assessment.questions[currentQuestionIndex].id;
    if (flaggedQuestions.includes(questionId)) {
      setFlaggedQuestions(flaggedQuestions.filter(id => id !== questionId));
    } else {
      setFlaggedQuestions([...flaggedQuestions, questionId]);
    }
  };
  
  // Open confirmation dialog
  const handleOpenSubmitDialog = () => {
    setConfirmSubmit(true);
  };
  
  // Close confirmation dialog
  const handleCloseSubmitDialog = () => {
    setConfirmSubmit(false);
  };
  
  // Handle assessment submission
  const handleSubmitAssessment = async () => {
    setSubmitting(true);
    
    // In a real app, you would submit the assessment to your API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate score (this would be done on the server in a real app)
      let score = 0;
      let maxScore = 0;
      
      assessment.questions.forEach(question => {
        maxScore += question.points;
        const userAnswer = answers[question.id];
        
        if (!userAnswer) return; // Unanswered
        
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
          if (userAnswer === question.correctAnswer) {
            score += question.points;
          }
        } else if (question.type === 'multiple-select') {
          if (userAnswer.length === question.correctAnswer.length && 
              userAnswer.every(a => question.correctAnswer.includes(a))) {
            score += question.points;
          }
        } else if (question.type === 'short-answer') {
          // In a real app, this would be graded by AI or an instructor
          // For now, we'll give partial credit based on answer length
          if (userAnswer.length > 10) {
            score += question.points * 0.8;
          }
        }
      });
      
      // Navigate to results page
      navigate(`/results/${assessmentId}`, { 
        state: { 
          score,
          maxScore,
          answers,
          assessment
        }
      });
    } catch (error) {
      setError('Failed to submit assessment. Please try again.');
      setSubmitting(false);
    }
  };
  
  // Render the current question
  const renderQuestion = () => {
    const question = assessment.questions[currentQuestionIndex];
    
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            {question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        );
        
      case 'true-false':
        return (
          <RadioGroup
            value={answers[question.id]?.toString() || ''}
            onChange={(e) => handleAnswerChange(e.target.value === 'true')}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="True"
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="False"
            />
          </RadioGroup>
        );
        
      case 'short-answer':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter your answer here..."
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        );
        
      case 'multiple-select':
        return (
          <FormGroup>
            {question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={(answers[question.id] || []).includes(option)}
                    onChange={(e) => {
                      const currentSelections = answers[question.id] || [];
                      if (e.target.checked) {
                        handleAnswerChange([...currentSelections, option]);
                      } else {
                        handleAnswerChange(currentSelections.filter(item => item !== option));
                      }
                    }}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        );
        
      default:
        return <Alert severity="error">Unsupported question type</Alert>;
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  if (!assessment) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Assessment not found or no longer available.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/dashboard')} 
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }
  
  if (!testStarted) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            {assessment.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {assessment.courseName}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total Points" 
                    secondary={assessment.totalPoints} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Time Limit" 
                    secondary={assessment.timeLimit ? `${assessment.timeLimit} minutes` : 'No time limit'} 
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Questions" 
                    secondary={assessment.questions.length} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Due Date" 
                    secondary={new Date(assessment.dueDate).toLocaleString()} 
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            {assessment.timeLimit 
              ? `This assessment has a time limit of ${assessment.timeLimit} minutes. The timer will start once you begin.` 
              : 'This assessment has no time limit, but must be completed in one session.'}
          </Alert>
          
          <Typography variant="body1" paragraph>
            {assessment.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={startTest}
            >
              Begin Assessment
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            {assessment.title}
          </Typography>
          {timeRemaining !== null && (
            <Chip 
              icon={<AccessTimeIcon />} 
              label={`Time remaining: ${formatTime(timeRemaining)}`}
              color={timeRemaining < 300 ? 'error' : 'default'}
              variant="outlined"
            />
          )}
        </Box>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage()} 
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(progressPercentage())}% Complete
                </Typography>
                <Box>
                  <IconButton
                    onClick={toggleFlagged}
                    color={flaggedQuestions.includes(assessment.questions[currentQuestionIndex].id) ? 'error' : 'default'}
                    title={flaggedQuestions.includes(assessment.questions[currentQuestionIndex].id) ? 'Unflag question' : 'Flag for review'}
                  >
                    <FlagIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {assessment.questions[currentQuestionIndex].text}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {renderQuestion()}
                </Box>
              </CardContent>
            </Card>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              {currentQuestionIndex < assessment.questions.length - 1 ? (
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleNextQuestion}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenSubmitDialog}
                >
                  Submit Assessment
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Question Navigator
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {assessment.questions.map((question, index) => (
                <Grid item key={question.id}>
                  <Button
                    variant={currentQuestionIndex === index ? 'contained' : 'outlined'}
                    color={
                      flaggedQuestions.includes(question.id) ? 'error' :
                      answers[question.id] ? 'success' : 'primary'
                    }
                    onClick={() => setCurrentQuestionIndex(index)}
                    sx={{ minWidth: 40, height: 40, p: 0 }}
                  >
                    {index + 1}
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" gutterBottom>
                Legend:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'primary.main' }} />
                  <Typography variant="body2">Current question</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'success.main' }} />
                  <Typography variant="body2">Answered</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'error.main' }} />
                  <Typography variant="body2">Flagged for review</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmSubmit}
        onClose={handleCloseSubmitDialog}
      >
        <DialogTitle>Submit Assessment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit this assessment? You will not be able to change your answers after submission.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Total questions: {assessment.questions.length}
            </Typography>
            <Typography variant="body2">
              Answered questions: {Object.keys(answers).length}
            </Typography>
            <Typography variant="body2">
              Unanswered questions: {assessment.questions.length - Object.keys(answers).length}
            </Typography>
            <Typography variant="body2">
              Flagged questions: {flaggedQuestions.length}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmitDialog}>
            Continue Editing
          </Button>
          <Button
            onClick={handleSubmitAssessment}
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;

export default AssessmentTake;