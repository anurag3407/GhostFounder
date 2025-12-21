'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconCode, 
  IconGitPullRequest, 
  IconCheck, 
  IconAlertTriangle,
  IconX,
  IconRefresh,
  IconBrandGithub,
  IconEye,
  IconClock,
  IconFileCode,
  IconShieldCheck
} from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

export default function CodeGuardianPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [githubConnected, setGithubConnected] = useState(false);

  const checkGithubConnection = () => {
    // Check if user has connected GitHub
    if (user?.githubUsername) {
      setGithubConnected(true);
    }
  };

  useEffect(() => {
    fetchReviews();
    checkGithubConnection();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/agents/code-guardian');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectGithub = () => {
    window.location.href = '/api/github/authorize';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-ghost-blue bg-ghost-blue/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <IconCheck className="w-5 h-5 text-green-500" />;
      case 'changes_requested': return <IconAlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'rejected': return <IconX className="w-5 h-5 text-red-500" />;
      default: return <IconEye className="w-5 h-5 text-ghost-blue" />;
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
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-ghost-blue/20 to-ghost-blue/5 flex items-center justify-center border border-ghost-blue/30">
            <IconCode className="w-8 h-8 text-ghost-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Phantom Code Guardian</h1>
            <p className="text-gray-400">AI-Powered Code Review & Security Analysis</p>
          </div>
        </div>

        {/* GitHub Connection Status */}
        {!githubConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-ghost-dark/50 border border-ghost-blue/20 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <IconBrandGithub className="w-10 h-10 text-white" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Connect GitHub</h3>
                  <p className="text-gray-400">Link your GitHub account to enable automatic code reviews on pull requests</p>
                </div>
              </div>
              <button
                onClick={connectGithub}
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <IconBrandGithub className="w-5 h-5" />
                Connect GitHub
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 text-green-500 mb-6">
            <IconCheck className="w-5 h-5" />
            <span>GitHub Connected</span>
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Reviews', value: reviews.length, icon: IconFileCode, color: 'ghost-blue' },
          { label: 'Approved', value: reviews.filter(r => r.status === 'approved').length, icon: IconCheck, color: 'neon-green' },
          { label: 'Changes Requested', value: reviews.filter(r => r.status === 'changes_requested').length, icon: IconAlertTriangle, color: 'yellow-500' },
          { label: 'Security Issues', value: reviews.reduce((acc, r) => acc + (r.securityIssues?.length || 0), 0), icon: IconShieldCheck, color: 'red-500' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-ghost-dark/50 border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-6 h-6 text-${stat.color}`} />
              <span className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reviews */}
        <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Reviews</h2>
            <button
              onClick={fetchReviews}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IconRefresh className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-ghost-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <IconGitPullRequest className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No code reviews yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Create a pull request in a connected repository to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {reviews.map((review, i) => (
                <motion.div
                  key={review._id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedReview(review)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedReview?._id === review._id 
                      ? 'border-ghost-blue bg-ghost-blue/10' 
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(review.status)}
                      <span className="text-white font-medium truncate max-w-[200px]">
                        {review.repository}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      #{review.prNumber}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2 truncate">{review.title}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <IconClock className="w-4 h-4" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {review.score && (
                      <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(
                        review.score >= 80 ? 'low' : review.score >= 60 ? 'medium' : review.score >= 40 ? 'high' : 'critical'
                      )}`}>
                        Score: {review.score}/100
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Review Details */}
        <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Review Details</h2>

          <AnimatePresence mode="wait">
            {selectedReview ? (
              <motion.div
                key={selectedReview._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(selectedReview.status)}
                    <span className="text-white font-semibold capitalize">
                      {selectedReview.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg text-white">{selectedReview.title}</h3>
                  <p className="text-gray-400 text-sm">
                    {selectedReview.repository} • PR #{selectedReview.prNumber}
                  </p>
                </div>

                {/* Score */}
                {selectedReview.score && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Code Quality Score</span>
                      <span className="text-2xl font-bold text-ghost-blue">
                        {selectedReview.score}/100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-ghost-blue to-neon-green transition-all duration-500"
                        style={{ width: `${selectedReview.score}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Summary */}
                {selectedReview.summary && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Summary</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {selectedReview.summary}
                    </p>
                  </div>
                )}

                {/* Issues */}
                {selectedReview.issues && selectedReview.issues.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Issues Found</h4>
                    <div className="space-y-2">
                      {selectedReview.issues.map((issue, i) => (
                        <div 
                          key={i} 
                          className={`p-3 rounded-lg ${getSeverityColor(issue.severity)}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium capitalize">{issue.severity}</span>
                            {issue.line && (
                              <span className="text-xs opacity-70">Line {issue.line}</span>
                            )}
                          </div>
                          <p className="text-sm opacity-80">{issue.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Files Changed */}
                {selectedReview.filesChanged && selectedReview.filesChanged.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Files Changed</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedReview.filesChanged.map((file, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-400"
                        >
                          {file}
                        </span>
                      ))}
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
                <IconCode className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400">Select a review to see details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
