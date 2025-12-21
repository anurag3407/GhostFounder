import { NextResponse } from 'next/server';
import PitchPoltergeist from '@/lib/agents/pitch-poltergeist';

const agent = new PitchPoltergeist();

// POST - Generate a pitch deck
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      repositoryUrl, 
      projectData = {},
      userId 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Start pitch deck generation
    const result = await agent.generatePitchDeck(
      repositoryUrl,
      projectData,
      userId
    );

    return NextResponse.json({
      success: true,
      message: '🎭 Pitch Poltergeist has conjured your pitch deck!',
      data: result
    });

  } catch (error) {
    console.error('Pitch Poltergeist Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate pitch deck',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Fetch user's pitch decks
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const deckId = searchParams.get('deckId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // If deckId provided, get specific deck
    if (deckId) {
      const deck = await agent.getPitchDeck(deckId, userId);
      return NextResponse.json({
        success: true,
        data: deck
      });
    }

    // Get all decks for user
    const decks = await agent.getUserDecks(userId);

    return NextResponse.json({
      success: true,
      data: decks
    });

  } catch (error) {
    console.error('Pitch Poltergeist Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch pitch decks',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
