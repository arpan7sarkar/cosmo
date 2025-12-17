import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Get Gemini model instance
 */
const getModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

/**
 * Generate study plan using AI
 * @param {Array} subjects - Array of subjects with topics
 * @param {Date} examDate - Target exam date
 * @param {number} hoursPerDay - Available study hours per day
 * @returns {Promise<Object>} - AI-optimized study plan
 */
export const generateStudyPlanWithAI = async (subjects, examDate, hoursPerDay = 4) => {
  const model = getModel();
  
  const prompt = `You are a study planner AI. Create an optimized study schedule.

SUBJECTS AND TOPICS:
${JSON.stringify(subjects, null, 2)}

EXAM DATE: ${examDate}
HOURS PER DAY: ${hoursPerDay}
TODAY: ${new Date().toISOString().split('T')[0]}

Create a JSON response with this structure:
{
  "schedule": [
    {
      "date": "YYYY-MM-DD",
      "sessions": [
        {
          "topic": "topic name",
          "subject": "subject name",
          "duration": 2,
          "type": "study|review",
          "priority": "high|medium|low"
        }
      ]
    }
  ],
  "tips": ["study tip 1", "study tip 2"],
  "estimatedReadiness": 85
}

Rules:
1. Distribute topics evenly to prevent burnout
2. Include review sessions for difficult topics
3. Leave buffer time before exam
4. Harder topics get more time
5. Response must be valid JSON only`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid AI response format');
  } catch (error) {
    console.error('Gemini study plan error:', error);
    // Fallback to basic plan generation
    return generateBasicPlan(subjects, examDate, hoursPerDay);
  }
};

/**
 * Explain topic with analogy
 * @param {string} topic - Topic to explain
 * @param {string} analogy - Analogy style (marvel, cricket, etc.)
 * @returns {Promise<Object>} - Explanation with analogy
 */
export const explainTopicWithAnalogy = async (topic, analogy = 'reallife') => {
  const model = getModel();
  
  const analogyContexts = {
    marvel: 'Use Marvel Cinematic Universe characters, powers, and storylines',
    cricket: 'Use cricket concepts, players, matches, and strategies',
    football: 'Use football/soccer concepts, teams, players, and tactics',
    movies: 'Use popular movie plots, characters, and scenes',
    reallife: 'Use everyday real-life situations and examples'
  };

  const prompt = `You are an expert tutor who explains complex topics using fun analogies.

TOPIC: ${topic}
ANALOGY STYLE: ${analogyContexts[analogy] || analogyContexts.reallife}

Provide a response in this JSON format:
{
  "simpleExplanation": "A clear 2-3 sentence explanation for beginners",
  "analogyExplanation": "A detailed explanation using the ${analogy} analogy (3-4 paragraphs)",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "commonMistakes": ["mistake 1", "mistake 2"],
  "relatedTopics": ["topic 1", "topic 2"]
}

Make it engaging, memorable, and educational. Response must be valid JSON only.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid AI response format');
  } catch (error) {
    console.error('Gemini explain error:', error);
    return {
      simpleExplanation: `${topic} is an important concept in this subject area.`,
      analogyExplanation: `Let me explain ${topic} using a simple analogy...`,
      keyPoints: ['Key point 1', 'Key point 2', 'Key point 3'],
      commonMistakes: ['Common mistake 1'],
      relatedTopics: ['Related topic 1']
    };
  }
};

/**
 * Generate quiz for a topic
 * @param {string} topic - Topic for quiz
 * @param {number} numQuestions - Number of questions
 * @returns {Promise<Object>} - Quiz questions
 */
export const generateQuiz = async (topic, numQuestions = 5) => {
  const model = getModel();
  
  const prompt = `Create a quiz for testing knowledge on: ${topic}

Generate ${numQuestions} multiple choice questions in this JSON format:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Rules:
1. Questions should test understanding, not just memorization
2. Include some application-based questions
3. All 4 options should be plausible
4. Response must be valid JSON only`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid AI response format');
  } catch (error) {
    console.error('Gemini quiz error:', error);
    return {
      topic,
      questions: [{
        id: 1,
        question: `What is the main concept of ${topic}?`,
        options: ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'],
        correctAnswer: 'A',
        explanation: 'This is a placeholder question.'
      }]
    };
  }
};

/**
 * Fallback basic plan generation
 */
const generateBasicPlan = (subjects, examDate, hoursPerDay) => {
  const schedule = [];
  const today = new Date();
  const exam = new Date(examDate);
  const daysUntilExam = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  
  let allTopics = [];
  subjects.forEach(subject => {
    subject.topics.forEach(topic => {
      allTopics.push({ ...topic, subject: subject.name });
    });
  });

  const topicsPerDay = Math.ceil(allTopics.length / Math.max(daysUntilExam - 2, 1));
  let topicIndex = 0;

  for (let day = 0; day < daysUntilExam - 2 && topicIndex < allTopics.length; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    
    const sessions = [];
    for (let i = 0; i < topicsPerDay && topicIndex < allTopics.length; i++) {
      const topic = allTopics[topicIndex++];
      sessions.push({
        topic: topic.name,
        subject: topic.subject,
        duration: Math.min(topic.estimatedHours, hoursPerDay / topicsPerDay),
        type: 'study',
        priority: 'medium'
      });
    }

    schedule.push({
      date: date.toISOString().split('T')[0],
      sessions
    });
  }

  return {
    schedule,
    tips: [
      'Take short breaks every 25-30 minutes',
      'Review difficult topics multiple times',
      'Get enough sleep before the exam'
    ],
    estimatedReadiness: 75
  };
};

export default { generateStudyPlanWithAI, explainTopicWithAnalogy, generateQuiz };
