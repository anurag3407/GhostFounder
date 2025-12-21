'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconAlertTriangle, IconRefresh, IconHome } from '@tabler/icons-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to console (could be sent to Sentry/LogRocket)
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Ghost Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center"
        >
          <IconAlertTriangle className="w-12 h-12 text-red-500" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Something Went Wrong
        </h1>
        
        <p className="text-gray-400 mb-6">
          A spectral disturbance has occurred. Our ghost agents are investigating the issue.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left"
          >
            <p className="text-red-400 text-sm font-mono break-all">
              {error?.message || 'Unknown error occurred'}
            </p>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-ghost-blue text-black font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <IconRefresh className="w-5 h-5" />
            Try Again
          </button>
          
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <IconHome className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-gray-500 text-sm">
          If this problem persists,{' '}
          <a href="mailto:support@ghostfounder.com" className="text-ghost-blue hover:underline">
            contact support
          </a>
        </p>
      </motion.div>
    </div>
  );
}
