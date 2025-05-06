import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Menu,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

// Mock data for courses
const mockCourses = [
  {
    id: '1',
    title: 'Data Structures and Algorithms',
    code: 'CS301',
    department: 'Computer Science',
    term: 'Fall 2025',
    enrollment: 45,
    assessmentCount: 3,
    description: 'Introduction to fundamental data structures and algorithms used in computer science.',
    students: [
      { id: '1', name: 'Alex Johnson', email: 'alex.j@example.com', avgScore: 88 },
      { id: '2', name: 'Jamie Smith', email: 'jamie.s@example.com', avgScore: 92 },
      { id: '3', name: 'Taylor Williams', email: 'taylor.w@example.com', avgScore: 76 },
      // More students...
    ],
    assessments: [
      { id: '1', title: 'Midterm Exam', type: 'Exam', dueDate: '2025-10-15', avgScore: 82, submissions: 40 },
      { id: '2', title: 'Binary Trees Implementation', type: 'Programming Assignment', dueDate: '2025-11-01', avgScore: 89, submissions: 42 },
      { id: '3', title: 'Final Exam', type: 'Exam', dueDate: '2025-12-10', avgScore: 0, submissions: 0 }
    ],
    materials: [
      { id: '1', title: 'Introduction to Data Structures', type: 'Lecture Notes', week: 1, url: '#' },
      { id: '2', title: 'Array Implementation', type: 'Programming Example', week: 2, url: '#' },
      { id: '3', title: 'Linked Lists vs Arrays', type: 'Research Article', week: 3, url: '#' }
    ]
  },
  {
    id: '2',
    title: 'Introduction to Programming',
    code: 'CS101',
    department: 'Computer Science',
    term: 'Fall 2025',
    enrollment: 120,
    assessmentCount: 5,
    description: 'Fundamentals of programming using Python. No prior experience required.',
    students: [],
    assessments: [],
    materials: []
  },
  {
    id: '3',
    title: 'Web Development Fundamentals',
    code: 'CS240',
    department: 'Computer Science',
    term: 'Fall 2025',
    enrollment: 60,
    assessmentCount: 4,
    description: 'Introduction to web development including HTML, CSS, JavaScript, and responsive design.',
    students: [],
    assessments: [],
    materials: []
  }
];

const CourseManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [dialogItem, setDialogItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Load courses
  useEffect(() => {
    setLoading(true);
    
    // In a real app, this would fetch data from an API
    setTimeout(() => {
      setCourses(mockCourses);
      
      if (courseId) {
        const course = mockCourses.find(c => c.id === courseId);
        if (course) {
          setSelectedCourse(course);
        }
      }
      
      setLoading(false);
    }, 1000);
  }, [courseId]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle course selection
  const handleSelectCourse = (course) => {
    navigate(`/instructor/courses/${course.id}`);
  };
  
  // Handle create new course
  const handleCreateCourse = () => {
    // In a real app, this would navigate to a course creation form
    console.log('Create new course');
  };
  
  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle dialog open
  const handleOpenDialog = (action, item) => {
    setDialogAction(action);
    setDialogItem(item);
    setOpenDialog(true);
    handleMenuClose();
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle dialog confirm
  const handleConfirmDialog = () => {
    // Handle different actions based on dialogAction
    switch (dialogAction) {
      case 'delete-course':
        console.log('Delete course:', dialogItem);
        navigate('/instructor/courses');
        break;
      case 'delete-assessment':
        console.log('Delete assessment:', dialogItem);
        break;
      case 'delete-material':
        console.log('Delete material:', dialogItem);
        break;
      case 'remove-student':
        console.log('Remove student:', dialogItem);
        break;
      default:
        break;
    }
    
    handleCloseDialog();
  };
  
  // Handle create assessment
  const handleCreateAssessment = () => {
    navigate('/instructor/assessment');
  };
  
  // Handle edit assessment
  const handleEditAssessment = (assessmentId) => {
    navigate(`/instructor/assessment/${assessmentId}`);
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
  
  // If no course is selected, show the course list
  if (!selectedCourse) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Course Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreateCourse}
          >
            Create New Course
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {courses.map(course => (
            <Grid item xs={12} md={6} lg={4} key={course.id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {course.title}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={handleMenuOpen}
                      aria-label="course options"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleOpenDialog('delete-course', course)}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Delete Course
                      </MenuItem>
                    </Menu>
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {course.code} • {course.department}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {course.description}
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonAddIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.enrollment} Students
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AssessmentIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.assessmentCount} Assessments
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.term}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => handleSelectCourse(course)}
                  >
                    Manage Course
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Confirm Delete Dialog */}
        <Dialog
          open={openDialog && dialogAction === 'delete-course'}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Delete Course</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the course "{dialogItem?.title}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleConfirmDialog} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
  
  // Course detail view
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/instructor/courses')} 
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Back to Courses
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {selectedCourse.title}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AutoGraphIcon />}
            component={RouterLink}
            to={`/instructor/curriculum/${selectedCourse.id}`}
          >
            Curriculum Mapping
          </Button>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {selectedCourse.code} • {selectedCourse.department} • {selectedCourse.term}
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<AssessmentIcon />} label="Assessments" iconPosition="start" />
          <Tab icon={<PersonAddIcon />} label="Students" iconPosition="start" />
          <Tab icon={<MenuBookIcon />} label="Course Materials" iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Assessments Tab */}
      <Box hidden={activeTab !== 0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Assessments
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreateAssessment}
          >
            Create Assessment
          </Button>
        </Box>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Submissions</TableCell>
                <TableCell align="right">Avg. Score</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCourse.assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell component="th" scope="row">
                    {assessment.title}
                  </TableCell>
                  <TableCell>{assessment.type}</TableCell>
                  <TableCell>{new Date(assessment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    {assessment.submissions}/{selectedCourse.enrollment}
                  </TableCell>
                  <TableCell align="right">
                    {assessment.avgScore > 0 ? `${assessment.avgScore}%` : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditAssessment(assessment.id)}
                      aria-label="edit assessment"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog('delete-assessment', assessment)}
                      aria-label="delete assessment"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {selectedCourse.assessments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No assessments created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Students Tab */}
      <Box hidden={activeTab !== 1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Students
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<PersonAddIcon />}
              sx={{ mr: 2 }}
            >
              Add Students
            </Button>
            <Button 
              variant="contained" 
              component={RouterLink}
              to={`/instructor/student-results/${selectedCourse.id}`}
            >
              View Student Results
            </Button>
          </Box>
        </Box>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Average Score</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCourse.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell component="th" scope="row">
                    {student.name}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${student.avgScore}%`} 
                      color={
                        student.avgScore >= 90 ? 'success' :
                        student.avgScore >= 70 ? 'primary' :
                        student.avgScore >= 60 ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog('remove-student', student)}
                      aria-label="remove student"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {selectedCourse.students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No students enrolled yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Course Materials Tab */}
      <Box hidden={activeTab !== 2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Course Materials
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
          >
            Add Material
          </Button>
        </Box>
        
        <List>
          {selectedCourse.materials.map((material) => (
            <React.Fragment key={material.id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton 
                      edge="end" 
                      aria-label="edit material"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete material"
                      onClick={() => handleOpenDialog('delete-material', material)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
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
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
          {selectedCourse.materials.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No course materials added yet."
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </Box>
      
      {/* Dialogs */}
      <Dialog
        open={openDialog && dialogAction === 'delete-assessment'}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Assessment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the assessment "{dialogItem?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDialog} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={openDialog && dialogAction === 'delete-material'}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Course Material</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the material "{dialogItem?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDialog} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={openDialog && dialogAction === 'remove-student'}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Remove Student</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {dialogItem?.name} from this course?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDialog} color="error">Remove</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseManagement;