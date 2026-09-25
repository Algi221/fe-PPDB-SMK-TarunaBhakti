"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sun, Moon, LogOut, Settings, Globe,
  Menu, ChevronDown, UserCircle
} from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";

interface DashboardHeaderProps {
  pathname: string;
  wsStatus: string;
  isDark: boolean;
  toggleTheme: () => void;
  adminUser: any;
  userInitial: string;
  showUserDropdown: boolean;
  setShowUserDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenMobileMenu: () => void;
  onLogoutClick: () => void;
}

export default function DashboardHeader({
  pathname,
  wsStatus,
  isDark,
  toggleTheme,
  adminUser,
  userInitial,
  showUserDropdown,
  setShowUserDropdown,
  onOpenMobileMenu,
  onLogoutClick
}: DashboardHeaderProps) {
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowUserDropdown]);

  return (
    <motion.header
      className="h-16 border-b border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shrink-0 z-40 sticky top-0 transition-colors duration-300"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
    >
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-1.5 -ml-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          onClick={onOpenMobileMenu}
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <Breadcrumbs pathname={pathname} />
        </div>
      </div>

      <motion.div 
        className="flex items-center gap-2"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        {/* WS Status */}
        <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 text-xs font-bold transition-colors duration-300">
          <span className={`w-2 h-2 rounded-full ${wsStatus === "CONNECTED" ? "bg-emerald-500 animate-ping" : wsStatus === "CONNECTING" ? "bg-amber-500 animate-pulse" : "bg-rose-500"}`} />
          <span className={`w-2 h-2 rounded-full absolute ${wsStatus === "CONNECTED" ? "bg-emerald-500" : wsStatus === "CONNECTING" ? "bg-amber-500" : "bg-rose-500"}`} />
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pl-1.5">
            WS Live: {wsStatus === "CONNECTED" ? "Terkoneksi" : wsStatus === "CONNECTING" ? "Menghubungkan..." : "Terputus"}
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm hover:shadow"
          title={isDark ? "Beralih ke Terang" : "Beralih ke Gelap"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setShowUserDropdown((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-sm overflow-hidden shrink-0">
              {adminUser?.foto_profil ? (
                <img src={adminUser.foto_profil} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                userInitial
              )}
            </div>
            <span className="hidden md:block text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {adminUser?.nama?.split(" ")[0] || "Admin"}
            </span>
            <ChevronDown
              size={13}
              className={`hidden md:block text-slate-400 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-sm shrink-0 overflow-hidden">
                    {adminUser?.foto_profil ? (
                      <img src={adminUser.foto_profil} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      userInitial
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{adminUser?.nama || "Admin TB"}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 font-medium truncate">@{adminUser?.username || "admin"}</p>
                    <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${adminUser?.role === "superadmin" ? "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400" : "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"}`}>
                      {adminUser?.role || "admin"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <UserCircle size={15} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold">Profil Saya</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <Settings size={15} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold">Pengaturan</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <Globe size={15} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold">Lihat Website</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                <button
                  onClick={onLogoutClick}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut size={15} className="shrink-0" />
                  <span className="text-xs font-bold">Keluar Sesi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
}
