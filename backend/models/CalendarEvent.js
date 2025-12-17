import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studyPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyPlan'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String // "10:00"
  },
  endTime: {
    type: String // "12:00"
  },
  type: {
    type: String,
    enum: ['study', 'exam', 'review', 'break'],
    default: 'study'
  },
  topic: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

export default CalendarEvent;
