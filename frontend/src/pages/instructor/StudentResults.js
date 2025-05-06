import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Chip,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  MenuItem,
  InputAdornment,
  Divider,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

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
  },
  {
    id: '4',
    name: 'Noah Brown',
    email: 'noah.b@example.edu',
    studentId: 'S1004',
    assessmentTitle: 'Midterm Exam',
    courseCode: 'CS301',
    score: 90,
    maxScore: 100,
    submissionDate: '2025-10-12T14:00:00',
    status: 'Completed',
    feedbackProvided: false,
    attempts: 1,
    timeSpent: 70, // minutes
    improvement: 0
  },
  {
    id: '5',
    name: 'Sophia Davis',
    email: 's.davis@example.edu',
    studentId: 'S1005',
    assessmentTitle: 'Midterm Exam',
    courseCode: 'CS301',
    score: 88,
    maxScore: 100,
    submissionDate: '2025-10-12T13:30:00',
    status: 'Completed',
    feedbackProvided: true,
    attempts: 1,
    timeSpent: 85, // minutes
    improvement: 8
  },
  {
    id: '6',
    name: 'James Garcia',
    email: 'j.garcia@example.edu',
    studentId: 'S1006',
    assessmentTitle: 'Midterm Exam',
    courseCode: 'CS301',
    score: 68,
    maxScore: 100,
    submissionDate: '2025-10-12T15:50:00',
    status: 'Needs Review',
    feedbackProvided: false,
    attempts: 1,
    timeSpent: 95, // minutes
    improvement: -12
  },
  {
    id: '7',
    name: 'Ava Martinez',
    email: 'a.martinez@example.edu',
    studentId: 'S1007',
    assessmentTitle: 'Midterm Exam',
    courseCode: 'CS301',
    score: 75,
    maxScore: 100,
    submissionDate: '2025-10-12T14:15:00',
    status: 'Completed',
    feedbackProvided: true,
    attempts: 1,
    timeSpent: 80, // minutes
    improvement: 3
  },
  {
    id: '8',
    name: 'William Lee',
    email: 'w.lee@example.edu',
    studentId: 'S1008',
    assessmentTitle: 'Midterm Exam',
    courseCode: 'CS301',
    score: 95,
    maxScore: 100,
    submissionDate: '2025-10-12T13:20:00',
    status: 'Completed',
    feedbackProvided: true,
    attempts: 1,
    timeSpent: 60, // minutes
    improvement: 15
  },
  {
    id: '9',
    name: 'Isabella Clark',
    email: 'i.clark@example.edu',
    studentId: 'S1009',
    assessmentTitle: 'Midterm Exam',
    courseCode: 'CS301',
    score: 82,
    maxScore: 100,
    submissionDate: '2025-10-12T15:40:00',
    status: 'Completed',
    feedbackProvided: false,
    attempts: 1,
    timeSpent: 75, // minutes
    improvement: 7
  },
  {
    id: '10',
    name: 'Mason Chen',
    email: 'm.chen@example.edu',
    studentId: 'S1010',
    assessmentTitle: 'Midterm Exam',
    courseCode: 'CS301',
    score: 79,
    maxScore: 100,
    submissionDate: '2025-10-12T14:50:00',
    status: 'Needs Review',
    feedbackProvided: false,
    attempts: 1,
    timeSpent: 88, // minutes
    improvement: -2
  }
];

const mockAssessments = [
  { id: '1', title: 'Midterm Exam', courseCode: 'CS301', type: 'Exam', dueDate: '2025-10-12' },
  { id: '2', title: 'Programming Assignment 3', courseCode: 'CS101', type: 'Assignment', dueDate: '2025-10-10' },
  { id: '3', title: 'Frontend Project', courseCode: 'CS240', type: 'Project', dueDate: '2025-10-20' }
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
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

const StudentResults = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [assessments, setAssessments] = useState([]);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('score');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const timer = setTimeout(() => {
      setResults(mockStudentResults);
      setStatistics(mockStatistics);
      setAssessments(mockAssessments);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [courseId]);
  
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
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleAssessmentFilterChange = (event) => {
    setSelectedAssessment(event.target.value);
    setPage(0);
  };
  
  const handleStatusFilterChange = (event) => {
    setSelectedStatus(event.target.value);
    setPage(0);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter results based on search and filter options
  const filteredResults = results.filter(result => {
    const matchesSearch = 
      result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAssessment = 
      selectedAssessment === 'all' || 
      result.assessmentTitle === selectedAssessment;
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      result.status === selectedStatus;
    
    return matchesSearch && matchesAssessment && matchesStatus;
  });
  
  // Sort results
  const sortedResults = filteredResults.sort((a, b) => {
    let comparison = 0;
    
    if (orderBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (orderBy === 'score') {
      comparison = a.score - b.score;
    } else if (orderBy === 'submissionDate') {
      comparison = new Date(a.submissionDate) - new Date(b.submissionDate);
    } else if (orderBy === 'timeSpent') {
      comparison = a.timeSpent - b.timeSpent;
    } else if (orderBy === 'improvement') {
      comparison = a.improvement - b.improvement;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
  
  // Paginate results
  const paginatedResults = sortedResults.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Results
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and analyze student performance across assessments
        </Typography>
      </Box>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Results Table" />
        <Tab label="Analytics Dashboard" />
      </Tabs>
      
      <TabPanel value={tabValue} index={0}>
        {/* Filters and Actions */}
        <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search Students"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Assessment"
                variant="outlined"
                size="small"
                value={selectedAssessment}
                onChange={handleAssessmentFilterChange}
              >
                <MenuItem value="all">All Assessments</MenuItem>
                {assessments.map((assessment) => (
                  <MenuItem key={assessment.id} value={assessment.title}>
                    {assessment.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                variant="outlined"
                size="small"
                value={selectedStatus}
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Needs Review">Needs Review</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                Export Results
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Results Table */}
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Student
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'score'}
                      direction={orderBy === 'score' ? order : 'asc'}
                      onClick={() => handleRequestSort('score')}
                    >
                      Score
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'submissionDate'}
                      direction={orderBy === 'submissionDate' ? order : 'asc'}
                      onClick={() => handleRequestSort('submissionDate')}
                    >
                      Submitted
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'timeSpent'}
                      direction={orderBy === 'timeSpent' ? order : 'asc'}
                      onClick={() => handleRequestSort('timeSpent')}
                    >
                      Time Spent
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'improvement'}
                      direction={orderBy === 'improvement' ? order : 'asc'}
                      onClick={() => handleRequestSort('improvement')}
                    >
                      Progress
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedResults.map((result) => (
                  <TableRow 
                    key={result.id}
                    hover
                    onClick={() => navigate(`/results/${result.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body1">{result.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {result.studentId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 'medium',
                            color: 
                              result.score >= 90 ? 'success.main' : 
                              result.score >= 70 ? 'primary.main' : 
                              'error.main'
                          }}
                        >
                          {result.score} / {result.maxScore}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(result.submissionDate).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {result.timeSpent} min
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {result.improvement > 0 ? (
                          <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                        ) : result.improvement < 0 ? (
                          <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                        ) : (
                          <TrendingFlatIcon color="action" sx={{ mr: 1 }} />
                        )}
                        <Typography 
                          variant="body2"
                          sx={{ 
                            color: 
                              result.improvement > 0 ? 'success.main' : 
                              result.improvement < 0 ? 'error.main' : 
                              'text.secondary'
                          }}
                        >
                          {result.improvement > 0 ? '+' : ''}{result.improvement}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={result.status} 
                        size="small"
                        color={result.status === 'Completed' ? 'success' : 'warning'}
                        variant={result.status === 'Completed' ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      {result.feedbackProvided ? (
                        <Chip 
                          label="Provided" 
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      ) : (
                        <Button size="small" variant="outlined" color="primary">
                          Add Feedback
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredResults.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {/* Analytics Dashboard */}
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} md={3}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Average Score
                </Typography>
                <Typography variant="h4" component="div">
                  {statistics.averageScore.toFixed(1)}%
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                    <CircularProgress
                      variant="determinate"
                      value={statistics.averageScore}
                      sx={{ color: 
                        statistics.averageScore >= 85 ? 'success.main' : 
                        statistics.averageScore >= 70 ? 'primary.main' : 
                        'error.main' 
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {statistics.averageScore > 80 ? (
                      <TrendingUpIcon color="success" sx={{ mr: 0.5 }} fontSize="small" />
                    ) : (
                      <TrendingFlatIcon color="action" sx={{ mr: 0.5 }} fontSize="small" />
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Class Performance
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Submission Rate
                </Typography>
                <Typography variant="h4" component="div">
                  {statistics.submissionRate}%
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                    <CircularProgress
                      variant="determinate"
                      value={statistics.submissionRate}
                      sx={{ color: 'info.main' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {results.length} students
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Average Time
                </Typography>
                <Typography variant="h4" component="div">
                  {statistics.averageTimeSpent} min
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <TrendingFlatIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Per assessment
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Needs Review
                </Typography>
                <Typography variant="h4" component="div">
                  {statistics.needsReviewCount}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Button size="small" variant="outlined" color="warning">
                    Review Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Score Distribution */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Score Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Score distribution chart would appear here
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Highest Score
                    </TableCell>
                    <TableCell align="right">{statistics.highestScore}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Lowest Score
                    </TableCell>
                    <TableCell align="right">{statistics.lowestScore}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Median Score
                    </TableCell>
                    <TableCell align="right">{statistics.medianScore}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Standard Deviation
                    </TableCell>
                    <TableCell align="right">{statistics.standardDeviation.toFixed(1)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Completion Rate
                    </TableCell>
                    <TableCell align="right">{statistics.completionRate}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          
          {/* Time Analysis */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Time Analysis
              </Typography>
              <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Time spent vs. score correlation chart would appear here
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Export Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
              >
                Export CSV
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<AssessmentIcon />}
              >
                Generate Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default StudentResults;