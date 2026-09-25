"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SubItem {
  label: string;
  href: string;
}

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
  superAdminOnly?: boolean;
  subItems?: SubItem[];
}

interface MenuSection {
  category: string;
  items: MenuItem[];
}

interface SidebarMenuNavProps {
  menuStructure: MenuSection[];
  adminUser: { role?: string } | null;
  openDropdowns: Record<string, boolean>;
  setOpenDropdowns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  pathname: string;
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ label, isCollapsed }: { label: string; isCollapsed: boolean }) {
  return (
    <div className="flex items-center py-2 overflow-hidden min-h-[32px]">
      <div className={`flex items-center w-full transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-4 gap-2"}`}>
        <span className={`text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-widest select-none transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
          isCollapsed ? "max-w-0 opacity-0" : "max-w-37.5 opacity-100"
        }`}>
          {label}
        </span>
        <div className={`h-px bg-slate-300 dark:bg-slate-700 transition-all duration-300 ${isCollapsed ? "w-8" : "flex-1"}`} />
      </div>
    </div>
  );
}

// ── Single Menu Item ──────────────────────────────────────────────────────────
function MenuItemRow({
  item,
  delayIndex,
  pathname,
  isCollapsed,
  setIsCollapsed,
  openDropdowns,
  setOpenDropdowns,
}: {
  item: MenuItem;
  delayIndex: number;
  pathname: string;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  openDropdowns: Record<string, boolean>;
  setOpenDropdowns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const searchParams = useSearchParams();
  const hasSub = !!item.subItems;
  const isOpen = !!openDropdowns[item.href];
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + "/");

  const currentTab = searchParams ? searchParams.get("tab") : null;

  const handleItemClick = (e: React.MouseEvent) => {
    if (hasSub) {
      e.preventDefault();
      if (isCollapsed) {
        setIsCollapsed(false);
        localStorage.setItem("ppdb-sidebar-collapsed", "false");
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
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-50 opacity-100 ml-3"
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

      {/* Render submenu items */}
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
                {item.subItems!.map((sub) => {
                  const defaultTab = sub.href.includes("pendaftar") ? "active" : "hero";
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
                          isSubActive ? "bg-blue-500" : "bg-slate-350 dark:bg-slate-650"
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
}

// ── Main SidebarMenuNav ───────────────────────────────────────────────────────
export default function SidebarMenuNav({
  menuStructure,
  adminUser,
  openDropdowns,
  setOpenDropdowns,
  isCollapsed,
  setIsCollapsed,
  pathname,
}: SidebarMenuNavProps) {
  let delayIndex = 0;

  return (
    <>
      {menuStructure.map((section) => (
        <React.Fragment key={section.category}>
          <SectionHeader label={section.category} isCollapsed={isCollapsed} />
          {section.items.map((item) => {
            if (item.superAdminOnly && adminUser?.role !== "superadmin") return null;
            delayIndex++;
            return (
              <MenuItemRow
                key={item.href}
                item={item}
                delayIndex={delayIndex}
                pathname={pathname}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                openDropdowns={openDropdowns}
                setOpenDropdowns={setOpenDropdowns}
              />
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
}
