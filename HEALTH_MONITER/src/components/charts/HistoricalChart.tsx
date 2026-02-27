"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import type { HistoricalDataPoint } from "@/types";

interface HistoricalChartProps {
  data: HistoricalDataPoint[];
  dataKey: keyof HistoricalDataPoint;
  color?: string;
  label?: string;
  unit?: string;
  loading?: boolean;
}

export function HistoricalChart({
  data,
  dataKey,
  color = "#06b6d4",
  label = "Value",
  unit = "",
  loading,
}: HistoricalChartProps) {
  if (loading) {
    return (
      <div className="glass-card p-5">
        <div className="h-3 w-40 rounded shimmer-bg mb-5" />
        <div className="h-56 rounded-lg shimmer-bg" />
      </div>
    );
  }

  if (data.length < 2) {
    return (
      <div className="glass-card p-5 flex items-center justify-center h-48">
        <p className="text-sm text-white/25">Not enough data to render chart</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <p className="text-sm font-semibold text-white/80 mb-4">{label}</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id={`grad-${String(dataKey)}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(6,11,22,0.95)",
                border: `1px solid ${color}30`,
                borderRadius: "8px",
                fontSize: "11px",
                color: "#fff",
              }}
              formatter={(val: number) => [`${val.toFixed(3)} ${unit}`, label]}
            />
            <Area
              type="monotone"
              dataKey={dataKey as string}
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${String(dataKey)})`}
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
