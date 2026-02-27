"use client";

import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
}

export function LoadingSkeleton({ className = "", rows = 3 }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 rounded shimmer-bg" style={{ width: `${75 + Math.random() * 25}%` }} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-lg shimmer-bg" />
          <div className="h-4 w-64 rounded-lg shimmer-bg" />
        </div>
        <div className="h-8 w-32 rounded-lg shimmer-bg" />
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="h-3 w-24 rounded shimmer-bg" />
                <div className="h-2 w-16 rounded shimmer-bg" />
              </div>
              <div className="w-10 h-10 rounded-xl shimmer-bg" />
            </div>
            <div className="h-10 w-20 rounded shimmer-bg mb-3" />
            <div className="h-1.5 w-full rounded shimmer-bg" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl shimmer-bg" />
          <div className="space-y-2">
            <div className="h-4 w-36 rounded shimmer-bg" />
            <div className="h-3 w-52 rounded shimmer-bg" />
          </div>
        </div>
        <div className="h-56 rounded-lg shimmer-bg" />
      </div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl shimmer-bg" />
              <div className="space-y-2">
                <div className="h-4 w-28 rounded shimmer-bg" />
                <div className="h-3 w-40 rounded shimmer-bg" />
              </div>
            </div>
            <div className="h-52 rounded-lg shimmer-bg" />
          </div>
        ))}
      </div>
    </div>
  );
}
