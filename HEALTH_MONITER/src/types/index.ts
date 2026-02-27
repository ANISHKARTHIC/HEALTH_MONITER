// ─── Patient Data ────────────────────────────────────────────────────────────
export interface PatientData {
  Temperature: number;
  Humidity: number;
  ECG: number;
  BPM?: number;
  Status?: string;
  AccelX: number;
  AccelY: number;
  AccelZ: number;
  GyroX?: number;
  GyroY?: number;
  GyroZ?: number;
  Latitude?: number;
  Longitude?: number;
  timestamp?: number;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  condition: string;
  avatar?: string;
}

// ─── Chart Data ──────────────────────────────────────────────────────────────
export interface TimeSeriesPoint {
  time: string;
  value: number;
}

export interface ECGDataPoint {
  time: string;
  ecg: number;
}

export interface AccelDataPoint {
  time: string;
  x: number;
  y: number;
  z: number;
}

export interface GyroDataPoint {
  time: string;
  x: number;
  y: number;
  z: number;
}

export interface HistoricalDataPoint extends PatientData {
  timestamp: number;
  dateLabel: string;
}

// ─── Alert Types ─────────────────────────────────────────────────────────────
export type AlertSeverity = "critical" | "warning" | "info";

export interface Alert {
  id: string;
  type: "temperature" | "ecg" | "fall" | "connectivity" | "humidity";
  severity: AlertSeverity;
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

// ─── Device Status ────────────────────────────────────────────────────────────
export type DeviceStatus = "online" | "offline" | "connecting";

export interface DeviceInfo {
  patientId: string;
  status: DeviceStatus;
  lastSeen: number;
  batteryLevel?: number;
  signalStrength?: number;
}

// ─── Navigation ──────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

// ─── Thresholds ──────────────────────────────────────────────────────────────
export const THRESHOLDS = {
  temperature: {
    low: 35.0,
    highWarning: 37.5,
    highCritical: 39.0,
    unit: "°C",
  },
  humidity: {
    low: 20,
    high: 80,
    unit: "%",
  },
  ecg: {
    spikeThreshold: 1.5,
    minNormal: -0.5,
    maxNormal: 1.2,
    unit: "mV",
  },
  accelerometer: {
    fallThreshold: 2.5,
    unit: "g",
  },
} as const;

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface StatsSummary {
  min: number;
  max: number;
  avg: number;
  latest: number;
}

export interface AnalyticsSummary {
  temperature: StatsSummary;
  humidity: StatsSummary;
  ecg: StatsSummary;
}
