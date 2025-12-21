'use client';

import { motion } from 'framer-motion';
import { IconGhost2, IconLoader2 } from '@tabler/icons-react';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        {/* Animated Ghost */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="mb-6"
        >
          <IconGhost2 className="w-16 h-16 text-ghost-blue mx-auto" />
        </motion.div>

        <div className="flex items-center justify-center gap-3">
          <IconLoader2 className="w-5 h-5 text-ghost-blue animate-spin" />
          <span className="text-gray-400">Loading...</span>
        </div>
      </motion.div>
    </div>
  );
}
