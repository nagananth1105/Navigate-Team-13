const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  syllabus: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assessments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  }],
  modules: [{
    title: String,
    description: String,
    resources: [{
      title: String,
      type: {
        type: String,
        enum: ['video', 'document', 'quiz', 'assignment']
      },
      content: String,
      url: String
    }]
  }],
  curriculumMap: {
    type: Map,
    of: {
      concepts: [String],
      dependsOn: [String],
      resources: [String]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);