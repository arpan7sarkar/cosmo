import { getModel } from './model.js';

/**
 * Explain topic with analogy
 * @param {string} topic - Topic to explain
 * @param {string} analogy - Analogy style (marvel, cricket, etc.)
 * @returns {Promise<Object>} - Explanation with analogy
 */
export const explainTopicWithAnalogy = async (topic, analogy = "reallife") => {
  const model = getModel();

  const analogyContexts = {
    marvel: "Use Marvel Cinematic Universe characters, powers, and storylines",
    cricket: "Use cricket concepts, players, matches, and strategies",
    football: "Use football/soccer concepts, teams, players, and tactics",
    movies: "Use popular movie plots, characters, and scenes",
    reallife: "Use everyday real-life situations and examples",
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

    let cleanText = text.replace(/```json/g, '').replace(/```/g, '');
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Invalid AI response format");
  } catch (error) {
    console.error("Gemini explain error:", error);
    return {
      simpleExplanation: `${topic} is an important concept in this subject area.`,
      analogyExplanation: `Let me explain ${topic} using a simple analogy...`,
      keyPoints: ["Key point 1", "Key point 2", "Key point 3"],
      commonMistakes: ["Common mistake 1"],
      relatedTopics: ["Related topic 1"],
    };
  }
};

export default { explainTopicWithAnalogy };
