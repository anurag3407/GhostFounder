/**
 * News Banshee - Daily News Aggregation Agent
 * 
 * Fetches and categorizes startup/tech news daily
 * - News API integration
 * - AI-powered categorization
 * - Relevance scoring
 * - Dashboard display
 */

import axios from 'axios';
import BaseAgent from './base-agent';
import { GEMINI_MODELS } from '@/lib/gemini/config';

class NewsBanshee extends BaseAgent {
  constructor() {
    super({
      name: 'News Banshee',
      description: 'Daily news aggregation and categorization agent',
      model: GEMINI_MODELS.flash
    });
  }

  /**
   * Fetch and process daily news
   */
  async fetchDailyNews({ userId, keywords, categories }) {
    await this.initialize(userId);

    try {
      // Step 1: Fetch news from multiple sources
      const rawNews = await this.fetchNewsFromSources(keywords);
      
      // Step 2: Categorize and score with AI
      const processedNews = await this.processNewsWithAI(rawNews, categories);
      
      // Step 3: Log usage
      await this.logUsage({
        action: 'daily_news_fetch',
        details: {
          articlesProcessed: rawNews.length,
          keywords
        }
      });

      return {
        success: true,
        data: {
          articles: processedNews,
          fetchedAt: new Date().toISOString(),
          totalArticles: processedNews.length
        }
      };
    } catch (error) {
      console.error('News Banshee error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Fetch news from various sources
   */
  async fetchNewsFromSources(keywords = ['startup', 'tech', 'AI', 'funding']) {
    const articles = [];
    const newsApiKey = process.env.NEWS_API_KEY;

    // If NewsAPI key is available, use it
    if (newsApiKey) {
      try {
        const query = keywords.join(' OR ');
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: query,
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 50,
            apiKey: newsApiKey
          }
        });

        if (response.data.articles) {
          articles.push(...response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            content: article.content,
            url: article.url,
            source: article.source?.name || 'Unknown',
            publishedAt: article.publishedAt,
            imageUrl: article.urlToImage
          })));
        }
      } catch (error) {
        console.error('NewsAPI fetch error:', error.message);
      }
    }

    // If no API key or few results, generate sample news
    if (articles.length < 5) {
      articles.push(...this.generateSampleNews());
    }

    return articles;
  }

  /**
   * Generate sample news for demo/development
   */
  generateSampleNews() {
    const now = new Date();
    const sampleNews = [
      {
        title: 'AI Startup Raises $50M Series B to Revolutionize Customer Service',
        description: 'A San Francisco-based AI startup has secured significant funding to expand its customer service automation platform.',
        content: 'The company plans to use the funds to expand into new markets and enhance their AI capabilities.',
        url: 'https://example.com/ai-startup-funding',
        source: 'TechCrunch',
        publishedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        imageUrl: null
      },
      {
        title: 'New Study Shows Remote Work Boosts Startup Productivity',
        description: 'A comprehensive study reveals that startups with remote-first policies show 23% higher productivity.',
        content: 'The research analyzed over 500 startups across various industries.',
        url: 'https://example.com/remote-work-study',
        source: 'Forbes',
        publishedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
        imageUrl: null
      },
      {
        title: 'Major Tech Company Acquires Promising Fintech Startup',
        description: 'In a deal valued at $200M, a major tech player has acquired a fintech startup focused on B2B payments.',
        content: 'This acquisition signals continued consolidation in the fintech space.',
        url: 'https://example.com/fintech-acquisition',
        source: 'Bloomberg',
        publishedAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
        imageUrl: null
      },
      {
        title: 'Y Combinator Announces Record Number of AI Startups in Latest Batch',
        description: 'The renowned accelerator reports 40% of its latest cohort are AI-focused companies.',
        content: 'This marks a significant increase from previous years, reflecting the AI boom.',
        url: 'https://example.com/yc-ai-startups',
        source: 'The Verge',
        publishedAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
        imageUrl: null
      },
      {
        title: 'Climate Tech Startups Attract Record Venture Investment',
        description: 'VC investment in climate technology has reached an all-time high in Q4.',
        content: 'Investors are increasingly focused on sustainable technology solutions.',
        url: 'https://example.com/climate-tech-funding',
        source: 'Reuters',
        publishedAt: new Date(now - 10 * 60 * 60 * 1000).toISOString(),
        imageUrl: null
      },
      {
        title: 'SaaS Startup Achieves Unicorn Status After Rapid Growth',
        description: 'A B2B SaaS company has crossed the $1B valuation mark after tripling revenue.',
        content: 'The company specializes in enterprise workflow automation.',
        url: 'https://example.com/saas-unicorn',
        source: 'Business Insider',
        publishedAt: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
        imageUrl: null
      },
      {
        title: 'Healthcare AI Startup Gets FDA Approval for Diagnostic Tool',
        description: 'A breakthrough AI diagnostic tool receives regulatory approval, opening new markets.',
        content: 'The tool can detect early signs of disease with 95% accuracy.',
        url: 'https://example.com/healthcare-ai-fda',
        source: 'CNBC',
        publishedAt: new Date(now - 14 * 60 * 60 * 1000).toISOString(),
        imageUrl: null
      },
      {
        title: 'European Startup Ecosystem Sees 30% Growth in Funding',
        description: 'Despite global challenges, European startups are attracting more investment than ever.',
        content: 'London, Berlin, and Paris lead as top startup hubs in Europe.',
        url: 'https://example.com/eu-startup-growth',
        source: 'Financial Times',
        publishedAt: new Date(now - 16 * 60 * 60 * 1000).toISOString(),
        imageUrl: null
      },
      {
        title: 'OpenAI Competitor Launches New Foundation Model',
        description: 'A new AI research lab has released a competing large language model with impressive capabilities.',
        content: 'The model shows strong performance on benchmarks while being more efficient.',
        url: 'https://example.com/new-ai-model',
        source: 'Wired',
        publishedAt: new Date(now - 18 * 60 * 60 * 1000).toISOString(),
        imageUrl: null
      },
      {
        title: 'Startup Founder Shares Lessons from Failed Venture',
        description: 'A candid post-mortem analysis from a founder whose startup shut down after raising $10M.',
        content: 'Key lessons include the importance of product-market fit and cash management.',
        url: 'https://example.com/startup-lessons',
        source: 'Medium',
        publishedAt: new Date(now - 20 * 60 * 60 * 1000).toISOString(),
        imageUrl: null
      }
    ];

    return sampleNews;
  }

  /**
   * Process news with AI for categorization and scoring
   */
  async processNewsWithAI(articles, customCategories = []) {
    if (articles.length === 0) return [];

    const defaultCategories = [
      'Funding & Investment',
      'Product Launch',
      'M&A Activity',
      'AI & Technology',
      'Market Trends',
      'Regulatory',
      'Startup Tips',
      'Industry News'
    ];

    const categories = [...new Set([...defaultCategories, ...customCategories])];

    const prompt = `
You are a news analyst for startup founders. Analyze and categorize the following news articles.

Available Categories: ${categories.join(', ')}

Articles to analyze:
${articles.slice(0, 20).map((a, i) => `
${i + 1}. Title: ${a.title}
   Description: ${a.description || 'No description'}
   Source: ${a.source}
`).join('\n')}

For each article, provide analysis in this JSON format:
{
  "articles": [
    {
      "index": 0,
      "category": "Category name",
      "subcategory": "More specific subcategory",
      "relevanceScore": 85,
      "sentiment": "positive/negative/neutral",
      "keyTakeaway": "One sentence summary",
      "founderRelevance": "Why this matters for founders",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Return ONLY valid JSON.
`;

    try {
      const response = await this.chat.sendMessage(prompt);
      const text = response.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        
        // Merge analysis with original articles
        return articles.map((article, index) => {
          const articleAnalysis = analysis.articles?.find(a => a.index === index) || {};
          return {
            ...article,
            category: articleAnalysis.category || 'Industry News',
            subcategory: articleAnalysis.subcategory || 'General',
            relevanceScore: articleAnalysis.relevanceScore || 50,
            sentiment: articleAnalysis.sentiment || 'neutral',
            keyTakeaway: articleAnalysis.keyTakeaway || article.description,
            founderRelevance: articleAnalysis.founderRelevance || 'Industry update',
            tags: articleAnalysis.tags || []
          };
        });
      }
    } catch (error) {
      console.error('AI processing error:', error);
    }

    // Return with default categorization if AI fails
    return articles.map(article => ({
      ...article,
      category: 'Industry News',
      subcategory: 'General',
      relevanceScore: 50,
      sentiment: 'neutral',
      keyTakeaway: article.description,
      founderRelevance: 'Industry update',
      tags: []
    }));
  }

  /**
   * Get news summary for dashboard
   */
  async getNewsSummary(articles) {
    if (!articles || articles.length === 0) {
      return { summary: 'No news available today.', highlights: [] };
    }

    const prompt = `
Summarize the following news for a busy startup founder. Be concise and actionable.

News articles:
${articles.slice(0, 10).map(a => `- ${a.title}`).join('\n')}

Provide a summary in JSON format:
{
  "summary": "2-3 sentence overview of today's key news",
  "highlights": [
    {"emoji": "🚀", "text": "Key highlight 1"},
    {"emoji": "💰", "text": "Key highlight 2"},
    {"emoji": "🤖", "text": "Key highlight 3"}
  ],
  "mustRead": "Title of the most important article",
  "trend": "Emerging trend from today's news"
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
      console.error('Summary generation error:', error);
    }

    return {
      summary: `${articles.length} articles collected today covering startup and tech news.`,
      highlights: articles.slice(0, 3).map(a => ({ emoji: '📰', text: a.title })),
      mustRead: articles[0]?.title || 'No articles',
      trend: 'Check individual articles for trends'
    };
  }

  /**
   * Filter news by category
   */
  filterByCategory(articles, category) {
    if (!category || category === 'all') return articles;
    return articles.filter(a => 
      a.category?.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get trending topics from news
   */
  async getTrendingTopics(articles) {
    if (!articles || articles.length < 5) {
      return ['AI', 'Startups', 'Funding', 'Technology'];
    }

    const allTags = articles.flatMap(a => a.tags || []);
    const tagCounts = {};
    
    for (const tag of allTags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }
}

export default NewsBanshee;
