"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, ChevronDown, Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeviceStatus } from "@/types";

interface NavbarProps {
  selectedPatient: string;
  onPatientChange: (patient: string) => void;
  deviceStatus: DeviceStatus;
  unreadAlerts: number;
}

const patients = [
  { id: "Patient1", label: "Patient 1 — John Doe", age: 54 },
  { id: "Patient2", label: "Patient 2 — Jane Smith", age: 38 },
  { id: "Patient3", label: "Patient 3 — Robert Lee", age: 67 },
];

const statusConfig = {
  online: {
    label: "Device Online",
    color: "text-green-400",
    dot: "bg-green-400",
    icon: Wifi,
    pulse: true,
  },
  offline: {
    label: "Device Offline",
    color: "text-red-400",
    dot: "bg-red-400",
    icon: WifiOff,
    pulse: false,
  },
  connecting: {
    label: "Connecting...",
    color: "text-yellow-400",
    dot: "bg-yellow-400",
    icon: Loader2,
    pulse: true,
  },
};

export function Navbar({
  selectedPatient,
  onPatientChange,
  deviceStatus,
  unreadAlerts,
}: NavbarProps) {
  const [patientOpen, setPatientOpen] = useState(false);
  const status = statusConfig[deviceStatus];
  const StatusIcon = status.icon;
  const selectedLabel =
    patients.find((p) => p.id === selectedPatient)?.label ?? selectedPatient;

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-16 flex items-center px-6 gap-4 border-b border-white/5"
      style={{
        background: "linear-gradient(to right, rgba(6,11,22,0.95), rgba(6,11,22,0.85))",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Page title area */}
      <div className="flex-1">
        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">
          IoT Health Monitor
        </p>
      </div>

      {/* Device status */}
      <div
        className={cn(
          "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium",
          deviceStatus === "online"
            ? "border-green-500/20 bg-green-500/5 text-green-400"
            : deviceStatus === "offline"
            ? "border-red-500/20 bg-red-500/5 text-red-400"
            : "border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
        )}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75",
              status.pulse ? `${status.dot} animate-ping` : ""
            )}
          />
          <span className={cn("relative inline-flex rounded-full h-2 w-2", status.dot)} />
        </span>
        {status.label}
      </div>

      {/* Patient selector */}
      <div className="relative">
        <button
          onClick={() => setPatientOpen(!patientOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/8 bg-white/3 hover:bg-white/6 transition-colors text-sm font-medium text-white/80 hover:text-white"
        >
          <User className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:block max-w-[140px] truncate">
            {selectedLabel.split("—")[0].trim()}
          </span>
          <ChevronDown
            className={cn("w-3.5 h-3.5 text-white/40 transition-transform", patientOpen && "rotate-180")}
          />
        </button>

        <AnimatePresence>
          {patientOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 glass-card py-1 z-50"
            >
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onPatientChange(p.id);
                    setPatientOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left",
                    selectedPatient === p.id ? "text-cyan-400" : "text-white/70"
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center text-[11px] font-bold text-cyan-300">
                    {p.label.split("—")[1]?.trim().charAt(0) ?? "P"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.label.split("—")[1]?.trim()}</p>
                    <p className="text-[11px] text-white/30">
                      {p.id} · Age {p.age}
                    </p>
                  </div>
                  {selectedPatient === p.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alerts bell */}
      <button className="relative p-2 rounded-lg border border-white/8 bg-white/3 hover:bg-white/6 transition-colors">
        <Bell className="w-4 h-4 text-white/60" />
        {unreadAlerts > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadAlerts > 9 ? "9+" : unreadAlerts}
          </span>
        )}
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
        Dr
      </div>
    </header>
  );
}
