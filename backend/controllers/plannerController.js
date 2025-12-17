import StudyPlan from '../models/StudyPlan.js';
import CalendarEvent from '../models/CalendarEvent.js';
import { generateStudyPlanWithAI } from '../services/geminiService.js';
import { createCalendarEvents, getCalendarEvents, updateEventCompletion } from '../services/plannerEngine.js';

/**
 * Generate study plan from existing study plan data
 * POST /api/generate-study-plan
 */
export const generateStudyPlan = async (req, res) => {
  try {
    const { studyPlanId, hoursPerDay = 4 } = req.body;

    const studyPlan = await StudyPlan.findById(studyPlanId);
    if (!studyPlan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    // Delete old calendar events for this study plan
    await CalendarEvent.deleteMany({ studyPlanId: studyPlan._id });

    // Generate AI-powered schedule
    const plan = await generateStudyPlanWithAI(
      studyPlan.subjects,
      studyPlan.examDate,
      hoursPerDay
    );

    // Create calendar events
    const events = await createCalendarEvents(plan, studyPlan.userId, studyPlan._id);

    // Update study plan with hours per day
    studyPlan.hoursPerDay = hoursPerDay;
    await studyPlan.save();

    res.json({
      success: true,
      message: 'Study plan generated successfully',
      data: {
        studyPlanId: studyPlan._id,
        schedule: plan.schedule,
        tips: plan.tips,
        estimatedReadiness: plan.estimatedReadiness,
        eventsCreated: events.length
      }
    });
  } catch (error) {
    console.error('Generate study plan error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get study calendar events
 * GET /api/study-calendar
 */
export const getStudyCalendar = async (req, res) => {
  try {
    const { studyPlanId, startDate, endDate } = req.query;

    let events = [];

    if (studyPlanId) {
      // Get events for specific study plan
      const query = { studyPlanId };
      if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }
      events = await CalendarEvent.find(query).sort({ date: 1, startTime: 1 });
    } else {
      // Get the latest study plan for the demo user
      const User = (await import('../models/User.js')).default;
      const demoUser = await User.findOne({ email: 'demo@learnflow.com' });

      if (demoUser) {
        // Get the most recent study plan
        const latestPlan = await StudyPlan.findOne({ userId: demoUser._id })
          .sort({ createdAt: -1 });

        if (latestPlan) {
          events = await CalendarEvent.find({ studyPlanId: latestPlan._id })
            .sort({ date: 1, startTime: 1 });
        }
      }
    }

    // Format for react-big-calendar - filter out invalid events
    const formattedEvents = events
      .filter(event => event.date && event.startTime && event.endTime && event.topic)
      .map(event => {
        const dateStr = event.date.toISOString().split('T')[0];
        const startTime = event.startTime || '09:00';
        const endTime = event.endTime || '10:00';

        // Parse date parts for local time construction
        const [year, month, day] = dateStr.split('-').map(Number);
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        return {
          id: event._id,
          title: event.title || 'Study Session',
          start: { year, month: month - 1, day, hour: startHour, minute: startMin },
          end: { year, month: month - 1, day, hour: endHour, minute: endMin },
          type: event.type,
          topic: event.topic,
          completed: event.completed,
          description: event.description
        };
      });

    res.json({
      success: true,
      data: formattedEvents
    });
  } catch (error) {
    console.error('Get calendar error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update event completion status
 * PATCH /api/calendar-event/:id
 */
export const updateCalendarEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const event = await updateEventCompletion(id, completed);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Clear all calendar events for user (for testing)
 * DELETE /api/clear-calendar
 */
export const clearCalendar = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const demoUser = await User.findOne({ email: 'demo@learnflow.com' });

    if (demoUser) {
      await CalendarEvent.deleteMany({ userId: demoUser._id });
    }

    res.json({
      success: true,
      message: 'Calendar cleared'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { generateStudyPlan, getStudyCalendar, updateCalendarEvent, clearCalendar };
