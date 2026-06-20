"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sun, Moon, LogOut, LayoutDashboard, Users, Settings, Globe, Megaphone, GraduationCap, ChevronLeft, ChevronRight, Palette, Layers, Shield, Menu } from "lucide-react";

function Breadcrumbs({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  const paths = pathname.split('/').filter(p => p);
  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    admin: "users",
    pendaftar: "pendaftar",
    "siswa-aktif": "siswa-aktif",
    informasi: "informasi",
    "kelola-ui": "kelola-ui",
    "pembagian-kelas": "pembagian-kelas",
    settings: "settings"
  };

  const breadcrumbs: { label: string; href: string }[] = [];
  paths.forEach((path, idx) => {
    const label = labelMap[path] || path;
    const href = '/' + paths.slice(0, idx + 1).join('/');
    breadcrumbs.push({ label, href });
  });

  if (pathname === "/dashboard/admin" && activeTab === "trash") {
    breadcrumbs.push({ label: "trashed", href: "/dashboard/admin?tab=trash" });
  } else if (pathname === "/dashboard/pendaftar" && activeTab === "trash") {
    breadcrumbs.push({ label: "trashed", href: "/dashboard/pendaftar?tab=trash" });
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide select-none">
      {breadcrumbs.map((bc, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-300 dark:text-slate-700">&gt;</span>}
            {isLast ? (
              <span className="text-slate-650 dark:text-slate-300 font-semibold">{bc.label}</span>
            ) : (
              <Link href={bc.href} className="hover:text-slate-650 dark:hover:text-slate-350 transition-colors">
                {bc.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { adminToken, adminUser, logoutAdmin, wsStatus } = usePPDB();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (pathname === "/dashboard/login") {
      setShowLogoutConfirm(false);
    }
  }, [pathname]);

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
    if (mounted) {
      const token = localStorage.getItem("ppdb_admin_token");
      const lastActive = localStorage.getItem("ppdb_admin_last_active");
      if (token && lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        if (elapsed > 60 * 60 * 1000) { // 1 hour
          logoutAdmin();
          router.push("/dashboard/login?expired=true");
          return;
        }
      }
      if (!adminToken) {
        router.push("/dashboard/login");
      }
    }
  }, [adminToken, mounted, router, logoutAdmin]);

  // Inactivity timeout of 1 hour (60 minutes)
  useEffect(() => {
    if (!adminToken || pathname === "/dashboard/login") return;

    let timeoutId: NodeJS.Timeout;
    let lastStorageUpdate = Date.now();

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logoutAdmin();
        router.push("/dashboard/login?expired=true");
      }, 60 * 60 * 1000); // 1 hour (60 minutes)

      const now = Date.now();
      if (now - lastStorageUpdate > 10000) { // Update localStorage at most once every 10 seconds
        localStorage.setItem("ppdb_admin_last_active", now.toString());
        lastStorageUpdate = now;
      }
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    // Set initial timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [adminToken, pathname, router, logoutAdmin]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ppdb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ppdb-theme", "light");
    }
  };

  if (!mounted) return null;

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

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
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logoutAdmin();
    setShowLogoutConfirm(false);
    router.push("/dashboard/login");
  };

  return (
    <div className="h-screen bg-[#f7f7f7] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar Navigation */}
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      } ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Toggle Collapse Button (Desktop Only) */}
        <button
          onClick={handleToggleCollapse}
          className="hidden md:flex absolute top-[24px] -right-4 w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 items-center justify-center transition-all duration-300 shadow-sm z-50 hover:scale-110 cursor-pointer"
          title={isCollapsed ? "Perluas Sidebar" : "Sembunyikan Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Brand Header */}
        <div className={`py-4 flex items-center border-b border-slate-300 dark:border-slate-700 min-h-[73px] transition-all duration-300 ${
          isCollapsed ? "px-[22px]" : "px-4"
        }`}>
          <Link href="/dashboard" className="flex items-center group">
            <img
              src="/logo_smktb.png"
              alt="Logo SMK Taruna Bhakti"
              className="w-9 h-9 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col min-w-0 ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3"
            }`}>
              <h2 className="text-sm font-black tracking-wider leading-none text-slate-800 dark:text-white uppercase whitespace-nowrap">SMK TB</h2>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-1 block whitespace-nowrap">PPDB Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "px-2" : "px-4"
        }`}>
          {/* KATEGORI 1: MANAJEMEN SISWA */}
          <div className="flex items-center py-2 overflow-hidden min-h-[32px]">
            <div className={`flex items-center w-full transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-4 gap-2"}`}>
              <span className={`text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-widest select-none transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
                isCollapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
              }`}>
                Manajemen Siswa
              </span>
              <div className={`h-px bg-slate-300 dark:bg-slate-700 transition-all duration-300 ${isCollapsed ? "w-8" : "flex-1"}`} />
            </div>
          </div>
          
          <Link
            href="/dashboard"
            className={`flex items-center rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              isCollapsed ? "px-[31px] py-3" : "px-4 py-3"
            } ${pathname === "/dashboard"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            title={isCollapsed ? "Ringkasan" : undefined}
          >
            <LayoutDashboard size={18} className="shrink-0" />
            <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            }`}>
              Ringkasan
            </span>
          </Link>
 
          <Link
            href="/dashboard/pendaftar"
            className={`flex items-center rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              isCollapsed ? "px-[31px] py-3" : "px-4 py-3"
            } ${pathname === "/dashboard/pendaftar"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            title={isCollapsed ? "Data Calon Siswa" : undefined}
          >
            <Users size={18} className="shrink-0" />
            <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            }`}>
              Data Calon Siswa
            </span>
          </Link>

          <Link
            href="/dashboard/pembagian-kelas"
            className={`flex items-center rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              isCollapsed ? "px-[31px] py-3" : "px-4 py-3"
            } ${pathname === "/dashboard/pembagian-kelas"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            title={isCollapsed ? "Pembagian Kelas" : undefined}
          >
            <Layers size={18} className="shrink-0" />
            <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            }`}>
              Pembagian Kelas
            </span>
          </Link>
 
          <Link
            href="/dashboard/siswa-aktif"
            className={`flex items-center rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              isCollapsed ? "px-[31px] py-3" : "px-4 py-3"
            } ${pathname === "/dashboard/siswa-aktif"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            title={isCollapsed ? "Siswa Aktif" : undefined}
          >
            <GraduationCap size={18} className="shrink-0" />
            <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            }`}>
              Siswa Aktif
            </span>
          </Link>

          {/* KATEGORI 2: KONTEN PORTAL */}
          <div className="flex items-center py-2 overflow-hidden min-h-[32px]">
            <div className={`flex items-center w-full transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-4 gap-2"}`}>
              <span className={`text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest select-none transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
                isCollapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
              }`}>
                Konten Portal
              </span>
              <div className={`h-px bg-slate-300 dark:bg-slate-700 transition-all duration-300 ${isCollapsed ? "w-8" : "flex-1"}`} />
            </div>
          </div>
 
          <Link
            href="/dashboard/informasi"
            className={`flex items-center rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              isCollapsed ? "px-[31px] py-3" : "px-4 py-3"
            } ${pathname === "/dashboard/informasi"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            title={isCollapsed ? "Kelola Informasi" : undefined}
          >
            <Megaphone size={18} className="shrink-0" />
            <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            }`}>
              Kelola Informasi
            </span>
          </Link>
 
          <Link
            href="/dashboard/kelola-ui"
            className={`flex items-center rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              isCollapsed ? "px-[31px] py-3" : "px-4 py-3"
            } ${pathname === "/dashboard/kelola-ui"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            title={isCollapsed ? "Kelola User Interface" : undefined}
          >
            <Palette size={18} className="shrink-0" />
            <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            }`}>
              Kelola UI
            </span>
          </Link>

          {/* KATEGORI 3: SISTEM & PENGATURAN */}
          <div className="flex items-center py-2 overflow-hidden min-h-[32px]">
            <div className={`flex items-center w-full transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-4 gap-2"}`}>
              <span className={`text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-widest select-none transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
                isCollapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
              }`}>
                Pengaturan Sistem
              </span>
              <div className={`h-px bg-slate-300 dark:bg-slate-700 transition-all duration-300 ${isCollapsed ? "w-8" : "flex-1"}`} />
            </div>
          </div>
 
          {adminUser?.role === 'superadmin' && (
            <Link
              href="/dashboard/admin"
              className={`flex items-center rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                isCollapsed ? "px-[31px] py-3" : "px-4 py-3"
              } ${pathname === "/dashboard/admin"
                  ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              title={isCollapsed ? "Manajemen Admin" : undefined}
            >
              <Shield size={18} className="shrink-0" />
              <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
                isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
              }`}>
                Manajemen Admin
              </span>
            </Link>
          )}
 
          <Link
            href="/dashboard/settings"
            className={`flex items-center rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              isCollapsed ? "px-[31px] py-3" : "px-4 py-3"
            } ${pathname === "/dashboard/settings"
                ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            title={isCollapsed ? "Pengaturan" : undefined}
          >
            <Settings size={18} className="shrink-0" />
            <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            }`}>
              Pengaturan
            </span>
          </Link>
        </nav>

        {/* Sidebar Footer (Admin Profile) */}
        <div className={`py-4 border-t border-slate-300 dark:border-slate-700 bg-[#f7f7f7]/40 dark:bg-slate-950/20 flex flex-col gap-3 transition-all duration-300 ${
          isCollapsed ? "px-[20px] items-center" : "px-4 items-stretch"
        }`}>
          <div className="flex items-center transition-all duration-300 w-full">
            <div
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-750 dark:text-slate-200 shrink-0 shadow-sm"
              title={adminUser?.nama || "Admin TB"}
            >
              {adminUser?.nama ? adminUser.nama.charAt(0).toUpperCase() : "A"}
            </div>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col min-w-0 ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3"
            }`}>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate leading-snug whitespace-nowrap">{adminUser?.nama || "Admin TB"}</h4>
              <span className="text-[10px] text-slate-400 dark:text-slate-550 font-bold truncate leading-none uppercase tracking-wider block mt-0.5 whitespace-nowrap">@{adminUser?.username || "admin_tb"}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`py-2.5 bg-slate-50 hover:bg-rose-500/10 hover:text-rose-600 dark:bg-white/5 dark:hover:bg-rose-500/10 dark:hover:text-rose-300 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center border border-slate-200/60 dark:border-white/5 hover:border-rose-500/20 ${
              isCollapsed ? "w-10 h-10 px-0" : "w-full px-3"
            }`}
            title={isCollapsed ? "Keluar Sesi" : undefined}
          >
            <LogOut size={14} className="shrink-0" />
            <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-2"
            }`}>
              Keluar Sesi
            </span>
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Top Header Panel */}
        <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shrink-0 z-40 sticky top-0 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1.5 -ml-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <Suspense fallback={<div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />}>
                <Breadcrumbs pathname={pathname} />
              </Suspense>
            </div>
          </div>

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
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm hover:shadow"
              title={isDark ? "Beralih ke Terang" : "Beralih ke Gelap"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="h-6 w-px bg-slate-200/80 dark:bg-slate-800/60 mx-1"></div>
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2 tracking-wide uppercase"
            >
              <Globe size={14} />
              <span>Lihat Web</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent scroll-smooth">
          <div className="mx-auto max-w-[1600px] animate-in slide-in-from-bottom-4 duration-500 fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center max-w-sm w-full mx-4 backdrop-blur-xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center text-rose-550 dark:text-rose-500 border border-rose-100 dark:border-rose-900/40 shadow-inner">
              <LogOut size={28} className="animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Konfirmasi Keluar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Apakah Anda yakin ingin keluar dari sesi admin portal PPDB? Anda perlu memasukkan kredensial lagi untuk masuk.
              </p>
            </div>
            
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 py-3 bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow shadow-rose-500/20 hover:shadow-rose-500/40 transition-all cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
