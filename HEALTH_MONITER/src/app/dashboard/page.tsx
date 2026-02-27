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
import { AccelerometerChart } from "@/components/charts/AccelerometerChart";
import { LocationMap } from "@/components/map/LocationMap";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { FirebaseErrorState } from "@/components/ui/EmptyState";
import { formatTimestamp, detectFall } from "@/lib/utils";
import {
  Zap,
  Activity,
  Move3d,
  RefreshCw,
  Clock,
  MapPin,
} from "lucide-react";

export default function DashboardPage() {
  const [selectedPatient, setSelectedPatient] = useState("Patient1");

  const {
    currentData,
    ecgHistory,
    accelHistory,
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
              title="Accel Magnitude"
              subtitle="Total force"
              value={
                currentData
                  ? parseFloat(
                      Math.sqrt(
                        currentData.AccelX ** 2 +
                          currentData.AccelY ** 2 +
                          currentData.AccelZ ** 2
                      ).toFixed(2)
                    )
                  : 0
              }
              unit="g"
              icon={<Activity size={18} />}
              color={fallDetected ? "text-red-400" : "text-violet-400"}
              bgColor={fallDetected ? "bg-red-500/10" : "bg-violet-500/10"}
              loading={loading}
            />
          </div>

          {/* ECG Chart — full width */}
          <ECGChart data={ecgHistory} loading={loading} />

          {/* Accelerometer — full width */}
          <AccelerometerChart data={accelHistory} loading={loading} />

          {/* IMU Metrics Row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Accel X", val: currentData?.AccelX ?? 0, color: "text-violet-400", unit: "g" },
              { label: "Accel Y", val: currentData?.AccelY ?? 0, color: "text-emerald-400", unit: "g" },
              { label: "Accel Z", val: currentData?.AccelZ ?? 0, color: "text-orange-400", unit: "g" },
            ].map((m) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-3"
              >
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5">
                  {m.label}
                </p>
                <p className={`text-lg font-bold tabular-nums ${m.color}`}>
                  {(m.val as number).toFixed(3)}
                </p>
                <p className="text-[10px] text-white/20">{m.unit}</p>
              </motion.div>
            ))}
          </div>

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
