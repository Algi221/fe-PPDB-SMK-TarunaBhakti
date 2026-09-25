"use client";

import React from "react";
import Link from "next/link";
import { Sun, Moon, Menu, X, ChevronRight } from "lucide-react";

interface ForumNavbarProps {
  ppdbLogo: string;
  ppdbTitle: string;
  isNavbarScrolled: boolean;
  isDark: boolean;
  toggleDark: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
}

export default function ForumNavbar({
  ppdbLogo,
  ppdbTitle,
  isNavbarScrolled,
  isDark,
  toggleDark,
  mobileMenuOpen,
  setMobileMenuOpen
}: ForumNavbarProps) {
  return (
    <>
      {/* ── FLOATING NAVBAR ── */}
      <div className="navbar-wrapper z-50">
        <nav className={`navbar ${isNavbarScrolled ? "scrolled" : ""}`}>
          <div className="nav-left">
            <Link href="/" className="logo-container">
              <img src={ppdbLogo} alt="Logo Sekolah" className="w-9 h-9 object-contain" />
              <span className="logo-text font-extrabold">{ppdbTitle}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/#alur" className="btn-nav-link">Alur Pendaftaran</Link>
            <Link href="/#majors" className="btn-nav-link">Jurusan</Link>
            <Link href="/#kemitraan" className="btn-nav-link">Mitra Industri</Link>
            <Link href="/#faq" className="btn-nav-link">FAQ</Link>
            <Link href="/forum" className="btn-nav-link" style={{ color: 'var(--color-blue-600, #2563eb)', fontWeight: 700 }}>Forum Informasi</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/daftar" className="btn-primary-pill hidden! md:inline-flex!">
              Daftar
            </Link>

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

      {/* ── MOBILE MENU OVERLAY ── */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 md:hidden flex justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img src={ppdbLogo} alt="Logo Sekolah" className="w-8 h-8 object-contain" />
                  <span className="font-extrabold text-sm text-slate-800 dark:text-white">{ppdbTitle}</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-3 py-6">
                <Link 
                  href="/#alur" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-between"
                >
                  <span>Alur Pendaftaran</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>
                <Link 
                  href="/#majors" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-between"
                >
                  <span>Jurusan</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>
                <Link 
                  href="/#kemitraan" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-between"
                >
                  <span>Mitra Industri</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>
                <Link 
                  href="/#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-between"
                >
                  <span>FAQ</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>
                <Link 
                  href="/forum" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-bold text-sm text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 transition-all flex items-center justify-between"
                >
                  <span>Forum Informasi</span>
                  <ChevronRight size={14} className="text-blue-600 dark:text-blue-400" />
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <Link 
                href="/daftar" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-center"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
