const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Mock data for demonstration purposes
const courses = [
  {
    _id: 'mock-course-id',
    title: 'Web Development Fundamentals',
    description: 'Learn the core principles of web development including HTML, CSS, and JavaScript. This course provides a solid foundation for building modern websites and web applications.',
    instructor: 'instructor-id-1',
    topics: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    level: 'beginner',
    progress: 25, // For demo purposes
    units: [
      {
        title: 'Introduction to HTML',
        lessons: [
          {
            title: 'Basic HTML Structure',
            type: 'video',
            completed: true
          },
          {
            title: 'HTML Elements and Tags',
            type: 'reading',
            completed: true
          },
          {
            title: 'HTML Forms',
            type: 'interactive',
            completed: false
          }
        ]
      },
      {
        title: 'CSS Fundamentals',
        lessons: [
          {
            title: 'CSS Selectors',
            type: 'video',
            completed: false
          },
          {
            title: 'CSS Box Model',
            type: 'reading',
            completed: false
          }
        ]
      },
      {
        title: 'JavaScript Basics',
        lessons: [
          {
            title: 'Variables and Data Types',
            type: 'video',
            completed: false
          },
          {
            title: 'Functions and Control Flow',
            type: 'interactive',
            completed: false
          }
        ]
      }
    ],
    createdAt: new Date()
  }
];

// @route   GET api/courses/enrolled
// @desc    Get courses the student is enrolled in
// @access  Private
router.get('/courses/enrolled', authMiddleware, (req, res) => {
  try {
    // In a real app, this would filter courses by user enrollment
    // For demo purposes, we'll just return all courses
    
    const enrolledCourses = courses.map(course => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      progress: course.progress,
      level: course.level,
      topics: course.topics
    }));
    
    res.json({
      success: true,
      courses: enrolledCourses
    });
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET api/courses/:id
// @desc    Get a specific course with all details
// @access  Private
router.get('/courses/:id', authMiddleware, (req, res) => {
  try {
    const course = courses.find(c => c._id === req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.json({
      success: true,
      course
    });
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET api/curriculum/map/:courseId
// @desc    Get the curriculum map for a course
// @access  Private
router.get('/map/:courseId', authMiddleware, (req, res) => {
  try {
    const { courseId } = req.params;
    const course = courses.find(c => c._id === courseId);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Generate curriculum map
    // In a real app, this would be more elaborate with prerequisite relationships, etc.
    const curriculumMap = {
      courseId,
      courseTitle: course.title,
      topics: course.topics,
      conceptNodes: [
        {
          id: 'html-basics',
          title: 'HTML Basics',
          description: 'Understanding the fundamentals of HTML markup',
          level: 1,
          prerequisites: []
        },
        {
          id: 'css-basics',
          title: 'CSS Basics',
          description: 'Understanding how to style web pages with CSS',
          level: 1,
          prerequisites: ['html-basics']
        },
        {
          id: 'responsive-design',
          title: 'Responsive Design',
          description: 'Creating websites that work on all devices and screen sizes',
          level: 2,
          prerequisites: ['html-basics', 'css-basics']
        },
        {
          id: 'javascript-intro',
          title: 'JavaScript Introduction',
          description: 'Learning the basics of programming with JavaScript',
          level: 2,
          prerequisites: ['html-basics']
        }
      ],
      paths: [
        {
          name: 'Frontend Developer Path',
          nodes: ['html-basics', 'css-basics', 'responsive-design', 'javascript-intro']
        }
      ]
    };
    
    res.json({
      success: true,
      curriculumMap
    });
  } catch (err) {
    console.error('Error fetching curriculum map:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;