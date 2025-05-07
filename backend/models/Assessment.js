const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Question schema (embedded document)
const QuestionSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'multiple-select', 'essay'],
    required: true
  },
  options: {
    type: [String],
    default: []
  },
  correctAnswer: {
    type: Schema.Types.Mixed, // Can be String, Boolean, or Array depending on question type
    required: true
  },
  points: {
    type: Number,
    default: 1
  },
  explanation: {
    type: String
  }
});

// Define Assessment schema
const AssessmentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  questions: [QuestionSchema],
  timeLimit: {
    type: Number, // in minutes
    default: 60
  },
  totalPoints: {
    type: Number,
    default: function() {
      return this.questions.reduce((sum, q) => sum + q.points, 0);
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  allowedAttempts: {
    type: Number,
    default: 1
  },
  randomizeQuestions: {
    type: Boolean,
    default: false
  },
  // New fields for assessment flow
  syllabusTitle: {
    type: String,
    default: ''
  },
  isAssignedToAllStudents: {
    type: Boolean,
    default: false
  },
  assignedStudents: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  visibility: {
    instructorCanSeeAnswers: {
      type: Boolean,
      default: true
    },
    studentsCanSeeAnswers: {
      type: Boolean,
      default: false
    },
    studentsCanSeeSyllabusTitle: {
      type: Boolean,
      default: false
    },
    showResultsImmediately: {
      type: Boolean,
      default: true
    }
  }
});

// Define Submission schema
const SubmissionSchema = new Schema({
  assessmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: {
    type: Map,
    of: Schema.Types.Mixed // Can be String, Boolean, or Array depending on question type
  },
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isGraded: {
    type: Boolean,
    default: false
  },
  feedback: {
    overallFeedback: {
      type: String
    },
    questionFeedback: {
      type: Map,
      of: String
    }
  },
  gradedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  gradedAt: {
    type: Date
  }
});

// Create models
const Assessment = mongoose.model('Assessment', AssessmentSchema);
const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = {
  Assessment,
  Submission
};