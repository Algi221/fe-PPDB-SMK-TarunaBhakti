"use client";

import React from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { SafeImage } from "./SafeImage";

interface LandingNavbarProps {
  isNavbarScrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isDark: boolean;
  toggleDark: () => void;
  ppdbLogo?: string | null;
  ppdbTitle: string;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  isNavbarScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  isDark,
  toggleDark,
  ppdbLogo,
  ppdbTitle
}) => {
  return (
    <>
      {/* FLOATING NAVBAR */}
      <div className="navbar-wrapper">
        <nav className={`navbar ${isNavbarScrolled ? "scrolled" : ""}`}>
          <div className="nav-left">
            <Link href="/" className="logo-container">
              <SafeImage src={ppdbLogo} alt="Logo Sekolah" width={36} height={36} className="w-9 h-9 object-contain" />
              <span className="logo-text font-extrabold">{ppdbTitle}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <a href="#alur" className="btn-nav-link">Alur Pendaftaran</a>
            <a href="#majors" className="btn-nav-link">Jurusan</a>
            <a href="#kemitraan" className="btn-nav-link">Mitra Industri</a>
            <a href="#faq" className="btn-nav-link">FAQ</a>
            <Link href="/forum" className="btn-nav-link">Forum Informasi</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title={isDark ? "Mode Terang" : "Mode Gelap"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/daftar" className="btn-primary-pill hidden! md:inline-flex!">
              Daftar
            </Link>

            {/* Hamburger Button visible only on mobile/tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 z-101 cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Fullscreen Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/98 backdrop-blur-2xl animate-in fade-in duration-300 md:hidden">
          {/* Close Button X in top right */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close Mobile Menu"
          >
            <X size={20} />
          </button>

          {/* Decorative gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col items-center gap-6 text-center p-6 w-full max-w-sm relative z-10">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 mb-6">
              <SafeImage src={ppdbLogo} alt="Logo Sekolah" width={48} height={48} className="w-12 h-12 object-contain" />
              <span className="text-2xl font-black text-slate-800 dark:text-white">{ppdbTitle}</span>
            </Link>

            <a
              href="#alur"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Alur Pendaftaran
            </a>
            <a
              href="#majors"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Jurusan
            </a>
            <a
              href="#kemitraan"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Mitra Industri
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              FAQ
            </a>
            <Link
              href="/forum"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Forum Informasi
            </Link>

            <div className="w-full flex flex-col gap-3 mt-8">
              <Link
                href="/daftar"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 text-center text-sm font-black uppercase tracking-wider rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
              >
                Daftar Sekarang
              </Link>
              <button
                onClick={() => { toggleDark(); setMobileMenuOpen(false); }}
                className="w-full py-4 text-center text-sm font-black uppercase tracking-wider rounded-2xl border border-slate-200 dark:border-slate-700/80 text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
