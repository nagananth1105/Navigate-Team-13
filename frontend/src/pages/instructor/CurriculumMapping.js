import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
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
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Mock data for curriculum mapping
const mockCourse = {
  id: '1',
  title: 'Data Structures and Algorithms',
  code: 'CS301',
  description: 'Introduction to fundamental data structures and algorithms used in computer science.',
  learningOutcomes: [
    {
      id: '1',
      text: 'Understand fundamental data structures and their implementations',
      bloom: 'Understand',
      competency: 'Core',
      assessments: ['1', '3']
    },
    {
      id: '2',
      text: 'Analyze algorithm complexity using Big O notation',
      bloom: 'Analyze',
      competency: 'Core',
      assessments: ['1']
    },
    {
      id: '3',
      text: 'Implement and use common data structures such as lists, stacks, queues, trees, and graphs',
      bloom: 'Apply',
      competency: 'Advanced',
      assessments: ['2', '3']
    },
    {
      id: '4',
      text: 'Apply appropriate data structures to solve programming problems',
      bloom: 'Apply',
      competency: 'Advanced',
      assessments: ['2', '3']
    },
    {
      id: '5',
      text: 'Compare and evaluate algorithms for efficiency',
      bloom: 'Evaluate',
      competency: 'Advanced',
      assessments: ['3']
    }
  ],
  assessments: [
    {
      id: '1',
      title: 'Midterm Exam',
      type: 'Exam',
      topics: ['Arrays', 'Lists', 'Stacks', 'Queues', 'Algorithm Analysis'],
      questions: 20,
      totalPoints: 100
    },
    {
      id: '2',
      title: 'Binary Trees Implementation',
      type: 'Programming Assignment',
      topics: ['Trees', 'Recursion'],
      questions: 3,
      totalPoints: 50
    },
    {
      id: '3',
      title: 'Final Exam',
      type: 'Exam',
      topics: ['All Topics', 'Advanced Algorithms'],
      questions: 25,
      totalPoints: 150
    }
  ],
  topics: [
    'Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Hashing', 
    'Algorithm Analysis', 'Recursion', 'Sorting Algorithms', 'Search Algorithms'
  ],
  programOutcomes: [
    {
      id: '1',
      text: 'Apply knowledge of computing and mathematics appropriate to the program\'s student outcomes and to the discipline',
      mappedOutcomes: ['1', '2']
    },
    {
      id: '2',
      text: 'Analyze a problem, and identify and define the computing requirements appropriate to its solution',
      mappedOutcomes: ['2', '4', '5']
    },
    {
      id: '3',
      text: 'Design, implement, and evaluate a computer-based system, process, component, or program to meet desired needs',
      mappedOutcomes: ['3', '4']
    },
    {
      id: '4',
      text: 'Use current techniques, skills, and tools necessary for computing practice',
      mappedOutcomes: ['3', '4']
    }
  ]
};

// Bloom's Taxonomy Levels
const bloomLevels = [
  { value: 'Remember', color: '#e3f2fd' },
  { value: 'Understand', color: '#bbdefb' },
  { value: 'Apply', color: '#90caf9' },
  { value: 'Analyze', color: '#64b5f6' },
  { value: 'Evaluate', color: '#42a5f5' },
  { value: 'Create', color: '#2196f3' }
];

// Competency Levels
const competencyLevels = [
  { value: 'Introductory', color: '#c8e6c9' },
  { value: 'Core', color: '#81c784' },
  { value: 'Advanced', color: '#4caf50' }
];

const CurriculumMapping = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [editingOutcome, setEditingOutcome] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredCell, setHoveredCell] = useState(null);
  
  // Load course data
  useEffect(() => {
    setLoading(true);
    
    // In a real app, this would fetch data from an API
    setTimeout(() => {
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);
  }, [courseId]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Open edit dialog
  const handleOpenEditDialog = (outcome) => {
    setEditingOutcome({ ...outcome });
    setOpenDialog(true);
  };
  
  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOutcome(null);
  };
  
  // Save outcome changes
  const handleSaveOutcome = () => {
    // In a real app, you would save the changes to the database
    console.log('Saving outcome:', editingOutcome);
    
    // Update the local state
    setCourse(prevCourse => ({
      ...prevCourse,
      learningOutcomes: prevCourse.learningOutcomes.map(outcome => 
        outcome.id === editingOutcome.id ? editingOutcome : outcome
      )
    }));
    
    handleCloseDialog();
  };
  
  // Handle generating outcomes with AI
  const handleGenerateOutcomes = () => {
    setGenerating(true);
    
    // In a real app, this would call an API to generate outcomes
    setTimeout(() => {
      // Simulate receiving AI-generated outcomes
      const aiGeneratedOutcomes = [
        {
          id: '6',
          text: 'Design and implement efficient algorithms for common computational problems',
          bloom: 'Create',
          competency: 'Advanced',
          assessments: []
        },
        {
          id: '7',
          text: 'Evaluate the trade-offs between different data structures for specific applications',
          bloom: 'Evaluate',
          competency: 'Advanced',
          assessments: []
        }
      ];
      
      setCourse(prevCourse => ({
        ...prevCourse,
        learningOutcomes: [...prevCourse.learningOutcomes, ...aiGeneratedOutcomes]
      }));
      
      setGenerating(false);
    }, 3000);
  };
  
  // Helper to get color for Bloom's level
  const getBloomColor = (level) => {
    const bloom = bloomLevels.find(b => b.value === level);
    return bloom ? bloom.color : '#e0e0e0';
  };
  
  // Helper to get color for competency level
  const getCompetencyColor = (level) => {
    const competency = competencyLevels.find(c => c.value === level);
    return competency ? competency.color : '#e0e0e0';
  };
  
  // Check if outcome is mapped to assessment
  const isOutcomeMappedToAssessment = (outcome, assessmentId) => {
    return outcome.assessments.includes(assessmentId);
  };
  
  // Helper to toggle assessment mapping
  const toggleAssessmentMapping = (outcomeId, assessmentId) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      learningOutcomes: prevCourse.learningOutcomes.map(outcome => {
        if (outcome.id === outcomeId) {
          const assessments = outcome.assessments.includes(assessmentId)
            ? outcome.assessments.filter(id => id !== assessmentId)
            : [...outcome.assessments, assessmentId];
          
          return { ...outcome, assessments };
        }
        return outcome;
      })
    }));
  };
  
  // Helper to toggle program outcome mapping
  const toggleProgramOutcomeMapping = (programOutcomeId, learningOutcomeId) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      programOutcomes: prevCourse.programOutcomes.map(outcome => {
        if (outcome.id === programOutcomeId) {
          const mappedOutcomes = outcome.mappedOutcomes.includes(learningOutcomeId)
            ? outcome.mappedOutcomes.filter(id => id !== learningOutcomeId)
            : [...outcome.mappedOutcomes, learningOutcomeId];
          
          return { ...outcome, mappedOutcomes };
        }
        return outcome;
      })
    }));
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
  
  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Course not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/instructor/courses')}
          sx={{ mt: 2 }}
        >
          Back to Courses
        </Button>
      </Container>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Curriculum Mapping
          </Typography>
          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
            onClick={handleGenerateOutcomes}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate Outcomes with AI'}
          </Button>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {course.title} ({course.code})
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Course Learning Outcomes
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="These are specific, measurable statements that define what students should know and be able to do upon completion of the course.">
              <IconButton size="small">
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Learning Outcome</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Bloom's Level</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Competency</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {course.learningOutcomes.map((outcome) => (
                <TableRow key={outcome.id} hover>
                  <TableCell>{outcome.text}</TableCell>
                  <TableCell>
                    <Chip 
                      label={outcome.bloom} 
                      size="small" 
                      sx={{ bgcolor: getBloomColor(outcome.bloom) }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={outcome.competency} 
                      size="small" 
                      sx={{ bgcolor: getCompetencyColor(outcome.competency) }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit Outcome">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenEditDialog(outcome)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<AssessmentIcon />} label="Assessment Mapping" iconPosition="start" />
          <Tab icon={<SchoolIcon />} label="Program Outcome Mapping" iconPosition="start" />
          <Tab icon={<AutoGraphIcon />} label="Coverage Analysis" iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Assessment Mapping Tab */}
      <Box hidden={activeTab !== 0}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Assessment Mapping
            </Typography>
            <Tooltip title="Map learning outcomes to specific assessments to ensure proper coverage.">
              <IconButton size="small">
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Learning Outcome</TableCell>
                  {course.assessments.map((assessment) => (
                    <TableCell 
                      key={assessment.id} 
                      align="center" 
                      sx={{ fontWeight: 'bold' }}
                    >
                      {assessment.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {course.learningOutcomes.map((outcome) => (
                  <TableRow key={outcome.id} hover>
                    <TableCell>{outcome.text}</TableCell>
                    {course.assessments.map((assessment) => (
                      <TableCell 
                        key={assessment.id} 
                        align="center" 
                        onClick={() => toggleAssessmentMapping(outcome.id, assessment.id)}
                        onMouseEnter={() => setHoveredCell(`${outcome.id}-${assessment.id}`)}
                        onMouseLeave={() => setHoveredCell(null)}
                        sx={{ 
                          cursor: 'pointer',
                          bgcolor: isOutcomeMappedToAssessment(outcome, assessment.id) 
                            ? '#c8e6c9' 
                            : hoveredCell === `${outcome.id}-${assessment.id}` ? '#f0f0f0' : 'inherit',
                          '&:hover': {
                            bgcolor: isOutcomeMappedToAssessment(outcome, assessment.id) 
                              ? '#a5d6a7' 
                              : '#e0e0e0'
                          }
                        }}
                      >
                        {isOutcomeMappedToAssessment(outcome, assessment.id) && (
                          <CheckCircleIcon color="success" fontSize="small" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 3 }}>
            <Alert severity="info">
              Click on cells to toggle assessment mapping. Each learning outcome should be assessed by at least one assessment.
            </Alert>
          </Box>
        </Paper>
      </Box>
      
      {/* Program Outcome Mapping Tab */}
      <Box hidden={activeTab !== 1}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Program Outcome Mapping
            </Typography>
            <Tooltip title="Map course learning outcomes to program-level outcomes to ensure curriculum alignment.">
              <IconButton size="small">
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Program Outcome</TableCell>
                  {course.learningOutcomes.map((outcome, index) => (
                    <TableCell 
                      key={outcome.id} 
                      align="center" 
                      sx={{ fontWeight: 'bold' }}
                    >
                      CLO {index + 1}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {course.programOutcomes.map((programOutcome) => (
                  <TableRow key={programOutcome.id} hover>
                    <TableCell>{programOutcome.text}</TableCell>
                    {course.learningOutcomes.map((learningOutcome) => {
                      const isMapped = programOutcome.mappedOutcomes.includes(learningOutcome.id);
                      const cellId = `${programOutcome.id}-${learningOutcome.id}`;
                      
                      return (
                        <TableCell 
                          key={learningOutcome.id} 
                          align="center" 
                          onClick={() => toggleProgramOutcomeMapping(programOutcome.id, learningOutcome.id)}
                          onMouseEnter={() => setHoveredCell(cellId)}
                          onMouseLeave={() => setHoveredCell(null)}
                          sx={{ 
                            cursor: 'pointer',
                            bgcolor: isMapped 
                              ? '#bbdefb' 
                              : hoveredCell === cellId ? '#f0f0f0' : 'inherit',
                            '&:hover': {
                              bgcolor: isMapped ? '#90caf9' : '#e0e0e0'
                            }
                          }}
                        >
                          {isMapped && (
                            <CheckCircleIcon color="primary" fontSize="small" />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 3 }}>
            <Alert severity="info">
              Click on cells to toggle program outcome mapping. This helps ensure your course contributes to the overall program goals.
            </Alert>
          </Box>
        </Paper>
      </Box>
      
      {/* Coverage Analysis Tab */}
      <Box hidden={activeTab !== 2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Bloom's Taxonomy Distribution
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {bloomLevels.map(level => {
                  const outcomesCount = course.learningOutcomes.filter(o => o.bloom === level.value).length;
                  const percentage = (outcomesCount / course.learningOutcomes.length) * 100;
                  
                  return (
                    <Box key={level.value} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{level.value}</Typography>
                        <Typography variant="body2">{outcomesCount} ({percentage.toFixed(0)}%)</Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          height: 20, 
                          bgcolor: level.color,
                          width: `${percentage}%`,
                          minWidth: '10px',
                          borderRadius: 1
                        }} 
                      />
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Assessment Coverage
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {course.learningOutcomes.map((outcome, index) => {
                  const coverage = (outcome.assessments.length / course.assessments.length) * 100;
                  
                  return (
                    <Box key={outcome.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">CLO {index + 1}</Typography>
                        <Typography variant="body2">
                          {outcome.assessments.length}/{course.assessments.length} assessments
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          height: 15, 
                          bgcolor: coverage === 0 ? '#ffcdd2' : 
                                  coverage < 50 ? '#ffe0b2' : 
                                  coverage < 100 ? '#c8e6c9' : 
                                  '#81c784',
                          width: `${coverage}%`,
                          minWidth: '10px',
                          borderRadius: 1
                        }} 
                      />
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Analysis & Recommendations
              </Typography>
              
              <List>
                {/* Identify outcomes without assessments */}
                {course.learningOutcomes.some(o => o.assessments.length === 0) && (
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Some learning outcomes are not assessed" 
                      secondary="Every learning outcome should be assessed by at least one assessment to ensure complete coverage."
                      primaryTypographyProps={{ color: 'error.main' }}
                    />
                  </ListItem>
                )}
                
                {/* Check for higher-level thinking assessments */}
                {!course.learningOutcomes.some(o => ['Evaluate', 'Create'].includes(o.bloom)) && (
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Missing higher-level thinking skills" 
                      secondary="Consider adding learning outcomes at the 'Evaluate' or 'Create' levels of Bloom's taxonomy."
                      primaryTypographyProps={{ color: 'warning.main' }}
                    />
                  </ListItem>
                )}
                
                {/* Check for complete program outcome coverage */}
                {course.programOutcomes.some(po => po.mappedOutcomes.length === 0) && (
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Some program outcomes are not addressed" 
                      secondary="Ensure that all relevant program outcomes are addressed by at least one course learning outcome."
                      primaryTypographyProps={{ color: 'warning.main' }}
                    />
                  </ListItem>
                )}
                
                {/* Provide positive feedback if everything looks good */}
                {!course.learningOutcomes.some(o => o.assessments.length === 0) &&
                 course.learningOutcomes.some(o => ['Evaluate', 'Create'].includes(o.bloom)) &&
                 !course.programOutcomes.some(po => po.mappedOutcomes.length === 0) && (
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Good curriculum alignment" 
                      secondary="Your course has well-aligned learning outcomes, assessments, and program outcomes."
                      primaryTypographyProps={{ color: 'success.main' }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Edit Outcome Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Learning Outcome</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Learning Outcome"
            fullWidth
            multiline
            rows={3}
            value={editingOutcome?.text || ''}
            onChange={(e) => setEditingOutcome({ ...editingOutcome, text: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Bloom's Taxonomy Level
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {bloomLevels.map((level) => (
                  <Chip
                    key={level.value}
                    label={level.value}
                    onClick={() => setEditingOutcome({ ...editingOutcome, bloom: level.value })}
                    sx={{ 
                      bgcolor: editingOutcome?.bloom === level.value ? level.color : 'default',
                      fontWeight: editingOutcome?.bloom === level.value ? 'bold' : 'normal'
                    }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Competency Level
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {competencyLevels.map((level) => (
                  <Chip
                    key={level.value}
                    label={level.value}
                    onClick={() => setEditingOutcome({ ...editingOutcome, competency: level.value })}
                    sx={{ 
                      bgcolor: editingOutcome?.competency === level.value ? level.color : 'default',
                      fontWeight: editingOutcome?.competency === level.value ? 'bold' : 'normal'
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Mapped Assessments
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {course.assessments.map((assessment) => (
                <Chip
                  key={assessment.id}
                  label={assessment.title}
                  onClick={() => {
                    const assessments = editingOutcome.assessments.includes(assessment.id)
                      ? editingOutcome.assessments.filter(id => id !== assessment.id)
                      : [...editingOutcome.assessments, assessment.id];
                    
                    setEditingOutcome({ ...editingOutcome, assessments });
                  }}
                  sx={{ 
                    bgcolor: editingOutcome?.assessments.includes(assessment.id) ? '#c8e6c9' : 'default',
                    fontWeight: editingOutcome?.assessments.includes(assessment.id) ? 'bold' : 'normal'
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveOutcome} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={!editingOutcome?.text}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CurriculumMapping;