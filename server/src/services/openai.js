/**
 * OpenAI Service - Handles AI-powered analysis and flashcard generation
 */

const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyze study material and extract keywords with explanations
 * @param {string} content - The study material content to analyze
 * @returns {Promise<Array<{keyword: string, detail: string}>>}
 */
async function analyzeStudyMaterial(content) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using cost-effective model
      messages: [
        {
          role: 'system',
          content: `You are an expert study assistant. Analyze the provided study material and extract the most important keywords and concepts. For each keyword, provide a clear, detailed explanation that would help a student understand and remember the concept.

Respond with JSON in this exact format:
{
  "keywords": [
    {
      "keyword": "Term or concept name",
      "detail": "Clear, detailed explanation of this concept"
    }
  ]
}

Extract 5-10 of the most important concepts. Focus on key terms, definitions, processes, and important facts. Make explanations concise but comprehensive.`
        },
        {
          role: 'user',
          content: content
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.keywords || [];
  } catch (error) {
    console.error('Error analyzing study material:', error);
    throw new Error('Failed to analyze study material');
  }
}

/**
 * Generate flashcards from keywords
 * @param {Array<{keyword: string, detail: string}>} keywords - Keywords to generate flashcards from
 * @returns {Promise<Array<{front: string, back: string}>>}
 */
async function generateFlashcards(keywords) {
  try {
    const keywordsText = keywords
      .map(k => `Keyword: ${k.keyword}\nDetail: ${k.detail}`)
      .join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert study assistant creating flashcards for effective learning. Based on the provided keywords and their explanations, create flashcards with a question on the front and the answer on the back.

Respond with JSON in this exact format:
{
  "flashcards": [
    {
      "front": "Question about the concept",
      "back": "Clear, concise answer"
    }
  ]
}

Create one flashcard per keyword. Make questions clear and specific. Answers should be comprehensive but concise. Use various question formats: "What is...", "Explain...", "How does...", "Why is...", etc.`
        },
        {
          role: 'user',
          content: keywordsText
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.flashcards || [];
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards');
  }
}

module.exports = {
  analyzeStudyMaterial,
  generateFlashcards
};
