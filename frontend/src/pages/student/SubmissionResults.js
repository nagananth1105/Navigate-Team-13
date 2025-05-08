import {
    AccessTime as AccessTimeIcon,
    ArrowBack as ArrowBackIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Flag as FlagIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Mock submission data
const mockSubmission = {
  id: '1',
  assessment: {
    id: '1',
    title: 'Midterm Exam',
    courseId: '1',
    courseName: 'Data Structures and Algorithms',
    description: 'Comprehensive evaluation of your understanding of data structures',
    timeLimit: 90, // in minutes
    totalPoints: 100,
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
  },
  student: {
    id: '1',
    name: 'Student Name',
    email: 'student@example.com'
  },
  answers: {
    'q1': 'Stack',
    'q2': 'O(log n)',
    'q3': 'A stack uses LIFO (Last In First Out) where elements are added and removed from the top. A queue uses FIFO (First In First Out) where elements are added at the back and removed from the front.',
    'q4': ['Insertion', 'Deletion', 'In-order traversal'],
    'q5': true
  },
  score: 25,
  maxScore: 35,
  submittedAt: '2025-10-12T15:30:00',
  timeSpent: 42, // in minutes
  feedback: {
    overallFeedback: 'Good understanding of basic data structures. Continue practicing with more complex operations on trees and graphs.',
    questionFeedback: {
      'q3': 'Good explanation of the basic principles, but could elaborate more on the implementation differences.',
      'q4': 'You missed "Level order traversal" which is also a valid operation on BSTs.'
    }
  },
  conceptMastery: [
    { concept: 'Stacks', masteryLevel: 90 },
    { concept: 'Queues', masteryLevel: 85 },
    { concept: 'Binary Search Trees', masteryLevel: 70 },
    { concept: 'Algorithm Complexity', masteryLevel: 80 }
  ]
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SubmissionResults = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Fetch submission data or use state from previous page
  useEffect(() => {
    if (location.state?.score !== undefined) {
      // If navigated from assessment take with state
      const { score, maxScore, answers, assessment } = location.state;
      
      // Create a submission object from the state
      const createdSubmission = {
        id: submissionId || '1',
        assessment,
        student: {
          id: currentUser?.id || '1',
          name: currentUser?.name || 'Student Name',
          email: currentUser?.email || 'student@example.com'
        },
        answers,
        score,
        maxScore,
        submittedAt: new Date().toISOString(),
        timeSpent: assessment.timeLimit || 60, // Default to time limit if actual time not tracked
        feedback: {
          overallFeedback: 'This is automated feedback based on your submission.',
          questionFeedback: {}
        },
        conceptMastery: []
      };
      
      setSubmission(createdSubmission);
      setLoading(false);
    } else {
      // If directly navigated to this page, fetch the submission data
      // In a real app, you would fetch from an API
      setTimeout(() => {
        setSubmission(mockSubmission);
        setLoading(false);
      }, 1000);
    }
  }, [submissionId, location, currentUser]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  if (!submission) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Submission not found
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

  const scorePercentage = (submission.score / submission.maxScore) * 100;
  const scoreColor = 
    scorePercentage >= 90 ? 'success.main' : 
    scorePercentage >= 70 ? 'primary.main' : 
    scorePercentage >= 60 ? 'warning.main' : 'error.main';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>
      
      {/* Results Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" gutterBottom>
              Assessment Results
            </Typography>
            <Typography variant="h5" gutterBottom>
              {submission.assessment.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {submission.assessment.courseName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted: {new Date(submission.submittedAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h3" color={scoreColor} sx={{ fontWeight: 'bold' }}>
                  {Math.round(scorePercentage)}%
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ ml: 1.5 }}>
                  ({submission.score}/{submission.maxScore} points)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<AssignmentTurnedInIcon />} 
                  label={`${submission.assessment.questions.length} Questions`} 
                  variant="outlined" 
                />
                <Chip 
                  icon={<AccessTimeIcon />} 
                  label={`${submission.timeSpent} minutes`} 
                  variant="outlined" 
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Results Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="results tabs">
          <Tab label="Question Review" />
          <Tab label="Performance Analysis" />
          <Tab label="Feedback" />
        </Tabs>
      </Box>
      
      {/* Question Review Tab */}
      <TabPanel value={activeTab} index={0}>
        <Typography variant="h6" gutterBottom>
          Questions and Answers
        </Typography>
        
        {submission.assessment.questions.map((question, index) => {
          const userAnswer = submission.answers[question.id];
          const isCorrect = 
            question.type === 'multiple-choice' || question.type === 'true-false' 
              ? userAnswer === question.correctAnswer
              : question.type === 'multiple-select'
                ? userAnswer && userAnswer.length === question.correctAnswer.length && 
                  userAnswer.every(a => question.correctAnswer.includes(a))
                : false; // For short answer, we don't do simple comparison
          
          return (
            <Card key={question.id} variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Question {index + 1}
                  </Typography>
                  <Box>
                    <Chip 
                      icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />} 
                      label={isCorrect ? 'Correct' : 'Incorrect'} 
                      color={isCorrect ? 'success' : 'error'} 
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${question.points} pts`} 
                      variant="outlined" 
                      size="small" 
                    />
                  </Box>
                </Box>
                
                <Typography variant="body1" paragraph>
                  {question.text}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Your Answer:
                    </Typography>
                    
                    {/* Render user answer based on question type */}
                    {question.type === 'multiple-choice' && (
                      <Typography variant="body1">
                        {userAnswer || <em>No answer provided</em>}
                      </Typography>
                    )}
                    
                    {question.type === 'true-false' && (
                      <Typography variant="body1">
                        {userAnswer === true ? 'True' : userAnswer === false ? 'False' : <em>No answer provided</em>}
                      </Typography>
                    )}
                    
                    {question.type === 'short-answer' && (
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {userAnswer || <em>No answer provided</em>}
                      </Typography>
                    )}
                    
                    {question.type === 'multiple-select' && (
                      <List dense>
                        {userAnswer && userAnswer.length > 0 ? (
                          userAnswer.map((option, idx) => (
                            <ListItem key={idx}>
                              <ListItemIcon sx={{ minWidth: 28 }}>
                                <CheckCircleIcon color={question.correctAnswer.includes(option) ? 'success' : 'error'} fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={option} />
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText primary={<em>No answer provided</em>} />
                          </ListItem>
                        )}
                      </List>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Correct Answer:
                    </Typography>
                    
                    {question.type === 'multiple-choice' && (
                      <Typography variant="body1">
                        {question.correctAnswer}
                      </Typography>
                    )}
                    
                    {question.type === 'true-false' && (
                      <Typography variant="body1">
                        {question.correctAnswer ? 'True' : 'False'}
                      </Typography>
                    )}
                    
                    {question.type === 'short-answer' && (
                      <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                        <em>Sample answer:</em> {question.correctAnswer}
                      </Typography>
                    )}
                    
                    {question.type === 'multiple-select' && (
                      <List dense>
                        {question.correctAnswer.map((option, idx) => (
                          <ListItem key={idx}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <CheckCircleIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={option} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Grid>
                </Grid>
                
                {/* Show feedback if available */}
                {submission.feedback.questionFeedback && submission.feedback.questionFeedback[question.id] && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Feedback:</Typography>
                    <Typography variant="body2">
                      {submission.feedback.questionFeedback[question.id]}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </TabPanel>
      
      {/* Performance Analysis Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Score Breakdown
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Your Score</TableCell>
                      <TableCell align="right">Max Score</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Overall</TableCell>
                      <TableCell align="right">{submission.score}</TableCell>
                      <TableCell align="right">{submission.maxScore}</TableCell>
                      <TableCell align="right">{Math.round(scorePercentage)}%</TableCell>
                    </TableRow>
                    {/* You could add category breakdowns here */}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Time Analysis
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body1">
                  Time Spent:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {submission.timeSpent} minutes
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body1">
                  Time Limit:
                </Typography>
                <Typography variant="body1">
                  {submission.assessment.timeLimit} minutes
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body1">
                  Time Utilization:
                </Typography>
                <Typography variant="body1" fontWeight="bold" color={submission.timeSpent <= submission.assessment.timeLimit ? 'success.main' : 'error.main'}>
                  {Math.round((submission.timeSpent / submission.assessment.timeLimit) * 100)}%
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {submission.conceptMastery && submission.conceptMastery.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Concept Mastery
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {submission.conceptMastery.map((concept, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            {concept.concept}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={concept.masteryLevel} 
                                color={
                                  concept.masteryLevel >= 80 ? 'success' :
                                  concept.masteryLevel >= 60 ? 'primary' :
                                  concept.masteryLevel >= 40 ? 'warning' : 'error'
                                }
                                sx={{ height: 10, borderRadius: 5 }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {concept.masteryLevel}%
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>
      
      {/* Feedback Tab */}
      <TabPanel value={activeTab} index={2}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Overall Feedback
          </Typography>
          <Typography variant="body1" paragraph>
            {submission.feedback?.overallFeedback || 'No feedback provided.'}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Strengths
          </Typography>
          <List>
            {scorePercentage >= 80 && (
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Strong overall understanding of the material" />
              </ListItem>
            )}
            {/* You would generate these dynamically based on the submission */}
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="Good grasp of fundamental concepts" />
            </ListItem>
          </List>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Areas for Improvement
          </Typography>
          <List>
            {scorePercentage < 80 && (
              <ListItem>
                <ListItemIcon>
                  <FlagIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary="Review the course materials to strengthen your understanding" />
              </ListItem>
            )}
            {/* You would generate these dynamically based on the submission */}
            <ListItem>
              <ListItemIcon>
                <FlagIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary="Practice more complex problem-solving scenarios" />
            </ListItem>
          </List>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Next Steps
          </Typography>
          <Alert severity="info" sx={{ mt: 1 }}>
            <Typography variant="body1">
              Based on your performance, we recommend focusing on the following topics:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <TimelineIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Review Tree traversal algorithms" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimelineIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Practice time complexity analysis" />
              </ListItem>
            </List>
          </Alert>
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default SubmissionResults;