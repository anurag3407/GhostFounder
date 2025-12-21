/**
 * Pitch Poltergeist - AI Pitch Deck Generator
 * 
 * Analyzes repository/README and generates professional pitch deck PDFs
 * - Market analysis
 * - Competition research
 * - Financial projections
 * - 10-15 slide presentation
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import BaseAgent from './base-agent';
import { GEMINI_MODELS } from '@/lib/gemini/config';

class PitchPoltergeist extends BaseAgent {
  constructor() {
    super({
      name: 'Pitch Poltergeist',
      description: 'AI-powered pitch deck generator with market analysis',
      model: GEMINI_MODELS.pro // Use Pro model for complex analysis
    });
  }

  /**
   * Generate a complete pitch deck
   */
  async generatePitchDeck({ userId, projectData }) {
    await this.initialize(userId);

    try {
      // Step 1: Analyze project data
      const analysis = await this.analyzeProject(projectData);
      
      // Step 2: Generate slide content
      const slides = await this.generateSlideContent(analysis, projectData);
      
      // Step 3: Create PDF
      const pdfBytes = await this.createPDF(slides);
      
      // Step 4: Log usage
      await this.logUsage({
        action: 'pitch_deck_generated',
        details: {
          projectName: projectData.name,
          slideCount: slides.length
        }
      });

      return {
        success: true,
        data: {
          pdfBytes,
          slides,
          analysis
        }
      };
    } catch (error) {
      console.error('Pitch deck generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Analyze project data using AI
   */
  async analyzeProject(projectData) {
    const prompt = `
You are a startup analyst expert. Analyze the following project and provide comprehensive insights for a pitch deck.

Project Information:
- Name: ${projectData.name}
- Description: ${projectData.description || 'Not provided'}
- README Content: ${projectData.readme || 'Not available'}
- Tech Stack: ${projectData.techStack?.join(', ') || 'Not specified'}
- Target Market: ${projectData.targetMarket || 'Not specified'}
- Problem Statement: ${projectData.problem || 'Not specified'}

Please provide a detailed analysis in the following JSON format:
{
  "problemStatement": "Clear articulation of the problem being solved",
  "solution": "How this project solves the problem",
  "uniqueValueProposition": "What makes this unique",
  "targetMarket": {
    "primary": "Primary target market description",
    "secondary": "Secondary market",
    "tam": "Total Addressable Market estimate",
    "sam": "Serviceable Addressable Market",
    "som": "Serviceable Obtainable Market"
  },
  "competitiveAdvantage": ["Advantage 1", "Advantage 2", "Advantage 3"],
  "competitors": [
    {"name": "Competitor 1", "weakness": "Their weakness"}
  ],
  "businessModel": {
    "type": "SaaS/Marketplace/etc",
    "revenueStreams": ["Stream 1", "Stream 2"],
    "pricing": "Pricing strategy"
  },
  "financialProjections": {
    "year1": {"revenue": "$X", "users": "Y"},
    "year2": {"revenue": "$X", "users": "Y"},
    "year3": {"revenue": "$X", "users": "Y"}
  },
  "keyMetrics": ["Metric 1", "Metric 2"],
  "risks": ["Risk 1", "Risk 2"],
  "askAmount": "Funding amount suggestion",
  "useOfFunds": ["Use 1 - X%", "Use 2 - Y%"]
}

Return ONLY valid JSON, no additional text.
`;

    const response = await this.chat.sendMessage(prompt);
    const text = response.response.text();
    
    // Parse JSON from response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.error('Failed to parse analysis JSON');
    }

    // Return default structure if parsing fails
    return {
      problemStatement: projectData.problem || 'Problem to be defined',
      solution: projectData.description || 'Solution to be defined',
      uniqueValueProposition: 'Unique approach to solving the problem',
      targetMarket: {
        primary: projectData.targetMarket || 'Target market to be defined',
        tam: '$10B+',
        sam: '$1B',
        som: '$100M'
      },
      competitiveAdvantage: ['Innovation', 'Technology', 'Team'],
      businessModel: {
        type: 'SaaS',
        revenueStreams: ['Subscriptions', 'Enterprise'],
        pricing: 'Freemium with paid tiers'
      },
      financialProjections: {
        year1: { revenue: '$500K', users: '10K' },
        year2: { revenue: '$2M', users: '50K' },
        year3: { revenue: '$10M', users: '200K' }
      },
      askAmount: '$1M Seed',
      useOfFunds: ['Product Development - 40%', 'Marketing - 30%', 'Team - 20%', 'Operations - 10%']
    };
  }

  /**
   * Generate content for each slide
   */
  async generateSlideContent(analysis, projectData) {
    const slides = [
      {
        type: 'cover',
        title: projectData.name || 'Startup Name',
        subtitle: analysis.uniqueValueProposition || 'Your tagline here',
        content: projectData.tagline || ''
      },
      {
        type: 'problem',
        title: 'The Problem',
        content: analysis.problemStatement,
        bullets: analysis.risks?.slice(0, 3) || []
      },
      {
        type: 'solution',
        title: 'Our Solution',
        content: analysis.solution,
        bullets: analysis.competitiveAdvantage || []
      },
      {
        type: 'market',
        title: 'Market Opportunity',
        content: `Target Market: ${analysis.targetMarket?.primary || 'Enterprise & SMBs'}`,
        metrics: [
          { label: 'TAM', value: analysis.targetMarket?.tam || '$10B+' },
          { label: 'SAM', value: analysis.targetMarket?.sam || '$1B' },
          { label: 'SOM', value: analysis.targetMarket?.som || '$100M' }
        ]
      },
      {
        type: 'product',
        title: 'Product Overview',
        content: projectData.description || analysis.solution,
        features: projectData.features || ['Feature 1', 'Feature 2', 'Feature 3']
      },
      {
        type: 'business',
        title: 'Business Model',
        content: `Model: ${analysis.businessModel?.type || 'SaaS'}`,
        bullets: analysis.businessModel?.revenueStreams || ['Subscriptions', 'Enterprise deals']
      },
      {
        type: 'traction',
        title: 'Traction & Metrics',
        metrics: analysis.keyMetrics?.map(m => ({ label: m, value: '-' })) || [
          { label: 'Users', value: 'X' },
          { label: 'Revenue', value: '$Y' },
          { label: 'Growth', value: 'Z%' }
        ]
      },
      {
        type: 'competition',
        title: 'Competitive Landscape',
        content: 'Our positioning in the market',
        competitors: analysis.competitors || []
      },
      {
        type: 'team',
        title: 'The Team',
        content: 'Our founding team brings expertise from leading companies',
        team: projectData.team || [
          { name: 'Founder 1', role: 'CEO' },
          { name: 'Founder 2', role: 'CTO' }
        ]
      },
      {
        type: 'financials',
        title: 'Financial Projections',
        projections: analysis.financialProjections || {}
      },
      {
        type: 'ask',
        title: 'The Ask',
        amount: analysis.askAmount || '$1M Seed Round',
        useOfFunds: analysis.useOfFunds || []
      },
      {
        type: 'closing',
        title: 'Thank You',
        content: projectData.contactEmail || 'contact@company.com',
        subtitle: projectData.website || 'www.company.com'
      }
    ];

    return slides;
  }

  /**
   * Create PDF document from slides
   */
  async createPDF(slides) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // PDF dimensions (16:9 aspect ratio)
    const width = 1280;
    const height = 720;

    // Colors (matching GhostFounder theme)
    const colors = {
      background: rgb(0.04, 0.04, 0.06), // #0a0a0f
      primary: rgb(0, 0.83, 1), // #00d4ff
      secondary: rgb(0, 1, 0.53), // #00ff88
      gold: rgb(1, 0.84, 0), // #ffd700
      white: rgb(1, 1, 1),
      gray: rgb(0.6, 0.64, 0.69)
    };

    for (const slide of slides) {
      const page = pdfDoc.addPage([width, height]);
      
      // Background
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: colors.background
      });

      // Add accent line at top
      page.drawRectangle({
        x: 0,
        y: height - 8,
        width,
        height: 8,
        color: colors.primary
      });

      // Draw slide content based on type
      switch (slide.type) {
        case 'cover':
          await this.drawCoverSlide(page, slide, font, fontRegular, colors, width, height);
          break;
        case 'ask':
          await this.drawAskSlide(page, slide, font, fontRegular, colors, width, height);
          break;
        case 'market':
        case 'traction':
        case 'financials':
          await this.drawMetricsSlide(page, slide, font, fontRegular, colors, width, height);
          break;
        default:
          await this.drawStandardSlide(page, slide, font, fontRegular, colors, width, height);
      }

      // Page number
      const pageNum = slides.indexOf(slide) + 1;
      page.drawText(`${pageNum}`, {
        x: width - 60,
        y: 30,
        size: 14,
        font: fontRegular,
        color: colors.gray
      });
    }

    return await pdfDoc.save();
  }

  /**
   * Draw cover slide
   */
  async drawCoverSlide(page, slide, font, fontRegular, colors, width, height) {
    // Large title
    page.drawText(slide.title.toUpperCase(), {
      x: 100,
      y: height / 2 + 60,
      size: 72,
      font,
      color: colors.white
    });

    // Subtitle
    page.drawText(slide.subtitle, {
      x: 100,
      y: height / 2 - 20,
      size: 28,
      font: fontRegular,
      color: colors.primary
    });

    // Tagline
    if (slide.content) {
      page.drawText(slide.content, {
        x: 100,
        y: height / 2 - 80,
        size: 18,
        font: fontRegular,
        color: colors.gray
      });
    }

    // Ghost icon placeholder text
    page.drawText('👻', {
      x: width - 150,
      y: 50,
      size: 48,
      font: fontRegular,
      color: colors.white
    });
  }

  /**
   * Draw ask/funding slide
   */
  async drawAskSlide(page, slide, font, fontRegular, colors, width, height) {
    // Title
    page.drawText(slide.title, {
      x: 100,
      y: height - 120,
      size: 48,
      font,
      color: colors.white
    });

    // Amount (large, centered)
    const amountText = slide.amount;
    page.drawText(amountText, {
      x: width / 2 - 200,
      y: height / 2 + 40,
      size: 64,
      font,
      color: colors.gold
    });

    // Use of funds
    let yPos = height / 2 - 60;
    page.drawText('Use of Funds:', {
      x: 100,
      y: yPos,
      size: 24,
      font,
      color: colors.white
    });

    yPos -= 50;
    for (const item of slide.useOfFunds || []) {
      page.drawText(`• ${item}`, {
        x: 120,
        y: yPos,
        size: 20,
        font: fontRegular,
        color: colors.gray
      });
      yPos -= 35;
    }
  }

  /**
   * Draw metrics/data slide
   */
  async drawMetricsSlide(page, slide, font, fontRegular, colors, width, height) {
    // Title
    page.drawText(slide.title, {
      x: 100,
      y: height - 120,
      size: 48,
      font,
      color: colors.white
    });

    // Content
    if (slide.content) {
      page.drawText(slide.content, {
        x: 100,
        y: height - 180,
        size: 20,
        font: fontRegular,
        color: colors.gray
      });
    }

    // Metrics cards
    const metrics = slide.metrics || [];
    const cardWidth = 280;
    const cardHeight = 150;
    const startX = 100;
    const startY = height / 2 + 20;
    const gap = 40;

    metrics.forEach((metric, i) => {
      const x = startX + (cardWidth + gap) * (i % 3);
      const y = startY - Math.floor(i / 3) * (cardHeight + 30);

      // Card background
      page.drawRectangle({
        x,
        y: y - cardHeight,
        width: cardWidth,
        height: cardHeight,
        color: rgb(0.1, 0.1, 0.12),
        borderColor: colors.primary,
        borderWidth: 1
      });

      // Value
      page.drawText(String(metric.value), {
        x: x + 20,
        y: y - 60,
        size: 36,
        font,
        color: colors.primary
      });

      // Label
      page.drawText(metric.label, {
        x: x + 20,
        y: y - 110,
        size: 16,
        font: fontRegular,
        color: colors.gray
      });
    });

    // Financial projections table
    if (slide.projections) {
      let yPos = height / 2 - 50;
      const projections = slide.projections;

      page.drawText('Revenue Projections:', {
        x: 100,
        y: yPos,
        size: 24,
        font,
        color: colors.white
      });

      yPos -= 50;
      const years = ['year1', 'year2', 'year3'];
      years.forEach((year, i) => {
        if (projections[year]) {
          const text = `Year ${i + 1}: ${projections[year].revenue} revenue, ${projections[year].users} users`;
          page.drawText(text, {
            x: 120,
            y: yPos,
            size: 18,
            font: fontRegular,
            color: colors.gray
          });
          yPos -= 40;
        }
      });
    }
  }

  /**
   * Draw standard content slide
   */
  async drawStandardSlide(page, slide, font, fontRegular, colors, width, height) {
    // Title
    page.drawText(slide.title, {
      x: 100,
      y: height - 120,
      size: 48,
      font,
      color: colors.white
    });

    // Main content
    if (slide.content) {
      // Word wrap for long content
      const maxWidth = width - 200;
      const words = slide.content.split(' ');
      let line = '';
      let yPos = height - 200;
      const lineHeight = 35;

      for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        // Approximate width (this is simplified)
        if (testLine.length * 10 > maxWidth) {
          page.drawText(line, {
            x: 100,
            y: yPos,
            size: 22,
            font: fontRegular,
            color: colors.gray
          });
          yPos -= lineHeight;
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line) {
        page.drawText(line, {
          x: 100,
          y: yPos,
          size: 22,
          font: fontRegular,
          color: colors.gray
        });
      }
    }

    // Bullet points
    let bulletY = height / 2 + 50;
    for (const bullet of slide.bullets || []) {
      page.drawText(`→ ${bullet}`, {
        x: 120,
        y: bulletY,
        size: 20,
        font: fontRegular,
        color: colors.secondary
      });
      bulletY -= 45;
    }

    // Features
    for (const feature of slide.features || []) {
      page.drawText(`✓ ${feature}`, {
        x: 120,
        y: bulletY,
        size: 20,
        font: fontRegular,
        color: colors.secondary
      });
      bulletY -= 45;
    }

    // Team members
    let teamX = 100;
    for (const member of slide.team || []) {
      page.drawText(member.name, {
        x: teamX,
        y: height / 2 - 50,
        size: 24,
        font,
        color: colors.white
      });
      page.drawText(member.role, {
        x: teamX,
        y: height / 2 - 85,
        size: 18,
        font: fontRegular,
        color: colors.primary
      });
      teamX += 300;
    }

    // Competitors
    let compY = height / 2;
    for (const comp of slide.competitors || []) {
      page.drawText(`${comp.name}: ${comp.weakness}`, {
        x: 120,
        y: compY,
        size: 18,
        font: fontRegular,
        color: colors.gray
      });
      compY -= 35;
    }
  }
}

export default PitchPoltergeist;
