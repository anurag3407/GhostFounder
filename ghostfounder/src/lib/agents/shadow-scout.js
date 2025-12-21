/**
 * Shadow Scout - Competitive Intelligence Agent
 * 
 * Monitors competitors and generates weekly intelligence reports
 * - GitHub activity analysis
 * - Market trend research
 * - Competitor feature tracking
 * - PDF report generation
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import BaseAgent from './base-agent';
import { GEMINI_MODELS } from '@/lib/gemini/config';

class ShadowScout extends BaseAgent {
  constructor() {
    super({
      name: 'Shadow Scout',
      description: 'Competitive intelligence agent for market analysis',
      model: GEMINI_MODELS.pro
    });
  }

  /**
   * Generate weekly competitive intelligence report
   */
  async generateWeeklyReport({ userId, projectData, competitors }) {
    await this.initialize(userId);

    try {
      // Step 1: Analyze competitors
      const analysis = await this.analyzeCompetitors(projectData, competitors);
      
      // Step 2: Get market trends
      const trends = await this.analyzeMarketTrends(projectData.industry);
      
      // Step 3: Generate insights
      const insights = await this.generateInsights(analysis, trends, projectData);
      
      // Step 4: Create PDF report
      const pdfBytes = await this.createReport(analysis, trends, insights, projectData);
      
      // Step 5: Log usage
      await this.logUsage({
        action: 'competitive_report_generated',
        details: {
          projectName: projectData.name,
          competitorsAnalyzed: competitors?.length || 0
        }
      });

      return {
        success: true,
        data: {
          pdfBytes,
          analysis,
          trends,
          insights
        }
      };
    } catch (error) {
      console.error('Shadow Scout error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Analyze competitors
   */
  async analyzeCompetitors(projectData, competitors = []) {
    const competitorList = competitors.length > 0 
      ? competitors.map(c => `- ${c.name}: ${c.description || 'No description'}`).join('\n')
      : 'No specific competitors provided';

    const prompt = `
You are a competitive intelligence analyst. Analyze the competitive landscape for this startup.

Our Project:
- Name: ${projectData.name}
- Description: ${projectData.description}
- Industry: ${projectData.industry || 'Technology'}
- Target Market: ${projectData.targetMarket || 'Not specified'}

Known Competitors:
${competitorList}

Please provide a comprehensive competitive analysis in JSON format:
{
  "directCompetitors": [
    {
      "name": "Competitor Name",
      "description": "What they do",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "marketShare": "Estimated market share",
      "funding": "Known funding",
      "threat_level": "high/medium/low"
    }
  ],
  "indirectCompetitors": [
    {
      "name": "Indirect Competitor",
      "description": "How they compete indirectly",
      "overlap": "Area of overlap"
    }
  ],
  "emergingThreats": [
    {
      "threat": "Potential new entrant or technology",
      "likelihood": "high/medium/low",
      "timeframe": "Short/Medium/Long term"
    }
  ],
  "ourAdvantages": ["Advantage 1", "Advantage 2"],
  "competitiveGaps": ["Gap we can exploit 1", "Gap 2"],
  "recommendations": ["Strategic recommendation 1", "Recommendation 2"]
}

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
      console.error('Failed to parse competitor analysis');
    }

    return {
      directCompetitors: [],
      indirectCompetitors: [],
      emergingThreats: [],
      ourAdvantages: ['First mover advantage', 'Technical innovation'],
      competitiveGaps: ['Underserved market segment'],
      recommendations: ['Focus on differentiation', 'Build strong moat']
    };
  }

  /**
   * Analyze market trends
   */
  async analyzeMarketTrends(industry) {
    const prompt = `
You are a market research analyst. Provide current market trends and insights for the ${industry || 'technology'} industry.

Return your analysis in JSON format:
{
  "currentTrends": [
    {
      "trend": "Trend name",
      "description": "Trend description",
      "impact": "high/medium/low",
      "opportunity": "How to capitalize"
    }
  ],
  "marketSize": {
    "current": "$X billion",
    "projected": "$Y billion by 2028",
    "cagr": "X%"
  },
  "keyDrivers": ["Driver 1", "Driver 2"],
  "challenges": ["Challenge 1", "Challenge 2"],
  "emergingTechnologies": ["Tech 1", "Tech 2"],
  "investmentActivity": {
    "trend": "Increasing/Stable/Decreasing",
    "notableDeals": ["Recent notable deal 1", "Deal 2"]
  },
  "regulatoryChanges": ["Regulatory change 1"],
  "forecast": "Brief market outlook for next 12 months"
}

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
      console.error('Failed to parse market trends');
    }

    return {
      currentTrends: [],
      marketSize: { current: 'N/A', projected: 'N/A', cagr: 'N/A' },
      keyDrivers: ['Digital transformation', 'AI adoption'],
      challenges: ['Market saturation', 'Regulatory uncertainty'],
      emergingTechnologies: ['AI/ML', 'Blockchain'],
      investmentActivity: { trend: 'Stable', notableDeals: [] },
      forecast: 'Market expected to continue growth trajectory'
    };
  }

  /**
   * Generate strategic insights
   */
  async generateInsights(competitorAnalysis, marketTrends, projectData) {
    const prompt = `
Based on the following competitive and market analysis, provide strategic insights for ${projectData.name}.

Competitive Analysis:
${JSON.stringify(competitorAnalysis, null, 2)}

Market Trends:
${JSON.stringify(marketTrends, null, 2)}

Provide strategic insights in JSON format:
{
  "keyInsights": [
    {
      "insight": "Key finding",
      "importance": "high/medium/low",
      "actionItem": "Specific action to take"
    }
  ],
  "opportunities": [
    {
      "opportunity": "Market opportunity",
      "timeline": "Short/Medium/Long term",
      "effort": "Low/Medium/High"
    }
  ],
  "threats": [
    {
      "threat": "Potential threat",
      "probability": "High/Medium/Low",
      "mitigation": "How to mitigate"
    }
  ],
  "strategicRecommendations": [
    {
      "recommendation": "Strategic recommendation",
      "priority": 1,
      "rationale": "Why this matters"
    }
  ],
  "quickWins": ["Quick win 1", "Quick win 2"],
  "watchList": ["Thing to monitor 1", "Thing to monitor 2"],
  "summary": "Executive summary in 2-3 sentences"
}

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
      console.error('Failed to parse insights');
    }

    return {
      keyInsights: [],
      opportunities: [],
      threats: [],
      strategicRecommendations: [],
      quickWins: ['Improve messaging', 'Enhance UX'],
      watchList: ['Key competitor activities', 'Market changes'],
      summary: 'Continue building competitive advantage through innovation and customer focus.'
    };
  }

  /**
   * Create PDF report
   */
  async createReport(analysis, trends, insights, projectData) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const width = 612; // Letter size
    const height = 792;
    
    const colors = {
      background: rgb(0.98, 0.98, 0.98),
      primary: rgb(0, 0.52, 0.63), // Dark teal
      secondary: rgb(0.2, 0.2, 0.25),
      accent: rgb(0, 0.83, 1),
      text: rgb(0.2, 0.2, 0.2),
      muted: rgb(0.5, 0.5, 0.5)
    };

    // Cover Page
    let page = pdfDoc.addPage([width, height]);
    this.drawCoverPage(page, projectData, font, fontRegular, colors, width, height);

    // Executive Summary
    page = pdfDoc.addPage([width, height]);
    this.drawExecutiveSummary(page, insights, font, fontRegular, colors, width, height);

    // Competitor Analysis
    page = pdfDoc.addPage([width, height]);
    this.drawCompetitorAnalysis(page, analysis, font, fontRegular, colors, width, height);

    // Market Trends
    page = pdfDoc.addPage([width, height]);
    this.drawMarketTrends(page, trends, font, fontRegular, colors, width, height);

    // Strategic Recommendations
    page = pdfDoc.addPage([width, height]);
    this.drawRecommendations(page, insights, font, fontRegular, colors, width, height);

    return await pdfDoc.save();
  }

  drawCoverPage(page, projectData, font, fontRegular, colors, width, height) {
    // Header bar
    page.drawRectangle({
      x: 0, y: height - 120,
      width, height: 120,
      color: colors.primary
    });

    page.drawText('COMPETITIVE INTELLIGENCE REPORT', {
      x: 50, y: height - 70,
      size: 24, font,
      color: rgb(1, 1, 1)
    });

    page.drawText(`Weekly Analysis for ${projectData.name}`, {
      x: 50, y: height - 100,
      size: 14, font: fontRegular,
      color: rgb(0.9, 0.9, 0.9)
    });

    // Date
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    page.drawText(date, {
      x: 50, y: height - 180,
      size: 16, font: fontRegular,
      color: colors.muted
    });

    // Ghost icon
    page.drawText('👻 Shadow Scout Report', {
      x: 50, y: height - 220,
      size: 18, font,
      color: colors.secondary
    });

    // Description
    page.drawText('This report provides comprehensive competitive intelligence', {
      x: 50, y: height / 2,
      size: 14, font: fontRegular,
      color: colors.text
    });
    page.drawText('including market analysis, competitor tracking, and strategic insights.', {
      x: 50, y: height / 2 - 25,
      size: 14, font: fontRegular,
      color: colors.text
    });

    // Footer
    page.drawText('Powered by GhostFounder AI', {
      x: 50, y: 50,
      size: 10, font: fontRegular,
      color: colors.muted
    });
  }

  drawExecutiveSummary(page, insights, font, fontRegular, colors, width, height) {
    page.drawText('EXECUTIVE SUMMARY', {
      x: 50, y: height - 60,
      size: 20, font,
      color: colors.primary
    });

    let yPos = height - 120;

    // Summary text
    if (insights.summary) {
      const summaryLines = this.wrapText(insights.summary, 80);
      for (const line of summaryLines) {
        page.drawText(line, {
          x: 50, y: yPos,
          size: 12, font: fontRegular,
          color: colors.text
        });
        yPos -= 20;
      }
    }

    yPos -= 30;
    page.drawText('Key Insights', {
      x: 50, y: yPos,
      size: 14, font,
      color: colors.secondary
    });
    yPos -= 30;

    for (const item of (insights.keyInsights || []).slice(0, 5)) {
      page.drawText(`• ${item.insight}`, {
        x: 60, y: yPos,
        size: 11, font: fontRegular,
        color: colors.text
      });
      yPos -= 25;
    }

    yPos -= 20;
    page.drawText('Quick Wins', {
      x: 50, y: yPos,
      size: 14, font,
      color: colors.secondary
    });
    yPos -= 30;

    for (const win of (insights.quickWins || []).slice(0, 3)) {
      page.drawText(`✓ ${win}`, {
        x: 60, y: yPos,
        size: 11, font: fontRegular,
        color: colors.text
      });
      yPos -= 25;
    }
  }

  drawCompetitorAnalysis(page, analysis, font, fontRegular, colors, width, height) {
    page.drawText('COMPETITOR ANALYSIS', {
      x: 50, y: height - 60,
      size: 20, font,
      color: colors.primary
    });

    let yPos = height - 120;

    // Direct competitors
    page.drawText('Direct Competitors', {
      x: 50, y: yPos,
      size: 14, font,
      color: colors.secondary
    });
    yPos -= 30;

    for (const comp of (analysis.directCompetitors || []).slice(0, 4)) {
      page.drawText(`${comp.name} (${comp.threat_level || 'unknown'} threat)`, {
        x: 60, y: yPos,
        size: 12, font,
        color: colors.text
      });
      yPos -= 20;
      
      if (comp.description) {
        const descLines = this.wrapText(comp.description, 70);
        for (const line of descLines.slice(0, 2)) {
          page.drawText(line, {
            x: 70, y: yPos,
            size: 10, font: fontRegular,
            color: colors.muted
          });
          yPos -= 15;
        }
      }
      yPos -= 15;
    }

    // Our advantages
    yPos -= 20;
    page.drawText('Our Competitive Advantages', {
      x: 50, y: yPos,
      size: 14, font,
      color: colors.secondary
    });
    yPos -= 30;

    for (const adv of (analysis.ourAdvantages || []).slice(0, 5)) {
      page.drawText(`→ ${adv}`, {
        x: 60, y: yPos,
        size: 11, font: fontRegular,
        color: colors.text
      });
      yPos -= 25;
    }
  }

  drawMarketTrends(page, trends, font, fontRegular, colors, width, height) {
    page.drawText('MARKET TRENDS', {
      x: 50, y: height - 60,
      size: 20, font,
      color: colors.primary
    });

    let yPos = height - 120;

    // Market size
    if (trends.marketSize) {
      page.drawText('Market Size', {
        x: 50, y: yPos,
        size: 14, font,
        color: colors.secondary
      });
      yPos -= 30;
      
      page.drawText(`Current: ${trends.marketSize.current}`, {
        x: 60, y: yPos,
        size: 11, font: fontRegular,
        color: colors.text
      });
      yPos -= 20;
      
      page.drawText(`Projected: ${trends.marketSize.projected}`, {
        x: 60, y: yPos,
        size: 11, font: fontRegular,
        color: colors.text
      });
      yPos -= 20;
      
      page.drawText(`CAGR: ${trends.marketSize.cagr}`, {
        x: 60, y: yPos,
        size: 11, font: fontRegular,
        color: colors.text
      });
      yPos -= 40;
    }

    // Current trends
    page.drawText('Current Trends', {
      x: 50, y: yPos,
      size: 14, font,
      color: colors.secondary
    });
    yPos -= 30;

    for (const trend of (trends.currentTrends || []).slice(0, 4)) {
      page.drawText(`• ${trend.trend} (${trend.impact} impact)`, {
        x: 60, y: yPos,
        size: 11, font: fontRegular,
        color: colors.text
      });
      yPos -= 25;
    }

    // Forecast
    yPos -= 20;
    page.drawText('Market Outlook', {
      x: 50, y: yPos,
      size: 14, font,
      color: colors.secondary
    });
    yPos -= 30;

    if (trends.forecast) {
      const forecastLines = this.wrapText(trends.forecast, 70);
      for (const line of forecastLines) {
        page.drawText(line, {
          x: 60, y: yPos,
          size: 11, font: fontRegular,
          color: colors.text
        });
        yPos -= 18;
      }
    }
  }

  drawRecommendations(page, insights, font, fontRegular, colors, width, height) {
    page.drawText('STRATEGIC RECOMMENDATIONS', {
      x: 50, y: height - 60,
      size: 20, font,
      color: colors.primary
    });

    let yPos = height - 120;

    for (const rec of (insights.strategicRecommendations || []).slice(0, 5)) {
      page.drawText(`${rec.priority}. ${rec.recommendation}`, {
        x: 50, y: yPos,
        size: 12, font,
        color: colors.text
      });
      yPos -= 25;

      if (rec.rationale) {
        const rationaleLines = this.wrapText(rec.rationale, 70);
        for (const line of rationaleLines.slice(0, 2)) {
          page.drawText(line, {
            x: 60, y: yPos,
            size: 10, font: fontRegular,
            color: colors.muted
          });
          yPos -= 15;
        }
      }
      yPos -= 20;
    }

    // Watch list
    yPos -= 20;
    page.drawText('Watch List', {
      x: 50, y: yPos,
      size: 14, font,
      color: colors.secondary
    });
    yPos -= 30;

    for (const item of (insights.watchList || []).slice(0, 5)) {
      page.drawText(`👁 ${item}`, {
        x: 60, y: yPos,
        size: 11, font: fontRegular,
        color: colors.text
      });
      yPos -= 25;
    }
  }

  /**
   * Utility: wrap text to fit within character limit
   */
  wrapText(text, maxChars) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).length > maxChars) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += (currentLine ? ' ' : '') + word;
      }
    }
    if (currentLine) lines.push(currentLine.trim());

    return lines;
  }
}

export default ShadowScout;
