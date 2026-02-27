"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Move3d } from "lucide-react";
import type { AccelDataPoint } from "@/types";

interface AccelerometerChartProps {
  data: AccelDataPoint[];
  loading?: boolean;
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 border border-white/10 text-xs space-y-1">
        <p className="text-white/40 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name.toUpperCase()}: {p.value.toFixed(4)} g
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function AccelerometerChart({ data, loading }: AccelerometerChartProps) {
  if (loading) return <ChartSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-500/15">
          <Move3d className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">Accelerometer</h3>
          <p className="text-[11px] text-white/30">X · Y · Z axes (g-force)</p>
        </div>
      </div>

      <div className="h-52">
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="x"
              stroke="#a78bfa"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#34d399"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="z"
              stroke="#fb923c"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-white/5">
        {[
          { label: "X-axis", color: "bg-violet-400" },
          { label: "Y-axis", color: "bg-emerald-400" },
          { label: "Z-axis", color: "bg-orange-400" },
        ].map((axis) => (
          <div key={axis.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-0.5 ${axis.color} rounded`} />
            <span className="text-[11px] text-white/30">{axis.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ChartSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl shimmer-bg" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-32 rounded shimmer-bg" />
          <div className="h-2.5 w-28 rounded shimmer-bg" />
        </div>
      </div>
      <div className="h-52 rounded-lg shimmer-bg" />
    </div>
  );
}
