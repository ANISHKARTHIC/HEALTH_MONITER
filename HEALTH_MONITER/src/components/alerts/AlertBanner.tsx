"use client";

import { motion } from "framer-motion";
import { AlertTriangle, X, Zap, Thermometer, MoveDown } from "lucide-react";
import type { Alert } from "@/types";
import { cn } from "@/lib/utils";

interface AlertBannerProps {
  alert: Alert;
  onDismiss: () => void;
}

const alertIcons = {
  temperature: Thermometer,
  ecg: Zap,
  fall: MoveDown,
  connectivity: AlertTriangle,
  humidity: AlertTriangle,
};

export function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  const Icon = alertIcons[alert.type] ?? AlertTriangle;
  const isCritical = alert.severity === "critical";

  return (
    <motion.div
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-16 left-64 right-0 z-50 mx-4 mt-2 rounded-xl border px-5 py-3.5 flex items-center gap-4",
        isCritical
          ? "bg-red-950/90 border-red-500/40 glow-red"
          : "bg-orange-950/90 border-orange-500/40"
      )}
      style={{ backdropFilter: "blur(16px)" }}
    >
      {/* Animated icon */}
      <div
        className={cn(
          "relative flex items-center justify-center w-9 h-9 rounded-full shrink-0",
          isCritical ? "bg-red-500/20" : "bg-orange-500/20"
        )}
      >
        <Icon
          className={cn(
            "w-4.5 h-4.5",
            isCritical ? "text-red-400" : "text-orange-400"
          )}
          size={18}
        />
        {isCritical && (
          <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
        )}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", isCritical ? "text-red-300" : "text-orange-300")}>
          {isCritical ? "⚠ Critical Alert" : "Warning"}
        </p>
        <p className="text-xs text-white/60 truncate">{alert.message}</p>
      </div>

      {/* Severity badge */}
      <span
        className={cn(
          "hidden sm:flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider",
          isCritical
            ? "bg-red-500/20 text-red-300"
            : "bg-orange-500/20 text-orange-300"
        )}
      >
        {alert.severity}
      </span>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white/80"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
