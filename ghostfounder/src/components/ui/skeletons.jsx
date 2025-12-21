'use client';

import { motion } from 'framer-motion';

/**
 * Skeleton component for loading states
 */
export function Skeleton({ className = '', variant = 'rectangle' }) {
  const baseClass = 'bg-white/5 animate-pulse rounded';
  
  if (variant === 'circle') {
    return <div className={`${baseClass} rounded-full ${className}`} />;
  }
  
  if (variant === 'text') {
    return <div className={`${baseClass} h-4 ${className}`} />;
  }
  
  return <div className={`${baseClass} ${className}`} />;
}

/**
 * Dashboard skeleton loader
 */
export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="w-16 h-16" variant="circle" />
        <div className="space-y-2">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>

      {/* Activity */}
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

/**
 * Agent page skeleton loader
 */
export function AgentSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="w-56 h-8" />
          <Skeleton className="w-40 h-4" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-12 rounded-lg" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Chart skeleton loader
 */
export function ChartSkeleton({ height = 'h-64' }) {
  const barHeights = [60, 80, 45, 90, 55, 75, 40]; // Fixed heights instead of random
  
  return (
    <div className={`bg-ghost-dark/50 border border-white/10 rounded-xl p-6 ${height}`}>
      <Skeleton className="w-32 h-6 mb-6" />
      <div className="flex items-end justify-between gap-2 h-[calc(100%-48px)]">
        {barHeights.map((h, i) => (
          <Skeleton 
            key={i} 
            className="flex-1" 
            style={{ height: `${h}%` }} 
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Card skeleton loader
 */
export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-32 h-5" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}

/**
 * Table skeleton loader
 */
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-ghost-dark/50 border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid gap-4 p-4 border-b border-white/10" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex}
          className="grid gap-4 p-4 border-b border-white/5" 
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * News card skeleton
 */
export function NewsCardSkeleton() {
  return (
    <div className="bg-ghost-dark/50 border border-white/10 rounded-xl overflow-hidden">
      <Skeleton className="h-40" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-16 h-3" />
        </div>
        <Skeleton className="h-5" />
        <Skeleton className="h-4" />
        <Skeleton className="w-3/4 h-4" />
      </div>
    </div>
  );
}

/**
 * Form skeleton
 */
export function FormSkeleton({ fields = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-12 rounded-lg mt-6" />
    </div>
  );
}

/**
 * Animated loading spinner
 */
export function LoadingSpinner({ size = 'md', color = 'ghost-blue' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizes[size]} border-2 border-${color} border-t-transparent rounded-full animate-spin`} />
  );
}

/**
 * Full page loading overlay
 */
export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400">{message}</p>
      </div>
    </motion.div>
  );
}

/**
 * Progress bar for multi-step operations
 */
export function ProgressBar({ progress, steps = [] }) {
  return (
    <div className="space-y-3">
      {/* Bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-ghost-blue to-neon-green"
        />
      </div>
      
      {/* Steps */}
      {steps.length > 0 && (
        <div className="flex justify-between text-xs">
          {steps.map((step, i) => {
            const stepProgress = ((i + 1) / steps.length) * 100;
            const isComplete = progress >= stepProgress;
            const isActive = progress >= (i / steps.length) * 100 && progress < stepProgress;
            
            return (
              <span 
                key={i}
                className={`${
                  isComplete ? 'text-neon-green' : 
                  isActive ? 'text-ghost-blue' : 
                  'text-gray-500'
                }`}
              >
                {step}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Skeletons = {
  Skeleton,
  DashboardSkeleton,
  AgentSkeleton,
  ChartSkeleton,
  CardSkeleton,
  TableSkeleton,
  NewsCardSkeleton,
  FormSkeleton,
  LoadingSpinner,
  LoadingOverlay,
  ProgressBar
};

export default Skeletons;
