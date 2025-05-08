import {
    ArrowBack as ArrowBackIcon,
    Assessment as AssessmentIcon,
    Description as DescriptionIcon,
    Person as PersonIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button, Card, CardContent,
    Chip, CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Tab,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Mock data moved to a separate constant at the bottom for clarity

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-results-tabpanel-${index}`}
      aria-labelledby={`student-results-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StudentResults = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const isInstructor = currentUser?.role === 'instructor';
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('score');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const assessmentId = queryParams.get('assessment');
    if (assessmentId) {
      setSelectedAssessment(assessmentId);
    }
    
    // In a real app, you would fetch this data from your API
    const timer = setTimeout(() => {
      setResults(mockStudentResults);
      setStatistics(mockStatistics);
      setAssessments(mockAssessments);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [courseId, location.search]);
  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleFilterChange = (type, value) => {
    if (type === 'assessment') {
      setSelectedAssessment(value);
    } else if (type === 'status') {
      setSelectedStatus(value);
    }
    setPage(0);
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
    
    // Fetch student details - in a real app, this would be an API call
    const student = mockStudentResults.find(s => s.id === studentId);
    if (student) {
      setStudentDetail(student);
    }
  };
  
  const filteredResults = results
    .filter(result => {
      // Apply assessment filter
      if (selectedAssessment !== 'all' && result.assessmentTitle !== selectedAssessment) {
        return false;
      }
      
      // Apply status filter
      if (selectedStatus !== 'all' && result.status !== selectedStatus) {
        return false;
      }
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          result.name.toLowerCase().includes(searchLower) ||
          result.email.toLowerCase().includes(searchLower) ||
          result.studentId.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (orderBy === 'submissionDate') {
        return order === 'asc'
          ? new Date(a.submissionDate) - new Date(b.submissionDate)
          : new Date(b.submissionDate) - new Date(a.submissionDate);
      }
      
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      if (typeof aValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
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
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(`/instructor/courses/${courseId}`)} 
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Back to Course
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Assessment Results
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {assessments.find(a => a.id === selectedAssessment)?.title || 'All Assessments'}
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<AssessmentIcon />} label="Assessment Results" iconPosition="start" />
          <Tab icon={<PersonIcon />} label="Student Performance" iconPosition="start" disabled={!selectedStudentId} />
          <Tab icon={<TrendingUpIcon />} label="Statistics" iconPosition="start" />
          <Tab icon={<DescriptionIcon />} label="Question Analysis" iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Assessment Results Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ p: 3, borderRadius: 2 }}
            >
              {/* Filters and Search would go here */}
              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Assessment</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Submission Date</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Score</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Time Spent</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow 
                        key={result.id}
                        hover
                        onClick={() => handleStudentSelect(result.id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {result.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {result.studentId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{result.assessmentTitle}</TableCell>
                        <TableCell>
                          {new Date(result.submissionDate).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${result.score}/${result.maxScore}`} 
                            color={
                              result.score / result.maxScore >= 0.9 ? 'success' :
                              result.score / result.maxScore >= 0.7 ? 'primary' :
                              result.score / result.maxScore >= 0.6 ? 'warning' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={result.status} 
                            color={
                              result.status === 'Completed' ? 'success' :
                              result.status === 'Needs Review' ? 'warning' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {result.timeSpent} min
                        </TableCell>
                        <TableCell align="right">
                          <Button 
                            size="small" 
                            color="primary"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/results/${result.id}`);
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredResults.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography color="text.secondary">
                            No results matching your filters
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Pagination would go here */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Student Performance Tab */}
      <TabPanel value={tabValue} index={1}>
        {studentDetail ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {studentDetail.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {studentDetail.studentId} • {studentDetail.email}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Performance Summary
                </Typography>
                {/* Student performance details would go here */}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">
            Select a student from the results tab to view detailed performance
          </Alert>
        )}
      </TabPanel>
      
      {/* Statistics Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Score Distribution
                </Typography>
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Score distribution chart would appear here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assessment Statistics
                </Typography>
                {statistics ? (
                  <Box>
                    <Typography variant="body1">
                      Average Score: {statistics.averageScore}%
                    </Typography>
                    <Typography variant="body1">
                      Median Score: {statistics.medianScore}%
                    </Typography>
                    <Typography variant="body1">
                      Highest Score: {statistics.highestScore}%
                    </Typography>
                    <Typography variant="body1">
                      Lowest Score: {statistics.lowestScore}%
                    </Typography>
                    <Typography variant="body1">
                      Standard Deviation: {statistics.standardDeviation}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No statistics available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Question Analysis Tab */}
      <TabPanel value={tabValue} index={3}>
        <Alert severity="info" sx={{ mb: 3 }}>
          This section shows analysis of student performance on individual questions.
        </Alert>
        <Typography variant="body1" color="text.secondary" align="center">
          Question analysis interface would be shown here
        </Typography>
      </TabPanel>
    </Container>
  );
};

// Mock data
const mockStudentResults = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.j@example.edu',
    studentId: 'S1001',
    assessmentTitle: 'Midterm Exam',
    courseCode: 'CS301',
    score: 92,
    maxScore: 100,
    submissionDate: '2025-10-12T14:30:00',
    status: 'Completed',
    feedbackProvided: true,
    attempts: 1,
    timeSpent: 75, // minutes
    improvement: 10
  },
  {
    id: '2',
    name: 'Liam Williams',
    email: 'l.williams@example.edu',
    studentId: 'S1002',
    assessmentTitle: 'Midterm Exam',
    courseCode: 'CS301',
    score: 78,
    maxScore: 100,
    submissionDate: '2025-10-12T13:45:00',
    status: 'Completed',
    feedbackProvided: true,
    attempts: 1,
    timeSpent: 90, // minutes
    improvement: -5
  },
  {
    id: '3',
    name: 'Olivia Smith',
    email: 'o.smith@example.edu',
    studentId: 'S1003',
    assessmentTitle: 'Midterm Exam',
    courseCode: 'CS301',
    score: 85,
    maxScore: 100,
    submissionDate: '2025-10-12T15:20:00',
    status: 'Completed',
    feedbackProvided: true,
    attempts: 1,
    timeSpent: 65, // minutes
    improvement: 5
  }
];

const mockStatistics = {
  averageScore: 83.2,
  medianScore: 84,
  highestScore: 95,
  lowestScore: 68,
  standardDeviation: 7.8,
  submissionRate: 92,
  completionRate: 100,
  averageTimeSpent: 78, // minutes
  needsReviewCount: 2
};

const mockAssessments = [
  { id: '1', title: 'Midterm Exam', courseCode: 'CS301', type: 'Exam', dueDate: '2025-10-12' },
  { id: '2', title: 'Programming Assignment 3', courseCode: 'CS101', type: 'Assignment', dueDate: '2025-10-10' },
  { id: '3', title: 'Frontend Project', courseCode: 'CS240', type: 'Project', dueDate: '2025-10-20' }
];

export default StudentResults;