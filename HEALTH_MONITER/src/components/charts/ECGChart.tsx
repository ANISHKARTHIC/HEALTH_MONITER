"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import type { ECGDataPoint } from "@/types";
import { THRESHOLDS } from "@/types";

interface ECGChartProps {
  data: ECGDataPoint[];
  loading?: boolean;
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const val = payload[0].value as number;
    const isAbnormal = val > THRESHOLDS.ecg.maxNormal || val < THRESHOLDS.ecg.minNormal;
    return (
      <div className="glass-card px-3 py-2 border border-white/10 text-xs">
        <p className="text-white/40 mb-1">{label}</p>
        <p className={isAbnormal ? "text-red-400 font-semibold" : "text-cyan-400 font-semibold"}>
          ECG: {val.toFixed(4)} mV
        </p>
        {isAbnormal && <p className="text-red-400/70 text-[10px] mt-0.5">⚠ Abnormal</p>}
      </div>
    );
  }
  return null;
}

export function ECGChart({ data, loading }: ECGChartProps) {
  if (loading) return <ChartSkeleton title="ECG Live Monitor" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-5 col-span-full"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/15">
            <Activity className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90">ECG Live Monitor</h3>
            <p className="text-[11px] text-white/30">Real-time electrocardiogram signal</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
          </span>
          <span className="text-xs text-red-400 font-medium">LIVE</span>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="time"
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[-1, 2]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={THRESHOLDS.ecg.maxNormal}
              stroke="rgba(239,68,68,0.35)"
              strokeDasharray="4 4"
              label={{ value: "High", fill: "rgba(239,68,68,0.5)", fontSize: 9 }}
            />
            <ReferenceLine
              y={THRESHOLDS.ecg.minNormal}
              stroke="rgba(239,68,68,0.35)"
              strokeDasharray="4 4"
              label={{ value: "Low", fill: "rgba(239,68,68,0.5)", fontSize: 9 }}
            />
            <Line
              type="monotoneX"
              dataKey="ecg"
              stroke="#f87171"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: "#f87171", strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-red-400" />
          <span className="text-[11px] text-white/30">ECG Signal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 border-t border-dashed border-red-500/40" />
          <span className="text-[11px] text-white/30">Normal Range</span>
        </div>
        <div className="ml-auto text-[11px] text-white/20">
          {data.length} data points
        </div>
      </div>
    </motion.div>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <div className="glass-card p-5 col-span-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl shimmer-bg" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-40 rounded shimmer-bg" />
          <div className="h-2.5 w-56 rounded shimmer-bg" />
        </div>
      </div>
      <div className="h-56 rounded-lg shimmer-bg" />
    </div>
  );
}
