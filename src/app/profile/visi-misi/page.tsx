"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Compass, Target, ArrowRight, Sparkles } from "lucide-react";
import { DEFAULT_VISI_MISI, ProfileVisiMisiData } from "@/utils/profileDefaults";

export default function VisiMisiPage() {
  const [data, setData] = useState<ProfileVisiMisiData>(DEFAULT_VISI_MISI);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const BACKEND_URL = typeof window !== "undefined"
          ? `http://${window.location.hostname}:5000`
          : "http://localhost:5000";
        const res = await fetch(`${BACKEND_URL}/api/config`);
        const json = await res.json();
        if (json.success && json.data && json.data.ppdb_profile_visi_misi) {
          setData({ ...DEFAULT_VISI_MISI, ...json.data.ppdb_profile_visi_misi });
        }
      } catch (err) {
        console.error("Gagal memuat profil visi misi:", err);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      <Navbar activePath="/profile/visi-misi" />

      {/* Glow decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[20%] w-[500px] h-[350px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-[10%] left-[20%] w-[450px] h-[300px] rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-6 pt-32 pb-24 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <span>/</span>
          <span>Profile Sekolah</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-sky-400">Visi-Misi</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-sky-400 text-xs font-bold tracking-wide">
            <Compass size={14} />
            <span>Arah Panduan Masa Depan</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Visi & Misi <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              SMK Taruna Bhakti
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Menjadi acuan arah dalam mendidik insan berkarakter mulia, berkeahlian teknologi mutakhir, dan berdaya saing internasional.
          </p>
        </div>

        {/* VISI CARD */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-500/20 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Compass size={180} />
          </div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-xs">
              <Sparkles size={12} />
              <span>Visi Sekolah</span>
            </div>
            <h2 className="text-xl md:text-3xl font-black leading-snug">
              &quot;{data.visi}&quot;
            </h2>
            {data.visi_desc && (
              <p className="text-xs md:text-sm text-blue-100 leading-relaxed pt-2">
                {data.visi_desc}
              </p>
            )}
          </div>
        </div>

        {/* MISI LIST */}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Target size={12} />
              <span>Langkah Nyata</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Misi Sekolah</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.missions.map((m, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-blue-500/50 transition-all flex gap-4"
              >
                <div className="text-2xl font-black text-blue-600 dark:text-sky-400 shrink-0 select-none">
                  {m.number}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {m.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nav Links */}
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/profile/sejarah"
            className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Kembali ke Sejarah
          </Link>
          <Link
            href="/profile/tujuan"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-sky-400 hover:gap-3 transition-all"
          >
            <span>Lanjut: Tujuan Sekolah</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
