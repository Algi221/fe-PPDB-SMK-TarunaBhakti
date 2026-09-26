"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Users, ShieldCheck } from "lucide-react";
import { DEFAULT_TENAGA_PENDIDIK, ProfileTenagaPendidikData } from "@/utils/profileDefaults";

export default function TenagaPendidikPage() {
  const [data, setData] = useState<ProfileTenagaPendidikData>(DEFAULT_TENAGA_PENDIDIK);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const BACKEND_URL = typeof window !== "undefined"
          ? `http://${window.location.hostname}:5000`
          : "http://localhost:5000";
        const res = await fetch(`${BACKEND_URL}/api/config`);
        const json = await res.json();
        if (json.success && json.data && json.data.ppdb_profile_tenaga_pendidik) {
          setData({ ...DEFAULT_TENAGA_PENDIDIK, ...json.data.ppdb_profile_tenaga_pendidik });
        }
      } catch (err) {
        console.error("Gagal memuat profil tenaga pendidik:", err);
      }
    };
    fetchConfig();
  }, []);

  const filteredStaff = filterCategory === "all" 
    ? data.staff 
    : data.staff.filter(s => s.category === filterCategory);

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      <Navbar activePath="/profile/tenaga-pendidik" />

      {/* Glow decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[20%] w-[500px] h-[350px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-[10%] left-[20%] w-[450px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-6 pt-32 pb-24 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <span>/</span>
          <span>Profile Sekolah</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-sky-400">Tenaga Pendidik</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-sky-400 text-xs font-bold tracking-wide">
            <Users size={14} />
            <span>Pendidik Berpengalaman & Bersertifikasi</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Tenaga Pendidik <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              SMK Taruna Bhakti
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {data.hero_desc}
          </p>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center">
            <div className="text-2xl md:text-3xl font-black text-blue-600 dark:text-sky-400">{data.stats?.sertifikasi || "95%+"}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Tersertifikasi Industri</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center">
            <div className="text-2xl md:text-3xl font-black text-blue-600 dark:text-sky-400">{data.stats?.rasio || "1:18"}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Rasio Guru & Siswa</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center">
            <div className="text-2xl md:text-3xl font-black text-blue-600 dark:text-sky-400">{data.stats?.industri_tamu || "12+"}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Instruktur Industri Tamu</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center">
            <div className="text-2xl md:text-3xl font-black text-blue-600 dark:text-sky-400">{data.stats?.dedikasi || "100%"}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Dedikasi Pembinaan</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {[
            { id: "all", label: "Semua Pendidik" },
            { id: "pimpinan", label: "Pimpinan Sekolah" },
            { id: "produktif", label: "Guru Produktif Kejuruan" },
            { id: "normatif", label: "Guru Umum & Bahasa" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === cat.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staff, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-md bg-gradient-to-br from-blue-500 to-indigo-600">
                    {staff.photo ? (
                      <img
                        src={staff.photo}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full text-white font-black text-base items-center justify-center"
                      style={{ display: staff.photo ? "none" : "flex" }}
                    >
                      {staff.initials}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {staff.name}
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-sky-400 font-semibold mt-0.5">
                      {staff.role}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <ShieldCheck size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{staff.cert}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/profile/tujuan"
            className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Kembali ke Tujuan Sekolah
          </Link>
          <Link
            href="/daftar"
            className="btn-primary-pill text-xs font-extrabold uppercase tracking-wider"
          >
            Daftar Sekarang
          </Link>
        </div>
      </main>
    </div>
  );
}
