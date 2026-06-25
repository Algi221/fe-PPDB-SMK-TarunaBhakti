"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import {
  Users, ShieldCheck, Clock, AlertTriangle, BarChart2,
  Pencil, TrendingUp, TrendingDown, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import KuotaTab from "@/components/KuotaTab";

interface MajorItem {
  name: string;
  dbName: string;
  color: string;
  count?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Area Chart Component
// ─────────────────────────────────────────────────────────────────────────────
function AreaChart({
  data,
  labels,
  color = "#3b82f6",
}: {
  data: number[];
  labels: string[];
  color?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<{ idx: number; x: number; y: number } | null>(null);
  const [animated, setAnimated] = useState(false);

  const W = 1000;
  const H = 320;
  const PAD_L = 50;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 36;

  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal || 1;

  const pts = data.map((v, i) => ({
    x: PAD_L + (i * (W - PAD_L - PAD_R)) / (data.length - 1 || 1),
    y: PAD_T + ((maxVal - v) / range) * (H - PAD_T - PAD_B),
    v,
  }));

  const linePath = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = pts[i - 1];
      const cpx = (prev.x + p.x) / 2;
      return `C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");

  const areaPath = `${linePath} L ${pts[pts.length - 1]?.x ?? 0} ${H - PAD_B} L ${pts[0]?.x ?? 0} ${H - PAD_B} Z`;

  // Y-axis ticks
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = Math.round(minVal + (range / 4) * (4 - i));
    const y = PAD_T + (i / 4) * (H - PAD_T - PAD_B);
    return { val, y };
  });

  // Handle mouse move for crosshair
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const rawX = ((e.clientX - rect.left) / rect.width) * W;
      // Find nearest point
      let nearest = 0;
      let minDist = Infinity;
      pts.forEach((p, i) => {
        const d = Math.abs(p.x - rawX);
        if (d < minDist) { minDist = d; nearest = i; }
      });
      setHovered({ idx: nearest, x: pts[nearest].x, y: pts[nearest].y });
    },
    [pts]
  );

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const gradId = `ag-${color.replace("#", "")}`;
  const hovPt = hovered ? pts[hovered.idx] : null;

  return (
    <div className="relative w-full" style={{ height: 240 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full overflow-visible cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
          <filter id="dot-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD_L} y1={t.y} x2={W - PAD_R} y2={t.y}
              stroke="currentColor" strokeOpacity="0.06" strokeWidth="1"
              className="text-slate-900 dark:text-white"
            />
            <text x={PAD_L - 8} y={t.y + 4} textAnchor="end" fill="currentColor"
              fontSize="11" className="text-slate-400 fill-slate-400 dark:fill-slate-600" opacity="0.7">
              {t.val}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradId})`} className={`transition-opacity duration-700 ${animated ? "opacity-100" : "opacity-0"}`} />

        {/* Line */}
        <path
          d={linePath} fill="none" stroke={color}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-all duration-700 ${animated ? "opacity-100" : "opacity-0"}`}
        />

        {/* X-axis labels */}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H - 6} textAnchor="middle"
            fontSize="11" className="fill-slate-400 dark:fill-slate-600"
            opacity={labels[i] ? 1 : 0}>
            {labels[i]}
          </text>
        ))}

        {/* Crosshair */}
        {hovPt && (
          <>
            <line x1={hovPt.x} y1={PAD_T} x2={hovPt.x} y2={H - PAD_B}
              stroke={color} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.5" />
            <circle cx={hovPt.x} cy={hovPt.y} r="5" fill={color} filter="url(#dot-glow)" />
            <circle cx={hovPt.x} cy={hovPt.y} r="9" fill="transparent" stroke={color} strokeWidth="1.5" strokeOpacity="0.35" />
          </>
        )}
      </svg>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hovered && hovPt && (
          <motion.div
            key={hovered.idx}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute pointer-events-none bg-slate-900/95 dark:bg-slate-950 border border-slate-700/50 backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-xl z-20 flex flex-col gap-0.5"
            style={{
              left: `${(hovPt.x / W) * 100}%`,
              top: `${(hovPt.y / H) * 100}%`,
              transform: "translate(-50%, calc(-100% - 12px))",
            }}
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              {labels[hovered.idx]}
            </span>
            <span className="text-sm font-black text-white leading-none">
              {pts[hovered.idx].v} <span className="text-[10px] text-slate-400 font-bold">pendaftar</span>
            </span>
            {hovered.idx > 0 && (
              <span className={`text-[10px] font-bold flex items-center gap-1 mt-0.5 ${pts[hovered.idx].v >= pts[hovered.idx - 1].v ? "text-emerald-400" : "text-rose-400"}`}>
                {pts[hovered.idx].v >= pts[hovered.idx - 1].v
                  ? <TrendingUp size={10} />
                  : <TrendingDown size={10} />}
                {Math.abs(pts[hovered.idx].v - pts[hovered.idx - 1].v)} dari sebelumnya
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bar Chart Component
// ─────────────────────────────────────────────────────────────────────────────
function BarChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  const W = 1000;
  const H = 260;
  const PAD_L = 40;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 48;

  const barW = Math.min(80, ((W - PAD_L - PAD_R) / data.length) * 0.55);
  const gap = (W - PAD_L - PAD_R) / data.length;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((frac) => ({
    val: Math.round(maxVal * frac),
    y: PAD_T + (1 - frac) * (H - PAD_T - PAD_B),
  }));

  return (
    <div className="relative w-full" style={{ height: 200 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
        {/* Grid */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PAD_L} y1={t.y} x2={W - PAD_R} y2={t.y}
              stroke="currentColor" strokeOpacity="0.06" strokeWidth="1"
              className="text-slate-900 dark:text-white" />
            <text x={PAD_L - 6} y={t.y + 4} textAnchor="end"
              fontSize="11" className="fill-slate-400 dark:fill-slate-600" opacity="0.75">
              {t.val}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const cx = PAD_L + gap * i + gap / 2;
          const barH = ((d.value / maxVal) * (H - PAD_T - PAD_B));
          const barY = H - PAD_B - barH;
          const isHov = hovered === i;

          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Bar background (full height ghost) */}
              <rect
                x={cx - barW / 2} y={PAD_T} width={barW}
                height={H - PAD_T - PAD_B}
                rx="6" fill={d.color} opacity={isHov ? 0.08 : 0}
                className="transition-opacity duration-200"
              />
              {/* Main bar */}
              <rect
                x={cx - barW / 2} y={barY} width={barW} height={barH}
                rx="6"
                fill={isHov ? d.color : d.color}
                opacity={isHov ? 1 : 0.75}
                className="transition-all duration-200"
              />
              {/* Value on top */}
              {isHov && (
                <text x={cx} y={barY - 6} textAnchor="middle"
                  fontSize="12" fontWeight="bold" fill={d.color}>
                  {d.value}
                </text>
              )}
              {/* X-label */}
              <text x={cx} y={H - PAD_B + 16} textAnchor="middle"
                fontSize="11" className="fill-slate-500 dark:fill-slate-400">
                {d.label}
              </text>
              {/* Percentage */}
              <text x={cx} y={H - PAD_B + 30} textAnchor="middle"
                fontSize="10" className="fill-slate-400 dark:fill-slate-600">
                {Math.round((d.value / total) * 100)}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute pointer-events-none bg-slate-900/95 dark:bg-slate-950 border border-slate-700/50 backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-xl z-20 flex flex-col gap-0.5"
            style={{
              left: `${((PAD_L + gap * hovered + gap / 2) / W) * 100}%`,
              top: "10%",
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{data[hovered].label}</span>
            <span className="text-sm font-black text-white">{data[hovered].value} <span className="text-[10px] text-slate-400 font-bold">pendaftar</span></span>
            <span className="text-[10px] text-slate-400 font-semibold">{Math.round((data[hovered].value / total) * 100)}% dari total</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const { applicants, activeStudents } = usePPDB();
  const [trendView, setTrendView] = useState<"hari" | "minggu" | "bulan" | "periode">("hari");

  const totalCount = applicants.length;
  const approvedCount = activeStudents.length;
  const pendingCount = applicants.filter((a: any) => a.status === "Pending" || !a.status).length;
  const rejectedCount = applicants.filter((a: any) => a.status === "Rejected").length;

  const [majorsList, setMajorsList] = useState<MajorItem[]>([
    { name: "PPLG", dbName: "Rekayasa Perangkat Lunak", color: "#3b82f6" },
    { name: "TJKT", dbName: "Teknik Jaringan Komputer & Telekomunikasi", color: "#0ea5e9" },
    { name: "DKV", dbName: "Desain Komunikasi Visual", color: "#6366f1" },
    { name: "Broadcasting", dbName: "Broadcasting & Perfilman", color: "#f59e0b" },
    { name: "Elektronika", dbName: "Teknik Elektronika", color: "#10b981" },
    { name: "Animasi", dbName: "Animasi", color: "#ec4899" },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("ppdb_majors_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMajorsList(parsed.map((m: any) => ({
            name: m.code === "RPL" ? "PPLG" : (m.code === "ANM" ? "Animasi" : (m.code === "BC" ? "Broadcasting" : m.code)),
            dbName: m.title,
            color: m.color || "#3b82f6",
          })));
        }
      } catch { /* ignore */ }
    }
    fetch("http://localhost:5000/api/config")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.ppdb_majors_config) {
          const dbMajors = json.data.ppdb_majors_config;
          if (Array.isArray(dbMajors) && dbMajors.length > 0) {
            const mapped = dbMajors.map((m: any) => ({
              name: m.code === "RPL" ? "PPLG" : (m.code === "ANM" ? "Animasi" : (m.code === "BC" ? "Broadcasting" : m.code)),
              dbName: m.title,
              color: m.color || "#3b82f6",
            }));
            setMajorsList(mapped);
            localStorage.setItem("ppdb_majors_config", JSON.stringify(dbMajors));
          }
        }
      })
      .catch(() => {});
  }, []);

  // ── Trend Data ──────────────────────────────────────────────────────────────
  const getTrendData = () => {
    const labels: string[] = [];
    const counts: number[] = [];
    const now = new Date();

    if (trendView === "hari") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(now.getDate() - i);
        labels.push(d.toLocaleDateString("id-ID", { weekday: "short" }));
        counts.push(applicants.filter((a: any) => new Date(a.tgl_daftar || a.createdAt || Date.now()).toDateString() === d.toDateString()).length);
      }
      const base = [8, 14, 11, 23, 19, 32, totalCount || 5];
      return { labels, counts: counts.every((c) => c === 0) ? base : counts };
    } else if (trendView === "minggu") {
      for (let i = 3; i >= 0; i--) {
        const start = new Date(); start.setDate(now.getDate() - (i + 1) * 7 + 1); start.setHours(0, 0, 0, 0);
        const end = new Date(); end.setDate(now.getDate() - i * 7); end.setHours(23, 59, 59, 999);
        labels.push(`${start.getDate()}-${end.getDate()} ${end.toLocaleDateString("id-ID", { month: "short" })}`);
        counts.push(applicants.filter((a: any) => { const d = new Date(a.tgl_daftar || a.createdAt || Date.now()); return d >= start && d <= end; }).length);
      }
      const base = [15, 28, 42, totalCount || 25];
      return { labels, counts: counts.every((c) => c === 0) ? base : counts };
    } else if (trendView === "bulan") {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(); d.setMonth(now.getMonth() - i);
        labels.push(d.toLocaleDateString("id-ID", { month: "short" }));
        counts.push(applicants.filter((a: any) => { const rd = new Date(a.tgl_daftar || a.createdAt || Date.now()); return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear(); }).length);
      }
      const base = [45, 62, 85, 55, 90, totalCount || 75];
      return { labels, counts: counts.every((c) => c === 0) ? base : counts };
    } else {
      const uniquePeriods = Array.from(new Set(applicants.map((a: any) => a.periode || "2026-2027")));
      if (uniquePeriods.length <= 1) return { labels: ["2024-2025", "2025-2026", "2026-2027"], counts: [35, 92, totalCount || 105] };
      const sorted = (uniquePeriods as string[]).sort();
      return {
        labels: sorted,
        counts: sorted.map((p) => applicants.filter((a: any) => (a.periode || "2026-2027") === p).length),
      };
    }
  };

  const trend = getTrendData();

  // ── Major Distribution for Bar Chart ───────────────────────────────────────
  const barData = majorsList.map((m) => ({
    label: m.name,
    color: m.color,
    value: applicants.filter((a: any) => a.jurusan_1 === m.dbName || a.jurusan1 === m.dbName || a.jurusan_1 === m.name).length,
  }));

  // ── Stat Cards ──────────────────────────────────────────────────────────────
  const stats = [
    { label: "Total Pendaftar", value: totalCount, sub: "Calon Siswa Baru", color: "blue", icon: <Users size={20} /> },
    { label: "Terverifikasi", value: approvedCount, sub: "Berkas Lolos Validasi", color: "emerald", icon: <ShieldCheck size={20} /> },
    { label: "Menunggu", value: pendingCount, sub: "Perlu Pemeriksaan", color: "amber", icon: <Clock size={20} /> },
    { label: "Ditolak / Gugur", value: rejectedCount, sub: "Tidak Memenuhi Syarat", color: "rose", icon: <AlertTriangle size={20} /> },
  ];

  const colorMap: Record<string, { bg: string; text: string; icon: string; border: string }> = {
    blue:    { bg: "bg-blue-50/70 dark:bg-blue-950/30",    text: "text-blue-600 dark:text-blue-400",    icon: "bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400",    border: "hover:border-blue-200 dark:hover:border-blue-800" },
    emerald: { bg: "bg-emerald-50/70 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", icon: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400", border: "hover:border-emerald-200 dark:hover:border-emerald-800" },
    amber:   { bg: "bg-amber-50/70 dark:bg-amber-950/30",   text: "text-amber-600 dark:text-amber-400",   icon: "bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400",   border: "hover:border-amber-200 dark:hover:border-amber-800" },
    rose:    { bg: "bg-rose-50/70 dark:bg-rose-950/30",     text: "text-rose-600 dark:text-rose-400",     icon: "bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400",     border: "hover:border-rose-200 dark:hover:border-rose-800" },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Stats Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const c = colorMap[s.color];
          return (
            <div key={s.label} className={`bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md ${c.border} transition-all duration-300 group`}>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${c.bg}`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{s.label}</span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon}`}>{s.icon}</div>
                </div>
                <h3 className={`text-3xl font-black leading-none mb-1 ${c.text}`}>{s.value}</h3>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{s.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Area Chart + Kuota ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Area Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Tren Registrasi</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                Statistik pendaftaran – {trendView === "hari" ? "7 hari terakhir" : trendView === "minggu" ? "4 minggu terakhir" : trendView === "bulan" ? "6 bulan terakhir" : "per periode"}
              </p>
            </div>
            <div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/40 dark:border-white/5 shrink-0">
              {(["hari", "minggu", "bulan", "periode"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setTrendView(v)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${trendView === v
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-200/30"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-white"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <AreaChart data={trend.counts} labels={trend.labels} color="#3b82f6" />
        </div>

        {/* Kuota Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Data Keseluruhan</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Status kuota seluruh jurusan</p>
            </div>
            <Link
              href="/dashboard/pendaftar?tab=kuota"
              className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-xl transition-all"
              title="Edit Target Kuota"
            >
              <Pencil size={13} />
            </Link>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <KuotaTab type="keseluruhan" variant="minimal" />
          </div>
        </div>
      </div>

      {/* ── Bar Chart – Distribusi Jurusan ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase flex items-center gap-2">
              <BarChart2 size={14} className="text-indigo-500" />
              Distribusi Pendaftar per Jurusan
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Jumlah calon siswa berdasarkan pilihan jurusan pertama</p>
          </div>
          {/* Legend */}
          <div className="hidden sm:flex items-center flex-wrap gap-x-4 gap-y-1">
            {majorsList.slice(0, 6).map((m) => (
              <div key={m.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color }} />
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
        <BarChart data={barData} />
      </div>

      {/* ── Recent Applicants + Kuota Progress ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Recent Table */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Pendaftar Terbaru</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">5 calon siswa yang baru mendaftar</p>
            </div>
            <Link href="/dashboard/pendaftar" className="flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 transition-colors uppercase tracking-wider">
              Lihat Semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-600 text-[9px] uppercase tracking-widest">
                  <th className="pb-2 pt-1 pl-2">Nama</th>
                  <th className="pb-2 pt-1">Asal Sekolah</th>
                  <th className="pb-2 pt-1">Jurusan</th>
                  <th className="pb-2 pt-1 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {applicants.slice(0, 5).map((a: any, idx: number) => (
                  <tr key={a.id || idx} className="hover:bg-slate-50/60 dark:hover:bg-white/3 transition-all">
                    <td className="py-2.5 pl-2 font-bold text-slate-800 dark:text-white max-w-[130px] truncate">{a.nama}</td>
                    <td className="py-2.5 truncate max-w-[110px] text-slate-500 dark:text-slate-400 font-medium">{a.sekolah_asal || a.sekolahAsal}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 text-[9px] font-bold uppercase tracking-wide">
                        {majorsList.find((m) => m.dbName === a.jurusan_1 || m.dbName === a.jurusan1)?.name || a.jurusan_1 || "PPLG"}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wide ${
                        a.status === "Approved" ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                        : a.status === "Rejected" ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                        : "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                      }`}>
                        {a.status === "Approved" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {applicants.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-slate-400 font-bold uppercase tracking-wider text-[10px]">Belum ada data pendaftar</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kuota Progress Charts */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 shadow-sm flex flex-col flex-1">
            <h3 className="text-[10px] font-black text-slate-800 dark:text-white tracking-wider uppercase mb-3 flex items-center gap-2">
              <BarChart2 size={12} className="text-blue-500" /> Progress Calon Siswa
            </h3>
            <KuotaTab type="pendaftar" variant="minimal" />
          </div>
          <div className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 shadow-sm flex flex-col flex-1">
            <h3 className="text-[10px] font-black text-slate-800 dark:text-white tracking-wider uppercase mb-3 flex items-center gap-2">
              <ShieldCheck size={12} className="text-emerald-500" /> Progress Siswa Aktif
            </h3>
            <KuotaTab type="siswa-aktif" variant="minimal" />
          </div>
        </div>
      </div>

    </div>
  );
}
