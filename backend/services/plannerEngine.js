import CalendarEvent from '../models/CalendarEvent.js';

/**
 * Generate calendar events from study plan
 * @param {Object} plan - AI-generated study plan
 * @param {string} userId - User ID
 * @param {string} studyPlanId - Study plan ID
 * @returns {Promise<Array>} - Created calendar events
 */
export const createCalendarEvents = async (plan, userId, studyPlanId) => {
  const events = [];

  // Guard against missing schedule
  if (!plan || !plan.schedule || !Array.isArray(plan.schedule)) {
    console.log('No valid schedule in plan');
    return events;
  }

  for (const day of plan.schedule) {
    if (!day.sessions || !Array.isArray(day.sessions)) continue;

    let startHour = 9; // Start at 9 AM

    for (const session of day.sessions) {
      // Skip sessions without valid topic
      if (!session.topic || session.topic === 'undefined' || !session.topic.trim()) {
        console.log('Skipping session with invalid topic:', session);
        continue;
      }

      const topicName = session.topic.trim();
      const subjectName = session.subject || 'General';
      const duration = session.duration || 1;

      const event = new CalendarEvent({
        userId,
        studyPlanId,
        title: `${session.type === 'review' ? '📝 Review:' : '📚 Study:'} ${topicName}`,
        description: `Subject: ${subjectName}\nPriority: ${session.priority || 'medium'}`,
        date: new Date(day.date),
        startTime: `${startHour.toString().padStart(2, '0')}:00`,
        endTime: `${Math.floor(startHour + duration).toString().padStart(2, '0')}:00`,
        type: session.type || 'study',
        topic: topicName,
        completed: false
      });

      await event.save();
      events.push(event);

      startHour += duration + 0.5; // 30 min break between sessions
    }
  }

  return events;
};

/**
 * Get all calendar events for a user
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date filter
 * @param {Date} endDate - End date filter
 * @returns {Promise<Array>} - Calendar events
 */
export const getCalendarEvents = async (userId, startDate, endDate) => {
  const query = { userId };

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  return CalendarEvent.find(query).sort({ date: 1, startTime: 1 });
};

/**
 * Mark event as completed
 * @param {string} eventId - Event ID
 * @param {boolean} completed - Completion status
 * @returns {Promise<Object>} - Updated event
 */
export const updateEventCompletion = async (eventId, completed) => {
  return CalendarEvent.findByIdAndUpdate(
    eventId,
    { completed },
    { new: true }
  );
};

export default { createCalendarEvents, getCalendarEvents, updateEventCompletion };
