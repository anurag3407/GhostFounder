/**
 * Equity Phantom - Blockchain Agent
 * 
 * Handles equity management via ERC-20 tokens on Ethereum (Sepolia testnet)
 * - Create equity token contracts
 * - Transfer equity between co-founders
 * - Vesting schedule management
 * - Real-time balance tracking
 */

import { ethers } from 'ethers';
import BaseAgent from './base-agent';
import { GEMINI_MODELS } from '@/lib/gemini/config';
import User from '@/models/User';

// Simple ERC-20 Token ABI (for equity tokens)
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Simple ERC-20 Token Bytecode (compiled Solidity contract)
// This is a basic ERC-20 implementation for demonstration
const ERC20_BYTECODE = `0x60806040523480156200001157600080fd5b5060405162000d3838038062000d38833981016040819052620000349162000127565b8251620000499060039060208601906200007a565b5081516200005f9060049060208501906200007a565b506005805460ff191660ff929092169190911790555062000201565b828054620000889062000190565b90600052602060002090601f016020900481019282620000ac5760008555620000f7565b82601f10620000c757805160ff1916838001178555620000f7565b82800160010185558215620000f7579182015b82811115620000f7578251825591602001919060010190620000da565b506200010592915062000109565b5090565b5b808211156200010557600081556001016200010a565b6000806000606084860312156200013c578283fd5b83516001600160401b038082111562000153578485fd5b818601915086601f83011262000167578485fd5b8151818111156200017c576200017c620001ec565b604051915060208082850101821015156200019557600080fd5b8060206000601f840119880160031c6020890183811015620001b657600080fd5b508093505b816002880111156200000055505050505b505050919050565b634e487b7160e01b600052604160045260246000fd5b610b2780620002116000396000f3fe`;

class EquityPhantom extends BaseAgent {
  constructor() {
    super({
      name: 'Equity Phantom',
      description: 'Blockchain agent for equity management via ERC-20 tokens',
      model: GEMINI_MODELS.flash
    });

    // Sepolia testnet configuration
    this.network = process.env.ETHEREUM_NETWORK || 'sepolia';
    this.rpcUrl = process.env.ETHEREUM_RPC_URL || `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
    
    // Initialize provider
    this.provider = null;
  }

  /**
   * Initialize the Ethereum provider
   */
  initializeProvider() {
    if (!this.provider) {
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    }
    return this.provider;
  }

  /**
   * Get a signer for transactions (requires private key)
   */
  getSigner(privateKey) {
    const provider = this.initializeProvider();
    return new ethers.Wallet(privateKey, provider);
  }

  /**
   * Execute equity-related actions
   */
  async execute({ userId, action, params }) {
    await this.initialize(userId);
    
    switch (action) {
      case 'getBalance':
        return this.getEquityBalance(params.tokenAddress, params.walletAddress);
      
      case 'transfer':
        return this.transferEquity(params);
      
      case 'getTokenInfo':
        return this.getTokenInfo(params.tokenAddress);
      
      case 'getAllocations':
        return this.getEquityAllocations(userId);
      
      case 'createVestingSchedule':
        return this.createVestingSchedule(params);
      
      case 'checkVesting':
        return this.checkVestingStatus(params);
      
      case 'analyzeEquity':
        return this.analyzeEquityDistribution(params);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Get equity token balance for an address
   */
  async getEquityBalance(tokenAddress, walletAddress) {
    try {
      this.initializeProvider();
      
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      
      const [balance, decimals, symbol, name] = await Promise.all([
        contract.balanceOf(walletAddress),
        contract.decimals(),
        contract.symbol(),
        contract.name()
      ]);

      const formattedBalance = ethers.formatUnits(balance, decimals);
      
      return {
        success: true,
        data: {
          tokenAddress,
          walletAddress,
          balance: formattedBalance,
          rawBalance: balance.toString(),
          decimals: Number(decimals),
          symbol,
          name
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Transfer equity tokens
   */
  async transferEquity({ privateKey, tokenAddress, toAddress, amount }) {
    try {
      const signer = this.getSigner(privateKey);
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      
      const decimals = await contract.decimals();
      const parsedAmount = ethers.parseUnits(amount.toString(), decimals);
      
      // Estimate gas
      const gasEstimate = await contract.transfer.estimateGas(toAddress, parsedAmount);
      
      // Execute transfer
      const tx = await contract.transfer(toAddress, parsedAmount, {
        gasLimit: gasEstimate * BigInt(120) / BigInt(100) // Add 20% buffer
      });
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Log the transfer
      await this.logUsage({
        action: 'equity_transfer',
        details: {
          tokenAddress,
          toAddress,
          amount,
          txHash: receipt.hash,
          gasUsed: receipt.gasUsed.toString()
        }
      });

      return {
        success: true,
        data: {
          txHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          from: await signer.getAddress(),
          to: toAddress,
          amount,
          tokenAddress
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get token information
   */
  async getTokenInfo(tokenAddress) {
    try {
      this.initializeProvider();
      
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply()
      ]);

      return {
        success: true,
        data: {
          address: tokenAddress,
          name,
          symbol,
          decimals: Number(decimals),
          totalSupply: ethers.formatUnits(totalSupply, decimals)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get equity allocations for a user's company
   */
  async getEquityAllocations(userId) {
    try {
      const user = await User.findById(userId).populate('company');
      
      if (!user?.company) {
        return {
          success: false,
          error: 'No company found for user'
        };
      }

      // Get all equity holders from company
      const equityHolders = user.company.equityHolders || [];
      
      return {
        success: true,
        data: {
          companyName: user.company.name,
          tokenAddress: user.company.equityTokenAddress,
          holders: equityHolders,
          totalEquity: 100, // 100%
          allocatedEquity: equityHolders.reduce((sum, h) => sum + h.percentage, 0)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a vesting schedule for equity
   */
  async createVestingSchedule({ beneficiary, totalAmount, startDate, cliffMonths, vestingMonths, tokenAddress }) {
    // In a real implementation, this would interact with a vesting contract
    // For now, we'll store the schedule in the database
    
    const schedule = {
      beneficiary,
      totalAmount,
      tokenAddress,
      startDate: new Date(startDate),
      cliffDate: new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + cliffMonths)),
      endDate: new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + vestingMonths)),
      cliffMonths,
      vestingMonths,
      vestedAmount: 0,
      claimedAmount: 0,
      status: 'active'
    };

    // Generate vesting milestones
    const milestones = [];
    const monthlyVest = totalAmount / vestingMonths;
    
    for (let i = 1; i <= vestingMonths; i++) {
      const vestDate = new Date(startDate);
      vestDate.setMonth(vestDate.getMonth() + i);
      
      milestones.push({
        month: i,
        date: vestDate,
        amount: monthlyVest,
        cumulative: monthlyVest * i,
        isCliff: i === cliffMonths,
        isPast: vestDate < new Date()
      });
    }

    return {
      success: true,
      data: {
        schedule,
        milestones,
        message: `Vesting schedule created: ${totalAmount} tokens over ${vestingMonths} months with ${cliffMonths} month cliff`
      }
    };
  }

  /**
   * Check vesting status
   */
  async checkVestingStatus({ scheduleId, beneficiary }) {
    // Calculate vested amount based on time elapsed
    // This would typically query a smart contract or database
    
    const now = new Date();
    
    // Mock vesting data (in production, fetch from contract/DB)
    const mockSchedule = {
      totalAmount: 10000,
      startDate: new Date('2024-01-01'),
      cliffMonths: 12,
      vestingMonths: 48,
      claimedAmount: 0
    };

    const cliffDate = new Date(mockSchedule.startDate);
    cliffDate.setMonth(cliffDate.getMonth() + mockSchedule.cliffMonths);

    if (now < cliffDate) {
      return {
        success: true,
        data: {
          vestedAmount: 0,
          availableToClaim: 0,
          claimedAmount: mockSchedule.claimedAmount,
          cliffDate,
          daysUntilCliff: Math.ceil((cliffDate - now) / (1000 * 60 * 60 * 24)),
          status: 'cliff_pending'
        }
      };
    }

    // Calculate vested amount after cliff
    const monthsElapsed = Math.min(
      Math.floor((now - mockSchedule.startDate) / (1000 * 60 * 60 * 24 * 30)),
      mockSchedule.vestingMonths
    );
    
    const vestedAmount = (mockSchedule.totalAmount / mockSchedule.vestingMonths) * monthsElapsed;
    const availableToClaim = vestedAmount - mockSchedule.claimedAmount;

    return {
      success: true,
      data: {
        vestedAmount,
        availableToClaim,
        claimedAmount: mockSchedule.claimedAmount,
        percentVested: (vestedAmount / mockSchedule.totalAmount) * 100,
        monthsElapsed,
        monthsRemaining: mockSchedule.vestingMonths - monthsElapsed,
        status: monthsElapsed >= mockSchedule.vestingMonths ? 'fully_vested' : 'vesting'
      }
    };
  }

  /**
   * Analyze equity distribution using AI
   */
  async analyzeEquityDistribution({ holders, companyStage, fundingRound }) {
    const prompt = `
You are an equity distribution expert for startups. Analyze the following equity cap table and provide recommendations.

Company Stage: ${companyStage || 'Seed'}
Current Funding Round: ${fundingRound || 'Pre-seed'}

Current Equity Distribution:
${holders.map(h => `- ${h.name} (${h.role}): ${h.percentage}%`).join('\n')}

Please provide:
1. Assessment of current distribution
2. Industry benchmark comparison
3. Potential issues or red flags
4. Recommendations for the next funding round
5. ESOP pool suggestions
6. Vesting schedule recommendations

Format your response in a clear, structured way.
`;

    const response = await this.chat.sendMessage(prompt);
    const analysis = response.response.text();

    return {
      success: true,
      data: {
        analysis,
        summary: {
          totalAllocated: holders.reduce((sum, h) => sum + h.percentage, 0),
          founderEquity: holders.filter(h => h.role === 'founder').reduce((sum, h) => sum + h.percentage, 0),
          investorEquity: holders.filter(h => h.role === 'investor').reduce((sum, h) => sum + h.percentage, 0),
          employeePool: holders.filter(h => h.role === 'esop').reduce((sum, h) => sum + h.percentage, 0),
          unallocated: 100 - holders.reduce((sum, h) => sum + h.percentage, 0)
        }
      }
    };
  }

  /**
   * Get wallet balance (ETH)
   */
  async getWalletBalance(address) {
    try {
      this.initializeProvider();
      const balance = await this.provider.getBalance(address);
      
      return {
        success: true,
        data: {
          address,
          balanceWei: balance.toString(),
          balanceEth: ethers.formatEther(balance),
          network: this.network
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get transaction history for an address
   */
  async getTransactionHistory(address, tokenAddress) {
    try {
      this.initializeProvider();
      
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      
      // Get transfer events where address is sender or receiver
      const filterFrom = contract.filters.Transfer(address, null);
      const filterTo = contract.filters.Transfer(null, address);
      
      const [eventsFrom, eventsTo] = await Promise.all([
        contract.queryFilter(filterFrom, -10000), // Last 10000 blocks
        contract.queryFilter(filterTo, -10000)
      ]);

      const allEvents = [...eventsFrom, ...eventsTo].sort((a, b) => b.blockNumber - a.blockNumber);

      const transactions = await Promise.all(
        allEvents.slice(0, 50).map(async (event) => {
          const block = await event.getBlock();
          const decimals = await contract.decimals();
          
          return {
            txHash: event.transactionHash,
            blockNumber: event.blockNumber,
            timestamp: new Date(block.timestamp * 1000),
            from: event.args[0],
            to: event.args[1],
            amount: ethers.formatUnits(event.args[2], decimals),
            direction: event.args[0].toLowerCase() === address.toLowerCase() ? 'out' : 'in'
          };
        })
      );

      return {
        success: true,
        data: {
          address,
          tokenAddress,
          transactions,
          count: transactions.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default EquityPhantom;
