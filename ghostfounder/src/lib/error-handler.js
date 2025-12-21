import connectDB from '@/lib/mongodb/connect';

/**
 * Agent Error Handler
 * Provides centralized error handling, logging, and retry logic for all agents
 */
class AgentErrorHandler {
  static MAX_RETRIES = 3;
  static RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff (ms)

  /**
   * Handle agent errors with logging and optional retry
   */
  static async handleAgentError(agentName, error, context = {}) {
    const errorLog = {
      agent: agentName,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code || 'UNKNOWN'
      },
      context,
      timestamp: new Date(),
      severity: this.determineSeverity(error)
    };

    // Log to console
    console.error(`[${agentName}] Error:`, error.message);

    // Log to database
    try {
      await this.logErrorToDatabase(errorLog);
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }

    // Notify if critical
    if (errorLog.severity === 'critical') {
      await this.notifyCriticalError(errorLog);
    }

    return errorLog;
  }

  /**
   * Execute a function with retry logic
   */
  static async withRetry(fn, agentName, options = {}) {
    const maxRetries = options.maxRetries || this.MAX_RETRIES;
    const retryOn = options.retryOn || this.isRetryableError;
    
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Check if we should retry
        if (attempt < maxRetries && retryOn(error)) {
          const delay = this.RETRY_DELAYS[attempt] || this.RETRY_DELAYS[this.RETRY_DELAYS.length - 1];
          console.log(`[${agentName}] Retry ${attempt + 1}/${maxRetries} in ${delay}ms...`);
          await this.sleep(delay);
        } else {
          break;
        }
      }
    }
    
    // All retries exhausted
    await this.handleAgentError(agentName, lastError, { retries: maxRetries });
    throw lastError;
  }

  /**
   * Determine if an error is retryable
   */
  static isRetryableError(error) {
    // Network errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') return true;
    if (error.code === 'ENOTFOUND') return true;
    
    // Rate limiting
    if (error.status === 429) return true;
    
    // Server errors
    if (error.status >= 500 && error.status < 600) return true;
    
    // API-specific errors
    if (error.message?.includes('rate limit')) return true;
    if (error.message?.includes('timeout')) return true;
    if (error.message?.includes('temporarily unavailable')) return true;
    
    return false;
  }

  /**
   * Determine error severity
   */
  static determineSeverity(error) {
    // Critical errors
    if (error.code === 'EACCES' || error.code === 'EPERM') return 'critical';
    if (error.message?.includes('authentication')) return 'critical';
    if (error.message?.includes('unauthorized')) return 'critical';
    if (error.message?.includes('database')) return 'critical';
    
    // High severity
    if (error.status >= 500) return 'high';
    if (error.message?.includes('validation')) return 'high';
    
    // Medium severity
    if (error.status >= 400 && error.status < 500) return 'medium';
    
    return 'low';
  }

  /**
   * Log error to MongoDB
   */
  static async logErrorToDatabase(errorLog) {
    try {
      await connectDB();
      
      // Dynamic import to avoid circular dependencies
      const mongoose = await import('mongoose');
      
      // Create error log schema if not exists
      const ErrorLog = mongoose.default.models.ErrorLog || mongoose.default.model('ErrorLog', new mongoose.default.Schema({
        agent: String,
        error: {
          message: String,
          stack: String,
          code: String
        },
        context: mongoose.default.Schema.Types.Mixed,
        timestamp: { type: Date, default: Date.now },
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
        resolved: { type: Boolean, default: false }
      }));
      
      await ErrorLog.create(errorLog);
    } catch (error) {
      console.error('Database logging failed:', error.message);
    }
  }

  /**
   * Notify about critical errors
   */
  static async notifyCriticalError(errorLog) {
    // Could integrate with Twilio, email, Slack, etc.
    console.error(`🚨 CRITICAL ERROR in ${errorLog.agent}:`, errorLog.error.message);
    
    // TODO: Send email/Slack notification for production
    // await sendSlackNotification({
    //   channel: '#errors',
    //   text: `Critical error in ${errorLog.agent}: ${errorLog.error.message}`
    // });
  }

  /**
   * Sleep utility for retry delays
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Wrap an agent's execute method with error handling
   */
  static wrapAgentMethod(agent, methodName) {
    const originalMethod = agent[methodName].bind(agent);
    const agentName = agent.constructor.name;
    
    return async (...args) => {
      return this.withRetry(
        () => originalMethod(...args),
        agentName,
        { maxRetries: 3 }
      );
    };
  }

  /**
   * Get recent errors for an agent
   */
  static async getRecentErrors(agentName, limit = 10) {
    try {
      await connectDB();
      const mongoose = await import('mongoose');
      const ErrorLog = mongoose.default.models.ErrorLog;
      
      if (!ErrorLog) return [];
      
      return await ErrorLog.find({ agent: agentName })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Failed to get recent errors:', error);
      return [];
    }
  }

  /**
   * Get error statistics
   */
  static async getErrorStats(hours = 24) {
    try {
      await connectDB();
      const mongoose = await import('mongoose');
      const ErrorLog = mongoose.default.models.ErrorLog;
      
      if (!ErrorLog) return { total: 0, byAgent: {}, bySeverity: {} };
      
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);
      
      const errors = await ErrorLog.find({ timestamp: { $gte: since } }).lean();
      
      const stats = {
        total: errors.length,
        byAgent: {},
        bySeverity: { low: 0, medium: 0, high: 0, critical: 0 }
      };
      
      errors.forEach(err => {
        stats.byAgent[err.agent] = (stats.byAgent[err.agent] || 0) + 1;
        stats.bySeverity[err.severity] = (stats.bySeverity[err.severity] || 0) + 1;
      });
      
      return stats;
    } catch (error) {
      console.error('Failed to get error stats:', error);
      return { total: 0, byAgent: {}, bySeverity: {} };
    }
  }
}

export default AgentErrorHandler;
