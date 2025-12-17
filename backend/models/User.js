import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  preferredAnalogy: {
    type: String,
    enum: ['marvel', 'cricket', 'football', 'movies', 'reallife'],
    default: 'reallife'
  },
  studyPlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyPlan'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;
