import { NextResponse } from 'next/server';
import ShadowScout from '@/lib/agents/shadow-scout';

const agent = new ShadowScout();

// POST - Generate competitive intelligence report
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      projectDescription,
      industry,
      competitors = [],
      userId 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!projectDescription) {
      return NextResponse.json(
        { error: 'Project description is required' },
        { status: 400 }
      );
    }

    // Generate spy report
    const result = await agent.generateWeeklyReport(
      projectDescription,
      industry || 'Technology',
      competitors,
      userId
    );

    return NextResponse.json({
      success: true,
      message: '👁️ Shadow Scout has compiled your intelligence report!',
      data: result
    });

  } catch (error) {
    console.error('Shadow Scout Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate spy report',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Fetch user's spy reports
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const reportId = searchParams.get('reportId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // If reportId provided, get specific report
    if (reportId) {
      const report = await agent.getReport(reportId, userId);
      return NextResponse.json({
        success: true,
        data: report
      });
    }

    // Get all reports for user
    const reports = await agent.getUserReports(userId);

    return NextResponse.json({
      success: true,
      data: reports
    });

  } catch (error) {
    console.error('Shadow Scout Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch spy reports',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
