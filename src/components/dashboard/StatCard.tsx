"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function useCountUp(target: number, duration = 1400, trigger = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger || target === 0) { setValue(target); return; }
    let start: number | null = null;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration, trigger]);
  return value;
}

interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  color: string;
  icon: React.ReactNode;
  delay?: number;
  trigger?: boolean;
}

export default function StatCard({
  label, value, sub, color, icon, delay = 0, trigger = false
}: StatCardProps) {
  const displayValue = useCountUp(value, 1300 + delay * 80, trigger);
  const colorMap: Record<string, { bg: string; text: string; icon: string; border: string; ring: string }> = {
    blue:    { bg: "bg-blue-50/70 dark:bg-blue-950/30",    text: "text-blue-600 dark:text-blue-400",    icon: "bg-blue-100 dark:bg-blue-950/60 text-blue-500 dark:text-blue-400",    border: "hover:border-blue-200 dark:hover:border-blue-800", ring: "ring-blue-500/20" },
    emerald: { bg: "bg-emerald-50/70 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", icon: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 dark:text-emerald-400", border: "hover:border-emerald-200 dark:hover:border-emerald-800", ring: "ring-emerald-500/20" },
    amber:   { bg: "bg-amber-50/70 dark:bg-amber-950/30",   text: "text-amber-600 dark:text-amber-400",   icon: "bg-amber-100 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400",   border: "hover:border-amber-200 dark:hover:border-amber-800", ring: "ring-amber-500/20" },
    rose:    { bg: "bg-rose-50/70 dark:bg-rose-950/30",     text: "text-rose-600 dark:text-rose-400",     icon: "bg-rose-100 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400",     border: "hover:border-rose-200 dark:hover:border-rose-800", ring: "ring-rose-500/20" },
  };
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5
        relative overflow-hidden shadow-sm hover:shadow-lg ${c.border} transition-all duration-300 group cursor-default`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${c.bg}`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon}`}>{icon}</div>
        </div>
        <h3 className={`text-3xl font-black leading-none mb-1 tabular-nums ${c.text}`}>{displayValue}</h3>
        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{sub}</span>
      </div>
    </motion.div>
  );
}
