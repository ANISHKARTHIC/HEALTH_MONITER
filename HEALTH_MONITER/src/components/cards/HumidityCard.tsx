"use client";

import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { THRESHOLDS } from "@/types";

interface HumidityCardProps {
  value: number | null;
  loading?: boolean;
}

export function HumidityCard({ value, loading }: HumidityCardProps) {
  if (loading || value === null) return <HumiditySkeleton />;

  const isLow = value < THRESHOLDS.humidity.low;
  const isHigh = value > THRESHOLDS.humidity.high;
  const isNormal = !isLow && !isHigh;

  const color = isHigh ? "text-blue-400" : isLow ? "text-orange-400" : "text-cyan-400";
  const bg = isHigh ? "bg-blue-500/10" : isLow ? "bg-orange-500/10" : "bg-cyan-500/10";
  const label = isHigh ? "High" : isLow ? "Low" : "Normal";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-2xl bg-cyan-500" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            Relative Humidity
          </p>
          <p className="text-[10px] text-white/20 mt-0.5">Environmental</p>
        </div>
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl", bg)}>
          <Droplets className={cn("w-5 h-5", color)} />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-end gap-1.5">
          <span className={cn("text-4xl font-bold tabular-nums tracking-tight", color)}>
            {formatNumber(value, 0)}
          </span>
          <span className="text-lg font-medium text-white/40 mb-1">%</span>
        </div>
        <p className={cn("text-xs font-medium mt-1.5", color)}>{label}</p>
      </div>

      {/* Circular progress visual */}
      <div>
        <div className="flex justify-between text-[10px] text-white/25 mb-1.5">
          <span>0%</span>
          <span>Ideal: 40–60%</span>
          <span>100%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(value, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              isHigh
                ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                : isLow
                ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                : "bg-gradient-to-r from-cyan-400 to-teal-400"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}

function HumiditySkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded shimmer-bg" />
          <div className="h-2 w-20 rounded shimmer-bg" />
        </div>
        <div className="w-10 h-10 rounded-xl shimmer-bg" />
      </div>
      <div className="h-10 w-24 rounded shimmer-bg mb-4" />
      <div className="h-1.5 w-full rounded shimmer-bg" />
    </div>
  );
}
