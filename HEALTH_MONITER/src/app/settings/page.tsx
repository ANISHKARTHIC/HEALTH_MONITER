"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { usePatientData } from "@/hooks/usePatientData";
import { useAlerts } from "@/hooks/useAlerts";
import { THRESHOLDS } from "@/types";
import {
  Settings,
  Database,
  Bell,
  Sliders,
  Info,
  CheckCircle,
  ExternalLink,
  Github,
} from "lucide-react";

// Read each NEXT_PUBLIC_ var directly (not via dynamic key) so Next.js
// can statically inline them on the client — prevents hydration mismatch.
const FIREBASE_ENV_MAP: Record<string, string | undefined> = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default function SettingsPage() {
  const [selectedPatient, setSelectedPatient] = useState("Patient1");
  const [notifyCritical, setNotifyCritical] = useState(true);
  const [notifyWarning, setNotifyWarning] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [saved, setSaved] = useState(false);
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({});

  const { currentData, deviceStatus } = usePatientData(selectedPatient);
  const { unreadCount, activeAlert, dismissActiveAlert } = useAlerts(currentData);

  // Resolve env var status only on client to avoid SSR/CSR hydration mismatch
  useEffect(() => {
    const status: Record<string, boolean> = {};
    for (const [key, val] of Object.entries(FIREBASE_ENV_MAP)) {
      status[key] = !!val && !val.includes("your_") && val.trim() !== "";
    }
    setEnvStatus(status);
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const envVars = Object.keys(FIREBASE_ENV_MAP);

  return (
    <MainLayout
      selectedPatient={selectedPatient}
      onPatientChange={setSelectedPatient}
      deviceStatus={deviceStatus}
      unreadAlerts={unreadCount}
      activeAlert={activeAlert}
      onDismissAlert={dismissActiveAlert}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold gradient-text">Settings</h1>
          <p className="text-xs text-white/30 mt-0.5">Configuration & environment setup</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl">
        {/* Firebase Config */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/15">
              <Database className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-sm font-semibold text-white/90">Firebase Configuration</h2>
          </div>

          <div className="space-y-2 mb-4">
            {envVars.map((key) => {
              const isSet = envStatus[key] ?? false;
              return (
                <div key={key} className="flex items-center justify-between py-1.5 border-b border-white/4">
                  <code className="text-[10px] text-white/40 font-mono">
                    {key.replace("NEXT_PUBLIC_FIREBASE_", "")}
                  </code>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isSet
                        ? "text-green-400 bg-green-500/10"
                        : "text-red-400 bg-red-500/10"
                    }`}
                  >
                    {isSet ? "✓ Set" : "✗ Missing"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-white/3 border border-white/5">
            <p className="text-[11px] text-white/40 leading-relaxed">
              Copy{" "}
              <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">.env.local.example</code>{" "}
              to{" "}
              <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">.env.local</code> and fill
              in your Firebase project credentials.
            </p>
          </div>
        </motion.div>

        {/* Alert Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/15">
              <Bell className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-sm font-semibold text-white/90">Alert Preferences</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: "Critical alerts", sub: "Temperature ≥39°C, Fall detection", val: notifyCritical, set: setNotifyCritical },
              { label: "Warning alerts", sub: "Elevated temp, abnormal ECG", val: notifyWarning, set: setNotifyWarning },
              { label: "Auto-refresh listener", sub: "Firebase real-time onValue sync", val: autoRefresh, set: setAutoRefresh },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 font-medium">{item.label}</p>
                  <p className="text-[11px] text-white/30">{item.sub}</p>
                </div>
                <button
                  onClick={() => item.set(!item.val)}
                  className={`relative w-10 h-5.5 rounded-full transition-colors ${
                    item.val ? "bg-cyan-500" : "bg-white/10"
                  }`}
                  style={{ height: "22px", minWidth: "40px" }}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                      item.val ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Thresholds */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/15">
              <Sliders className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-sm font-semibold text-white/90">Detection Thresholds</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Temp — Warning",
                val: `≥ ${THRESHOLDS.temperature.highWarning}°C`,
                color: "text-orange-400",
              },
              {
                label: "Temp — Critical",
                val: `≥ ${THRESHOLDS.temperature.highCritical}°C`,
                color: "text-red-400",
              },
              {
                label: "ECG Spike",
                val: `> ${THRESHOLDS.ecg.maxNormal} or < ${THRESHOLDS.ecg.minNormal} mV`,
                color: "text-red-400",
              },
              {
                label: "Fall Detection",
                val: `Accel |magnitude| > ${THRESHOLDS.accelerometer.fallThreshold} g`,
                color: "text-red-400",
              },
              {
                label: "Humidity Range",
                val: `${THRESHOLDS.humidity.low}% – ${THRESHOLDS.humidity.high}%`,
                color: "text-cyan-400",
              },
            ].map((t) => (
              <div
                key={t.label}
                className="flex items-center justify-between py-2 border-b border-white/4"
              >
                <p className="text-xs text-white/50">{t.label}</p>
                <p className={`text-xs font-mono font-medium ${t.color}`}>{t.val}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5">
              <Info className="w-5 h-5 text-white/40" />
            </div>
            <h2 className="text-sm font-semibold text-white/90">About</h2>
          </div>

          <div className="space-y-2 mb-5">
            {[
              { k: "Framework", v: "Next.js 14 (App Router)" },
              { k: "Language", v: "TypeScript 5" },
              { k: "Database", v: "Firebase Realtime Database" },
              { k: "Charts", v: "Recharts 2" },
              { k: "Animations", v: "Framer Motion 11" },
              { k: "Map", v: "Leaflet.js + OpenStreetMap" },
              { k: "Styling", v: "Tailwind CSS + Glassmorphism" },
              { k: "Hardware", v: "ESP32 + sensor suite" },
            ].map((item) => (
              <div
                key={item.k}
                className="flex items-center justify-between py-1.5 border-b border-white/4"
              >
                <span className="text-xs text-white/35">{item.k}</span>
                <span className="text-xs text-white/70 font-medium">{item.v}</span>
              </div>
            ))}
          </div>

          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold text-white border border-white/10 bg-white/5 hover:bg-white/8 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Deploy to Vercel
          </a>
        </motion.div>
      </div>

      {/* Save button */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 transition-opacity"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Settings className="w-4 h-4" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </MainLayout>
  );
}
