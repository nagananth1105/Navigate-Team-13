import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  CircularProgress
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Mock data for development
const mockCourse = {
  id: '1',
  title: 'Data Structures and Algorithms',
  code: 'CS301',
  description: 'Introduction to fundamental data structures and algorithms used in computer science.',
  instructor: 'Dr. Jane Smith',
  term: 'Fall 2025',
  department: 'Computer Science',
  credits: 3,
  assessments: [
    {
      id: '1',
      title: 'Midterm Exam',
      type: 'Exam',
      dueDate: '2025-10-15',
      status: 'available',
      timeLimit: 90,
      totalPoints: 100
    },
    {
      id: '2',
      title: 'Binary Trees Implementation',
      type: 'Programming Assignment',
      dueDate: '2025-11-01',
      status: 'available',
      timeLimit: 0,
      totalPoints: 50
    },
    {
      id: '3',
      title: 'Final Exam',
      type: 'Exam',
      dueDate: '2025-12-10',
      status: 'upcoming',
      timeLimit: 120,
      totalPoints: 150
    }
  ],
  materials: [
    {
      id: '1',
      title: 'Introduction to Data Structures',
      type: 'Lecture Notes',
      week: 1,
      url: '#'
    },
    {
      id: '2',
      title: 'Array Implementation',
      type: 'Programming Example',
      week: 2,
      url: '#'
    },
    {
      id: '3',
      title: 'Linked Lists vs Arrays',
      type: 'Research Article',
      week: 3,
      url: '#'
    }
  ],
  syllabus: {
    learningOutcomes: [
      'Understand fundamental data structures and their implementations',
      'Analyze algorithm complexity using Big O notation',
      'Implement and use common data structures such as lists, stacks, queues, trees, and graphs',
      'Apply appropriate data structures to solve programming problems',
      'Compare and evaluate algorithms for efficiency'
    ],
    weeklyTopics: [
      {
        week: 1,
        topic: 'Introduction to Data Structures',
        description: 'Overview of course, introduction to basic concepts.'
      },
      {
        week: 2,
        topic: 'Arrays and Lists',
        description: 'Implementation and operations on arrays and lists.'
      },
      {
        week: 3,
        topic: 'Linked Lists',
        description: 'Singly and doubly linked lists, operations and applications.'
      },
      {
        week: 4,
        topic: 'Stacks and Queues',
        description: 'Stack and queue implementations and applications.'
      },
      {
        week: 5,
        topic: 'Recursion',
        description: 'Recursive algorithms and problem-solving.'
      },
      {
        week: 6,
        topic: 'Trees I',
        description: 'Binary trees, traversal algorithms.'
      },
      {
        week: 7,
        topic: 'Midterm Review and Exam',
        description: 'Review of material and midterm examination.'
      },
      {
        week: 8,
        topic: 'Trees II',
        description: 'Binary search trees, balanced trees.'
      },
      {
        week: 9,
        topic: 'Heaps and Priority Queues',
        description: 'Heap implementation and applications.'
      },
      {
        week: 10,
        topic: 'Graphs I',
        description: 'Graph representations and traversal algorithms.'
      },
      {
        week: 11,
        topic: 'Graphs II',
        description: 'Shortest path and minimum spanning tree algorithms.'
      },
      {
        week: 12,
        topic: 'Sorting and Searching',
        description: 'Comparison of sorting and searching algorithms.'
      },
      {
        week: 13,
        topic: 'Hashing',
        description: 'Hash tables, collision resolution strategies.'
      },
      {
        week: 14,
        topic: 'Advanced Topics',
        description: 'Advanced data structures and algorithms.'
      },
      {
        week: 15,
        topic: 'Final Review',
        description: 'Comprehensive review of course material.'
      }
    ]
  },
  progress: {
    completedAssessments: 1,
    totalAssessments: 3,
    averageScore: 85,
    learningPathStatus: 'on-track'
  }
};

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Load course data
  useEffect(() => {
    // In a real application, you would fetch the course from an API
    // For this demo, we'll use the mock data
    setCourse(mockCourse);
    setLoading(false);
  }, [courseId]);

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

  if (!course) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Course not found
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Course Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {course.code} • {course.department} • {course.credits} Credits
            </Typography>
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Instructor" secondary={course.instructor} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText primary="Term" secondary={course.term} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AutoGraphIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Your Progress" 
                  secondary={`${course.progress.completedAssessments}/${course.progress.totalAssessments} assessments completed`} 
                />
              </ListItem>
            </List>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                component={RouterLink}
                to={`/learning-path/${course.id}`}
                startIcon={<AutoGraphIcon />}
              >
                Learning Path
              </Button>
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
          <Tab label="Assessments" icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label="Course Materials" icon={<DescriptionIcon />} iconPosition="start" />
          <Tab label="Syllabus" icon={<MenuBookIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Assessments Tab */}
      <Box hidden={activeTab !== 0}>
        <Typography variant="h5" gutterBottom>
          Assessments
        </Typography>
        <Grid container spacing={3}>
          {course.assessments.map((assessment) => (
            <Grid item xs={12} sm={6} md={4} key={assessment.id}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: assessment.status === 'upcoming' ? '#f5f5f5' : 'background.paper'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" gutterBottom>
                      {assessment.title}
                    </Typography>
                    <Chip 
                      label={assessment.status === 'available' ? 'Available' : 'Upcoming'} 
                      color={assessment.status === 'available' ? 'primary' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {assessment.type}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Due: {new Date(assessment.dueDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <List dense>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AccessTimeIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={assessment.timeLimit ? `Time Limit: ${assessment.timeLimit} minutes` : 'No time limit'}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={`Points: ${assessment.totalPoints}`} />
                    </ListItem>
                  </List>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    component={RouterLink}
                    to={`/assessment/${assessment.id}`}
                    disabled={assessment.status !== 'available'}
                  >
                    {assessment.status === 'available' ? 'Start Assessment' : 'Coming Soon'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Course Materials Tab */}
      <Box hidden={activeTab !== 1}>
        <Typography variant="h5" gutterBottom>
          Course Materials
        </Typography>
        <List>
          {course.materials.map((material) => (
            <React.Fragment key={material.id}>
              <ListItem 
                component={Paper} 
                elevation={2} 
                sx={{ mb: 2, p: 2, borderRadius: 2 }}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={material.title}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip 
                        label={`Week ${material.week}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={material.type} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  }
                />
                <Button 
                  variant="outlined" 
                  size="small" 
                  component="a" 
                  href={material.url}
                  target="_blank"
                >
                  View
                </Button>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Syllabus Tab */}
      <Box hidden={activeTab !== 2}>
        <Typography variant="h5" gutterBottom>
          Course Syllabus
        </Typography>
        
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Learning Outcomes
          </Typography>
          <List>
            {course.syllabus.learningOutcomes.map((outcome, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={outcome} />
              </ListItem>
            ))}
          </List>
        </Paper>
        
        <Typography variant="h6" gutterBottom>
          Weekly Schedule
        </Typography>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {course.syllabus.weeklyTopics.map((week, index) => (
            <React.Fragment key={week.week}>
              <Box 
                sx={{ 
                  p: 2,
                  bgcolor: index % 2 === 0 ? 'background.paper' : '#f5f7fa'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Week {week.week}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {week.topic}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {week.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              {index < course.syllabus.weeklyTopics.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default CourseView;