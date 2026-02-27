"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { usePatientData } from "@/hooks/usePatientData";
import { useAlerts } from "@/hooks/useAlerts";
import { NoAlertsEmpty } from "@/components/ui/EmptyState";
import { cn, getSeverityColor, formatTimestamp } from "@/lib/utils";
import type { Alert } from "@/types";
import {
  AlertTriangle,
  Thermometer,
  Zap,
  MoveDown,
  Wifi,
  Droplets,
  CheckCircle,
  Trash2,
  Filter,
  Bell,
} from "lucide-react";

const alertIcons = {
  temperature: Thermometer,
  ecg: Zap,
  fall: MoveDown,
  connectivity: Wifi,
  humidity: Droplets,
};

type FilterType = "all" | "critical" | "warning" | "info";

export default function AlertsPage() {
  const [selectedPatient, setSelectedPatient] = useState("Patient1");
  const [filter, setFilter] = useState<FilterType>("all");

  const { currentData, deviceStatus } = usePatientData(selectedPatient);
  const {
    alerts,
    unreadCount,
    activeAlert,
    acknowledgeAlert,
    clearAlerts,
    markAllRead,
    dismissActiveAlert,
  } = useAlerts(currentData);

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);

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
          <h1 className="text-xl font-bold gradient-text">Alert Center</h1>
          <p className="text-xs text-white/30 mt-0.5">
            {alerts.length} total · {unreadCount} unread
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          {alerts.length > 0 && (
            <button
              onClick={clearAlerts}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["all", "critical", "warning", "info"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border",
              filter === f
                ? f === "critical"
                  ? "bg-red-500/15 border-red-500/30 text-red-400"
                  : f === "warning"
                  ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                  : f === "info"
                  ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                  : "bg-white/10 border-white/15 text-white"
                : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/4"
            )}
          >
            {f === "all" ? `All (${alerts.length})` : f}
          </button>
        ))}
      </div>

      {/* Alert list */}
      {filtered.length === 0 ? (
        <NoAlertsEmpty />
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {filtered.map((alert) => {
              const Icon = alertIcons[alert.type] ?? AlertTriangle;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "glass-card px-4 py-3.5 flex items-start gap-4 border transition-all",
                    alert.acknowledged ? "opacity-40" : "",
                    alert.severity === "critical"
                      ? "border-red-500/20"
                      : alert.severity === "warning"
                      ? "border-orange-500/20"
                      : "border-white/5"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5",
                      alert.severity === "critical"
                        ? "bg-red-500/15"
                        : alert.severity === "warning"
                        ? "bg-orange-500/15"
                        : "bg-cyan-500/15"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        alert.severity === "critical"
                          ? "text-red-400"
                          : alert.severity === "warning"
                          ? "text-orange-400"
                          : "text-cyan-400"
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                          getSeverityColor(alert.severity)
                        )}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-white/25 capitalize">
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-sm text-white/80 leading-snug">{alert.message}</p>
                    <p className="text-[11px] text-white/25 mt-1">
                      {formatTimestamp(alert.timestamp)}
                    </p>
                  </div>

                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-white/8 transition-colors text-white/25 hover:text-white/60"
                      title="Acknowledge"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </MainLayout>
  );
}
