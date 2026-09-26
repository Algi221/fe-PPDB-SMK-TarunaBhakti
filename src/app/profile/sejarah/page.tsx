"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { History, Award, Building, ArrowRight } from "lucide-react";
import { DEFAULT_SEJARAH, ProfileSejarahData } from "@/utils/profileDefaults";

export default function SejarahPage() {
  const [data, setData] = useState<ProfileSejarahData>(DEFAULT_SEJARAH);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const BACKEND_URL = typeof window !== "undefined"
          ? `http://${window.location.hostname}:5000`
          : "http://localhost:5000";
        const res = await fetch(`${BACKEND_URL}/api/config`);
        const json = await res.json();
        if (json.success && json.data && json.data.ppdb_profile_sejarah) {
          setData({ ...DEFAULT_SEJARAH, ...json.data.ppdb_profile_sejarah });
        }
      } catch (err) {
        console.error("Gagal memuat profil sejarah:", err);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      <Navbar activePath="/profile/sejarah" />

      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[350px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-[10%] right-[20%] w-[450px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-6 pt-32 pb-24 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <span>/</span>
          <span>Profile Sekolah</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-sky-400">Sejarah</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-sky-400 text-xs font-bold tracking-wide">
            <History size={14} />
            <span>Rekam Jejak Keunggulan</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {data.hero_title}
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {data.hero_subtitle}
          </p>
        </div>

        {/* Story Intro Card */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/30 dark:shadow-none mb-16 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">
                {data.intro_title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {data.intro_p1}
              </p>
              {data.intro_p2 && (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {data.intro_p2}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-blue-50/70 dark:bg-slate-800/70 border border-blue-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Building className="text-blue-600 dark:text-sky-400 shrink-0" size={24} />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Akreditasi</div>
                  <div className="text-lg font-black text-slate-800 dark:text-white">{data.akreditasi}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <Award className="text-amber-500 shrink-0" size={24} />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Predikat Nasional</div>
                  <div className="text-lg font-black text-slate-800 dark:text-white">{data.predikat_nasional}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Tonggak Sejarah Utama</h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">Langkah demi langkah menuju kemajuan berkelanjutan</p>
          </div>

          <div className="relative border-l-2 border-blue-500/20 dark:border-blue-500/30 ml-4 md:ml-32 space-y-10 pl-6 md:pl-10">
            {data.milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[35px] md:-left-[152px] top-1 flex items-center justify-center">
                  <span className="hidden md:inline-block w-24 text-right pr-4 text-sm font-black text-blue-600 dark:text-sky-400">
                    {m.year}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-sky-400 border-4 border-white dark:border-slate-950 shadow-md group-hover:scale-125 transition-transform" />
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className="inline-block md:hidden text-xs font-extrabold text-blue-600 dark:text-sky-400 mb-1">
                    {m.year}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-2">
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

        {/* Navigation links */}
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/profile/visi-misi"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-sky-400 hover:gap-3 transition-all"
          >
            <span>Lanjut: Visi & Misi Sekolah</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/daftar"
            className="btn-primary-pill text-xs font-extrabold uppercase tracking-wider"
          >
            Daftar PPDB Sekarang
          </Link>
        </div>
      </main>
    </div>
  );
}
