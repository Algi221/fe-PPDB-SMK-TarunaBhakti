"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Target, CheckCircle2, ArrowRight, Briefcase, GraduationCap, Lightbulb, ShieldCheck } from "lucide-react";
import { DEFAULT_TUJUAN, ProfileTujuanData } from "@/utils/profileDefaults";

export default function TujuanPage() {
  const [data, setData] = useState<ProfileTujuanData>(DEFAULT_TUJUAN);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const BACKEND_URL = typeof window !== "undefined"
          ? `http://${window.location.hostname}:5000`
          : "http://localhost:5000";
        const res = await fetch(`${BACKEND_URL}/api/config`);
        const json = await res.json();
        if (json.success && json.data && json.data.ppdb_profile_tujuan) {
          setData({ ...DEFAULT_TUJUAN, ...json.data.ppdb_profile_tujuan });
        }
      } catch (err) {
        console.error("Gagal memuat profil tujuan:", err);
      }
    };
    fetchConfig();
  }, []);

  const icons = [Briefcase, GraduationCap, Lightbulb, ShieldCheck];

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      <Navbar activePath="/profile/tujuan" />

      {/* Glow decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[25%] w-[500px] h-[350px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-[10%] right-[25%] w-[450px] h-[300px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-6 pt-32 pb-24 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <span>/</span>
          <span>Profile Sekolah</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-sky-400">Tujuan</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-sky-400 text-xs font-bold tracking-wide">
            <Target size={14} />
            <span>Sasaran Strategis Pendidikan</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Tujuan Sekolah <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              SMK Taruna Bhakti
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {data.hero_desc}
          </p>
        </div>

        {/* Grid Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {data.goals.map((g, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-7 shadow-sm hover:shadow-lg hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-sky-400">
                      <Icon size={24} />
                    </div>
                    {g.badge && (
                      <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {g.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {g.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {g.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategic Pillars */}
        {data.pillars && data.pillars.length > 0 && (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-sm">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-6">
              Strategi Pencapaian Tujuan Institusi
            </h2>
            <div className="space-y-4">
              {data.pillars.map((p, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/profile/visi-misi"
            className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Kembali ke Visi & Misi
          </Link>
          <Link
            href="/profile/tenaga-pendidik"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-sky-400 hover:gap-3 transition-all"
          >
            <span>Lanjut: Tenaga Pendidik</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
