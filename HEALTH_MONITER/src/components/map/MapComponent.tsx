"use client";

import { useEffect, useRef } from "react";

interface MapComponentProps {
  lat: number;
  lng: number;
}

export default function MapComponent({ lat, lng }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    async function initMap() {
      const L = (await import("leaflet")).default;

      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: false,
        }).setView([lat, lng], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        // Custom pulsing marker icon
        const pulseIcon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:20px;height:20px">
              <div style="position:absolute;inset:0;border-radius:50%;background:rgba(6,182,212,0.3);animation:ping 1.5s ease-out infinite"></div>
              <div style="position:absolute;inset:3px;border-radius:50%;background:#06b6d4;border:2px solid white;box-shadow:0 0 10px rgba(6,182,212,0.8)"></div>
            </div>
            <style>@keyframes ping{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.5);opacity:0}}</style>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        markerRef.current = L.marker([lat, lng], { icon: pulseIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(
            `<div style="font-family:Inter,sans-serif;font-size:12px;color:#111">
              <strong>Patient Location</strong><br/>
              ${lat.toFixed(6)}, ${lng.toFixed(6)}
            </div>`,
            { maxWidth: 200 }
          );
      } else if (mapInstanceRef.current && markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.panTo([lat, lng]);
      }
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.5 });
    }
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      className="h-56 w-full rounded-xl overflow-hidden border border-white/5"
      style={{ background: "#0d1117" }}
    />
  );
}
