'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconSkull,
  IconFlame,
  IconLoader2,
  IconRefresh,
  IconQuote,
  IconBrain,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconClock,
  IconTrophy,
  IconChartBar,
  IconBulb,
  IconMoodSad
} from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

export default function InvestorGhoulPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingMotivation, setLoadingMotivation] = useState(false);
  const [roastResult, setRoastResult] = useState(null);
  const [motivation, setMotivation] = useState(null);
  const [roastHistory, setRoastHistory] = useState([]);
  const [roastMode, setRoastMode] = useState('standard');
  const [formData, setFormData] = useState({
    idea: '',
    problemSolving: '',
    targetMarket: '',
    businessModel: '',
    competition: '',
    askAmount: ''
  });

  useEffect(() => {
    fetchHistory();
    fetchMotivation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchHistory = async () => {
    if (!user?.uid) return;
    try {
      const res = await fetch(`/api/agents/investor-ghoul?userId=${user.uid}`);
      const data = await res.json();
      if (data.success) {
        setRoastHistory(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const fetchMotivation = async () => {
    if (!user?.uid) return;
    setLoadingMotivation(true);
    try {
      const res = await fetch(`/api/agents/investor-ghoul?userId=${user.uid}&action=motivation`);
      const data = await res.json();
      if (data.success) {
        setMotivation(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch motivation:', error);
    } finally {
      setLoadingMotivation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/agents/investor-ghoul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: formData.idea,
          pitchDetails: {
            problemSolving: formData.problemSolving,
            targetMarket: formData.targetMarket,
            businessModel: formData.businessModel,
            competition: formData.competition,
            askAmount: formData.askAmount
          },
          roastMode,
          userId: user.uid
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setRoastResult(data.data);
        fetchHistory();
      }
    } catch (error) {
      console.error('Failed to roast idea:', error);
    } finally {
      setLoading(false);
    }
  };

  const roastModes = [
    { id: 'constructive', label: 'Constructive', icon: IconBulb, desc: 'Tough but helpful feedback' },
    { id: 'standard', label: 'Standard VC', icon: IconBrain, desc: 'Real VC-style criticism' },
    { id: 'brutal', label: 'Brutal Mode', icon: IconFlame, desc: 'No mercy, pure honesty' }
  ];

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-neon-green';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'invest': return <IconCheck className="w-6 h-6 text-neon-green" />;
      case 'pass': return <IconX className="w-6 h-6 text-red-500" />;
      case 'maybe': return <IconAlertTriangle className="w-6 h-6 text-yellow-500" />;
      default: return <IconSkull className="w-6 h-6 text-gray-400" />;
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
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center border border-red-500/30">
            <IconSkull className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Investor Ghoul</h1>
            <p className="text-gray-400">VC Roast Mode - Harsh But Constructive Feedback</p>
          </div>
        </div>
      </motion.div>

      {/* Daily Motivation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-gradient-to-r from-ghost-dark/80 to-red-500/10 border border-red-500/20 rounded-xl"
      >
        <div className="flex items-start gap-4">
          <IconQuote className="w-8 h-8 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-lg text-white italic mb-2">
              {loadingMotivation ? (
                <span className="text-gray-400">Loading tough love...</span>
              ) : (
                motivation?.message || "Your idea is only as good as your execution. Stop planning, start building."
              )}
            </p>
            <p className="text-gray-500 text-sm">— The Investor Ghoul</p>
          </div>
          <button
            onClick={fetchMotivation}
            disabled={loadingMotivation}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <IconRefresh className={`w-5 h-5 text-gray-400 ${loadingMotivation ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pitch Form */}
        <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <IconFlame className="w-5 h-5 text-red-500" />
            Submit Your Pitch for Roasting
          </h2>

          {/* Roast Mode Selection */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-3">Select Roast Intensity</label>
            <div className="grid grid-cols-3 gap-3">
              {roastModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setRoastMode(mode.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    roastMode === mode.id
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <mode.icon className={`w-6 h-6 mx-auto mb-2 ${
                    roastMode === mode.id ? 'text-red-500' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    roastMode === mode.id ? 'text-white' : 'text-gray-400'
                  }`}>{mode.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Main Idea */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Your Startup Idea *</label>
              <textarea
                required
                value={formData.idea}
                onChange={(e) => setFormData(prev => ({ ...prev, idea: e.target.value }))}
                placeholder="Describe your startup idea in a few sentences..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Problem Solving */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">What Problem Are You Solving?</label>
              <input
                type="text"
                value={formData.problemSolving}
                onChange={(e) => setFormData(prev => ({ ...prev, problemSolving: e.target.value }))}
                placeholder="The specific problem your startup addresses..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Target Market */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Target Market</label>
              <input
                type="text"
                value={formData.targetMarket}
                onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                placeholder="Who are your target customers?"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Business Model */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Business Model</label>
              <input
                type="text"
                value={formData.businessModel}
                onChange={(e) => setFormData(prev => ({ ...prev, businessModel: e.target.value }))}
                placeholder="How will you make money?"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Competition */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Known Competitors</label>
              <input
                type="text"
                value={formData.competition}
                onChange={(e) => setFormData(prev => ({ ...prev, competition: e.target.value }))}
                placeholder="Who are you competing against?"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Ask Amount */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Funding Ask (Optional)</label>
              <input
                type="text"
                value={formData.askAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, askAmount: e.target.value }))}
                placeholder="$500K for 10% equity"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.idea}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <IconLoader2 className="w-5 h-5 animate-spin" />
                  Roasting...
                </>
              ) : (
                <>
                  <IconFlame className="w-5 h-5" />
                  Roast My Idea
                </>
              )}
            </button>
          </form>
        </div>

        {/* Roast Result */}
        <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <IconSkull className="w-5 h-5 text-red-500" />
            The Verdict
          </h2>

          <AnimatePresence mode="wait">
            {roastResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Score & Verdict */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getVerdictIcon(roastResult.verdict)}
                    <div>
                      <p className="text-white font-medium capitalize">
                        {roastResult.verdict || 'Evaluated'}
                      </p>
                      <p className="text-gray-400 text-sm">Investment Decision</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${getScoreColor(roastResult.score)}`}>
                      {roastResult.score}/100
                    </p>
                    <p className="text-gray-400 text-sm">Pitch Score</p>
                  </div>
                </div>

                {/* Main Roast */}
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <IconFlame className="w-4 h-4 text-red-500" />
                    The Roast
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {roastResult.roast}
                  </p>
                </div>

                {/* Strengths */}
                {roastResult.strengths && roastResult.strengths.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <IconTrophy className="w-4 h-4 text-neon-green" />
                      What&apos;s Actually Good
                    </h4>
                    <div className="space-y-2">
                      {roastResult.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <IconCheck className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weaknesses */}
                {roastResult.weaknesses && roastResult.weaknesses.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <IconMoodSad className="w-4 h-4 text-red-500" />
                      What Needs Work
                    </h4>
                    <div className="space-y-2">
                      {roastResult.weaknesses.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <IconX className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advice */}
                {roastResult.advice && (
                  <div className="p-4 bg-ghost-blue/10 border border-ghost-blue/20 rounded-lg">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <IconBulb className="w-4 h-4 text-ghost-blue" />
                      Parting Wisdom
                    </h4>
                    <p className="text-gray-300 text-sm">{roastResult.advice}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <IconSkull className="w-20 h-20 text-gray-600 mb-4" />
                <p className="text-gray-400 mb-2">No pitch roasted yet</p>
                <p className="text-gray-500 text-sm">Submit your idea and prepare to be humbled</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Roast History */}
      {roastHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-ghost-dark/50 border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <IconChartBar className="w-5 h-5 text-red-500" />
            Your Roast History
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roastHistory.map((roast, i) => (
              <motion.div
                key={roast._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-red-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-bold ${getScoreColor(roast.score)}`}>
                    {roast.score}/100
                  </span>
                  {getVerdictIcon(roast.verdict)}
                </div>
                <p className="text-white text-sm line-clamp-2 mb-2">{roast.idea}</p>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <IconClock className="w-3 h-3" />
                  {new Date(roast.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 bg-ghost-dark/30 border border-white/5 rounded-xl"
      >
        <p className="text-gray-500 text-sm text-center">
          💀 The Investor Ghoul provides entertainment and educational feedback only. 
          Don&apos;t take it too personally — every successful founder has been told their idea wouldn&apos;t work.
        </p>
      </motion.div>
    </div>
  );
}
