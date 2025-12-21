import { NextResponse } from 'next/server';
import InvestorGhoul from '@/lib/agents/investor-ghoul';

const agent = new InvestorGhoul();

// POST - Roast an idea or pitch
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      idea,
      pitchDetails = {},
      roastMode = 'standard', // standard, brutal, constructive
      userId 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea/pitch is required' },
        { status: 400 }
      );
    }

    // Roast the idea
    const result = await agent.roastIdea(
      idea,
      pitchDetails,
      roastMode,
      userId
    );

    return NextResponse.json({
      success: true,
      message: '💀 Investor Ghoul has evaluated your pitch!',
      data: result
    });

  } catch (error) {
    console.error('Investor Ghoul Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to roast idea',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Get random motivation or past roasts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action'); // motivation, history

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (action === 'motivation') {
      // Get random tough love motivation
      const motivation = await agent.generateRandomMessage(userId);
      return NextResponse.json({
        success: true,
        data: motivation
      });
    }

    // Get roast history
    const history = await agent.getRoastHistory(userId);

    return NextResponse.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Investor Ghoul Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
