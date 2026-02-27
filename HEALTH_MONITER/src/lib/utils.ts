import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { THRESHOLDS, type Alert, type AlertSeverity, type PatientData } from "@/types";

// ─── Class Utilities ────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Time Utilities ──────────────────────────────────────────────────────────
export function formatTimestamp(ts: number): string {
  return format(new Date(ts), "HH:mm:ss");
}

export function formatDate(ts: number): string {
  return format(new Date(ts), "MMM dd, yyyy");
}

export function formatDateTime(ts: number): string {
  return format(new Date(ts), "MMM dd, HH:mm");
}

export function timeNow(): string {
  return format(new Date(), "HH:mm:ss");
}

// ─── Temperature Utils ───────────────────────────────────────────────────────
export function getTemperatureStatus(value: number): {
  label: string;
  color: string;
  bg: string;
  glow: string;
} {
  if (value >= THRESHOLDS.temperature.highCritical) {
    return {
      label: "Critical",
      color: "text-red-400",
      bg: "bg-red-500/10",
      glow: "shadow-glow-red",
    };
  }
  if (value >= THRESHOLDS.temperature.highWarning) {
    return {
      label: "Elevated",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      glow: "shadow-orange-500/20",
    };
  }
  if (value < THRESHOLDS.temperature.low) {
    return {
      label: "Low",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      glow: "shadow-blue-500/20",
    };
  }
  return {
    label: "Normal",
    color: "text-green-400",
    bg: "bg-green-500/10",
    glow: "shadow-glow-green",
  };
}

// ─── ECG Utils ───────────────────────────────────────────────────────────────
export function isECGSpike(value: number): boolean {
  return (
    value > THRESHOLDS.ecg.maxNormal || value < THRESHOLDS.ecg.minNormal
  );
}

// ─── Fall Detection ──────────────────────────────────────────────────────────
export function detectFall(accelX: number, accelY: number, accelZ: number): boolean {
  const magnitude = Math.sqrt(accelX ** 2 + accelY ** 2 + accelZ ** 2);
  return magnitude > THRESHOLDS.accelerometer.fallThreshold;
}

// ─── Alert Generation ────────────────────────────────────────────────────────
export function generateAlerts(data: PatientData): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();

  if (data.Temperature >= THRESHOLDS.temperature.highCritical) {
    alerts.push({
      id: `temp-${now}`,
      type: "temperature",
      severity: "critical",
      message: `Critical temperature: ${data.Temperature.toFixed(1)}°C — Immediate attention required.`,
      timestamp: now,
      acknowledged: false,
    });
  } else if (data.Temperature >= THRESHOLDS.temperature.highWarning) {
    alerts.push({
      id: `temp-${now}`,
      type: "temperature",
      severity: "warning",
      message: `Elevated temperature: ${data.Temperature.toFixed(1)}°C — Monitor closely.`,
      timestamp: now,
      acknowledged: false,
    });
  }

  if (isECGSpike(data.ECG)) {
    alerts.push({
      id: `ecg-${now}`,
      type: "ecg",
      severity: "warning",
      message: `Abnormal ECG reading detected: ${data.ECG.toFixed(3)} mV.`,
      timestamp: now,
      acknowledged: false,
    });
  }

  if (detectFall(data.AccelX, data.AccelY, data.AccelZ)) {
    alerts.push({
      id: `fall-${now}`,
      type: "fall",
      severity: "critical",
      message: "Possible fall detected — Sudden accelerometer spike detected.",
      timestamp: now,
      acknowledged: false,
    });
  }

  return alerts;
}

// ─── Stats Utils ─────────────────────────────────────────────────────────────
export function calcStats(values: number[]) {
  if (values.length === 0) return { min: 0, max: 0, avg: 0, latest: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const latest = values[values.length - 1];
  return { min, max, avg: parseFloat(avg.toFixed(2)), latest };
}

// ─── CSV Export ──────────────────────────────────────────────────────────────
export function exportToCSV(data: PatientData[], filename: string = "health_data.csv") {
  if (data.length === 0) return;

  const headers = [
    "Timestamp",
    "Temperature",
    "Humidity",
    "ECG",
    "AccelX",
    "AccelY",
    "AccelZ",
    "GyroX",
    "GyroY",
    "GyroZ",
    "Latitude",
    "Longitude",
  ];

  const rows = data.map((d) => [
    d.timestamp ? new Date(d.timestamp).toISOString() : new Date().toISOString(),
    d.Temperature,
    d.Humidity,
    d.ECG,
    d.AccelX,
    d.AccelY,
    d.AccelZ,
    d.GyroX,
    d.GyroY,
    d.GyroZ,
    d.Latitude,
    d.Longitude,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Number Utils ────────────────────────────────────────────────────────────
export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

export function getSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "text-red-400 bg-red-500/10 border-red-500/30";
    case "warning":
      return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    case "info":
      return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    default:
      return "text-gray-400 bg-gray-500/10 border-gray-500/30";
  }
}
