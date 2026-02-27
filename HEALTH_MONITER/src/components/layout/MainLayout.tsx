"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { AlertBanner } from "@/components/alerts/AlertBanner";
import type { DeviceStatus, Alert } from "@/types";

interface MainLayoutProps {
  children: React.ReactNode;
  selectedPatient: string;
  onPatientChange: (patient: string) => void;
  deviceStatus: DeviceStatus;
  unreadAlerts: number;
  activeAlert: Alert | null;
  onDismissAlert: () => void;
}

export function MainLayout({
  children,
  selectedPatient,
  onPatientChange,
  deviceStatus,
  unreadAlerts,
  activeAlert,
  onDismissAlert,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#060b16]">
      <Sidebar unreadAlerts={unreadAlerts} />
      <Navbar
        selectedPatient={selectedPatient}
        onPatientChange={onPatientChange}
        deviceStatus={deviceStatus}
        unreadAlerts={unreadAlerts}
      />

      {/* Alert Banner */}
      <AnimatePresence>
        {activeAlert && (
          <AlertBanner alert={activeAlert} onDismiss={onDismissAlert} />
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="ml-64 pt-16 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
