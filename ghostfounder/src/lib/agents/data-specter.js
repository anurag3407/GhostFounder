import { BaseAgent } from './base-agent';
import { generateContent, GEMINI_MODELS, startChat } from '@/lib/gemini/config';
import { ChatMessage, User, CodeReview, FinancialReport } from '@/models';
import dbConnect from '@/lib/mongodb/connect';

const DATA_SPECTER_SYSTEM_PROMPT = `You are Data Specter, an AI assistant that helps users query their data using natural language. You convert user questions into MongoDB aggregation pipelines.

Available Collections and their schemas:

1. **users** - User profiles
   - firebaseUid, email, displayName, githubConnected, subscription, tokenUsage[], createdAt

2. **codereviews** - Code review results
   - userId, repoName, prNumber, prTitle, analysis (summary, bugs[], securityIssues[], overallScore), tokenUsage, status, createdAt

3. **financialreports** - Financial reports
   - userId, period (Q1/Q2/Q3/Q4), year, data (revenue, expenses, netProfit, burnRate), status, createdAt

When a user asks a question:
1. Determine which collection(s) to query
2. Generate a valid MongoDB aggregation pipeline
3. Explain what the query does

Respond in JSON format:
{
  "collection": "collectionName",
  "pipeline": [...aggregation stages...],
  "explanation": "What this query does",
  "visualization": "table|bar|line|pie|none"
}

Rules:
- Always use safe queries - never allow deletions or updates
- Limit results to 100 documents max
- Use $match for filtering, $group for aggregation, $project for field selection
- For token usage queries, sum the tokenUsage array
- Always include proper date filtering when relevant`;

/**
 * Data Specter - Natural Language Database Query Agent
 */
export class DataSpecter extends BaseAgent {
  constructor() {
    super('data-specter', GEMINI_MODELS.DATABASE);
    this.activeSessions = new Map();
  }

  /**
   * Process a natural language query
   * @param {object} input - Query data
   * @param {string} input.question - User's question
   * @param {string} input.firebaseUid - User's Firebase UID
   * @param {string} input.sessionId - Optional session ID for chat continuity
   */
  async execute(input) {
    this.startTimer();
    await dbConnect();

    const { question, firebaseUid, sessionId } = input;

    // Get or create chat session
    let chatSession = sessionId 
      ? await ChatMessage.findById(sessionId)
      : null;

    if (!chatSession) {
      const user = await this.getOrCreateUser(firebaseUid, input.email, input.displayName);
      chatSession = await ChatMessage.create({
        userId: user._id,
        firebaseUid,
        agent: 'data-specter',
        messages: [],
      });
    }

    try {
      // Add user message
      await chatSession.addMessage('user', question, 0);

      // Generate MongoDB query using Gemini
      const prompt = `${DATA_SPECTER_SYSTEM_PROMPT}

User ID for filtering: ${firebaseUid}

User Question: ${question}

Generate the MongoDB aggregation pipeline to answer this question. Make sure to filter by firebaseUid when querying user-specific data.`;

      const { text, usage } = await generateContent(this.modelName, prompt, {
        temperature: 0.2, // Low for accurate query generation
        maxOutputTokens: 2048,
      });

      // Parse the response
      const queryPlan = this.parseQueryPlan(text);

      // Execute the query safely
      let results = null;
      let error = null;

      if (queryPlan.collection && queryPlan.pipeline) {
        try {
          results = await this.executeQuery(queryPlan.collection, queryPlan.pipeline, firebaseUid);
        } catch (e) {
          error = e.message;
        }
      }

      // Generate natural language response
      const responseText = await this.generateResponse(question, queryPlan, results, error);

      // Add assistant message
      await chatSession.addMessage('assistant', responseText, usage.totalTokens, results);

      // Update total tokens
      chatSession.totalTokens += usage.totalTokens;
      chatSession.totalCost += usage.cost;
      await chatSession.save();

      // Log usage
      await this.logUsage(firebaseUid, usage.totalTokens, usage.cost);

      return {
        success: true,
        sessionId: chatSession._id.toString(),
        response: responseText,
        results,
        visualization: queryPlan.visualization || 'table',
        executionTime: this.getExecutionTime(),
        tokenUsage: usage,
      };
    } catch (error) {
      await chatSession.addMessage('assistant', `Error: ${error.message}`, 0);
      throw error;
    }
  }

  /**
   * Parse the AI response into a query plan
   */
  parseQueryPlan(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { collection: null, pipeline: null, explanation: text, visualization: 'none' };
    } catch (error) {
      return { collection: null, pipeline: null, explanation: text, visualization: 'none' };
    }
  }

  /**
   * Execute a MongoDB aggregation pipeline safely
   */
  async executeQuery(collection, pipeline, firebaseUid) {
    await dbConnect();

    // Whitelist of allowed collections
    const allowedCollections = {
      'users': User,
      'codereviews': CodeReview,
      'financialreports': FinancialReport,
    };

    const Model = allowedCollections[collection.toLowerCase()];
    if (!Model) {
      throw new Error(`Collection '${collection}' is not accessible`);
    }

    // Safety: Ensure user can only query their own data
    const safePipeline = this.sanitizePipeline(pipeline, firebaseUid);

    // Add limit if not present
    const hasLimit = safePipeline.some(stage => stage.$limit);
    if (!hasLimit) {
      safePipeline.push({ $limit: 100 });
    }

    const results = await Model.aggregate(safePipeline);
    return results;
  }

  /**
   * Sanitize the pipeline to ensure user can only access their data
   */
  sanitizePipeline(pipeline, firebaseUid) {
    // Ensure first stage is a $match with firebaseUid
    const matchStage = pipeline.find(stage => stage.$match);
    
    if (matchStage) {
      matchStage.$match.firebaseUid = firebaseUid;
    } else {
      pipeline.unshift({ $match: { firebaseUid } });
    }

    // Remove any dangerous operations
    return pipeline.filter(stage => {
      const key = Object.keys(stage)[0];
      const dangerousOps = ['$out', '$merge', '$unset'];
      return !dangerousOps.includes(key);
    });
  }

  /**
   * Generate a natural language response from query results
   */
  async generateResponse(question, queryPlan, results, error) {
    if (error) {
      return `I encountered an error while querying: ${error}. Could you try rephrasing your question?`;
    }

    if (!results || results.length === 0) {
      return `I searched your data but found no results matching your query. ${queryPlan.explanation || ''}`;
    }

    // For simple queries, generate a response
    const prompt = `The user asked: "${question}"
    
Query explanation: ${queryPlan.explanation}

Results (${results.length} items):
${JSON.stringify(results.slice(0, 5), null, 2)}

Generate a natural, helpful response summarizing these results. Be concise but informative.`;

    const { text } = await generateContent(this.modelName, prompt, {
      temperature: 0.7,
      maxOutputTokens: 1024,
    });

    return text;
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId) {
    await dbConnect();
    return ChatMessage.findById(sessionId).lean();
  }

  /**
   * Get all chat sessions for a user
   */
  async getUserSessions(firebaseUid, limit = 10) {
    await dbConnect();
    return ChatMessage.find({ firebaseUid, agent: 'data-specter' })
      .sort({ lastActivity: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * Get suggested queries based on user's data
   */
  getSuggestedQueries() {
    return [
      "How many code reviews have I done this month?",
      "What's my total token usage this week?",
      "Show me my code reviews with critical bugs",
      "What's my average code review score?",
      "List my most recent financial reports",
      "How much have I spent on AI tokens?",
      "Show me code reviews for my main repository",
      "What security issues were found in my code?",
    ];
  }
}

export default DataSpecter;
