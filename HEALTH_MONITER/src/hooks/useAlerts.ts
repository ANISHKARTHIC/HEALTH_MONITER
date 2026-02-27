"use client";

import { useState, useEffect, useCallback } from "react";
import type { Alert, PatientData } from "@/types";
import { generateAlerts } from "@/lib/utils";

const MAX_ALERTS = 50;

export function useAlerts(currentData: PatientData | null) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);

  useEffect(() => {
    if (!currentData) return;

    const newAlerts = generateAlerts(currentData);
    if (newAlerts.length === 0) return;

    setAlerts((prev) => {
      const combined = [...newAlerts, ...prev].slice(0, MAX_ALERTS);
      return combined;
    });

    setUnreadCount((prev) => prev + newAlerts.length);

    const critical = newAlerts.find((a) => a.severity === "critical");
    if (critical) {
      setActiveAlert(critical);
      setTimeout(() => setActiveAlert(null), 6000);
    }
  }, [currentData]);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const dismissActiveAlert = useCallback(() => {
    setActiveAlert(null);
  }, []);

  return {
    alerts,
    unreadCount,
    activeAlert,
    acknowledgeAlert,
    clearAlerts,
    markAllRead,
    dismissActiveAlert,
  };
}
