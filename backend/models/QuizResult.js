import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: String,
  userAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean
});

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answers: [answerSchema],
  timeTaken: {
    type: Number // in seconds
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;
