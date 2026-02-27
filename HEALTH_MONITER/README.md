# IoT Health Monitor — Real-Time Dashboard

A production-ready, full-stack IoT health monitoring dashboard built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Firebase Realtime Database**, **Recharts**, and **Framer Motion**.

---

## Features

- **Real-time sensor data** from ESP32 via Firebase `onValue` listener
- **Live ECG chart**, accelerometer (3-axis), gyroscope (3-axis) graphs
- **GPS tracking** via embedded Leaflet map
- **Smart alerts**: fall detection, high temperature, abnormal ECG
- **Analytics page** with rolling historical data and CSV export
- **Dark glassmorphism UI** with smooth animations
- **Mobile-responsive** layout
- **Ready to deploy** on Vercel in one click

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3 |
| Database | Firebase Realtime Database |
| Charts | Recharts 2 |
| Animations | Framer Motion 11 |
| Map | Leaflet.js + OpenStreetMap |
| Fonts | Inter (Google Fonts) |

---

## Firebase Database Structure

```
Patient1/
├── Temperature    (number, °C)
├── Humidity       (number, %)
├── ECG            (number, mV)
├── Accel_X        (number, g)
├── Accel_Y        (number, g)
├── Accel_Z        (number, g)
├── Gyro_X         (number, °/s)
├── Gyro_Y         (number, °/s)
├── Gyro_Z         (number, °/s)
├── Latitude       (number)
└── Longitude      (number)
```

---

## Quick Start

### 1. Clone & Install

```bash
cd HEALTH_MONITER
npm install
```

### 2. Configure Firebase

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Firebase project values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project → Enable **Realtime Database**
3. Set database rules to allow reads (for development):

```json
{
  "rules": {
    ".read": true,
    ".write": false
  }
}
```

4. Copy your config from **Project Settings → Your apps → SDK setup**

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          ← Root layout, fonts, metadata
│   ├── page.tsx            ← Redirects to /dashboard
│   ├── globals.css         ← Tailwind + glassmorphism styles
│   ├── dashboard/page.tsx  ← Live Dashboard
│   ├── analytics/page.tsx  ← Analytics & CSV export
│   ├── alerts/page.tsx     ← Alert center
│   └── settings/page.tsx   ← Configuration
├── components/
│   ├── layout/             ← Sidebar, Navbar, MainLayout
│   ├── cards/              ← Temperature, Humidity, Metric cards
│   ├── charts/             ← ECG, Accelerometer, Gyroscope, Historical
│   ├── map/                ← Leaflet GPS map
│   ├── alerts/             ← Alert banner
│   └── ui/                 ← Skeletons, empty states
├── hooks/
│   ├── usePatientData.ts   ← Firebase real-time data hook
│   └── useAlerts.ts        ← Alert generation & state
├── lib/
│   ├── firebase.ts         ← Firebase initialization
│   └── utils.ts            ← Utilities, helpers, CSV export
└── types/
    └── index.ts            ← All TypeScript types & thresholds
```

---

## Alert Thresholds

| Alert | Condition |
|---|---|
| Temperature Warning | ≥ 37.5°C |
| Temperature Critical | ≥ 39.0°C |
| Low Temperature | < 35.0°C |
| ECG Spike | > 1.2 mV or < -0.5 mV |
| Fall Detection | Accel magnitude > 2.5g |

---

## Deploy to Vercel

```bash
npm run build
```

Or click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set your environment variables in **Vercel → Settings → Environment Variables**.

---

## ESP32 Arduino Code Example

```cpp
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void loop() {
  Firebase.RTDB.setFloat(&fbdo, "Patient1/Temperature", readTemp());
  Firebase.RTDB.setFloat(&fbdo, "Patient1/Humidity",    readHumidity());
  Firebase.RTDB.setFloat(&fbdo, "Patient1/ECG",         readECG());
  Firebase.RTDB.setFloat(&fbdo, "Patient1/Accel_X",     accel.x);
  Firebase.RTDB.setFloat(&fbdo, "Patient1/Accel_Y",     accel.y);
  Firebase.RTDB.setFloat(&fbdo, "Patient1/Accel_Z",     accel.z);
  Firebase.RTDB.setFloat(&fbdo, "Patient1/Gyro_X",      gyro.x);
  Firebase.RTDB.setFloat(&fbdo, "Patient1/Latitude",    gps.lat);
  Firebase.RTDB.setFloat(&fbdo, "Patient1/Longitude",   gps.lon);
  delay(100);
}
```

---

## License

MIT — Free to use and modify.
