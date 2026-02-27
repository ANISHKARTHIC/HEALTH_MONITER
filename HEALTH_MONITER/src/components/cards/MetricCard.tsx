"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color?: string;
  bgColor?: string;
  trend?: string;
  loading?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  subtitle,
  value,
  unit,
  icon,
  color = "text-cyan-400",
  bgColor = "bg-cyan-500/10",
  trend,
  loading,
  className,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className={cn("glass-card p-4", className)}>
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded shimmer-bg" />
            <div className="h-2 w-16 rounded shimmer-bg" />
          </div>
          <div className="w-9 h-9 rounded-lg shimmer-bg" />
        </div>
        <div className="h-8 w-20 rounded shimmer-bg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass-card p-4 relative overflow-hidden group hover:border-white/10 transition-colors", className)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{title}</p>
          {subtitle && <p className="text-[10px] text-white/20 mt-0.5">{subtitle}</p>}
        </div>
        <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg", bgColor)}>
          <span className={cn("w-4.5 h-4.5", color)}>{icon}</span>
        </div>
      </div>

      <div className="flex items-end gap-1">
        <span className={cn("text-2xl font-bold tabular-nums tracking-tight", color)}>
          {typeof value === "number" ? value.toFixed(2) : value}
        </span>
        {unit && <span className="text-sm text-white/30 mb-0.5">{unit}</span>}
      </div>

      {trend && (
        <p className="text-[11px] text-white/30 mt-1">{trend}</p>
      )}
    </motion.div>
  );
}
