"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Leaflet map to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
  loading?: boolean;
}

const DEFAULT_LAT = 11.084664;
const DEFAULT_LNG = 76.998004;

export function LocationMap({ loading }: LocationMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-5 col-span-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/15">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90">GPS Location</h3>
            <p className="text-[11px] text-white/30">Real-time patient tracking</p>
          </div>
        </div>

        <a
            href={`https://www.google.com/maps?q=${DEFAULT_LAT},${DEFAULT_LNG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Open in Maps
          </a>
      </div>

      {loading ? (
        <MapSkeleton />
      ) : (
        <>
          <MapComponent lat={DEFAULT_LAT} lng={DEFAULT_LNG} />
          <div className="flex items-center gap-2 mt-3 text-xs text-white/30">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>{DEFAULT_LAT.toFixed(6)}, {DEFAULT_LNG.toFixed(6)}</span>
          </div>
        </>
      )}
    </motion.div>
  );
}

function MapSkeleton() {
  return <div className="h-56 rounded-lg shimmer-bg" />;
}
