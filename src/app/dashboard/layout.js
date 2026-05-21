"use client";

import React, { useEffect, useState } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const { adminToken, adminUser, logoutAdmin, wsStatus } = usePPDB();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !adminToken && pathname !== "/dashboard/login") {
      router.push("/dashboard/login");
    }
  }, [adminToken, pathname, router, mounted]);

  if (!mounted) return null;

  // Don't render sidebar & header on the login page
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  // If loading or unauthorized, show a minimal loading overlay
  if (!adminToken) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 font-semibold text-sm">Memeriksa status otentikasi...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutAdmin();
    router.push("/dashboard/login");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#161f2e] border-r border-white/5 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-[0_4px_12px_rgba(0,102,255,0.2)]">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wider leading-none text-white uppercase">SMK TB</h2>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1 block">PPDB Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all ${
              pathname === "/dashboard"
                ? "bg-blue-600 text-white shadow-[0_4px_20px_rgba(0,102,255,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Ringkasan
          </Link>

          <Link
            href="/dashboard/pendaftar"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all ${
              pathname === "/dashboard/pendaftar"
                ? "bg-blue-600 text-white shadow-[0_4px_20px_rgba(0,102,255,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Data Calon Siswa
          </Link>

          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all ${
              pathname === "/dashboard/settings"
                ? "bg-blue-600 text-white shadow-[0_4px_20px_rgba(0,102,255,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Pengaturan Simulasi
          </Link>
        </nav>

        {/* Sidebar Footer (Admin Profile) */}
        <div className="p-4 border-t border-white/5 bg-slate-950/20 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center font-bold text-white shrink-0 shadow-md">
              {adminUser?.nama ? adminUser.nama.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate leading-snug">{adminUser?.nama || "Admin TB"}</h4>
              <span className="text-[10px] text-slate-400 font-semibold truncate leading-none uppercase tracking-wider block mt-0.5">@{adminUser?.username || "admin_tb"}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 bg-white/5 hover:bg-rose-500/10 hover:text-rose-300 text-slate-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-rose-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Top Header Panel */}
        <header className="h-16 border-b border-white/5 bg-[#161f2e]/60 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-40 sticky top-0">
          <h1 className="text-lg font-extrabold text-white leading-none">
            {pathname === "/dashboard" ? "Ringkasan Eksekutif" : pathname === "/dashboard/pendaftar" ? "Direktori Calon Siswa" : "Konfigurasi & Simulasi"}
          </h1>

          {/* WebSocket Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/40 border border-white/5 text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${wsStatus === "CONNECTED" ? "bg-emerald-500 animate-ping" : wsStatus === "CONNECTING" ? "bg-amber-500 animate-pulse" : "bg-rose-500"}`} />
              <span className={`w-2 h-2 rounded-full absolute ${wsStatus === "CONNECTED" ? "bg-emerald-500" : wsStatus === "CONNECTING" ? "bg-amber-500" : "bg-rose-500"}`} />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1.5">
                WS Live: {wsStatus === "CONNECTED" ? "Terkoneksi" : wsStatus === "CONNECTING" ? "Menghubungkan..." : "Terputus"}
              </span>
            </div>

            <Link href="/" target="_blank" className="px-3.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/30 rounded-full text-xs font-bold transition-all flex items-center gap-1.5">
              <span>Buka Beranda</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
