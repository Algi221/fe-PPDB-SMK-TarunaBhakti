"use client";

import React, { useState } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

// Hooks & Components
import { useAdminSession } from "@/hooks/useAdminSession";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import LogoutModal from "@/components/dashboard/LogoutModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { adminToken, adminUser, logoutAdmin, wsStatus, ppdbLogo, ppdbTitle } = usePPDB();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const {
    mounted,
    isDark,
    toggleTheme,
    isCollapsed,
    handleToggleCollapse,
  } = useAdminSession();

  const handleLogout = () => {
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

  return (
    <div className="h-screen bg-[#f7f7f7] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex font-sans overflow-hidden transition-colors duration-300">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        isCollapsed={isCollapsed}
        handleToggleCollapse={handleToggleCollapse}
        isMobileMenuOpen={isMobileMenuOpen}
        adminUser={adminUser}
        ppdbLogo={ppdbLogo}
        ppdbTitle={ppdbTitle}
      />

      {/* Main Panel */}
      <motion.div
        className="flex-1 flex flex-col min-w-0 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Header Component */}
        <Header
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          pathname={pathname}
          wsStatus={wsStatus}
          isDark={isDark}
          toggleTheme={toggleTheme}
          adminUser={adminUser}
          handleLogout={handleLogout}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent scroll-smooth">
          <motion.div
            className="mx-auto max-w-[1600px]"
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
        showLogoutConfirm={showLogoutConfirm}
        setShowLogoutConfirm={setShowLogoutConfirm}
        confirmLogout={confirmLogout}
      />
    </div>
  );
}
