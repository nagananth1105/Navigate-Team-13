import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FaceIcon from '@mui/icons-material/Face';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SchoolIcon from '@mui/icons-material/School';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

// Mock data for development
const mockSubmission = {
  id: '123',
  assessmentId: '1',
  courseId: '1',
  assessmentTitle: 'Introduction to Data Structures',
  courseTitle: 'Data Structures and Algorithms',
  submittedAt: '2025-10-15T14:30:00Z',
  score: 82,
  maxScore: 100,
  timeSpent: '52:30', // minutes:seconds
  questionResults: [
    {
      id: '1',
      question: 'Which data structure operates on a LIFO principle?',
      questionType: 'Multiple Choice',
      options: ['Queue', 'Stack', 'Linked List', 'Tree'],
      yourAnswer: 'Stack',
      correctAnswer: 'Stack',
      isCorrect: true,
      score: 5,
      maxScore: 5,
      explanation: 'Stacks follow the Last-In-First-Out (LIFO) principle, where the last element added is the first one to be removed.'
    },
    {
      id: '2',
      question: 'Explain the difference between a linked list and an array in terms of memory allocation.',
      questionType: 'Short Answer',
      yourAnswer: 'Arrays allocate memory in a contiguous block, while linked lists allocate memory for each node separately with pointers connecting them.',
      correctAnswer: null, // No simple "correct" answer for short answer
      isCorrect: null,
      score: 8,
      maxScore: 10,
      explanation: 'Good explanation, but could have mentioned that arrays have fixed size allocation while linked lists can grow dynamically.',
      feedback: 'Your answer correctly identifies the key difference in memory allocation patterns. To improve, consider discussing the implications of these patterns on operations like insertion and deletion.'
    },
    {
      id: '3',
      question: 'Implement a simple queue using two stacks.',
      questionType: 'Programming',
      yourAnswer: `class Queue {
  constructor() {
    this.stackIn = [];
    this.stackOut = [];
  }
  
  enqueue(item) {
    this.stackIn.push(item);
  }
  
  dequeue() {
    if (this.stackOut.length === 0) {
      while (this.stackIn.length > 0) {
        this.stackOut.push(this.stackIn.pop());
      }
    }
    return this.stackOut.pop();
  }
  
  peek() {
    if (this.stackOut.length === 0) {
      while (this.stackIn.length > 0) {
        this.stackOut.push(this.stackIn.pop());
      }
    }
    return this.stackOut[this.stackOut.length - 1];
  }
  
  isEmpty() {
    return this.stackIn.length === 0 && this.stackOut.length === 0;
  }
}`,
      correctAnswer: null,
      isCorrect: null,
      score: 14,
      maxScore: 15,
      explanation: 'Your implementation correctly uses two stacks to simulate queue behavior.',
      feedback: 'Your implementation correctly follows the two-stack approach. The time complexity for enqueue is O(1), while dequeue is amortized O(1). A minor improvement would be adding error handling for dequeue and peek operations when the queue is empty.'
    },
    {
      id: '4',
      question: 'What is the time complexity of insertion in a balanced binary search tree?',
      questionType: 'Multiple Choice',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      yourAnswer: 'O(n)',
      correctAnswer: 'O(log n)',
      isCorrect: false,
      score: 0,
      maxScore: 5,
      explanation: 'In a balanced binary search tree, the time complexity for insertion is O(log n) because the height of the tree is logarithmic to the number of nodes.'
    },
    {
      id: '5',
      question: 'Explain how hash collisions can be resolved in hash tables.',
      questionType: 'Essay',
      yourAnswer: 'Hash collisions can be resolved using methods like chaining and open addressing. In chaining, each bucket contains a linked list of elements that hash to the same bucket. In open addressing, we find another empty slot in the hash table by using a probing sequence. Probing methods include linear probing, quadratic probing, and double hashing.',
      correctAnswer: null,
      isCorrect: null,
      score: 12,
      maxScore: 15,
      explanation: 'Your answer covers the main collision resolution strategies.',
      feedback: 'Your answer correctly identifies the two main collision resolution strategies: chaining and open addressing. You also mentioned the different probing techniques for open addressing. To improve, you could have discussed the pros and cons of each approach and when one might be preferred over the other.'
    }
  ],
  expertFeedback: [
    {
      expertName: 'Dr. Algorithm',
      expertTitle: 'Data Structures Specialist',
      avatar: '/assets/experts/algorithm.jpg',
      generalFeedback: 'Overall, you demonstrate a good understanding of basic data structures concepts. Your implementation skills are strong, as shown in the programming question.',
      strengthAreas: ['Algorithm implementation', 'Understanding of stack operations'],
      improvementAreas: ['Time complexity analysis', 'Hash table collision resolution strategies'],
      suggestedResources: [
        {
          title: 'Introduction to Algorithms',
          type: 'Book',
          link: '#'
        },
        {
          title: 'Time Complexity Deep Dive',
          type: 'Video',
          link: '#'
        }
      ]
    },
    {
      expertName: 'Prof. DataMaster',
      expertTitle: 'Computer Science Educator',
      avatar: '/assets/experts/datamaster.jpg',
      generalFeedback: 'You show promise in your understanding of data structures. Your written explanations are clear and concise, but there are some gaps in your theoretical knowledge.',
      strengthAreas: ['Clear explanations', 'Good coding style'],
      improvementAreas: ['Understanding of balanced trees', 'Theoretical concepts'],
      suggestedResources: [
        {
          title: 'Visualizing Data Structures',
          type: 'Interactive Tool',
          link: '#'
        },
        {
          title: 'Advanced Data Structures Course',
          type: 'Online Course',
          link: '#'
        }
      ]
    }
  ],
  learningRecommendations: [
    {
      topic: 'Balanced Binary Search Trees',
      confidence: 'low',
      recommendedResources: [
        {
          title: 'AVL Trees Explained',
          type: 'Article',
          link: '#'
        },
        {
          title: 'Red-Black Trees: A Visual Introduction',
          type: 'Video',
          link: '#'
        }
      ]
    },
    {
      topic: 'Time Complexity Analysis',
      confidence: 'medium',
      recommendedResources: [
        {
          title: 'Big O Notation and Algorithm Analysis',
          type: 'Tutorial',
          link: '#'
        }
      ]
    }
  ]
};

const SubmissionResults = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Load submission data
  useEffect(() => {
    // In a real application, you would fetch the submission data from an API
    // For this demo, we'll use the mock data
    setSubmission(mockSubmission);
    setLoading(false);
  }, [submissionId]);

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
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/dashboard')} 
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1">
          Assessment Results
        </Typography>
      </Box>

      {/* Summary Card */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              {submission.assessmentTitle}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {submission.courseTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted on {new Date(submission.submittedAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Time spent: {submission.timeSpent}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Your Score
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <CircularProgress 
                  variant="determinate" 
                  value={scorePercentage} 
                  size={100} 
                  thickness={5}
                  sx={{ color: scoreColor }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" color={scoreColor}>
                    {scorePercentage.toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {submission.score} / {submission.maxScore} points
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Navigation */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<AutoGraphIcon />} label="Question Breakdown" iconPosition="start" />
          <Tab icon={<PsychologyIcon />} label="Expert Feedback" iconPosition="start" />
          <Tab icon={<TipsAndUpdatesIcon />} label="Next Steps" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Question Breakdown Tab */}
      <Box hidden={activeTab !== 0}>
        <Typography variant="h5" gutterBottom>
          Question Breakdown
        </Typography>
        
        {submission.questionResults.map((result, index) => (
          <Accordion key={result.id} defaultExpanded={index === 0} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ mr: 2 }}>
                  {result.isCorrect === true ? (
                    <CheckCircleIcon color="success" />
                  ) : result.isCorrect === false ? (
                    <CancelIcon color="error" />
                  ) : (
                    <CheckCircleIcon color="action" />
                  )}
                </Box>
                <Typography sx={{ flexGrow: 1 }} variant="subtitle1">
                  Question {index + 1}: {result.question.length > 60 ? `${result.question.substring(0, 60)}...` : result.question}
                </Typography>
                <Chip 
                  label={`${result.score}/${result.maxScore}`} 
                  color={result.score === result.maxScore ? 'success' : 'primary'} 
                  sx={{ ml: 2 }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {result.question}
                  </Typography>
                  <Chip 
                    label={result.questionType} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  
                  {/* Display multiple choice options if applicable */}
                  {result.questionType === 'Multiple Choice' && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      {result.options.map((option, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            p: 1, 
                            mb: 1, 
                            border: '1px solid',
                            borderColor: 
                              option === result.correctAnswer ? 'success.main' : 
                              option === result.yourAnswer && result.yourAnswer !== result.correctAnswer ? 'error.main' : 
                              'divider',
                            borderRadius: 1,
                            bgcolor: 
                              option === result.correctAnswer ? 'success.light' : 
                              option === result.yourAnswer && result.yourAnswer !== result.correctAnswer ? 'error.light' : 
                              'background.paper',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {option === result.correctAnswer && <CheckCircleIcon color="success" sx={{ mr: 1 }} />}
                          {option === result.yourAnswer && option !== result.correctAnswer && <CancelIcon color="error" sx={{ mr: 1 }} />}
                          <Typography>{option}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  {/* Display your answer for non-multiple choice questions */}
                  {result.questionType !== 'Multiple Choice' && (
                    <Box sx={{ mt: 2, mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Your Response:
                      </Typography>
                      <TextField
                        multiline
                        fullWidth
                        variant="outlined"
                        value={result.yourAnswer}
                        InputProps={{
                          readOnly: true,
                          style: result.questionType === 'Programming' ? { fontFamily: 'monospace' } : {}
                        }}
                        minRows={result.questionType === 'Programming' ? 8 : 3}
                      />
                    </Box>
                  )}
                  
                  {/* Display explanation and feedback */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Explanation:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {result.explanation}
                    </Typography>
                    
                    {result.feedback && (
                      <>
                        <Typography variant="subtitle2" gutterBottom>
                          Feedback:
                        </Typography>
                        <Typography variant="body2">
                          {result.feedback}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Expert Feedback Tab */}
      <Box hidden={activeTab !== 1}>
        <Typography variant="h5" gutterBottom>
          Expert Feedback
        </Typography>
        
        <Grid container spacing={3}>
          {submission.expertFeedback.map((expert, index) => (
            <Grid item xs={12} key={index}>
              <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <FaceIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6">
                        {expert.expertName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {expert.expertTitle}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" paragraph>
                    {expert.generalFeedback}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Strengths:
                  </Typography>
                  <List dense>
                    {expert.strengthAreas.map((strength, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={strength} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Areas for Improvement:
                  </Typography>
                  <List dense>
                    {expert.improvementAreas.map((area, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <TipsAndUpdatesIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={area} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Suggested Resources:
                  </Typography>
                  <List dense>
                    {expert.suggestedResources.map((resource, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <SchoolIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Button href={resource.link} color="primary" sx={{ p: 0, textTransform: 'none', textAlign: 'left' }}>
                              {resource.title}
                            </Button>
                          } 
                          secondary={resource.type}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Next Steps Tab */}
      <Box hidden={activeTab !== 2}>
        <Typography variant="h5" gutterBottom>
          Personalized Learning Recommendations
        </Typography>
        <Typography variant="body1" paragraph>
          Based on your assessment results, we've identified the following areas for focused study:
        </Typography>
        
        <Grid container spacing={3}>
          {submission.learningRecommendations.map((rec, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {rec.topic}
                    </Typography>
                    <Chip 
                      label={`${rec.confidence} confidence`}
                      color={
                        rec.confidence === 'high' ? 'success' : 
                        rec.confidence === 'medium' ? 'primary' : 
                        'warning'
                      }
                      size="small"
                    />
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Recommended Resources:
                  </Typography>
                  <List dense>
                    {rec.recommendedResources.map((resource, idx) => (
                      <ListItem key={idx} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <SchoolIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Button href={resource.link} color="primary" sx={{ p: 0, textTransform: 'none', textAlign: 'left' }}>
                              {resource.title}
                            </Button>
                          } 
                          secondary={resource.type}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={RouterLink}
            to={`/learning-path/${submission.courseId}`}
            startIcon={<AutoGraphIcon />}
          >
            View Complete Learning Path
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SubmissionResults;