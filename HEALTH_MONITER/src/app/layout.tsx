import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IoT Health Monitor — Real-Time Patient Dashboard",
  description:
    "Real-time IoT health monitoring dashboard powered by Firebase and ESP32 sensors. Monitor vitals, ECG, location, and motion data live.",
  keywords: ["IoT", "health monitoring", "ESP32", "Firebase", "real-time", "dashboard"],
  authors: [{ name: "IoT Health Monitor" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060b16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-[#060b16] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
