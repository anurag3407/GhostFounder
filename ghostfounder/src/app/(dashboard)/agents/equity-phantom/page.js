'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconCurrencyEthereum, 
  IconUsers, 
  IconWallet,
  IconRefresh,
  IconSend,
  IconHistory,
  IconChartPie,
  IconCalendar,
  IconLock,
  IconLockOpen,
  IconExternalLink,
  IconPlus,
  IconSparkles,
  IconAlertTriangle,
  IconCheck
} from '@tabler/icons-react';

export default function EquityPhantomPage() {
  const [allocations, setAllocations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showVestingModal, setShowVestingModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const res = await fetch('/api/agents/equity-phantom');
      if (res.ok) {
        const data = await res.json();
        setAllocations(data);
      }
    } catch {
      console.error('Failed to fetch allocations');
    } finally {
      setLoading(false);
    }
  };

  const analyzeEquity = async () => {
    if (!allocations?.holders) return;
    
    setAnalyzing(true);
    try {
      const res = await fetch('/api/agents/equity-phantom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyzeEquity',
          holders: allocations.holders,
          companyStage: 'Seed',
          fundingRound: 'Pre-seed'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.data);
      }
    } catch {
      console.error('Failed to analyze equity');
    } finally {
      setAnalyzing(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'founder': return 'bg-ghost-blue';
      case 'investor': return 'bg-neon-green';
      case 'esop': return 'bg-ghost-gold';
      case 'advisor': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'founder': return 'Founder';
      case 'investor': return 'Investor';
      case 'esop': return 'ESOP Pool';
      case 'advisor': return 'Advisor';
      case 'reserved': return 'Reserved';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-ghost-blue/20 to-neon-green/20 flex items-center justify-center border border-ghost-blue/30">
              <IconCurrencyEthereum className="w-8 h-8 text-ghost-blue" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Equity Phantom</h1>
              <p className="text-gray-400">Blockchain-Powered Equity Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={analyzeEquity}
              disabled={analyzing}
              className="px-4 py-2 bg-ghost-blue/20 border border-ghost-blue/30 text-ghost-blue rounded-lg hover:bg-ghost-blue/30 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <IconSparkles className={`w-5 h-5 ${analyzing ? 'animate-pulse' : ''}`} />
              {analyzing ? 'Analyzing...' : 'AI Analysis'}
            </button>
            <button
              onClick={fetchAllocations}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <IconRefresh className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: IconChartPie },
          { id: 'holders', label: 'Shareholders', icon: IconUsers },
          { id: 'vesting', label: 'Vesting', icon: IconCalendar },
          { id: 'transactions', label: 'Transactions', icon: IconHistory }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? 'bg-ghost-blue text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-ghost-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Equity Chart */}
              <div className="lg:col-span-2 bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Equity Distribution</h2>
                
                {allocations?.holders && (
                  <div className="flex gap-8">
                    {/* Pie Chart Visualization */}
                    <div className="relative w-48 h-48">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {(() => {
                          let cumulative = 0;
                          return allocations.holders.map((holder, i) => {
                            const start = cumulative;
                            cumulative += holder.percentage;
                            const largeArcFlag = holder.percentage > 50 ? 1 : 0;
                            
                            const startAngle = (start / 100) * 2 * Math.PI;
                            const endAngle = (cumulative / 100) * 2 * Math.PI;
                            
                            const x1 = 50 + 40 * Math.cos(startAngle);
                            const y1 = 50 + 40 * Math.sin(startAngle);
                            const x2 = 50 + 40 * Math.cos(endAngle);
                            const y2 = 50 + 40 * Math.sin(endAngle);

                            const colors = ['#00d4ff', '#00ff88', '#ffd700', '#a855f7', '#6b7280'];
                            
                            return (
                              <path
                                key={i}
                                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                fill={colors[i % colors.length]}
                                className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                              />
                            );
                          });
                        })()}
                        <circle cx="50" cy="50" r="25" fill="#0a0a0f" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">100%</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-3">
                      {allocations.holders.map((holder, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getRoleColor(holder.role)}`} />
                            <div>
                              <p className="text-white font-medium">{holder.name}</p>
                              <p className="text-gray-500 text-sm">{getRoleLabel(holder.role)}</p>
                            </div>
                          </div>
                          <span className="text-white font-bold">{holder.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
                  <h3 className="text-gray-400 text-sm mb-2">Company</h3>
                  <p className="text-xl font-bold text-white">{allocations?.companyName || 'Not Set'}</p>
                </div>
                
                <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
                  <h3 className="text-gray-400 text-sm mb-2">Token Contract</h3>
                  {allocations?.tokenAddress ? (
                    <a 
                      href={`https://sepolia.etherscan.io/address/${allocations.tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ghost-blue hover:underline flex items-center gap-2"
                    >
                      {`${allocations.tokenAddress.slice(0, 6)}...${allocations.tokenAddress.slice(-4)}`}
                      <IconExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <p className="text-gray-500">Not deployed</p>
                  )}
                </div>

                <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
                  <h3 className="text-gray-400 text-sm mb-2">Shareholders</h3>
                  <p className="text-xl font-bold text-white">{allocations?.holders?.length || 0}</p>
                </div>

                <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
                  <h3 className="text-gray-400 text-sm mb-2">Network</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                    <p className="text-white">Sepolia Testnet</p>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              {analysis && (
                <div className="lg:col-span-3 bg-ghost-dark/50 border border-ghost-blue/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <IconSparkles className="w-6 h-6 text-ghost-blue" />
                    <h2 className="text-xl font-semibold text-white">AI Equity Analysis</h2>
                  </div>
                  
                  {/* Summary Stats */}
                  {analysis.summary && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      {[
                        { label: 'Total Allocated', value: `${analysis.summary.totalAllocated}%` },
                        { label: 'Founder Equity', value: `${analysis.summary.founderEquity}%` },
                        { label: 'Investor Equity', value: `${analysis.summary.investorEquity}%` },
                        { label: 'ESOP Pool', value: `${analysis.summary.employeePool}%` },
                        { label: 'Unallocated', value: `${analysis.summary.unallocated}%` }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className="text-xs text-gray-400">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {analysis.analysis}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'holders' && (
            <motion.div
              key="holders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Shareholders</h2>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="px-4 py-2 bg-ghost-blue text-white rounded-lg hover:bg-ghost-blue/90 transition-colors flex items-center gap-2"
                >
                  <IconSend className="w-5 h-5" />
                  Transfer Equity
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Equity %</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Vesting Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Wallet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations?.holders?.map((holder, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${getRoleColor(holder.role)} flex items-center justify-center`}>
                              <span className="text-white text-sm font-bold">
                                {holder.name.charAt(0)}
                              </span>
                            </div>
                            <span className="text-white font-medium">{holder.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${getRoleColor(holder.role)} bg-opacity-20`}>
                            {getRoleLabel(holder.role)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white font-bold">{holder.percentage}%</td>
                        <td className="py-4 px-4">
                          {holder.role === 'founder' ? (
                            <span className="flex items-center gap-1 text-neon-green text-sm">
                              <IconLockOpen className="w-4 h-4" />
                              Fully Vested
                            </span>
                          ) : holder.role === 'esop' ? (
                            <span className="flex items-center gap-1 text-ghost-gold text-sm">
                              <IconLock className="w-4 h-4" />
                              4-Year Vesting
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">N/A</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {holder.walletAddress ? (
                            <a
                              href={`https://sepolia.etherscan.io/address/${holder.walletAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-ghost-blue hover:underline text-sm flex items-center gap-1"
                            >
                              {`${holder.walletAddress.slice(0, 6)}...${holder.walletAddress.slice(-4)}`}
                              <IconExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">Not connected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'vesting' && (
            <motion.div
              key="vesting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Vesting Schedules</h2>
                  <button
                    onClick={() => setShowVestingModal(true)}
                    className="px-4 py-2 bg-ghost-gold text-black rounded-lg hover:bg-ghost-gold/90 transition-colors flex items-center gap-2"
                  >
                    <IconPlus className="w-5 h-5" />
                    Create Schedule
                  </button>
                </div>

                {/* Example Vesting Schedule */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">ESOP Vesting Pool</h3>
                      <p className="text-gray-400 text-sm">4-year vesting with 1-year cliff</p>
                    </div>
                    <span className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-full text-sm">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">15%</p>
                      <p className="text-xs text-gray-400">Total Pool</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-ghost-blue">3.75%</p>
                      <p className="text-xs text-gray-400">Vested</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-ghost-gold">11.25%</p>
                      <p className="text-xs text-gray-400">Remaining</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">36</p>
                      <p className="text-xs text-gray-400">Months Left</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">25% Complete</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-ghost-blue to-neon-green w-1/4 transition-all duration-500" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Start: Jan 2024</span>
                      <span>Cliff: Jan 2025</span>
                      <span>End: Jan 2028</span>
                    </div>
                  </div>
                </div>

                {/* Empty State for additional schedules */}
                <div className="mt-6 text-center py-8 text-gray-500">
                  <IconCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Create additional vesting schedules for team members</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Transaction History</h2>
              
              {/* Empty State */}
              <div className="text-center py-16">
                <IconHistory className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No transactions yet</p>
                <p className="text-gray-500 text-sm">
                  Equity transfers will appear here once your token contract is deployed
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <TransferModal onClose={() => setShowTransferModal(false)} />
        )}
        {showVestingModal && (
          <VestingModal onClose={() => setShowVestingModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Transfer Modal Component
function TransferModal({ onClose }) {
  const [formData, setFormData] = useState({
    toAddress: '',
    amount: '',
    note: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle transfer logic
    console.log('Transfer:', formData);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-ghost-dark border border-white/10 rounded-xl p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Transfer Equity</h2>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <IconAlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-500 text-sm">
              Equity transfers are permanent and recorded on the blockchain. Please verify all details before proceeding.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
            <input
              type="text"
              value={formData.toAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, toAddress: e.target.value }))}
              placeholder="0x..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-ghost-blue/50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount (%)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              step="0.01"
              min="0"
              max="100"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-ghost-blue/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Note (Optional)</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Reason for transfer..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-ghost-blue/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-ghost-blue text-white rounded-lg hover:bg-ghost-blue/90 transition-colors flex items-center justify-center gap-2"
            >
              <IconSend className="w-4 h-4" />
              Transfer
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Vesting Modal Component
function VestingModal({ onClose }) {
  const [formData, setFormData] = useState({
    beneficiary: '',
    totalAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    cliffMonths: 12,
    vestingMonths: 48
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle vesting schedule creation
    console.log('Vesting Schedule:', formData);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-ghost-dark border border-white/10 rounded-xl p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Create Vesting Schedule</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Beneficiary Name</label>
            <input
              type="text"
              value={formData.beneficiary}
              onChange={(e) => setFormData(prev => ({ ...prev, beneficiary: e.target.value }))}
              placeholder="Team member name"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-ghost-gold/50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Total Equity (%)</label>
            <input
              type="number"
              value={formData.totalAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
              placeholder="0.00"
              step="0.01"
              min="0"
              max="100"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-ghost-gold/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ghost-gold/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Cliff (Months)</label>
              <input
                type="number"
                value={formData.cliffMonths}
                onChange={(e) => setFormData(prev => ({ ...prev, cliffMonths: parseInt(e.target.value) }))}
                min="0"
                max="48"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ghost-gold/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Vesting (Months)</label>
              <input
                type="number"
                value={formData.vestingMonths}
                onChange={(e) => setFormData(prev => ({ ...prev, vestingMonths: parseInt(e.target.value) }))}
                min="1"
                max="120"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ghost-gold/50"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-ghost-gold text-black rounded-lg hover:bg-ghost-gold/90 transition-colors flex items-center justify-center gap-2"
            >
              <IconCheck className="w-4 h-4" />
              Create Schedule
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
