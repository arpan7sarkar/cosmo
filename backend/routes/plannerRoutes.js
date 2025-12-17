import express from 'express';
import { generateStudyPlan, getStudyCalendar, updateCalendarEvent, clearCalendar } from '../controllers/plannerController.js';

const router = express.Router();

// Generate study plan
router.post('/generate-study-plan', generateStudyPlan);

// Get study calendar
router.get('/study-calendar', getStudyCalendar);

// Update calendar event
router.patch('/calendar-event/:id', updateCalendarEvent);

// Clear calendar (for testing/reset)
router.delete('/clear-calendar', clearCalendar);

export default router;
