import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weightage: { type: Number, default: 1 },
  estimatedHours: { type: Number, default: 2 },
  completed: { type: Boolean, default: false }
});

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'My Study Plan'
  },
  subjects: [{
    name: String,
    topics: [topicSchema]
  }],
  examDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  hoursPerDay: {
    type: Number,
    default: 4
  },
  syllabusText: {
    type: String
  },
  tips: [{
    type: String
  }],
  estimatedReadiness: {
    type: Number,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);

export default StudyPlan;
