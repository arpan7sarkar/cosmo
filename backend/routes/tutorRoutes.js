import express from 'express';
import { explainTopic, createQuiz, submitQuiz, getQuizHistory } from '../controllers/tutorController.js';

const router = express.Router();

// Get AI explanation for topic
router.post('/ai-explain-topic', explainTopic);

// Generate quiz
router.post('/generate-quiz', createQuiz);

// Submit quiz answers
router.post('/submit-quiz', submitQuiz);

// Get quiz history
router.get('/quiz-history', getQuizHistory);

export default router;
