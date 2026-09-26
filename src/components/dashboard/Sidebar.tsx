"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Layers,
  GraduationCap,
  Megaphone,
  Palette,
  Shield,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";

export default function Sidebar({
  isCollapsed,
  handleToggleCollapse,
  isMobileMenuOpen,
  adminUser,
  ppdbLogo,
  ppdbTitle
}: {
  isCollapsed: boolean;
  handleToggleCollapse: () => void;
  isMobileMenuOpen: boolean;
  adminUser: any;
  ppdbLogo: string | null;
  ppdbTitle: string | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  const menuStructure = [
    {
      category: "Manajemen Siswa",
      items: [
        { href: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Ringkasan", exact: true },
        {
          href: "/dashboard/pendaftar",
          icon: <Users size={18} />,
          label: "Data Calon Siswa",
          subItems: [
            { label: "Pendaftar Reguler", href: "/dashboard/pendaftar?tab=active" },
            { label: "Pendaftar Pindahan", href: "/dashboard/pendaftar?tab=transfer" },
            { label: "Kuota & Target", href: "/dashboard/pendaftar?tab=kuota" },
            { label: "Tempat Sampah", href: "/dashboard/pendaftar?tab=trash" }
          ]
        },
        { href: "/dashboard/pembagian-kelas", icon: <Layers size={18} />, label: "Pembagian Kelas" },
        { href: "/dashboard/siswa-aktif", icon: <GraduationCap size={18} />, label: "Siswa Aktif" },
        {
          href: "/dashboard/siswa-aktif?tab=tidak-lancar",
          icon: <AlertCircle size={18} />,
          label: "Riwayat Tidak Lancar"
        }
      ]
    },
    {
      category: "Konten Portal",
      items: [
        { href: "/dashboard/informasi", icon: <Megaphone size={18} />, label: "Kelola Informasi" },
        {
          href: "/dashboard/kelola-ui",
          icon: <Palette size={18} />,
          label: "Kelola UI/Data",
          superAdminOnly: true,
          subItems: [
            { label: "Hero & Kontak", href: "/dashboard/kelola-ui?tab=hero" },
            { label: "Program Keahlian", href: "/dashboard/kelola-ui?tab=majors" },
            { label: "Alur Pendaftaran", href: "/dashboard/kelola-ui?tab=alur" },
            { label: "Form & Panduan", href: "/dashboard/kelola-ui?tab=form" },
            { label: "Bank Sekolah", href: "/dashboard/kelola-ui?tab=bank" },
            { label: "Mitra Industri", href: "/dashboard/kelola-ui?tab=partners" },
            { label: "FAQ", href: "/dashboard/kelola-ui?tab=faq" },
            { label: "Riwayat Perubahan", href: "/dashboard/kelola-ui?tab=revisions" }
          ]
        }
      ]
    },
    {
      category: "Pengaturan Sistem",
      items: [
        { href: "/dashboard/admin", icon: <Shield size={18} />, label: "Manajemen Admin", superAdminOnly: true },
        { href: "/dashboard/settings", icon: <Settings size={18} />, label: "Pengaturan" }
      ]
    }
  ];

  const sectionHeader = (label: string) => (
    <div className="flex items-center py-2 overflow-hidden min-h-[32px]">
      <div className={`flex items-center w-full transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-4 gap-2"}`}>
        <span className={`text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
          isCollapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
        }`}>
          {label}
        </span>
        <div className={`h-px bg-slate-300 dark:bg-slate-700 transition-all duration-300 ${isCollapsed ? "w-8" : "flex-1"}`} />
      </div>
    </div>
  );

  const renderMenuItem = (item: any, delayIndex: number) => {
    const hasSub = !!item.subItems;
    const isOpen = !!openDropdowns[item.href];
    const itemPathname = item.href.split("?")[0];
    const itemTab = new URLSearchParams(item.href.split("?")[1] || "").get("tab");
    const currentTab = searchParams ? searchParams.get("tab") : null;

    const isActive = item.exact
      ? pathname === item.href
      : itemTab
      ? pathname === itemPathname && currentTab === itemTab
      : hasSub
      ? pathname === itemPathname
      : pathname === itemPathname && (!currentTab || currentTab === "active");

    const handleItemClick = (e: React.MouseEvent) => {
      if (hasSub) {
        e.preventDefault();
        if (isCollapsed) {
          handleToggleCollapse();
          setOpenDropdowns((prev) => ({ ...prev, [item.href]: true }));
        } else {
          setOpenDropdowns((prev) => ({ ...prev, [item.href]: !prev[item.href] }));
        }
      }
    };

    return (
      <motion.div
        key={item.href}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delayIndex * 0.05 + 0.1, duration: 0.35 }}
        className="w-full flex flex-col"
      >
        <Link
          href={item.href}
          onClick={handleItemClick}
          className={`flex items-center justify-between rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
            isCollapsed ? "justify-center p-3" : "px-4 py-3"
          } ${
            isActive && (!hasSub || isCollapsed)
              ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
          }`}
          title={isCollapsed ? item.label : undefined}
        >
          <div className="flex items-center min-w-0">
            <span className="shrink-0">{item.icon}</span>
            <span
              className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
                isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
              }`}
            >
              {item.label}
            </span>
          </div>
          {hasSub && !isCollapsed && (
            <ChevronDown
              size={14}
              className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 shrink-0 ml-2 ${
                isOpen ? "rotate-180 text-blue-500" : ""
              }`}
            />
          )}
        </Link>

        {hasSub && (
          <div className="overflow-hidden">
            <AnimatePresence initial={false}>
              {isOpen && !isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="pl-8 pr-2 py-1.5 space-y-1"
                >
                  {item.subItems.map((sub: any) => {
                    const defaultTab = sub.href.includes("pendaftar") ? "active" : sub.href.includes("siswa-aktif") ? "active" : "hero";
                    const urlParams = new URLSearchParams(sub.href.split("?")[1] || "");
                    const tabVal = urlParams.get("tab");
                    const isSubActive =
                      pathname === sub.href.split("?")[0] &&
                      tabVal === (currentTab || defaultTab);

                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`flex items-center gap-2.5 py-2 px-3.5 rounded-xl text-[10px] font-bold tracking-wide uppercase transition-all duration-200 border ${
                          isSubActive
                            ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-slate-200/50 dark:border-slate-700/50 font-black"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSubActive ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      } ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <button
        onClick={handleToggleCollapse}
        className="hidden md:flex absolute top-[24px] -right-4 w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 items-center justify-center transition-all duration-300 shadow-sm z-50 hover:scale-110 cursor-pointer"
        title={isCollapsed ? "Perluas Sidebar" : "Sembunyikan Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`py-4 flex items-center border-b border-slate-300 dark:border-slate-700 min-h-[73px] transition-all duration-300 ${
        isCollapsed ? "justify-center px-0" : "px-5"
      }`}>
        <Link href="/dashboard" className="flex items-center group">
          <img
            src={ppdbLogo || "/logo_smktb.png"}
            alt="Logo Sekolah"
            className="w-9 h-9 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
          <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col min-w-0 ${
            isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3"
          }`}>
            <h2 className="text-sm font-black tracking-wider leading-none text-slate-800 dark:text-white uppercase whitespace-nowrap">
              {ppdbTitle ? ppdbTitle.replace(/^(ppdb\s+)/i, "") : "SMK TB"}
            </h2>
            <span className="text-[10px] text-blue-600 dark:text-amber-400 font-bold uppercase tracking-widest mt-1 block whitespace-nowrap">
              PPDB Admin Portal
            </span>
          </div>
        </Link>
      </div>

      <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto transition-all duration-300 ${
        isCollapsed ? "px-2" : "px-4"
      }`}>
        {(() => {
          let delayIndex = 0;
          return menuStructure.map((section) => (
            <React.Fragment key={section.category}>
              {sectionHeader(section.category)}
              {section.items.map((item) => {
                if (item.superAdminOnly && adminUser?.role !== "superadmin") return null;
                delayIndex++;
                return renderMenuItem(item, delayIndex);
              })}
            </React.Fragment>
          ));
        })()}
      </nav>
    </motion.aside>
  );
}
