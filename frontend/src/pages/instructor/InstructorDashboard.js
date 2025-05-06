import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TodayIcon from '@mui/icons-material/Today';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PendingIcon from '@mui/icons-material/Pending';

// Mock data for instructor dashboard
const mockData = {
  instructor: {
    id: '1',
    name: 'Dr. Alex Johnson',
    department: 'Computer Science',
    avatar: null
  },
  courses: [
    {
      id: '1',
      title: 'Data Structures and Algorithms',
      code: 'CS301',
      term: 'Fall 2025',
      enrollment: 45,
      assessmentCount: 3,
      recentActivity: true
    },
    {
      id: '2',
      title: 'Introduction to Programming',
      code: 'CS101',
      term: 'Fall 2025',
      enrollment: 120,
      assessmentCount: 5,
      recentActivity: false
    },
    {
      id: '3',
      title: 'Web Development Fundamentals',
      code: 'CS240',
      term: 'Fall 2025',
      enrollment: 60,
      assessmentCount: 4,
      recentActivity: true
    }
  ],
  recentAssessments: [
    {
      id: '1',
      title: 'Midterm Exam',
      courseTitle: 'Data Structures and Algorithms',
      courseCode: 'CS301',
      dueDate: '2025-10-15',
      submissionRate: 88,
      avgScore: 82
    },
    {
      id: '2',
      title: 'Programming Assignment 3',
      courseTitle: 'Introduction to Programming',
      courseCode: 'CS101',
      dueDate: '2025-10-10',
      submissionRate: 95,
      avgScore: 78
    },
    {
      id: '3',
      title: 'Frontend Project',
      courseTitle: 'Web Development Fundamentals',
      courseCode: 'CS240',
      dueDate: '2025-10-20',
      submissionRate: 75,
      avgScore: 85
    }
  ],
  upcomingAssessments: [
    {
      id: '4',
      title: 'Binary Trees Implementation',
      courseTitle: 'Data Structures and Algorithms',
      courseCode: 'CS301',
      dueDate: '2025-11-01',
      status: 'Published'
    },
    {
      id: '5',
      title: 'Final Project',
      courseTitle: 'Introduction to Programming',
      courseCode: 'CS101',
      dueDate: '2025-11-15',
      status: 'Draft'
    },
    {
      id: '6',
      title: 'Backend Integration Quiz',
      courseTitle: 'Web Development Fundamentals',
      courseCode: 'CS240',
      dueDate: '2025-10-28',
      status: 'Published'
    }
  ],
  pendingGrading: [
    {
      id: '1',
      title: 'Midterm Exam',
      courseTitle: 'Data Structures and Algorithms',
      courseCode: 'CS301',
      submissionCount: 5,
      totalStudents: 45
    },
    {
      id: '2',
      title: 'Programming Assignment 3',
      courseTitle: 'Introduction to Programming',
      courseCode: 'CS101',
      submissionCount: 12,
      totalStudents: 120
    }
  ],
  notifications: [
    {
      id: '1',
      message: 'New submissions awaiting grading in CS301 Midterm Exam',
      date: '2025-10-13',
      type: 'grading'
    },
    {
      id: '2',
      message: 'Low submission rate for Frontend Project in CS240',
      date: '2025-10-11',
      type: 'warning'
    },
    {
      id: '3',
      message: 'Syllabus analysis complete for CS101',
      date: '2025-10-09',
      type: 'info'
    }
  ],
  insights: [
    {
      id: '1',
      title: 'Course Performance',
      description: 'CS101 student performance is 15% lower than previous term, consider additional review sessions.',
      type: 'warning'
    },
    {
      id: '2',
      title: 'Topic Mastery',
      description: 'Students showing strong mastery in data structures but struggling with algorithm complexity analysis.',
      type: 'info'
    },
    {
      id: '3',
      title: 'Assessment Effectiveness',
      description: 'Multi-stage projects in CS240 showing better learning outcomes than traditional exams.',
      type: 'success'
    }
  ]
};

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1200);
  }, []);
  
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
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome and Overview */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome back, {data.instructor.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AssessmentIcon />}
              onClick={() => navigate('/instructor/assessment')}
            >
              Create Assessment
            </Button>
          </Box>
        </Grid>
        
        {/* Quick Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h5" component="div">
                    {data.courses.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Courses
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SchoolIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h5" component="div">
                    {data.courses.reduce((total, course) => total + course.enrollment, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Students
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <PersonIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h5" component="div">
                    {data.courses.reduce((total, course) => total + course.assessmentCount, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Assessments
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AssessmentIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h5" component="div">
                    {data.pendingGrading.reduce((total, item) => total + item.submissionCount, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Submissions
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <PendingIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* My Courses */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                My Courses
              </Typography>
              <Button 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/instructor/courses')}
              >
                View All
              </Button>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Term</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Students</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Assessments</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Activity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.courses.map((course) => (
                    <TableRow 
                      key={course.id} 
                      hover 
                      onClick={() => navigate(`/instructor/courses/${course.id}`)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Typography variant="body1">
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{course.term}</TableCell>
                      <TableCell align="right">{course.enrollment}</TableCell>
                      <TableCell align="right">{course.assessmentCount}</TableCell>
                      <TableCell align="right">
                        {course.recentActivity ? (
                          <Chip 
                            size="small" 
                            label="Active" 
                            color="success" 
                            variant="outlined"
                          />
                        ) : (
                          <Chip 
                            size="small" 
                            label="Quiet" 
                            color="default" 
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Notifications
              </Typography>
              <IconButton>
                <NotificationsIcon />
              </IconButton>
            </Box>
            
            <List>
              {data.notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {notification.type === 'grading' && <AssignmentTurnedInIcon color="primary" />}
                      {notification.type === 'warning' && <ErrorIcon color="warning" />}
                      {notification.type === 'info' && <InfoIcon color="info" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.message}
                      secondary={new Date(notification.date).toLocaleDateString()}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Assessment Insights */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Assessment Insights
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {data.insights.map((insight) => (
                <Grid item xs={12} md={4} key={insight.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderLeft: 5, 
                      borderColor: 
                        insight.type === 'warning' ? 'warning.main' : 
                        insight.type === 'success' ? 'success.main' : 
                        'info.main'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2">
                        {insight.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        {/* Recent Assessments */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Recent Assessments
            </Typography>
            
            <List>
              {data.recentAssessments.map((assessment) => (
                <React.Fragment key={assessment.id}>
                  <ListItem 
                    button 
                    component={RouterLink} 
                    to={`/instructor/student-results/${assessment.id}`}
                  >
                    <ListItemText
                      primary={assessment.title}
                      secondary={`${assessment.courseCode}: ${assessment.courseTitle}`}
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="Submission Rate">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AssignmentTurnedInIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">
                              {assessment.submissionRate}%
                            </Typography>
                          </Box>
                        </Tooltip>
                        <Tooltip title="Average Score">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {assessment.avgScore >= 80 ? (
                              <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                            ) : (
                              <TrendingDownIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                            )}
                            <Typography variant="body2">
                              {assessment.avgScore}%
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Upcoming Assessments */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Upcoming Assessments
            </Typography>
            
            <List>
              {data.upcomingAssessments.map((assessment) => (
                <React.Fragment key={assessment.id}>
                  <ListItem 
                    button 
                    component={RouterLink} 
                    to={`/instructor/assessment/${assessment.id}`}
                  >
                    <ListItemIcon>
                      <EventIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={assessment.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span">
                            {assessment.courseCode}: {assessment.courseTitle}
                          </Typography>
                          <br />
                          <Typography variant="body2" component="span" color="text.secondary">
                            Due: {new Date(assessment.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip 
                        size="small" 
                        label={assessment.status} 
                        color={assessment.status === 'Published' ? 'success' : 'default'} 
                        variant="outlined"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Pending Items */}
        <Grid item xs={12}>
          <Alert 
            severity="warning" 
            icon={<PendingIcon />}
            sx={{ borderRadius: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                component={RouterLink} 
                to="/instructor/student-results"
              >
                Grade Now
              </Button>
            }
          >
            <Typography variant="subtitle2">
              You have {data.pendingGrading.reduce((total, item) => total + item.submissionCount, 0)} submissions waiting to be graded
            </Typography>
            <Typography variant="body2">
              Includes submissions from: {data.pendingGrading.map(item => item.courseCode).join(', ')}
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InstructorDashboard;