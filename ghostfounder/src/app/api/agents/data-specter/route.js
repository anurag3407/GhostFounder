import { NextResponse } from 'next/server';
import { DataSpecter } from '@/lib/agents';

const dataSpecter = new DataSpecter();

/**
 * GET - Get chat history or suggested queries
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const firebaseUid = searchParams.get('firebaseUid');
    const sessionId = searchParams.get('sessionId');
    const getSuggestions = searchParams.get('suggestions');

    if (getSuggestions === 'true') {
      const suggestions = dataSpecter.getSuggestedQueries();
      return NextResponse.json({ success: true, suggestions });
    }

    if (sessionId) {
      const history = await dataSpecter.getChatHistory(sessionId);
      return NextResponse.json({ success: true, history });
    }

    if (firebaseUid) {
      const sessions = await dataSpecter.getUserSessions(firebaseUid);
      return NextResponse.json({ success: true, sessions });
    }

    return NextResponse.json(
      { error: 'Missing firebaseUid or sessionId' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Data Specter GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

/**
 * POST - Process a natural language query
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { question, firebaseUid, sessionId, email, displayName } = body;

    if (!question || !firebaseUid) {
      return NextResponse.json(
        { error: 'Missing required fields: question, firebaseUid' },
        { status: 400 }
      );
    }

    const result = await dataSpecter.execute({
      question,
      firebaseUid,
      sessionId,
      email,
      displayName,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Data Specter POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process query', details: error.message },
      { status: 500 }
    );
  }
}
