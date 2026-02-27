"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Bell,
  Settings,
  Activity,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  unreadAlerts?: number;
}

export function Sidebar({ unreadAlerts = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="glass-sidebar fixed left-0 top-0 h-full w-64 z-40 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
          <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-[#060b16]" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white leading-tight">HealthMonitor</h1>
          <p className="text-[10px] text-cyan-400/70 font-medium tracking-wider uppercase">
            IoT Dashboard
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "nav-item-active"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <Icon
                  className={cn(
                    "w-4.5 h-4.5 shrink-0 transition-colors",
                    isActive ? "text-cyan-400" : "text-white/40 group-hover:text-white/70"
                  )}
                  size={18}
                />
                <span className="text-sm font-medium">{item.label}</span>
                {item.label === "Alerts" && unreadAlerts > 0 && (
                  <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500/90 text-[10px] font-bold text-white">
                    {unreadAlerts > 99 ? "99+" : unreadAlerts}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-400"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-5 border-t border-white/5">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/3">
          <Wifi className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="text-[11px] font-medium text-white/70">Firebase Connected</p>
            <p className="text-[10px] text-cyan-400/60">Realtime Sync Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
