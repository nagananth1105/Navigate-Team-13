import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import FlagIcon from '@mui/icons-material/Flag';
import TimerIcon from '@mui/icons-material/Timer';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Mock data for development
const mockAssessment = {
  id: '1',
  title: 'Introduction to Data Structures',
  description: 'Test your knowledge on basic data structures concepts',
  totalPoints: 100,
  timeLimit: 60, // minutes
  questions: [
    {
      id: '1',
      question: 'Which data structure operates on a LIFO principle?',
      questionType: 'Multiple Choice',
      options: ['Queue', 'Stack', 'Linked List', 'Tree'],
      topic: 'Basic Data Structures',
      points: 5,
      difficulty: 'Easy',
      bloomLevel: 'Knowledge'
    },
    {
      id: '2',
      question: 'Explain the difference between a linked list and an array in terms of memory allocation.',
      questionType: 'Short Answer',
      topic: 'Memory Management',
      points: 10,
      difficulty: 'Medium',
      bloomLevel: 'Comprehension'
    },
    {
      id: '3',
      question: 'Implement a simple queue using two stacks.',
      questionType: 'Programming',
      topic: 'Advanced Data Structures',
      points: 15,
      difficulty: 'Hard',
      bloomLevel: 'Application'
    },
    {
      id: '4',
      question: 'What is the time complexity of insertion in a balanced binary search tree?',
      questionType: 'Multiple Choice',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      topic: 'Time Complexity',
      points: 5,
      difficulty: 'Medium',
      bloomLevel: 'Knowledge'
    },
    {
      id: '5',
      question: 'Explain how hash collisions can be resolved in hash tables.',
      questionType: 'Essay',
      topic: 'Hash Tables',
      points: 15,
      difficulty: 'Medium',
      bloomLevel: 'Analysis'
    }
  ]
};

const AssessmentTake = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  
  // Load assessment data
  useEffect(() => {
    // In a real application, you would fetch the assessment from an API
    // For this demo, we'll use the mock data
    setAssessment(mockAssessment);
    setTimeRemaining(mockAssessment.timeLimit * 60); // Convert minutes to seconds
    setLoading(false);
  }, [assessmentId]);
  
  // Timer effect
  useEffect(() => {
    let timer;
    if (assessment && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
    
    return () => clearInterval(timer);
  }, [assessment, timeRemaining, handleSubmit]);
  
  // Format time remaining as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
  
  // Submit assessment
  const handleSubmit = useCallback(() => {
    // In a real app, you would submit the answers to the server
    console.log('Submitting answers:', answers);
    
    // Navigate to results page with a mock submission ID
    navigate('/results/123');
  }, [answers, navigate]);
  
  // Render question based on its type
  const renderQuestion = (question) => {
    switch (question.questionType) {
      case 'Multiple Choice':
        return (
          <FormControl component="fieldset" fullWidth>
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
          </FormControl>
        );
        
      case 'Short Answer':
      case 'Essay':
        return (
          <TextField
            multiline
            rows={question.questionType === 'Essay' ? 8 : 3}
            placeholder="Enter your answer here..."
            variant="outlined"
            fullWidth
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        );
        
      case 'Programming':
        return (
          <TextField
            multiline
            rows={10}
            placeholder="Enter your code here..."
            variant="outlined"
            fullWidth
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            InputProps={{
              style: { fontFamily: 'monospace' }
            }}
          />
        );
        
      default:
        return (
          <TextField
            multiline
            rows={4}
            placeholder="Enter your answer here..."
            variant="outlined"
            fullWidth
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        );
    }
  };
  
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  if (!assessment) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Assessment not found
        </Typography>
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
  
  const currentQuestion = assessment.questions[currentQuestionIndex];
  const isFlagged = flaggedQuestions.includes(currentQuestion.id);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column (Question Area) */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h1">
                {assessment.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TimerIcon sx={{ mr: 1, color: timeRemaining < 300 ? 'error.main' : 'inherit' }} />
                <Typography 
                  variant="h6" 
                  color={timeRemaining < 300 ? 'error' : 'inherit'}
                >
                  {formatTime(timeRemaining)}
                </Typography>
              </Box>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage()} 
              sx={{ mb: 3 }} 
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Chip 
                label={`Question ${currentQuestionIndex + 1} of ${assessment.questions.length}`} 
                color="primary" 
                variant="outlined" 
              />
              <Box>
                <Chip 
                  label={`${currentQuestion.points} points`} 
                  variant="outlined" 
                  sx={{ mr: 1 }} 
                />
                <Chip 
                  label={currentQuestion.difficulty} 
                  color={
                    currentQuestion.difficulty === 'Easy' ? 'success' : 
                    currentQuestion.difficulty === 'Medium' ? 'warning' : 'error'
                  }
                  variant="outlined" 
                />
              </Box>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              {currentQuestion.question}
            </Typography>
            
            <Box sx={{ my: 3 }}>
              {renderQuestion(currentQuestion)}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <Button
                variant="outlined"
                color={isFlagged ? 'warning' : 'primary'}
                startIcon={<FlagIcon />}
                onClick={toggleFlagged}
              >
                {isFlagged ? 'Unflag' : 'Flag for Review'}
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
                  color="success"
                  endIcon={<CheckIcon />}
                  onClick={handleSubmit}
                >
                  Submit Assessment
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Column (Question List & Info) */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Question Navigator
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {assessment.questions.map((q, index) => (
                  <Button
                    key={q.id}
                    variant={currentQuestionIndex === index ? 'contained' : 'outlined'}
                    color={
                      flaggedQuestions.includes(q.id) ? 'warning' : 
                      answers[q.id] ? 'success' : 'primary'
                    }
                    size="small"
                    onClick={() => setCurrentQuestionIndex(index)}
                    sx={{ minWidth: '40px' }}
                  >
                    {index + 1}
                  </Button>
                ))}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <b>Legend:</b>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: 'primary.main', mr: 1, borderRadius: 1 }} />
                    <Typography variant="body2">Current</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: 'success.main', mr: 1, borderRadius: 1 }} />
                    <Typography variant="body2">Answered</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: 'warning.main', mr: 1, borderRadius: 1 }} />
                    <Typography variant="body2">Flagged</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assessment Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Total Questions" 
                    secondary={assessment.questions.length} 
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Total Points" 
                    secondary={assessment.totalPoints} 
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Time Limit" 
                    secondary={`${assessment.timeLimit} minutes`} 
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Completed" 
                    secondary={`${Object.keys(answers).length} of ${assessment.questions.length} questions`}
                  />
                </ListItem>
              </List>
              
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSubmit}
              >
                Submit Assessment
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AssessmentTake;