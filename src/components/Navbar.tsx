"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePPDB } from "@/context/PPDBContext";
import { ChevronDown, Sun, Moon, Menu, X } from "lucide-react";

interface NavbarProps {
  activePath?: string;
}

export const majorsList = [
  { code: "RPL", routeCode: "rpl", title: "Rekayasa Perangkat Lunak" },
  { code: "TJKT", routeCode: "tjkt", title: "Teknik Jaringan Komputer & Telekomunikasi" },
  { code: "DKV", routeCode: "dkv", title: "Desain Komunikasi Visual" },
  { code: "BC", routeCode: "bc", title: "Broadcasting & Perfilman" },
  { code: "ANM", routeCode: "an", title: "Animasi" },
  { code: "TE", routeCode: "te", title: "Teknik Elektronika" },
];

export const profileMenuItems = [
  { title: "Sejarah", href: "/profile/sejarah" },
  { title: "Visi-Misi", href: "/profile/visi-misi" },
  { title: "Tujuan", href: "/profile/tujuan" },
  { title: "Tenaga Pendidik", href: "/profile/tenaga-pendidik" },
];

export default function Navbar({ activePath }: NavbarProps) {
  const { ppdbLogo, ppdbTitle } = usePPDB();
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isJurusanDropdownOpen, setIsJurusanDropdownOpen] = useState(false);
  const [isMobileJurusanOpen, setIsMobileJurusanOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const jurusanDropdownRef = useRef<HTMLDivElement>(null);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const profileDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("ppdb-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

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

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsJurusanDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsJurusanDropdownOpen(false);
    }, 150);
  };

  const handleProfileDropdownEnter = () => {
    if (profileDropdownTimeoutRef.current) clearTimeout(profileDropdownTimeoutRef.current);
    setIsProfileDropdownOpen(true);
  };

  const handleProfileDropdownLeave = () => {
    profileDropdownTimeoutRef.current = setTimeout(() => {
      setIsProfileDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (jurusanDropdownRef.current && !jurusanDropdownRef.current.contains(event.target as Node)) {
        setIsJurusanDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className={`navbar-wrapper z-50 ${isNavbarScrolled ? "nav-scrolled" : "nav-expanded"}`}>
        <nav className={`navbar ${isNavbarScrolled ? "scrolled" : ""}`}>
          <div className="nav-left">
            <Link href="/" className="logo-container">
              <img src={ppdbLogo} alt="Logo Sekolah" className="w-9 h-9 object-contain" />
              <span className="logo-text font-extrabold">{ppdbTitle}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`btn-nav-link ${activePath === "/" ? "text-blue-600 dark:text-sky-400 font-bold" : ""}`}
            >
              Beranda
            </Link>

            {/* Jurusan Dropdown */}
            <div
              ref={jurusanDropdownRef}
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => setIsJurusanDropdownOpen(!isJurusanDropdownOpen)}
                className={`btn-nav-link flex items-center gap-1.5 cursor-pointer transition-all ${
                  isJurusanDropdownOpen || activePath?.startsWith("/jurusan")
                    ? "text-blue-600 dark:text-sky-400 bg-blue-50/50 dark:bg-slate-800/60"
                    : ""
                }`}
                aria-expanded={isJurusanDropdownOpen}
              >
                <span>Jurusan</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 text-slate-500 dark:text-slate-400 ${
                    isJurusanDropdownOpen ? "rotate-180 text-blue-600 dark:text-sky-400" : ""
                  }`}
                />
              </button>

              {isJurusanDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-[280px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/50 p-2.5">
                    <div className="space-y-0.5">
                      {majorsList.map((m) => (
                        <Link
                          key={m.code}
                          href={`/jurusan/${m.routeCode}`}
                          onClick={() => setIsJurusanDropdownOpen(false)}
                          className="block py-2.5 px-3 text-[13.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/70 rounded-xl transition-colors text-left"
                        >
                          {m.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Sekolah Dropdown */}
            <div
              ref={profileDropdownRef}
              className="relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`btn-nav-link flex items-center gap-1.5 cursor-pointer transition-all ${
                  isProfileDropdownOpen || activePath?.startsWith("/profile")
                    ? "text-blue-600 dark:text-sky-400 bg-blue-50/50 dark:bg-slate-800/60"
                    : ""
                }`}
                aria-expanded={isProfileDropdownOpen}
              >
                <span>Profile Sekolah</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 text-slate-500 dark:text-slate-400 ${
                    isProfileDropdownOpen ? "rotate-180 text-blue-600 dark:text-sky-400" : ""
                  }`}
                />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-[220px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/50 p-2.5">
                    <div className="space-y-0.5">
                      {profileMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block py-2.5 px-3 text-[13.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/70 rounded-xl transition-colors text-left"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className={`btn-nav-link ${activePath?.startsWith("/blog") ? "text-blue-600 dark:text-sky-400 font-bold" : ""}`}
            >
              Blog
            </Link>
            <Link
              href="/forum"
              className={`btn-nav-link ${activePath?.startsWith("/forum") ? "text-blue-600 dark:text-sky-400 font-bold" : ""}`}
            >
              Forum Informasi
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title={isDark ? "Mode Terang" : "Mode Gelap"}
              aria-label="Toggle Mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/daftar" className="btn-primary-pill hidden! md:inline-flex!">
              Daftar
            </Link>

            {/* Mobile Hamburger */}
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
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close Mobile Menu"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-6 text-center p-6 w-full max-w-sm relative z-10 max-h-[90vh] overflow-y-auto">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 mb-2">
              <img src={ppdbLogo} alt="Logo Sekolah" className="w-12 h-12 object-contain" />
              <span className="text-2xl font-black text-slate-800 dark:text-white">{ppdbTitle}</span>
            </Link>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Beranda
            </Link>

            {/* Jurusan Accordion in Mobile */}
            <div className="w-full border-b border-slate-100 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => setIsMobileJurusanOpen(!isMobileJurusanOpen)}
                className="w-full flex items-center justify-between text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-sky-400 transition-colors py-3"
              >
                <span>Jurusan</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${
                    isMobileJurusanOpen ? "rotate-180 text-blue-600 dark:text-sky-400" : "text-slate-400"
                  }`}
                />
              </button>

              {isMobileJurusanOpen && (
                <div className="pb-3 pl-3.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150 text-left border-l-2 border-blue-500/20 ml-1 mb-2">
                  {majorsList.map((m) => (
                    <Link
                      key={m.code}
                      href={`/jurusan/${m.routeCode}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[14px] font-medium transition-colors hover:text-blue-600 dark:hover:text-sky-400"
                    >
                      {m.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Sekolah Accordion in Mobile */}
            <div className="w-full border-b border-slate-100 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                className="w-full flex items-center justify-between text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-sky-400 transition-colors py-3"
              >
                <span>Profile Sekolah</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${
                    isMobileProfileOpen ? "rotate-180 text-blue-600 dark:text-sky-400" : "text-slate-400"
                  }`}
                />
              </button>

              {isMobileProfileOpen && (
                <div className="pb-3 pl-3.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150 text-left border-l-2 border-blue-500/20 ml-1 mb-2">
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[14px] font-medium transition-colors hover:text-blue-600 dark:hover:text-sky-400"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Blog
            </Link>

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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
