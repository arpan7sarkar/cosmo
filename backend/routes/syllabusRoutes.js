import express from 'express';
import upload from '../middleware/upload.js';
import { uploadSyllabus, getStudyPlan } from '../controllers/syllabusController.js';

const router = express.Router();

// Upload syllabus PDF
router.post('/upload-syllabus', upload.single('syllabus'), uploadSyllabus);

// Get study plan details
router.get('/study-plan/:id', getStudyPlan);

export default router;
