import { explainTopicWithAnalogy, generateQuiz } from '../services/geminiService.js';
import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';

/**
 * Get AI explanation for a topic
 * POST /api/ai-explain-topic
 */
export const explainTopic = async (req, res) => {
  try {
    const { topic, analogy = 'reallife' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const explanation = await explainTopicWithAnalogy(topic, analogy);

    res.json({
      success: true,
      data: {
        topic,
        analogy,
        ...explanation
      }
    });
  } catch (error) {
    console.error('Explain topic error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate quiz for a topic
 * POST /api/generate-quiz
 */
export const createQuiz = async (req, res) => {
  try {
    const { topic, numQuestions = 5 } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const quiz = await generateQuiz(topic, numQuestions);

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Submit quiz answers
 * POST /api/submit-quiz
 */
export const submitQuiz = async (req, res) => {
  try {
    const { topic, answers, userId } = req.body;

    if (!topic || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Topic and answers are required' });
    }

    // Get or create demo user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ email: 'demo@learnflow.com' });
    }

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Calculate score
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / answers.length) * 100);

    // Save quiz result
    const quizResult = await QuizResult.create({
      userId: user._id,
      topic,
      score,
      totalQuestions: answers.length,
      answers
    });

    res.json({
      success: true,
      data: {
        quizResultId: quizResult._id,
        score,
        correctAnswers,
        totalQuestions: answers.length,
        passed: score >= 70
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get quiz history
 * GET /api/quiz-history
 */
export const getQuizHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ email: 'demo@learnflow.com' });
    }

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const quizzes = await QuizResult.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { explainTopic, createQuiz, submitQuiz, getQuizHistory };
