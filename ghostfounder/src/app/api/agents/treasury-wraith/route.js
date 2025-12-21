import { NextResponse } from 'next/server';
import { TreasuryWraith } from '@/lib/agents';

const treasuryWraith = new TreasuryWraith();

/**
 * GET - Get report history for a user
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const firebaseUid = searchParams.get('firebaseUid');
    const getSampleData = searchParams.get('sampleData');
    const period = searchParams.get('period') || 'Q1';

    if (getSampleData === 'true') {
      const sampleData = treasuryWraith.generateSampleData(period);
      return NextResponse.json({ success: true, sampleData });
    }

    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Missing firebaseUid' },
        { status: 400 }
      );
    }

    const reports = await treasuryWraith.getReportHistory(firebaseUid);
    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('Treasury Wraith GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

/**
 * POST - Generate a financial report
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { period, year, financialData, firebaseUid, email, displayName } = body;

    if (!period || !year || !financialData || !firebaseUid) {
      return NextResponse.json(
        { error: 'Missing required fields: period, year, financialData, firebaseUid' },
        { status: 400 }
      );
    }

    const result = await treasuryWraith.execute({
      period,
      year,
      financialData,
      firebaseUid,
      email,
      displayName,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Treasury Wraith POST error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', details: error.message },
      { status: 500 }
    );
  }
}
