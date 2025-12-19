import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

/**
 * Parse PDF from buffer and extract text content
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text content
 */
export const parsePDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
};

/**
 * Extract topics from syllabus text using patterns
 * @param {string} text - Raw syllabus text
 * @returns {Array} - Array of subject objects with topics
 */
export const extractTopicsFromText = (text) => {
  // Simple extraction logic - can be enhanced with Gemini
  const lines = text.split('\n').filter(line => line.trim());
  const subjects = [];
  let currentSubject = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect subject headers (usually capitalized or numbered)
    if (/^(UNIT|MODULE|CHAPTER|SECTION|\d+\.)\s*/i.test(trimmed) || 
        (trimmed.length < 50 && trimmed === trimmed.toUpperCase() && trimmed.length > 3)) {
      if (currentSubject && currentSubject.topics.length > 0) {
        subjects.push(currentSubject);
      }
      currentSubject = {
        name: trimmed.replace(/^(UNIT|MODULE|CHAPTER|SECTION|\d+\.)\s*/i, '').trim(),
        topics: []
      };
    } else if (currentSubject && trimmed.length > 5 && trimmed.length < 200) {
      // Add as topic if it looks like content
      currentSubject.topics.push({
        name: trimmed,
        weightage: 1,
        estimatedHours: 2,
        completed: false
      });
    }
  }

  // Add last subject
  if (currentSubject && currentSubject.topics.length > 0) {
    subjects.push(currentSubject);
  }

  // If no structured subjects found, create a default one
  if (subjects.length === 0) {
    subjects.push({
      name: 'General Topics',
      topics: lines.slice(0, 20).map(line => ({
        name: line.trim().substring(0, 100),
        weightage: 1,
        estimatedHours: 2,
        completed: false
      })).filter(t => t.name.length > 5)
    });
  }

  return subjects;
};

/**
 * Extract exam dates from text
 * @param {string} text - Syllabus text
 * @returns {Date|null} - Extracted exam date or null
 */
export const extractExamDate = (text) => {
  // Look for common date patterns
  const datePatterns = [
    /exam\s*(?:date|on|:)?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    /(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})\s*(?:exam|test|final)/i,
    /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const dateStr = match[1] || match[0];
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }

  // Default to 30 days from now if no date found
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 30);
  return defaultDate;
};

export default { parsePDF, extractTopicsFromText, extractExamDate };
