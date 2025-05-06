const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    aiEvaluation: {
      accuracy: {
        score: Number,
        feedback: String
      },
      conceptualUnderstanding: {
        score: Number,
        feedback: String
      },
      originality: {
        score: Number,
        feedback: String,
        similarityScore: Number // For plagiarism detection
      },
      presentation: {
        score: Number,
        feedback: String
      },
      totalScore: Number,
      suggestions: [String]
    },
    expertPanelFeedback: [{
      role: {
        type: String,
        enum: ['fact-checker', 'concept-analyzer', 'clarity-checker']
      },
      feedback: String,
      suggestions: [String]
    }],
    misconceptions: [String],
    learningGaps: [String]
  }],
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  gradedAt: {
    type: Date
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Submission', SubmissionSchema);