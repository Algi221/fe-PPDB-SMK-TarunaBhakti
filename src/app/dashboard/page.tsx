"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import {
  Users, ShieldCheck, Clock, AlertTriangle, BarChart2,
  Pencil, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import KuotaTab from "@/components/KuotaTab";
import StatCard from "@/components/dashboard/StatCard";
import DashboardAreaChart from "@/components/dashboard/DashboardAreaChart";
import DashboardBarChart from "@/components/dashboard/DashboardBarChart";

interface MajorItem {
  name: string;
  dbName: string;
  color: string;
  count?: number;
}

export default function DashboardOverview() {
  const { applicants, activeStudents } = usePPDB();
  const [trendView, setTrendView] = useState<"hari" | "minggu" | "bulan" | "periode">("hari");
  const [counterTrigger, setCounterTrigger] = useState(false);

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
    const t = setTimeout(() => setCounterTrigger(true), 200);
    return () => clearTimeout(t);
  }, []);

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

  const barData = majorsList.map((m) => ({
    label: m.name,
    color: m.color,
    value: applicants.filter((a: any) => a.jurusan_1 === m.dbName || a.jurusan1 === m.dbName || a.jurusan_1 === m.name).length,
  }));

  const stats = [
    { label: "Total Pendaftar",   value: totalCount,    sub: "Calon Siswa Baru",          color: "blue",    icon: <Users size={20} /> },
    { label: "Terverifikasi",      value: approvedCount, sub: "Berkas Lolos Validasi",      color: "emerald", icon: <ShieldCheck size={20} /> },
    { label: "Menunggu",           value: pendingCount,  sub: "Perlu Pemeriksaan",          color: "amber",   icon: <Clock size={20} /> },
    { label: "Ditolak / Gugur",    value: rejectedCount, sub: "Tidak Memenuhi Syarat",      color: "rose",    icon: <AlertTriangle size={20} /> },
  ];

  return (
    <div className="space-y-6">
      {/* ── Stats Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            sub={s.sub}
            color={s.color}
            icon={s.icon}
            delay={i}
            trigger={counterTrigger}
          />
        ))}
      </div>

      {/* ── Area Chart + Kuota ──────────────────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
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
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${trendView === v
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-200/30"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-white"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <DashboardAreaChart data={trend.counts} labels={trend.labels} color="#3b82f6" />
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
      </motion.div>

      {/* ── Bar Chart – Distribusi Jurusan ──────────────────────────────────── */}
      <motion.div
        className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase flex items-center gap-2">
              <BarChart2 size={14} className="text-indigo-500" />
              Distribusi Pendaftar per Jurusan
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Jumlah calon siswa berdasarkan pilihan jurusan pertama</p>
          </div>
          <div className="hidden sm:flex items-center flex-wrap gap-x-4 gap-y-1">
            {majorsList.slice(0, 6).map((m) => (
              <div key={m.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color }} />
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
        <DashboardBarChart data={barData} />
      </motion.div>

      {/* ── Recent Applicants + Kuota Progress ──────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Recent Table */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Pendaftar Terbaru</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">7 calon siswa yang baru mendaftar</p>
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
                {applicants.slice(0, 7).map((a: any, idx: number) => (
                  <motion.tr
                    key={a.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.06, duration: 0.35 }}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/3 transition-all"
                  >
                    <td className="py-2.5 pl-2 font-bold text-slate-800 dark:text-white max-w-32.5 truncate">{a.nama}</td>
                    <td className="py-2.5 truncate max-w-27.5 text-slate-500 dark:text-slate-400 font-medium">{a.sekolah_asal || a.sekolahAsal}</td>
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
                  </motion.tr>
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
      </motion.div>
    </div>
  );
}
