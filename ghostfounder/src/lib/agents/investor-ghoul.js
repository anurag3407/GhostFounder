/**
 * Investor Ghoul - VC Roast Mode Agent
 * 
 * Provides harsh but constructive feedback like a tough VC investor
 * - Analyzes pitch ideas critically
 * - Sends random motivational/critical messages
 * - Acts as a tough mentor
 */

import BaseAgent from './base-agent';
import { GEMINI_MODELS } from '@/lib/gemini/config';
import { sendWhatsApp } from '@/lib/notifications';

class InvestorGhoul extends BaseAgent {
  constructor() {
    super({
      name: 'Investor Ghoul',
      description: 'Harsh VC-style feedback and mentorship agent',
      model: GEMINI_MODELS.flash
    });

    // Personality traits for the VC persona
    this.personality = {
      name: 'The Ghoul',
      background: 'Former partner at top-tier VC, seen 10,000+ pitches, funded 50+ unicorns',
      style: 'Direct, critical, but ultimately wants you to succeed',
      motto: 'I\'m not here to make you feel good. I\'m here to make you successful.'
    };
  }

  /**
   * Roast/analyze a startup idea
   */
  async roastIdea({ userId, idea, context }) {
    await this.initialize(userId);

    try {
      const roast = await this.generateRoast(idea, context);
      
      // Log usage
      await this.logUsage({
        action: 'idea_roast',
        details: {
          ideaLength: idea?.length || 0,
          hasContext: !!context
        }
      });

      return {
        success: true,
        data: roast
      };
    } catch (error) {
      console.error('Investor Ghoul error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate harsh but constructive feedback
   */
  async generateRoast(idea, context = {}) {
    const prompt = `
You are a legendary venture capitalist known as "The Ghoul." You've been in the game for 25 years, seen 10,000+ pitches, and funded 50+ unicorns. You're known for your brutally honest feedback that, while harsh, has helped many founders succeed.

Your personality:
- Direct and unfiltered - you don't sugarcoat
- Skeptical by default - you've seen every type of failure
- Data-driven - you want metrics, not dreams
- Secretly caring - you're tough because you want them to succeed
- Occasionally add dark humor

A founder has come to you with this idea:
"${idea}"

${context.stage ? `Stage: ${context.stage}` : ''}
${context.traction ? `Traction: ${context.traction}` : ''}
${context.funding ? `Funding sought: ${context.funding}` : ''}
${context.team ? `Team: ${context.team}` : ''}

Provide your brutally honest analysis in JSON format:
{
  "overallScore": 0-100,
  "verdict": "PASS/NEEDS_WORK/FAIL",
  "firstImpression": "Your gut reaction in 1-2 sentences",
  "roast": "Your harshest but fair critique (2-3 sentences)",
  "criticalFlaws": [
    {"flaw": "Major issue 1", "severity": "critical/major/minor", "advice": "How to fix it"}
  ],
  "whatWorks": ["Thing that's actually good", "Another good thing"],
  "hardQuestions": [
    "Tough question they need to answer 1",
    "Tough question 2",
    "Tough question 3"
  ],
  "marketReality": "What the market actually looks like for this idea",
  "competitionWarning": "Who they're really competing against",
  "unitEconomicsCheck": "Quick assessment of whether the math can work",
  "adviceIfTheyContinue": [
    "What they MUST do if they proceed",
    "Next critical milestone"
  ],
  "adviceIfTheyPivot": "Alternative direction they should consider",
  "parting_words": "Your final harsh but motivating message",
  "ghoulQuote": "A memorable one-liner in your signature style"
}

Be harsh but fair. Don't be mean for the sake of it - be mean because you want them to build something great.

Return ONLY valid JSON.
`;

    const response = await this.chat.sendMessage(prompt);
    const text = response.response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.error('Failed to parse roast response');
    }

    // Return default response if parsing fails
    return {
      overallScore: 50,
      verdict: 'NEEDS_WORK',
      firstImpression: 'Interesting concept, but the execution needs serious work.',
      roast: 'I\'ve seen this pitch 100 times. What makes YOU different?',
      criticalFlaws: [
        { flaw: 'Unclear value proposition', severity: 'critical', advice: 'Define your 10x improvement' }
      ],
      whatWorks: ['You have an idea, which is a start'],
      hardQuestions: ['Who is your customer and why do they care?', 'How will you acquire customers profitably?'],
      marketReality: 'Market may exist but you need to prove it',
      competitionWarning: 'Someone is already working on this',
      unitEconomicsCheck: 'Show me the numbers',
      adviceIfTheyContinue: ['Talk to 100 potential customers', 'Build an MVP in 30 days'],
      adviceIfTheyPivot: 'Consider a more focused niche',
      parting_words: 'Come back when you have traction. Ideas are worthless, execution is everything.',
      ghoulQuote: 'In the startup graveyard, the headstones all read: "But the idea was great."'
    };
  }

  /**
   * Generate random motivational/critical message
   */
  async generateRandomMessage(userContext = {}) {
    const messageTypes = [
      'tough_love',
      'market_insight',
      'productivity_push',
      'reality_check',
      'motivation',
      'metric_reminder'
    ];

    const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];

    const prompt = `
You are "The Ghoul," a legendary VC known for sending random messages to founders in your portfolio. Today's message type: ${messageType}.

${userContext.startup ? `Their startup: ${userContext.startup}` : ''}
${userContext.lastMetric ? `Their last reported metric: ${userContext.lastMetric}` : ''}

Generate a short, punchy message (2-3 sentences max) that fits the type. Be direct, slightly intimidating, but ultimately helpful.

Message types:
- tough_love: Harsh reminder about what matters
- market_insight: Quick market observation they should know
- productivity_push: Push them to work harder/smarter
- reality_check: Remind them of harsh startup realities
- motivation: Surprisingly encouraging (rare from you)
- metric_reminder: Ask about a specific metric

Return JSON:
{
  "message": "The actual message",
  "type": "${messageType}",
  "emoji": "Single relevant emoji",
  "urgency": "high/medium/low"
}

Return ONLY valid JSON.
`;

    try {
      const response = await this.chat.sendMessage(prompt);
      const text = response.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Random message generation error:', error);
    }

    // Fallback messages by type
    const fallbackMessages = {
      tough_love: {
        message: "Your burn rate is eating your runway. Cut costs or raise now.",
        emoji: "🔥",
        urgency: "high"
      },
      market_insight: {
        message: "Your competitor just raised $10M. Time to differentiate or die.",
        emoji: "⚔️",
        urgency: "medium"
      },
      productivity_push: {
        message: "It's 10 AM. Have you talked to a customer yet today?",
        emoji: "📞",
        urgency: "medium"
      },
      reality_check: {
        message: "90% of startups fail. Are you doing what the 10% do?",
        emoji: "💀",
        urgency: "high"
      },
      motivation: {
        message: "I've seen founders with less pull off miracles. You've got this.",
        emoji: "👻",
        urgency: "low"
      },
      metric_reminder: {
        message: "What's your CAC:LTV ratio this month? If you don't know, that's a problem.",
        emoji: "📊",
        urgency: "medium"
      }
    };

    return {
      ...fallbackMessages[messageType] || fallbackMessages.reality_check,
      type: messageType
    };
  }

  /**
   * Send random message to user (for cron job)
   */
  async sendRandomMessageToUser(userId, phoneNumber) {
    // 30% chance of sending a message
    if (Math.random() > 0.3) {
      return { sent: false, reason: 'Random chance - no message sent' };
    }

    // Only during business hours (9 AM - 8 PM)
    const hour = new Date().getHours();
    if (hour < 9 || hour > 20) {
      return { sent: false, reason: 'Outside business hours' };
    }

    try {
      const messageData = await this.generateRandomMessage();
      
      if (phoneNumber && process.env.TWILIO_ACCOUNT_SID) {
        await sendWhatsApp(
          phoneNumber,
          `${messageData.emoji} *The Ghoul says:*\n\n${messageData.message}`
        );

        await this.logUsage({
          action: 'random_message_sent',
          details: {
            userId,
            messageType: messageData.type
          }
        });

        return { sent: true, message: messageData };
      }

      return { sent: false, reason: 'No phone number or Twilio not configured' };
    } catch (error) {
      console.error('Error sending random message:', error);
      return { sent: false, reason: error.message };
    }
  }

  /**
   * Quick pitch feedback (shorter version)
   */
  async quickFeedback(pitch) {
    const prompt = `
You are "The Ghoul," a legendary VC. Give quick feedback on this pitch in 3 bullet points max.

Pitch: "${pitch}"

Be harsh and direct. Format:
{
  "score": 0-100,
  "verdict": "PASS/NEEDS_WORK/FAIL",
  "bullets": [
    "Point 1",
    "Point 2",
    "Point 3"
  ],
  "oneAdvice": "Single most important thing to do next"
}

Return ONLY valid JSON.
`;

    try {
      const response = await this.chat.sendMessage(prompt);
      const text = response.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.error('Quick feedback error');
    }

    return {
      score: 50,
      verdict: 'NEEDS_WORK',
      bullets: [
        'Be more specific about your value proposition',
        'Show me numbers, not dreams',
        'Who pays for this and why?'
      ],
      oneAdvice: 'Talk to 10 potential customers this week'
    };
  }

  /**
   * Get Ghoul quotes (for UI)
   */
  getGhoulQuotes() {
    return [
      "In the startup graveyard, every headstone reads: 'But the idea was great.'",
      "Your pitch deck is beautiful. Your unit economics are terrifying.",
      "I don't invest in ideas. I invest in founders who can execute despite bad ideas.",
      "If you can't explain your business to me in 30 seconds, you don't understand it.",
      "The market doesn't care about your passion. It cares about your solution.",
      "You're not running out of money. You're running out of mistakes you can afford to make.",
      "A startup without metrics is a hobby with anxiety.",
      "I've seen better pivots from drunk basketball players.",
      "Your competitor is working right now. Are you?",
      "The best time to raise money was when you didn't need it. The second best time is never showing desperation.",
      "Every founder thinks they're the exception. The data says otherwise.",
      "Your burn rate is a timer on how long I have to believe in you."
    ];
  }
}

export default InvestorGhoul;
