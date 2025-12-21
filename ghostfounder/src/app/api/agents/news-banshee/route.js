import { NextResponse } from 'next/server';
import NewsBanshee from '@/lib/agents/news-banshee';

const agent = new NewsBanshee();

// POST - Fetch and process news for user
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      keywords = [],
      categories = ['startups', 'technology', 'funding'],
      userId 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch daily news
    const result = await agent.fetchDailyNews(
      keywords,
      categories,
      userId
    );

    return NextResponse.json({
      success: true,
      message: '📰 News Banshee has gathered today\'s intelligence!',
      data: result
    });

  } catch (error) {
    console.error('News Banshee Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch news',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Get dashboard news or specific articles
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 10;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get dashboard news
    const news = await agent.getDashboardNews(userId, category, limit);

    return NextResponse.json({
      success: true,
      data: news
    });

  } catch (error) {
    console.error('News Banshee Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch news',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
