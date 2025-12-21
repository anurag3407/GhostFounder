import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Model configurations for different agents
export const GEMINI_MODELS = {
  CODE_REVIEW: process.env.GEMINI_MODEL_CODE_REVIEW || 'gemini-2.5-flash',
  DATABASE: process.env.GEMINI_MODEL_DATABASE || 'gemini-2.5-flash',
  CFO: process.env.GEMINI_MODEL_CFO || 'gemini-2.5-flash',
  PITCH: process.env.GEMINI_MODEL_PITCH || 'gemini-2.5-pro',
  SPY: process.env.GEMINI_MODEL_SPY || 'gemini-2.5-pro',
  NEWS: process.env.GEMINI_MODEL_NEWS || 'gemini-2.5-flash',
  VC_ROAST: process.env.GEMINI_MODEL_VC_ROAST || 'gemini-2.5-flash',
};

// Cost per 1M tokens (approximate for Gemini 2.5)
export const TOKEN_COSTS = {
  'gemini-2.5-flash': {
    input: 0.075,  // per 1M input tokens
    output: 0.30,  // per 1M output tokens
  },
  'gemini-2.5-pro': {
    input: 1.25,   // per 1M input tokens
    output: 10.00, // per 1M output tokens
  },
};

/**
 * Get a Gemini model instance
 * @param {string} modelName - The model name from GEMINI_MODELS
 * @returns {GenerativeModel}
 */
export function getModel(modelName) {
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Calculate cost based on token usage
 * @param {string} modelName - The model used
 * @param {number} inputTokens - Number of input tokens
 * @param {number} outputTokens - Number of output tokens
 * @returns {number} - Cost in USD
 */
export function calculateCost(modelName, inputTokens, outputTokens) {
  const costs = TOKEN_COSTS[modelName] || TOKEN_COSTS['gemini-2.5-flash'];
  const inputCost = (inputTokens / 1000000) * costs.input;
  const outputCost = (outputTokens / 1000000) * costs.output;
  return inputCost + outputCost;
}

/**
 * Generate content with automatic retry and error handling
 * @param {string} modelName - The model to use
 * @param {string} prompt - The prompt text
 * @param {object} options - Additional options
 * @returns {Promise<{text: string, usage: object}>}
 */
export async function generateContent(modelName, prompt, options = {}) {
  const model = getModel(modelName);
  
  const generationConfig = {
    temperature: options.temperature || 0.7,
    topP: options.topP || 0.95,
    topK: options.topK || 40,
    maxOutputTokens: options.maxOutputTokens || 8192,
  };

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();
    
    // Get token usage from response metadata
    const usageMetadata = response.usageMetadata || {};
    const usage = {
      promptTokens: usageMetadata.promptTokenCount || 0,
      completionTokens: usageMetadata.candidatesTokenCount || 0,
      totalTokens: usageMetadata.totalTokenCount || 0,
      cost: calculateCost(
        modelName,
        usageMetadata.promptTokenCount || 0,
        usageMetadata.candidatesTokenCount || 0
      ),
    };

    return { text, usage };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

/**
 * Start a chat session for multi-turn conversations
 * @param {string} modelName - The model to use
 * @param {string} systemInstruction - System prompt for the chat
 * @returns {ChatSession}
 */
export function startChat(modelName, systemInstruction) {
  const model = getModel(modelName);
  
  return model.startChat({
    history: [],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
    systemInstruction: systemInstruction,
  });
}

export default genAI;
