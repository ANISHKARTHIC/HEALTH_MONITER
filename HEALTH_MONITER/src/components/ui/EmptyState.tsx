"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, Bell, Wifi } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-5 text-white/20">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-white/50 mb-2">{title}</h3>
      <p className="text-sm text-white/25 max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

export function NoAlertsEmpty() {
  return (
    <EmptyState
      icon={<Bell className="w-7 h-7" />}
      title="No Alerts"
      description="All vitals are within normal range. You'll be notified when something requires attention."
    />
  );
}

export function NoDataEmpty() {
  return (
    <EmptyState
      icon={<Activity className="w-7 h-7" />}
      title="No Data Available"
      description="Waiting for sensor data from the device. Make sure the ESP32 is connected and transmitting."
    />
  );
}

export function FirebaseErrorState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <Wifi className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-base font-semibold text-red-400 mb-2">Connection Error</h3>
      <p className="text-sm text-white/30 max-w-sm leading-relaxed mb-4">{message}</p>
      <p className="text-xs text-white/20">
        Ensure your <code className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">.env.local</code> file is configured with valid Firebase credentials.
      </p>
    </motion.div>
  );
}
