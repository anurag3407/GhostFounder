/**
 * Equity Phantom API Routes
 * 
 * Handles blockchain equity management operations
 */

import { NextResponse } from 'next/server';
import EquityPhantom from '@/lib/agents/equity-phantom';
import connectDB from '@/lib/mongodb/connect';

const agent = new EquityPhantom();

/**
 * GET /api/agents/equity-phantom
 * 
 * Get equity information for the user
 */
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'getAllocations';
    const tokenAddress = searchParams.get('tokenAddress');
    const walletAddress = searchParams.get('walletAddress');
    
    // TODO: Get userId from auth session
    const userId = searchParams.get('userId');

    let result;

    switch (action) {
      case 'getBalance':
        if (!tokenAddress || !walletAddress) {
          return NextResponse.json(
            { error: 'Token address and wallet address are required' },
            { status: 400 }
          );
        }
        result = await agent.getEquityBalance(tokenAddress, walletAddress);
        break;

      case 'getTokenInfo':
        if (!tokenAddress) {
          return NextResponse.json(
            { error: 'Token address is required' },
            { status: 400 }
          );
        }
        result = await agent.getTokenInfo(tokenAddress);
        break;

      case 'getWalletBalance':
        if (!walletAddress) {
          return NextResponse.json(
            { error: 'Wallet address is required' },
            { status: 400 }
          );
        }
        result = await agent.getWalletBalance(walletAddress);
        break;

      case 'getTransactions':
        if (!tokenAddress || !walletAddress) {
          return NextResponse.json(
            { error: 'Token address and wallet address are required' },
            { status: 400 }
          );
        }
        result = await agent.getTransactionHistory(walletAddress, tokenAddress);
        break;

      case 'getAllocations':
      default:
        if (!userId) {
          // Return mock data for demo
          result = {
            success: true,
            data: {
              companyName: 'GhostFounder Demo',
              tokenAddress: null,
              holders: [
                { name: 'Founder 1', role: 'founder', percentage: 40 },
                { name: 'Founder 2', role: 'founder', percentage: 30 },
                { name: 'ESOP Pool', role: 'esop', percentage: 15 },
                { name: 'Reserved', role: 'reserved', percentage: 15 }
              ],
              totalEquity: 100,
              allocatedEquity: 100
            }
          };
        } else {
          result = await agent.execute({
            userId,
            action: 'getAllocations',
            params: {}
          });
        }
        break;
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);

  } catch (error) {
    console.error('Equity Phantom GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equity data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents/equity-phantom
 * 
 * Execute equity operations
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { action, ...params } = body;

    // TODO: Get userId from auth session
    const userId = body.userId;

    let result;

    switch (action) {
      case 'transfer':
        // Validate required fields
        if (!params.tokenAddress || !params.toAddress || !params.amount) {
          return NextResponse.json(
            { error: 'Token address, recipient address, and amount are required' },
            { status: 400 }
          );
        }
        
        // NOTE: In production, private key should NEVER be sent via API
        // Use a proper wallet connection (MetaMask, WalletConnect, etc.)
        if (!params.privateKey) {
          return NextResponse.json(
            { error: 'Transaction signing requires wallet connection' },
            { status: 400 }
          );
        }

        result = await agent.execute({
          userId,
          action: 'transfer',
          params
        });
        break;

      case 'createVestingSchedule':
        if (!params.beneficiary || !params.totalAmount || !params.startDate) {
          return NextResponse.json(
            { error: 'Beneficiary, total amount, and start date are required' },
            { status: 400 }
          );
        }

        result = await agent.execute({
          userId,
          action: 'createVestingSchedule',
          params: {
            beneficiary: params.beneficiary,
            totalAmount: params.totalAmount,
            startDate: params.startDate,
            cliffMonths: params.cliffMonths || 12,
            vestingMonths: params.vestingMonths || 48,
            tokenAddress: params.tokenAddress
          }
        });
        break;

      case 'checkVesting':
        result = await agent.execute({
          userId,
          action: 'checkVesting',
          params
        });
        break;

      case 'analyzeEquity':
        if (!params.holders || !Array.isArray(params.holders)) {
          return NextResponse.json(
            { error: 'Equity holders array is required' },
            { status: 400 }
          );
        }

        result = await agent.execute({
          userId,
          action: 'analyzeEquity',
          params
        });
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Equity Phantom POST error:', error);
    return NextResponse.json(
      { error: 'Failed to execute equity operation' },
      { status: 500 }
    );
  }
}
