"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { MainLayout } from "@/components/layout/MainLayout";
import { usePatientData } from "@/hooks/usePatientData";
import { useAlerts } from "@/hooks/useAlerts";
import { calcStats, exportToCSV, formatNumber, formatDateTime } from "@/lib/utils";
import type { PatientData } from "@/types";
import {
  Download,
  BarChart3,
  TrendingUp,
  Thermometer,
  Droplets,
  Zap,
  Calendar,
} from "lucide-react";

interface HistoricalPoint extends PatientData {
  timestamp: number;
  dateLabel: string;
}

export default function AnalyticsPage() {
  const [selectedPatient, setSelectedPatient] = useState("Patient1");
  const [historicalData, setHistoricalData] = useState<HistoricalPoint[]>([]);
  const [metric, setMetric] = useState<"Temperature" | "Humidity" | "ECG">("Temperature");

  const { currentData, deviceStatus } = usePatientData(selectedPatient);
  const { unreadCount, activeAlert, dismissActiveAlert } = useAlerts(currentData);

  // Keep a rolling buffer of live data as "historical"
  const bufferRef = useRef<HistoricalPoint[]>([]);

  useEffect(() => {
    if (currentData) {
      const point: HistoricalPoint = {
        ...currentData,
        timestamp: Date.now(),
        dateLabel: new Date().toLocaleTimeString(),
      };
      bufferRef.current = [...bufferRef.current, point].slice(-200);
      setHistoricalData([...bufferRef.current]);
    }
  }, [currentData]);

  const metricValues = historicalData.map((d) => d[metric] as number);
  const stats = calcStats(metricValues);

  const metrics = [
    {
      key: "Temperature" as const,
      label: "Temperature",
      color: "#06b6d4",
      icon: Thermometer,
      unit: "°C",
    },
    {
      key: "Humidity" as const,
      label: "Humidity",
      color: "#34d399",
      icon: Droplets,
      unit: "%",
    },
    {
      key: "ECG" as const,
      label: "ECG",
      color: "#f87171",
      icon: Zap,
      unit: "mV",
    },
  ];

  const current = metrics.find((m) => m.key === metric)!;

  const handleExport = () => {
    exportToCSV(historicalData, `${selectedPatient}_health_data.csv`);
  };

  return (
    <MainLayout
      selectedPatient={selectedPatient}
      onPatientChange={setSelectedPatient}
      deviceStatus={deviceStatus}
      unreadAlerts={unreadCount}
      activeAlert={activeAlert}
      onDismissAlert={dismissActiveAlert}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold gradient-text">Analytics</h1>
          <p className="text-xs text-white/30 mt-0.5">
            Historical trends · {historicalData.length} data points collected
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={historicalData.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2 mb-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                metric === m.key
                  ? "bg-white/10 text-white border border-white/15"
                  : "text-white/40 hover:text-white/70 border border-transparent hover:bg-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: metric === m.key ? m.color : undefined }} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Latest", value: formatNumber(stats.latest, 2), suffix: current.unit },
          { label: "Average", value: formatNumber(stats.avg, 2), suffix: current.unit },
          { label: "Minimum", value: formatNumber(stats.min, 2), suffix: current.unit },
          { label: "Maximum", value: formatNumber(stats.max, 2), suffix: current.unit },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">
              {s.label}
            </p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: current.color }}>
              {s.value}
              <span className="text-sm font-normal text-white/30 ml-1">{s.suffix}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 mb-4"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: `${current.color}20` }}
            >
              <current.icon className="w-5 h-5" style={{ color: current.color }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/90">
                {current.label} Trend
              </h3>
              <p className="text-[11px] text-white/30">Live rolling window — last 200 readings</p>
            </div>
          </div>
        </div>

        {historicalData.length > 1 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={current.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={current.color} stopOpacity={0} />
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
                    border: `1px solid ${current.color}30`,
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}
                />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke={current.color}
                  strokeWidth={2}
                  fill="url(#colorGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: current.color, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-sm text-white/25">
              Collecting data... ({historicalData.length} / 2 minimum needed)
            </p>
          </div>
        )}
      </motion.div>

      {/* Multi-metric comparison */}
      {historicalData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5">
              <BarChart3 className="w-5 h-5 text-white/40" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/90">Multi-Metric Overview</h3>
              <p className="text-[11px] text-white/30">Temperature, Humidity & ECG overlaid</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
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
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="Temperature" stroke="#06b6d4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="Humidity" stroke="#34d399" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="ECG" stroke="#f87171" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-5 mt-3 pt-3 border-t border-white/5">
            {[
              { label: "Temperature", color: "bg-cyan-400" },
              { label: "Humidity", color: "bg-emerald-400" },
              { label: "ECG", color: "bg-red-400" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-0.5 ${l.color} rounded`} />
                <span className="text-[11px] text-white/30">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </MainLayout>
  );
}
