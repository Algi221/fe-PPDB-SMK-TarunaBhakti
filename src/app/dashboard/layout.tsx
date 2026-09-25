"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SidebarMenuNav from "@/components/dashboard/SidebarMenuNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LogoutModal from "@/components/dashboard/LogoutModal";
import { menuStructure } from "@/components/dashboard/menuStructure";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { adminToken, adminUser, logoutAdmin, wsStatus, ppdbLogo, ppdbTitle } = usePPDB();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (pathname) {
      if (pathname.startsWith("/dashboard/pendaftar")) {
        setOpenDropdowns((prev) => ({ ...prev, "/dashboard/pendaftar": true }));
      } else if (pathname.startsWith("/dashboard/kelola-ui")) {
        setOpenDropdowns((prev) => ({ ...prev, "/dashboard/kelola-ui": true }));
      }
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

  const getTimeoutDuration = () => {
    if (typeof window === "undefined") return 60 * 60 * 1000;
    const saved = localStorage.getItem("ppdb_session_timeout");
    if (!saved) return 60 * 60 * 1000;
    const minutes = parseInt(saved, 10);
    return isNaN(minutes) ? 60 * 60 * 1000 : minutes * 60 * 1000;
  };

  useEffect(() => {
    if (mounted) {
      const token = localStorage.getItem("ppdb_admin_token");
      const lastActive = localStorage.getItem("ppdb_admin_last_active");
      if (token && lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        const limit = getTimeoutDuration();
        if (elapsed > limit) {
          logoutAdmin();
          router.push("/auth/login?expired=true");
          return;
        }
      }
      if (!adminToken) {
        router.push("/auth/login");
      }
    }
  }, [adminToken, mounted]);

  useEffect(() => {
    if (!adminToken) return;
    let timeoutId: NodeJS.Timeout;
    let lastStorageUpdate = Date.now();
    const resetTimer = () => {
      clearTimeout(timeoutId);
      const limit = getTimeoutDuration();
      timeoutId = setTimeout(() => {
        logoutAdmin();
        router.push("/auth/login?expired=true");
      }, limit);
      const now = Date.now();
      if (now - lastStorageUpdate > 10000) {
        localStorage.setItem("ppdb_admin_last_active", now.toString());
        lastStorageUpdate = now;
      }
    };
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    resetTimer();
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    return () => {
      clearTimeout(timeoutId);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [adminToken, pathname]);

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

  const handleLogout = () => {
    setShowUserDropdown(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logoutAdmin();
    setShowLogoutConfirm(false);
    router.push("/auth/login");
  };

  if (!mounted) return null;
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

  const userInitial = adminUser?.nama ? adminUser.nama.charAt(0).toUpperCase() : "A";

  return (
    <div className="h-screen bg-[#f7f7f7] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex font-sans overflow-hidden transition-colors duration-300">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-72"
        } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={handleToggleCollapse}
          className="hidden md:flex absolute top-6 -right-4 w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 items-center justify-center transition-all duration-300 shadow-sm z-50 hover:scale-110 cursor-pointer"
          title={isCollapsed ? "Perluas Sidebar" : "Sembunyikan Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Brand Header */}
        <div className={`py-4 flex items-center border-b border-slate-300 dark:border-slate-700 min-h-18.25 transition-all duration-300 ${
          isCollapsed ? "justify-center px-0" : "px-5"
        }`}>
          <Link href="/dashboard" className="flex items-center group">
            <img
              src={ppdbLogo || "/logo_smktb.png"}
              alt="Logo Sekolah"
              className="w-9 h-9 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col min-w-0 ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-37.5 opacity-100 ml-3"
            }`}>
              <h2 className="text-sm font-black tracking-wider leading-none text-slate-800 dark:text-white uppercase whitespace-nowrap">
                {ppdbTitle ? ppdbTitle.replace(/^(ppdb\s+)/i, '') : "SMK TB"}
              </h2>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-1 block whitespace-nowrap">PPDB Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "px-2" : "px-4"
        }`}>
          <Suspense fallback={<div className="h-40 animate-pulse bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl m-2" />}>
            <SidebarMenuNav
              menuStructure={menuStructure}
              adminUser={adminUser}
              openDropdowns={openDropdowns}
              setOpenDropdowns={setOpenDropdowns}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              pathname={pathname}
            />
          </Suspense>
        </nav>
      </motion.aside>

      {/* ── MAIN PANEL ──────────────────────────────────────────────────────── */}
      <motion.div
        className="flex-1 flex flex-col min-w-0 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Top Header */}
        <DashboardHeader
          pathname={pathname}
          wsStatus={wsStatus}
          isDark={isDark}
          toggleTheme={toggleTheme}
          adminUser={adminUser}
          userInitial={userInitial}
          showUserDropdown={showUserDropdown}
          setShowUserDropdown={setShowUserDropdown}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onLogoutClick={handleLogout}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent scroll-smooth">
          <motion.div
            className="mx-auto max-w-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}
