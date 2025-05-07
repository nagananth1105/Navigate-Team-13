const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Import services
const syllabusAnalyzerService = require('../services/syllabusAnalyzerService');
const plagiarismService = require('../services/plagiarismService');
const authMiddleware = require('../middlewares/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter to accept only certain types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB size limit
});

// @route   POST /api/assessment/upload-syllabus
// @desc    Upload and process syllabus
// @access  Private
router.post('/upload-syllabus', [authMiddleware, upload.single('file')], async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded'
      });
    }

    console.log(`Processing uploaded file: ${req.file.originalname}`);
    
    // Extract text content from file
    const syllabusContent = await syllabusAnalyzerService.extractTextFromFile(req.file);
    
    // Return the extracted content
    res.status(200).json({
      success: true,
      message: 'File uploaded and processed successfully',
      syllabusContent,
      fileName: req.file.originalname
    });
  } catch (error) {
    console.error('Error uploading syllabus:', error);
    res.status(500).json({
      success: false,
      message: `Error processing file: ${error.message}`
    });
  }
});

// @route   POST /api/assessment/analyze-syllabus
// @desc    Analyze syllabus content
// @access  Private
router.post('/analyze-syllabus', authMiddleware, async (req, res) => {
  try {
    const { syllabusContent, courseId } = req.body;
    
    if (!syllabusContent || syllabusContent.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Syllabus content is too short for analysis'
      });
    }
    
    console.log(`Analyzing syllabus content (${syllabusContent.length} chars)...`);
    
    // Extract topics directly from syllabus content
    let extractedTopics = [];
    try {
      // Try to use the service if available
      const topicsExtraction = await syllabusAnalyzerService.extractTopicsFromSyllabus(syllabusContent);
      extractedTopics = topicsExtraction.topics || [];
    } catch (topicError) {
      console.warn('Using fallback topic extraction:', topicError.message);
      // Simple fallback pattern extraction
      const topicsList = syllabusContent.match(/topics:[\s\S]*?((?:-|\d+\.)[^\n]+)/gi) || [];
      extractedTopics = topicsList
        .map(t => t.replace(/^(?:topics:|-|\d+\.)[\s]*/i, '').trim())
        .filter(t => t.length > 3)
        .slice(0, 10);
    }
    
    // Analyze the syllabus
    const syllabusAnalysis = await syllabusAnalyzerService.analyzeSyllabus(syllabusContent);
    
    // If no topics were extracted earlier, use the ones from syllabusAnalysis
    if (extractedTopics.length === 0 && 
        syllabusAnalysis.learningOutcomes && 
        Array.isArray(syllabusAnalysis.learningOutcomes.keyTopics)) {
      extractedTopics = syllabusAnalysis.learningOutcomes.keyTopics;
    }
    
    // Generate an ID for this analysis
    const analysisId = crypto.createHash('md5').update(syllabusContent).digest('hex').substring(0, 8);
    
    // Store the analysis
    await syllabusAnalyzerService.storeSyllabusAnalysis(analysisId, syllabusAnalysis);
    
    // Return the analysis with topics array for flexible topic selection
    res.status(200).json({
      success: true,
      message: 'Syllabus analyzed successfully',
      syllabusAnalysis,
      analysisId,
      syllabusTopics: extractedTopics // Only include actual extracted topics
    });
  } catch (error) {
    console.error('Error analyzing syllabus:', error);
    res.status(500).json({
      success: false,
      message: `Error analyzing syllabus: ${error.message}`
    });
  }
});

// @route   GET /api/assessment/syllabus/:id
// @desc    Get syllabus analysis by ID
// @access  Private
router.get('/syllabus/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Retrieve the analysis
    const syllabusAnalysis = await syllabusAnalyzerService.getSyllabusAnalysis(id);
    
    if (!syllabusAnalysis) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus analysis not found'
      });
    }
    
    res.status(200).json({
      success: true,
      syllabusAnalysis
    });
  } catch (error) {
    console.error('Error retrieving syllabus analysis:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving syllabus analysis: ${error.message}`
    });
  }
});

// @route   GET /api/assessment/syllabus/list
// @desc    Get list of analyzed syllabi
// @access  Private
router.get('/syllabus/list', authMiddleware, async (req, res) => {
  try {
    // Get list of syllabi
    const syllabi = await syllabusAnalyzerService.getSyllabiList();
    
    res.status(200).json({
      success: true,
      syllabi
    });
  } catch (error) {
    console.error('Error retrieving syllabi list:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving syllabi list: ${error.message}`
    });
  }
});

// @route   POST /api/assessment/generate-questions
// @desc    Generate assessment questions based on syllabus analysis and pattern
// @access  Private
router.post('/generate-questions', authMiddleware, async (req, res) => {
  try {
    const { syllabusAnalysis, pattern } = req.body;
    
    if (!syllabusAnalysis || !pattern) {
      return res.status(400).json({
        success: false,
        message: 'Syllabus analysis and pattern are required'
      });
    }
    
    console.log(`Generating assessment with pattern: ${pattern.name}`);
    
    // Check if this is a quick quiz or a full assessment
    let assessment;
    
    if (pattern.isQuickQuiz) {
      // Generate a quick quiz
      assessment = await syllabusAnalyzerService.generateQuickQuiz(syllabusAnalysis, {
        questionCount: pattern.structure.reduce((sum, item) => sum + item.count, 0),
        difficulty: pattern.difficulty,
        questionTypes: pattern.structure.map(item => item.questionType.toLowerCase().replace(/\s+/g, '-')),
        timeLimit: pattern.estimatedTime
      });
    } else {
      // Generate a full assessment
      assessment = await syllabusAnalyzerService.generateAssessment(syllabusAnalysis, {
        pattern: pattern,
        modelName: pattern.modelName || 'gpt2' // Use GPT-2 by default
      });
    }
    
    // Return the assessment
    res.status(200).json({
      success: true,
      message: 'Assessment generated successfully',
      assessment
    });
  } catch (error) {
    console.error('Error generating assessment:', error);
    res.status(500).json({
      success: false,
      message: `Error generating assessment: ${error.message}`
    });
  }
});

// @route   POST /api/assessment/iterate-quiz
// @desc    Refine a generated quiz based on feedback
// @access  Private
router.post('/iterate-quiz', authMiddleware, async (req, res) => {
  try {
    const { syllabusId, currentQuiz, feedback, parameters } = req.body;
    
    if (!currentQuiz || !feedback) {
      return res.status(400).json({
        success: false,
        message: 'Current quiz and feedback are required'
      });
    }
    
    console.log(`Iterating quiz based on feedback: ${feedback.substring(0, 100)}...`);
    
    // Get the syllabus analysis if we have an ID
    let syllabusAnalysis = null;
    if (syllabusId) {
      syllabusAnalysis = await syllabusAnalyzerService.getSyllabusAnalysis(syllabusId);
    }
    
    // For this demo, we'll just return the current quiz with a note
    // In a real implementation, you would send the feedback to the model and generate a new quiz
    const iteratedQuiz = {
      ...currentQuiz,
      title: `${currentQuiz.title} (Refined)`,
      description: `${currentQuiz.description}\n\nRefined based on feedback: ${feedback.substring(0, 50)}...`,
      generatedAt: new Date().toISOString(),
      questions: currentQuiz.questions.map(q => ({
        ...q,
        explanation: q.explanation || "This explanation was enhanced based on your feedback."
      }))
    };
    
    res.status(200).json({
      success: true,
      message: 'Quiz iterated successfully',
      iteratedQuiz
    });
  } catch (error) {
    console.error('Error iterating quiz:', error);
    res.status(500).json({
      success: false,
      message: `Error iterating quiz: ${error.message}`
    });
  }
});

// @route   GET /api/assessment/templates/:courseId
// @desc    Get assessment templates (predefined or course-specific)
// @access  Private
router.get('/templates/:courseId', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // If courseId is provided and not 'default', we could load course-specific templates
    // For now, return a set of predefined templates for all courses
    
    const templates = [
      {
        name: "Standard Quiz",
        description: "A balanced assessment with multiple choice and short answer questions",
        difficulty: "Medium",
        timeLimit: 30,
        questionDistribution: [
          { type: "multiple-choice", count: 10, pointsEach: 1 },
          { type: "short-answer", count: 5, pointsEach: 2 }
        ],
        totalPoints: 20,
        isRecommended: true
      },
      {
        name: "Comprehensive Exam",
        description: "In-depth assessment covering all major topics with varied question types",
        difficulty: "Hard",
        timeLimit: 90,
        questionDistribution: [
          { type: "multiple-choice", count: 15, pointsEach: 1 },
          { type: "true-false", count: 10, pointsEach: 1 },
          { type: "short-answer", count: 5, pointsEach: 3 },
          { type: "essay", count: 2, pointsEach: 10 }
        ],
        totalPoints: 50,
        isRecommended: false
      },
      {
        name: "Quick Check",
        description: "Brief assessment to quickly gauge understanding of key concepts",
        difficulty: "Easy",
        timeLimit: 15,
        questionDistribution: [
          { type: "multiple-choice", count: 8, pointsEach: 1 },
          { type: "true-false", count: 7, pointsEach: 1 }
        ],
        totalPoints: 15,
        isRecommended: true
      },
      {
        name: "Conceptual Understanding",
        description: "Focus on deeper understanding with short answer and essay questions",
        difficulty: "Medium",
        timeLimit: 45,
        questionDistribution: [
          { type: "short-answer", count: 8, pointsEach: 2 },
          { type: "essay", count: 2, pointsEach: 7 }
        ],
        totalPoints: 30,
        isRecommended: false
      },
      {
        name: "Practical Application",
        description: "Assessment focused on applying concepts to real-world scenarios",
        difficulty: "Medium",
        timeLimit: 60,
        questionDistribution: [
          { type: "multiple-choice", count: 5, pointsEach: 1 },
          { type: "short-answer", count: 5, pointsEach: 2 },
          { type: "essay", count: 3, pointsEach: 5 }
        ],
        totalPoints: 25,
        isRecommended: true
      }
    ];
    
    // Return templates with success status
    res.status(200).json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error fetching assessment templates:', error);
    res.status(500).json({
      success: false,
      message: `Error fetching templates: ${error.message}`
    });
  }
});

// @route   POST /api/assessment/save
// @desc    Save assessment to database and optionally assign to students
// @access  Private (Instructor only)
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      courseId, 
      questions, 
      timeLimit, 
      totalPoints,
      assignToAllStudents,
      syllabusTitle,
      visibility
    } = req.body;
    
    // Check if user is an instructor
    if (req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can save assessments'
      });
    }
    
    if (!title || !courseId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required assessment information'
      });
    }
    
    // Create assessment document
    const assessment = {
      title,
      description,
      courseId,
      questions,
      timeLimit: timeLimit || 60,
      totalPoints: totalPoints || questions.reduce((sum, q) => sum + (q.points || 0), 0),
      createdBy: req.user.id,
      createdAt: new Date(),
      assignToAllStudents: assignToAllStudents || false,
      syllabusTitle: syllabusTitle || '',
      visibility: visibility || {
        instructorCanSeeAnswers: true,
        studentsCanSeeAnswers: false,
        studentsCanSeeSyllabusTitle: false
      }
    };
    
    // In a real implementation, you would save to the database
    // For now, we'll simulate a successful save
    
    // If assignToAllStudents is true, we would also create assignments for all students in the course
    const assignmentStatus = assessment.assignToAllStudents 
      ? 'Assessment assigned to all students in the course' 
      : 'Assessment saved as draft';
    
    res.status(200).json({
      success: true,
      message: `Assessment saved successfully. ${assignmentStatus}`,
      assessmentId: '12345', // This would be the actual ID from the database
      assessment
    });
  } catch (error) {
    console.error('Error saving assessment:', error);
    res.status(500).json({
      success: false,
      message: `Error saving assessment: ${error.message}`
    });
  }
});

// @route   GET /api/assessment/student/:assessmentId
// @desc    Get assessment for student (filtered to hide instructor-only content)
// @access  Private (Student only)
router.get('/student/:assessmentId', authMiddleware, async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    // In a real implementation, you would fetch from database
    // For now, we'll use a mock assessment
    
    // Create a filtered version that only shows what students should see
    // based on the visibility settings
    const assessment = {
      id: assessmentId,
      title: 'Midterm Exam',
      description: 'Test your knowledge on basic data structures',
      courseId: '1',
      courseName: 'Data Structures and Algorithms',
      timeLimit: 60,
      totalPoints: 100,
      dueDate: '2025-12-10',
      // Filter out answers and other instructor-only information
      questions: [
        {
          id: '1',
          text: 'Which data structure uses LIFO (Last In First Out) principle?',
          type: 'multiple-choice',
          options: ['Queue', 'Stack', 'Linked List', 'Tree'],
          points: 5
          // Note: correctAnswer is omitted for students
        },
        // More questions...
      ]
    };
    
    res.status(200).json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('Error retrieving assessment for student:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving assessment: ${error.message}`
    });
  }
});

// @route   POST /api/assessment/submit
// @desc    Submit a completed assessment
// @access  Private (Student only)
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { 
      assessmentId, 
      answers, 
      timeSpent 
    } = req.body;
    
    if (!assessmentId || !answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Missing required submission information'
      });
    }
    
    // In a real implementation, you would:
    // 1. Validate the assessmentId exists and is available to the student
    // 2. Calculate the score based on answers
    // 3. Save the submission to the database
    // 4. Update the student's progress
    
    // For now, simulate a successful submission
    const submission = {
      id: Math.random().toString(36).substring(2, 10),
      assessmentId,
      studentId: req.user.id,
      answers,
      timeSpent: timeSpent || 0,
      score: 85, // This would be calculated
      maxScore: 100,
      submittedAt: new Date()
    };
    
    res.status(200).json({
      success: true,
      message: 'Assessment submitted successfully',
      submissionId: submission.id,
      score: submission.score,
      maxScore: submission.maxScore
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({
      success: false,
      message: `Error submitting assessment: ${error.message}`
    });
  }
});

// @route   GET /api/assessment/results/:submissionId
// @desc    Get assessment submission results
// @access  Private (Owner student or instructor)
router.get('/results/:submissionId', authMiddleware, async (req, res) => {
  try {
    const { submissionId } = req.params;
    
    // In a real implementation, you would fetch from database
    // and apply appropriate visibility rules based on user role
    
    // Assume we found the submission
    const submission = {
      id: submissionId,
      assessmentId: '1',
      assessment: {
        title: 'Midterm Exam',
        courseId: '1',
        courseName: 'Data Structures and Algorithms'
      },
      studentId: '123',
      studentName: 'Student Name',
      score: 85,
      maxScore: 100,
      submittedAt: new Date().toISOString(),
      timeSpent: 45,
      answers: {
        // Student answers here
      },
      questionResults: [
        {
          questionId: '1',
          correct: true,
          score: 5,
          maxScore: 5,
          feedback: 'Great job!'
        },
        // More question results...
      ]
    };
    
    // Check if user is authorized to view this submission
    // (either the student who submitted it or an instructor of the course)
    const isOwner = req.user.id === submission.studentId;
    const isInstructor = req.user.role === 'instructor';
    
    if (!isOwner && !isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this submission'
      });
    }
    
    // Apply visibility rules based on user role
    let visibleSubmission = { ...submission };
    
    // If student, maybe hide certain information
    if (!isInstructor) {
      // In the real implementation, this would depend on assessment settings
      // For example, maybe don't show correct answers immediately
    }
    
    res.status(200).json({
      success: true,
      submission: visibleSubmission
    });
  } catch (error) {
    console.error('Error retrieving submission results:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving results: ${error.message}`
    });
  }
});

// @route   GET /api/assessment/course/:courseId/submissions
// @desc    Get all submissions for a course
// @access  Private (Instructor only)
router.get('/course/:courseId/submissions', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if user is an instructor
    if (req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can view all course submissions'
      });
    }
    
    // In a real implementation, you would fetch from database
    // For now, return mock data
    const submissions = [
      {
        id: '1',
        assessmentId: '1',
        assessmentTitle: 'Midterm Exam',
        studentId: '123',
        studentName: 'John Doe',
        score: 85,
        maxScore: 100,
        submittedAt: new Date().toISOString()
      },
      {
        id: '2',
        assessmentId: '1',
        assessmentTitle: 'Midterm Exam',
        studentId: '456',
        studentName: 'Jane Smith',
        score: 92,
        maxScore: 100,
        submittedAt: new Date().toISOString()
      }
    ];
    
    res.status(200).json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error('Error retrieving course submissions:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving submissions: ${error.message}`
    });
  }
});

module.exports = router;