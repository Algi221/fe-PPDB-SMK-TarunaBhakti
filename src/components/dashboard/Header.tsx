"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, Sun, Moon, ChevronDown, UserCircle, Settings, Globe, LogOut, Search } from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";

export default function Header({
  setIsMobileMenuOpen,
  pathname,
  wsStatus,
  isDark,
  toggleTheme,
  adminUser,
  handleLogout
}: {
  setIsMobileMenuOpen: (val: boolean) => void;
  pathname: string;
  wsStatus: string;
  isDark: boolean;
  toggleTheme: () => void;
  adminUser: any;
  handleLogout: () => void;
}) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = adminUser?.nama ? adminUser.nama.charAt(0).toUpperCase() : "A";

  return (
    <header className="h-16 w-full border-b border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0b1121] flex items-center justify-between px-4 md:px-8 z-40 shrink-0 sticky top-0 transition-colors duration-300">
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
        {/* Search menu input (Ctrl+K) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-400 w-44 md:w-56 transition-all focus-within:ring-1 focus-within:ring-blue-500/50">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari menu (Ctrl+K)"
            className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full"
          />
        </div>

        {/* Dark Mode Moon Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all shadow-xs"
          title={isDark ? "Beralih ke Terang" : "Beralih ke Gelap"}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* User Profile Button */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setShowUserDropdown((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 transition-all text-xs font-semibold shadow-xs"
          >
            {adminUser?.foto_profil ? (
              <img src={adminUser.foto_profil} alt="Profil" className="w-7 h-7 rounded-full object-cover shrink-0" />
            ) : (
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                {userInitial}
              </span>
            )}
            <span className="hidden md:block whitespace-nowrap">
              {adminUser?.nama?.split(" ")[0] || "Admin"}
            </span>
            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-sm shrink-0 overflow-hidden">
                    {adminUser?.foto_profil ? (
                      <img src={adminUser.foto_profil} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      userInitial
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{adminUser?.nama || "Admin TB"}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">@{adminUser?.username || "admin"}</p>
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
                  onClick={() => {
                    setShowUserDropdown(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut size={15} className="shrink-0" />
                  <span className="text-xs font-bold">Keluar Sesi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
