"use client";

import React, { useEffect, useState } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Sun, Moon, LogOut, LayoutDashboard, Users, Settings, Globe, Megaphone, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { adminToken, adminUser, logoutAdmin, wsStatus } = usePPDB();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("ppdb-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    const savedCollapse = localStorage.getItem("ppdb-sidebar-collapsed");
    if (savedCollapse === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const handleToggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    localStorage.setItem("ppdb-sidebar-collapsed", String(nextVal));
  };

  useEffect(() => {
    if (mounted && !adminToken && pathname !== "/dashboard/login") {
      router.push("/dashboard/login");
    }
  }, [adminToken, pathname, router, mounted]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ppdb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ppdb-theme", "light");
    }
  };

  if (!mounted) return null;

  // Don't render sidebar & header on the login page
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  // If loading or unauthorized, show a minimal loading overlay
  if (!adminToken) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-white transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">Memeriksa status otentikasi...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutAdmin();
    router.push("/dashboard/login");
  };

  return (
    <div className="h-screen bg-[#f7f7f7] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className={`${isCollapsed ? "w-20" : "w-64"} sticky top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/40 flex flex-col shrink-0 transition-all duration-300 z-50`}>
        {/* Brand Header */}
        <div className={`p-4 ${isCollapsed ? "flex flex-col items-center gap-3" : "flex items-center justify-between"} border-b border-slate-200/80 dark:border-slate-800/60 min-h-[73px]`}>
          <Link href="/dashboard" className="flex items-center gap-3 group justify-center">
            <img 
              src="/logo_smktb.png" 
              alt="Logo SMK Taruna Bhakti" 
              className="w-9 h-9 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105" 
            />
            {!isCollapsed && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-sm font-black tracking-wider leading-none text-slate-800 dark:text-white uppercase">SMK TB</h2>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-1 block">PPDB Admin Portal</span>
              </div>
            )}
          </Link>
          <button
            onClick={handleToggleCollapse}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 border border-slate-200/50 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all shadow-sm flex items-center justify-center shrink-0"
            title={isCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 ${isCollapsed ? "px-2" : "px-4"} py-6 space-y-1.5 overflow-y-auto`}>
          <Link
            href="/dashboard"
            className={`flex items-center ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
              pathname === "/dashboard"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
            }`}
            title={isCollapsed ? "Ringkasan" : undefined}
          >
            <LayoutDashboard size={18} className="shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Ringkasan</span>}
          </Link>

          <Link
            href="/dashboard/pendaftar"
            className={`flex items-center ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
              pathname === "/dashboard/pendaftar"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
            }`}
            title={isCollapsed ? "Data Calon Siswa" : undefined}
          >
            <Users size={18} className="shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300 text-left">Data Calon Siswa</span>}
          </Link>

          <Link
            href="/dashboard/siswa-aktif"
            className={`flex items-center ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
              pathname === "/dashboard/siswa-aktif"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
            }`}
            title={isCollapsed ? "Siswa Aktif" : undefined}
          >
            <GraduationCap size={18} className="shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300 text-left">Siswa Aktif</span>}
          </Link>

          <Link
            href="/dashboard/informasi"
            className={`flex items-center ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
              pathname === "/dashboard/informasi"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
            }`}
            title={isCollapsed ? "Kelola Informasi" : undefined}
          >
            <Megaphone size={18} className="shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300 text-left">Kelola Informasi</span>}
          </Link>

          <Link
            href="/dashboard/settings"
            className={`flex items-center ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
              pathname === "/dashboard/settings"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
            }`}
            title={isCollapsed ? "Pengaturan" : undefined}
          >
            <Settings size={18} className="shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300 text-left">Pengaturan</span>}
          </Link>
        </nav>

        {/* Sidebar Footer (Admin Profile) */}
        <div className={`p-4 border-t border-slate-200/60 dark:border-slate-800/40 bg-[#f7f7f7]/40 dark:bg-slate-950/20 flex flex-col gap-3 ${isCollapsed ? "items-center" : ""}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <div 
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500/80 to-sky-400/80 flex items-center justify-center font-black text-white shrink-0 shadow-sm"
              title={adminUser?.nama || "Admin TB"}
            >
              {adminUser?.nama ? adminUser.nama.charAt(0).toUpperCase() : "A"}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 animate-in fade-in duration-300">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate leading-snug">{adminUser?.nama || "Admin TB"}</h4>
                <span className="text-[10px] text-slate-400 dark:text-slate-550 font-bold truncate leading-none uppercase tracking-wider block mt-0.5">@{adminUser?.username || "admin_tb"}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full py-2.5 ${isCollapsed ? "px-1.5" : "px-3"} bg-slate-50 hover:bg-rose-500/10 hover:text-rose-600 dark:bg-white/5 dark:hover:bg-rose-500/10 dark:hover:text-rose-300 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200/60 dark:border-white/5 hover:border-rose-500/20`}
            title={isCollapsed ? "Keluar Sesi" : undefined}
          >
            <LogOut size={14} className="shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Keluar Sesi</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Top Header Panel */}
        <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-40 sticky top-0 transition-colors duration-300">
          <h1 className="text-sm font-black text-slate-800 dark:text-white leading-none uppercase tracking-wider">
            {pathname === "/dashboard" 
              ? "Ringkasan Eksekutif" 
              : pathname === "/dashboard/pendaftar" 
              ? "Direktori Calon Siswa" 
              : pathname === "/dashboard/siswa-aktif"
              ? "Daftar Siswa Aktif"
              : pathname === "/dashboard/informasi"
              ? "Kelola Informasi & Pengumuman"
              : "Konfigurasi & Simulasi"}
          </h1>

          <div className="flex items-center gap-3">
            {/* WebSocket Status Indicator */}
            <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 text-xs font-bold transition-colors duration-300">
              <span className={`w-2 h-2 rounded-full ${wsStatus === "CONNECTED" ? "bg-emerald-500 animate-ping" : wsStatus === "CONNECTING" ? "bg-amber-500 animate-pulse" : "bg-rose-500"}`} />
              <span className={`w-2 h-2 rounded-full absolute ${wsStatus === "CONNECTED" ? "bg-emerald-500" : wsStatus === "CONNECTING" ? "bg-amber-500" : "bg-rose-500"}`} />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pl-1.5">
                WS Live: {wsStatus === "CONNECTED" ? "Terkoneksi" : wsStatus === "CONNECTING" ? "Menghubungkan..." : "Terputus"}
              </span>
            </div>

            {/* Dark Mode Toggle Switch */}
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-355 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              title={isDark ? "Mode Terang" : "Mode Gelap"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Open Portal Homepage Link */}
            <Link
              href="/"
              target="_blank"
              className="h-10 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:hover:bg-blue-950/60 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Globe size={14} />
              <span>Beranda</span>
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
