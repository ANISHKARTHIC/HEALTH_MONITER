"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { getDb, firebaseConfig } from "@/lib/firebase";
import type {
  PatientData,
  ECGDataPoint,
  AccelDataPoint,
  GyroDataPoint,
  DeviceStatus,
} from "@/types";
import { timeNow } from "@/lib/utils";

const MAX_HISTORY_POINTS = 50;
const DEVICE_TIMEOUT_MS = 10000;
const CONNECTION_TIMEOUT_MS = 12000; // break out of infinite load after 12s

export function usePatientData(patientId: string = "Patient1") {
  const [currentData, setCurrentData] = useState<PatientData | null>(null);
  const [ecgHistory, setECGHistory]     = useState<ECGDataPoint[]>([]);
  const [accelHistory, setAccelHistory] = useState<AccelDataPoint[]>([]);
  const [gyroHistory, setGyroHistory]   = useState<GyroDataPoint[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>("connecting");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  const deviceTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetDeviceTimer = useCallback(() => {
    if (deviceTimerRef.current) clearTimeout(deviceTimerRef.current);
    setDeviceStatus("online");
    deviceTimerRef.current = setTimeout(() => setDeviceStatus("offline"), DEVICE_TIMEOUT_MS);
  }, []);

  const appendWithLimit = useCallback(<T>(prev: T[], item: T): T[] => {
    const next = [...prev, item];
    return next.length > MAX_HISTORY_POINTS ? next.slice(next.length - MAX_HISTORY_POINTS) : next;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ── Log config in dev so we can see what Firebase is using ──
    if (process.env.NODE_ENV === "development") {
      console.log("[Firebase] databaseURL:", firebaseConfig.databaseURL);
      console.log("[Firebase] projectId:", firebaseConfig.projectId);
      console.log("[Firebase] listening on path:", `${patientId}/Logs`);
    }

    let cancelled = false;

    const db = getDb();
    // Data is stored as push-key logs: Patient1/Logs/{pushKey}/{fields}
    // Listen to the single latest entry so we always have fresh sensor readings.
    const logsRef = query(ref(db, `${patientId}/Logs`), limitToLast(1));

    // ── Connection timeout — stop the infinite skeleton after 12 s ──
    connectionTimerRef.current = setTimeout(() => {
      if (cancelled) return;
      console.warn("[Firebase] No response after 12s. Check DB rules and path.");
      setError(
        `No data received after 12 seconds.\n\nCheck:\n` +
        `1. Firebase Realtime DB rules allow ".read": true\n` +
        `2. Data path should be "${patientId}/Logs/{pushKey}/..."\n` +
        `3. DATABASE_URL="${firebaseConfig.databaseURL}"`
      );
      setLoading(false);
      setDeviceStatus("offline");
    }, CONNECTION_TIMEOUT_MS);

    const unsub = onValue(
      logsRef,
      (snapshot) => {
        if (cancelled) return;
        if (connectionTimerRef.current) clearTimeout(connectionTimerRef.current);

        if (snapshot.exists()) {
          // snapshot.val() = { "-OmPushKey": { Temperature, ECG, ... } }
          const entries = snapshot.val() as Record<string, PatientData>;
          const raw = Object.values(entries)[0];
          const now = timeNow();

          if (process.env.NODE_ENV === "development") {
            console.log("[Firebase] latest log entry:", raw);
          }

          setCurrentData(raw);
          resetDeviceTimer();
          setLoading(false);
          setError(null);

          setECGHistory(prev => appendWithLimit(prev, { time: now, ecg: raw.ECG ?? 0 }));
          setAccelHistory(prev => appendWithLimit(prev, {
            time: now, x: raw.AccelX ?? 0, y: raw.AccelY ?? 0, z: raw.AccelZ ?? 0,
          }));
          setGyroHistory(prev => appendWithLimit(prev, {
            time: now, x: raw.GyroX ?? 0, y: raw.GyroY ?? 0, z: raw.GyroZ ?? 0,
          }));
        } else {
          console.warn(`[Firebase] No log entries found at "${patientId}/Logs"`);
          setError(`No data at path "${patientId}/Logs" in the database.`);
          setLoading(false);
          setDeviceStatus("offline");
        }
      },
      (err) => {
        if (cancelled) return;
        if (connectionTimerRef.current) clearTimeout(connectionTimerRef.current);
        console.error("[Firebase] onValue error:", err.code, err.message);

        let msg = err.message;
        if (err.code === "PERMISSION_DENIED") {
          msg = `Permission denied. Open Firebase Console → Realtime Database → Rules and set:\n{ "rules": { ".read": true, ".write": false } }`;
        }
        setError(msg);
        setLoading(false);
        setDeviceStatus("offline");
      }
    );

    return () => {
      cancelled = true;
      unsub(); // Firebase v9: onValue() returns a detach/unsubscribe function
      if (deviceTimerRef.current)     clearTimeout(deviceTimerRef.current);
      if (connectionTimerRef.current) clearTimeout(connectionTimerRef.current);
    };
  }, [patientId, resetDeviceTimer, appendWithLimit]);

  return { currentData, ecgHistory, accelHistory, gyroHistory, deviceStatus, loading, error };
}

