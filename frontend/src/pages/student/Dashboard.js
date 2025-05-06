import {
    ArrowForward as ArrowForwardIcon,
    Assessment as AssessmentIcon,
    School as SchoolIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [upcomingAssessments, setUpcomingAssessments] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch enrolled courses
        const coursesResponse = await axios.get('/api/courses/enrolled');
        setCourses(coursesResponse.data.courses);

        // Fetch upcoming assessments
        const assessmentsResponse = await axios.get('/api/assessments/upcoming');
        setUpcomingAssessments(assessmentsResponse.data.assessments);

        // Fetch recent submissions
        const submissionsResponse = await axios.get('/api/submissions/recent');
        setRecentSubmissions(submissionsResponse.data.submissions);

        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
        console.error('Dashboard data error:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleAssessmentClick = (assessmentId) => {
    navigate(`/assessment/${assessmentId}`);
  };

  const handleSubmissionClick = (submissionId) => {
    navigate(`/results/${submissionId}`);
  };

  const handleLearningPathClick = (courseId) => {
    navigate(`/learning-path/${courseId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {currentUser?.name}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* My Courses Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SchoolIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5">My Courses</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {courses.length === 0 ? (
            <Alert severity="info">You are not enrolled in any courses yet.</Alert>
          ) : (
            <Grid container spacing={2}>
              {courses.map(course => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: '0.3s',
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.description.substring(0, 120)}...
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Chip 
                          size="small" 
                          color="primary" 
                          label={`${course.progress}% Complete`} 
                          sx={{ mr: 1 }}
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        onClick={() => handleCourseClick(course._id)}
                      >
                        View Course
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => handleLearningPathClick(course._id)}
                      >
                        Learning Path
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Upcoming Assessments Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
            <AssessmentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5">Upcoming Assessments</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {upcomingAssessments.length === 0 ? (
            <Alert severity="info">No upcoming assessments.</Alert>
          ) : (
            <Grid container spacing={2}>
              {upcomingAssessments.map(assessment => (
                <Grid item xs={12} key={assessment._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {assessment.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Course: {assessment.course.title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Chip 
                          size="small" 
                          color={new Date(assessment.dueDate) < new Date() ? "error" : "primary"} 
                          label={`Due: ${new Date(assessment.dueDate).toLocaleDateString()}`} 
                        />
                        <Button 
                          size="small" 
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => handleAssessmentClick(assessment._id)}
                        >
                          Take Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Recent Results Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
            <TimelineIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5">Recent Results</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {recentSubmissions.length === 0 ? (
            <Alert severity="info">No recent assessment results.</Alert>
          ) : (
            <Grid container spacing={2}>
              {recentSubmissions.map(submission => (
                <Grid item xs={12} key={submission._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {submission.assessment.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Course: {submission.course.title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Chip 
                          size="small" 
                          color={submission.overallScore >= 70 ? "success" : 
                                 submission.overallScore >= 50 ? "warning" : "error"} 
                          label={`Score: ${submission.overallScore}%`} 
                        />
                        <Button 
                          size="small" 
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => handleSubmissionClick(submission._id)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;