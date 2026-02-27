"use client";

import { motion } from "framer-motion";
import { Thermometer, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, getTemperatureStatus, formatNumber } from "@/lib/utils";

interface TemperatureCardProps {
  value: number | null;
  loading?: boolean;
}

export function TemperatureCard({ value, loading }: TemperatureCardProps) {
  if (loading || value === null) {
    return <TemperatureSkeleton />;
  }

  const status = getTemperatureStatus(value);
  const isHigh = value >= 37.5;
  const isLow = value < 35;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass-card p-5 relative overflow-hidden transition-all duration-500",
        isHigh && value >= 39 ? "glow-red" : isHigh ? "glow-orange" : "glow-cyan"
      )}
    >
      {/* Background glow decoration */}
      <div
        className={cn(
          "absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-2xl transition-colors duration-500",
          isHigh && value >= 39 ? "bg-red-500" : isHigh ? "bg-orange-500" : "bg-cyan-500"
        )}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            Body Temperature
          </p>
          <p className="text-[10px] text-white/20 mt-0.5">Core Sensor</p>
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl",
            status.bg
          )}
        >
          <Thermometer className={cn("w-5 h-5", status.color)} />
        </div>
      </div>

      {/* Value */}
      <div className="mb-4">
        <div className="flex items-end gap-1.5">
          <span className={cn("text-4xl font-bold tabular-nums tracking-tight", status.color)}>
            {formatNumber(value, 1)}
          </span>
          <span className="text-lg font-medium text-white/40 mb-1">°C</span>
        </div>

        {/* Trend indicator */}
        <div className={cn("flex items-center gap-1.5 mt-1.5")}>
          {isHigh ? (
            <TrendingUp className="w-3.5 h-3.5 text-red-400" />
          ) : isLow ? (
            <TrendingDown className="w-3.5 h-3.5 text-blue-400" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-green-400" />
          )}
          <span className={cn("text-xs font-medium", status.color)}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[10px] text-white/25 mb-1.5">
          <span>35°C</span>
          <span>Normal: 36–37.5°C</span>
          <span>42°C</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.max(((value - 35) / 7) * 100, 0), 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              isHigh && value >= 39
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : isHigh
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : "bg-gradient-to-r from-cyan-500 to-green-500"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}

function TemperatureSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded shimmer-bg" />
          <div className="h-2 w-20 rounded shimmer-bg" />
        </div>
        <div className="w-10 h-10 rounded-xl shimmer-bg" />
      </div>
      <div className="h-10 w-28 rounded shimmer-bg mb-4" />
      <div className="h-1.5 w-full rounded shimmer-bg" />
    </div>
  );
}
