"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePatientData } from "@/hooks/usePatientData";
import { useAlerts } from "@/hooks/useAlerts";
import { MainLayout } from "@/components/layout/MainLayout";
import { TemperatureCard } from "@/components/cards/TemperatureCard";
import { HumidityCard } from "@/components/cards/HumidityCard";
import { MetricCard } from "@/components/cards/MetricCard";
import { ECGChart } from "@/components/charts/ECGChart";
import { LocationMap } from "@/components/map/LocationMap";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { FirebaseErrorState } from "@/components/ui/EmptyState";
import { formatTimestamp, detectFall } from "@/lib/utils";
import {
  Zap,
  Activity,
  HeartPulse,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const [selectedPatient, setSelectedPatient] = useState("Patient1");

  const {
    currentData,
    ecgHistory,
    deviceStatus,
    loading,
    error,
  } = usePatientData(selectedPatient);

  const {
    alerts,
    unreadCount,
    activeAlert,
    dismissActiveAlert,
    markAllRead,
  } = useAlerts(currentData);

  if (error) {
    return (
      <MainLayout
        selectedPatient={selectedPatient}
        onPatientChange={setSelectedPatient}
        deviceStatus="offline"
        unreadAlerts={0}
        activeAlert={null}
        onDismissAlert={() => {}}
      >
        <FirebaseErrorState message={error} />
      </MainLayout>
    );
  }

  const fallDetected =
    currentData !== null &&
    detectFall(currentData.AccelX, currentData.AccelY, currentData.AccelZ);

  return (
    <MainLayout
      selectedPatient={selectedPatient}
      onPatientChange={setSelectedPatient}
      deviceStatus={deviceStatus}
      unreadAlerts={unreadCount}
      activeAlert={activeAlert}
      onDismissAlert={dismissActiveAlert}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold gradient-text">Live Dashboard</h1>
          <p className="text-xs text-white/30 mt-0.5">
            Real-time sensor data · {selectedPatient}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <Clock className="w-3.5 h-3.5" />
          <span>
            Last update:{" "}
            {currentData?.timestamp
              ? formatTimestamp(currentData.timestamp)
              : "—"}
          </span>
        </div>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-4">
          {/* Fall Detection Banner */}
          {fallDetected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-4 border border-red-500/30 glow-red flex items-center gap-4"
            >
              <div className="w-3 h-3 rounded-full bg-red-400 animate-ping" />
              <div>
                <p className="text-sm font-semibold text-red-300">
                  ⚠ Fall Detected
                </p>
                <p className="text-xs text-white/40">
                  High accelerometer magnitude detected. Immediate check recommended.
                </p>
              </div>
            </motion.div>
          )}

          {/* Vital Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <TemperatureCard
              value={currentData?.Temperature ?? null}
              loading={loading}
            />
            <HumidityCard
              value={currentData?.Humidity ?? null}
              loading={loading}
            />
            <MetricCard
              title="ECG Signal"
              subtitle="Current reading"
              value={currentData?.ECG ?? 0}
              unit="mV"
              icon={<Zap size={18} />}
              color="text-red-400"
              bgColor="bg-red-500/10"
              loading={loading}
            />
            <MetricCard
              title="Heart Rate"
              subtitle="Current reading"
              value={currentData?.BPM ?? 0}
              unit="bpm"
              icon={<HeartPulse size={18} />}
              color="text-pink-400"
              bgColor="bg-pink-500/10"
              loading={loading}
            />
          </div>

          {/* ECG Chart — full width */}
          <ECGChart data={ecgHistory} loading={loading} />

          {/* Fall Status */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-4 border ${
              fallDetected
                ? "border-red-500/30 glow-red"
                : "border-emerald-500/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                  Fall Detection
                </p>
                <p
                  className={`text-lg font-bold mt-1 ${
                    fallDetected ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {fallDetected ? "Detected" : "No Fall"}
                </p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  fallDetected ? "bg-red-400 animate-pulse" : "bg-emerald-400"
                }`}
              />
            </div>
          </motion.div>

          {/* GPS Map */}
          <div className="grid grid-cols-1">
            <LocationMap
              latitude={currentData?.Latitude ?? null}
              longitude={currentData?.Longitude ?? null}
              loading={loading}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
