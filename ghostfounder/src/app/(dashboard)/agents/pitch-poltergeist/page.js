'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconPresentation, 
  IconDownload,
  IconSparkles,
  IconLoader2,
  IconBrandGithub,
  IconBulb,
  IconChartBar,
  IconUsers,
  IconCurrencyDollar,
  IconTarget,
  IconTrophy,
  IconFileText,
  IconCheck,
  IconClock
} from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

export default function PitchPoltergeistPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generatedDeck, setGeneratedDeck] = useState(null);
  const [decks, setDecks] = useState([]);
  const [formData, setFormData] = useState({
    repositoryUrl: '',
    projectName: '',
    description: '',
    problem: '',
    solution: '',
    targetMarket: '',
    businessModel: '',
    fundingGoal: ''
  });
  const [activeTab, setActiveTab] = useState('generate');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/agents/pitch-poltergeist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repositoryUrl: formData.repositoryUrl,
          projectData: {
            name: formData.projectName,
            description: formData.description,
            problem: formData.problem,
            solution: formData.solution,
            targetMarket: formData.targetMarket,
            businessModel: formData.businessModel,
            fundingGoal: formData.fundingGoal
          },
          userId: user.uid
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setGeneratedDeck(data.data);
        fetchDecks();
      }
    } catch (error) {
      console.error('Failed to generate deck:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDecks = async () => {
    if (!user?.uid) return;
    try {
      const res = await fetch(`/api/agents/pitch-poltergeist?userId=${user.uid}`);
      const data = await res.json();
      if (data.success) {
        setDecks(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch decks:', error);
    }
  };

  const slideIcons = {
    'Title': IconPresentation,
    'Problem': IconBulb,
    'Solution': IconSparkles,
    'Market': IconChartBar,
    'Competition': IconTarget,
    'Business Model': IconCurrencyDollar,
    'Traction': IconTrophy,
    'Team': IconUsers,
    'Financials': IconChartBar,
    'Ask': IconCurrencyDollar
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
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-ghost-gold/20 to-ghost-gold/5 flex items-center justify-center border border-ghost-gold/30">
            <IconPresentation className="w-8 h-8 text-ghost-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Pitch Poltergeist</h1>
            <p className="text-gray-400">AI-Powered Pitch Deck Generator</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {['generate', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-ghost-gold text-black'
                : 'bg-ghost-dark/50 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {tab === 'generate' ? 'Generate New' : 'Previous Decks'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'generate' ? (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Form */}
            <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <IconSparkles className="w-5 h-5 text-ghost-gold" />
                Conjure Your Pitch Deck
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* GitHub URL */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    GitHub Repository (Optional)
                  </label>
                  <div className="relative">
                    <IconBrandGithub className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="url"
                      value={formData.repositoryUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, repositoryUrl: e.target.value }))}
                      placeholder="https://github.com/username/repo"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-gold/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">We&apos;ll analyze your codebase for context</p>
                </div>

                {/* Project Name */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="GhostFounder"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-gold/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">One-Line Description *</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="AI agents that haunt your startup journey"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-gold/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* Problem */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Problem You&apos;re Solving</label>
                  <textarea
                    value={formData.problem}
                    onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
                    placeholder="Founders waste 80% of their time on non-core activities..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-gold/50 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Solution */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Your Solution</label>
                  <textarea
                    value={formData.solution}
                    onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
                    placeholder="AI agents that automate code reviews, finances, legal..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-gold/50 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Target Market */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Target Market</label>
                  <input
                    type="text"
                    value={formData.targetMarket}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                    placeholder="Solo founders and small startup teams"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-gold/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* Business Model */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Business Model</label>
                  <input
                    type="text"
                    value={formData.businessModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessModel: e.target.value }))}
                    placeholder="SaaS subscription - $49/mo per founder"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-gold/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* Funding Goal */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Funding Goal</label>
                  <input
                    type="text"
                    value={formData.fundingGoal}
                    onChange={(e) => setFormData(prev => ({ ...prev, fundingGoal: e.target.value }))}
                    placeholder="$500K seed round"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-gold/50 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.projectName || !formData.description}
                  className="w-full py-4 bg-gradient-to-r from-ghost-gold to-yellow-600 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <IconLoader2 className="w-5 h-5 animate-spin" />
                      Conjuring Deck...
                    </>
                  ) : (
                    <>
                      <IconSparkles className="w-5 h-5" />
                      Generate Pitch Deck
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Preview */}
            <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <IconFileText className="w-5 h-5 text-ghost-gold" />
                Generated Deck Preview
              </h2>

              {generatedDeck ? (
                <div className="space-y-4">
                  {/* Download Button */}
                  {generatedDeck.pdfUrl && (
                    <a
                      href={generatedDeck.pdfUrl}
                      download
                      className="w-full py-3 bg-neon-green/20 border border-neon-green/30 text-neon-green font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-neon-green/30 transition-colors"
                    >
                      <IconDownload className="w-5 h-5" />
                      Download PDF
                    </a>
                  )}

                  {/* Slides Preview */}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {generatedDeck.slides?.map((slide, i) => {
                      const SlideIcon = slideIcons[slide.title] || IconFileText;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 bg-white/5 border border-white/10 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <SlideIcon className="w-5 h-5 text-ghost-gold" />
                            <span className="text-white font-medium">
                              Slide {i + 1}: {slide.title}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-3">
                            {slide.content}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <IconPresentation className="w-20 h-20 text-gray-600 mb-4" />
                  <p className="text-gray-400 mb-2">No deck generated yet</p>
                  <p className="text-gray-500 text-sm">Fill in the form and click generate to create your pitch deck</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Previous Pitch Decks</h2>
            
            {decks.length === 0 ? (
              <div className="text-center py-12">
                <IconPresentation className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No pitch decks created yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {decks.map((deck, i) => (
                  <motion.div
                    key={deck._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-ghost-gold/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <IconPresentation className="w-5 h-5 text-ghost-gold" />
                      <span className="text-white font-medium truncate">
                        {deck.projectName}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {deck.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <IconClock className="w-3 h-3" />
                        {new Date(deck.createdAt).toLocaleDateString()}
                      </span>
                      {deck.pdfUrl && (
                        <a
                          href={deck.pdfUrl}
                          download
                          className="p-2 hover:bg-ghost-gold/20 rounded-lg transition-colors"
                        >
                          <IconDownload className="w-4 h-4 text-ghost-gold" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { icon: IconBrandGithub, title: 'Code Analysis', desc: 'Analyzes your GitHub repo for tech stack insights' },
          { icon: IconChartBar, title: 'Market Research', desc: 'AI-powered market size and competition analysis' },
          { icon: IconCheck, title: 'Investor Ready', desc: 'Creates decks optimized for VC presentations' }
        ].map((feature, i) => (
          <div
            key={i}
            className="p-4 bg-ghost-dark/30 border border-white/5 rounded-xl"
          >
            <feature.icon className="w-8 h-8 text-ghost-gold mb-3" />
            <h3 className="text-white font-medium mb-1">{feature.title}</h3>
            <p className="text-gray-500 text-sm">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
