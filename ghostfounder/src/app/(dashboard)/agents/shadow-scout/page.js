'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconEye,
  IconDownload,
  IconLoader2,
  IconRefresh,
  IconBuilding,
  IconBrandGithub,
  IconTrendingUp,
  IconAlertTriangle,
  IconTarget,
  IconChartBar,
  IconClock,
  IconPlus,
  IconX,
  IconSearch
} from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

export default function ShadowScoutPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingReports, setFetchingReports] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showNewReportForm, setShowNewReportForm] = useState(false);
  const [competitors, setCompetitors] = useState(['']);
  const [formData, setFormData] = useState({
    projectDescription: '',
    industry: 'Technology'
  });

  useEffect(() => {
    fetchReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchReports = async () => {
    if (!user?.uid) return;
    setFetchingReports(true);
    try {
      const res = await fetch(`/api/agents/shadow-scout?userId=${user.uid}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setFetchingReports(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/agents/shadow-scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectDescription: formData.projectDescription,
          industry: formData.industry,
          competitors: competitors.filter(c => c.trim()),
          userId: user.uid
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setShowNewReportForm(false);
        setSelectedReport(data.data);
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCompetitor = () => {
    setCompetitors([...competitors, '']);
  };

  const removeCompetitor = (index) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const updateCompetitor = (index, value) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  };

  const getThreatColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-ghost-blue bg-ghost-blue/10';
    }
  };

  const industries = [
    'Technology', 'FinTech', 'HealthTech', 'EdTech', 'E-Commerce',
    'SaaS', 'AI/ML', 'Blockchain', 'CleanTech', 'Media', 'Gaming'
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-ghost-blue/20 to-ghost-blue/5 flex items-center justify-center border border-ghost-blue/30">
              <IconEye className="w-8 h-8 text-ghost-blue" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Shadow Scout</h1>
              <p className="text-gray-400">Competitive Intelligence & Market Analysis</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowNewReportForm(!showNewReportForm)}
            className="px-6 py-3 bg-ghost-blue text-black font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <IconPlus className="w-5 h-5" />
            New Spy Report
          </button>
        </div>
      </motion.div>

      {/* New Report Form */}
      <AnimatePresence>
        {showNewReportForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-ghost-dark/50 border border-ghost-blue/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <IconSearch className="w-5 h-5 text-ghost-blue" />
                  Generate Intelligence Report
                </h2>
                <button 
                  onClick={() => setShowNewReportForm(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <IconX className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Description */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">
                      Describe Your Project *
                    </label>
                    <textarea
                      required
                      value={formData.projectDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                      placeholder="AI-powered platform that helps founders manage their startups with intelligent agents..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-blue/50 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-ghost-blue/50 focus:outline-none transition-colors"
                    >
                      {industries.map((ind) => (
                        <option key={ind} value={ind} className="bg-ghost-dark">
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Competitors */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Known Competitors (Optional)
                    </label>
                    <div className="space-y-2">
                      {competitors.map((comp, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            value={comp}
                            onChange={(e) => updateCompetitor(i, e.target.value)}
                            placeholder="Competitor name or URL"
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-blue/50 focus:outline-none transition-colors"
                          />
                          {competitors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCompetitor(i)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <IconX className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addCompetitor}
                        className="text-ghost-blue text-sm flex items-center gap-1 hover:underline"
                      >
                        <IconPlus className="w-4 h-4" />
                        Add competitor
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.projectDescription}
                  className="px-8 py-3 bg-gradient-to-r from-ghost-blue to-cyan-600 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <IconLoader2 className="w-5 h-5 animate-spin" />
                      Scouting...
                    </>
                  ) : (
                    <>
                      <IconEye className="w-5 h-5" />
                      Generate Report
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports List */}
        <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Intelligence Reports</h2>
            <button
              onClick={fetchReports}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IconRefresh className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {fetchingReports ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-ghost-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <IconEye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No spy reports yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Create a new report to start gathering intelligence
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {reports.map((report, i) => (
                <motion.div
                  key={report._id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedReport?._id === report._id 
                      ? 'border-ghost-blue bg-ghost-blue/10' 
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconBuilding className="w-5 h-5 text-ghost-blue" />
                      <span className="text-white font-medium">
                        {report.industry || 'Market'} Report
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs ${getThreatColor(report.threatLevel)}`}>
                      {report.competitorsFound || 0} competitors
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {report.projectDescription || report.summary}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <IconClock className="w-4 h-4" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Report Details */}
        <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Report Details</h2>

          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div
                key={selectedReport._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Download Button */}
                {selectedReport.pdfUrl && (
                  <a
                    href={selectedReport.pdfUrl}
                    download
                    className="w-full py-3 bg-neon-green/20 border border-neon-green/30 text-neon-green font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-neon-green/30 transition-colors"
                  >
                    <IconDownload className="w-5 h-5" />
                    Download PDF Report
                  </a>
                )}

                {/* Overview */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <IconChartBar className="w-5 h-5 text-ghost-blue" />
                    Market Overview
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {selectedReport.marketOverview || selectedReport.summary || 'No overview available'}
                  </p>
                </div>

                {/* Competitors */}
                {selectedReport.competitors && selectedReport.competitors.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <IconTarget className="w-5 h-5 text-ghost-blue" />
                      Competitors Identified
                    </h4>
                    <div className="space-y-2">
                      {selectedReport.competitors.map((comp, i) => (
                        <div 
                          key={i} 
                          className="p-3 bg-white/5 border border-white/10 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium">{comp.name}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${getThreatColor(comp.threatLevel)}`}>
                              {comp.threatLevel} threat
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{comp.description}</p>
                          {comp.website && (
                            <a 
                              href={comp.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-ghost-blue text-xs mt-1 inline-block hover:underline"
                            >
                              {comp.website}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trends */}
                {selectedReport.trends && selectedReport.trends.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <IconTrendingUp className="w-5 h-5 text-neon-green" />
                      Market Trends
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.trends.map((trend, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-neon-green/10 border border-neon-green/20 text-neon-green text-sm rounded-full"
                        >
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Threats */}
                {selectedReport.threats && selectedReport.threats.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <IconAlertTriangle className="w-5 h-5 text-yellow-500" />
                      Potential Threats
                    </h4>
                    <div className="space-y-2">
                      {selectedReport.threats.map((threat, i) => (
                        <div 
                          key={i} 
                          className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-100"
                        >
                          {threat}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* GitHub Activity */}
                {selectedReport.githubActivity && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <IconBrandGithub className="w-5 h-5 text-white" />
                      Competitor GitHub Activity
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <span className="text-2xl font-bold text-ghost-blue">
                          {selectedReport.githubActivity.totalStars || 0}
                        </span>
                        <p className="text-gray-400 text-xs">Total Stars</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <span className="text-2xl font-bold text-neon-green">
                          {selectedReport.githubActivity.totalCommits || 0}
                        </span>
                        <p className="text-gray-400 text-xs">Commits (7d)</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <span className="text-2xl font-bold text-ghost-gold">
                          {selectedReport.githubActivity.activeRepos || 0}
                        </span>
                        <p className="text-gray-400 text-xs">Active Repos</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <IconEye className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400">Select a report to see details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
