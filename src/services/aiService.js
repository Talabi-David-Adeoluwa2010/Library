import { GoogleGenAI } from '@google/genai';

// Initialize with your API key
const ai = new GoogleGenAI({ apiKey: "YOUR_GEMINI_API_KEY" });

/**
 * Chat in-character with a literary figure
 * @param {string} characterName - e.g., "Jay Gatsby"
 * @param {string} userMessage - Message sent by the scholar
 * @param {Array} history - Previous message history
 */
export const chatWithCharacter = async (characterName, userMessage, history = []) => {
  try {
    const systemInstruction = `You are ${characterName} from classic literature. Always respond in character, using the appropriate era-specific tone, vocabulary, and worldview. Keep responses concise (under 3 sentences) suitable for a mobile app chat interface.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error('AI Character Chat Error:', error);
    return "Forgive me, old sport. I seem to have gotten lost in thought for a moment.";
  }
};

/**
 * Generate instant tutoring explanations for literature/exam questions
 */
export const getAiExplanation = async (question, selectedAnswer, correctAnswer) => {
  try {
    const prompt = `A student answered a practice exam question.
Question: "${question}"
Student Answer: "${selectedAnswer}"
Correct Answer: "${correctAnswer}"

Provide a clear, brief 2-sentence explanation explaining why the correct answer is right and offering a quick memory tip for exams like UTME/WAEC.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error('AI Tutor Explanation Error:', error);
    return "Check the main text context to see how this answer fits best.";
  }
};
