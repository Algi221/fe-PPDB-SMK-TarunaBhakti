"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { Settings, RefreshCw } from "lucide-react";
import SecurityPasswordCard from "./components/SecurityPasswordCard";
import StudentSeederCard from "./components/StudentSeederCard";
import SecurityTipsCard from "./components/SecurityTipsCard";

export default function SimulationSettings() {
  const { 
    simulateRegistration, 
    adminToken,
    addToast 
  } = usePPDB();

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-blue-500 dark:text-blue-400" size={32} />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-455">Memuat konfigurasi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in duration-500 text-left pb-16">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="text-blue-500 dark:text-blue-400" size={24} />
          <span>Pengaturan Sistem & Keamanan</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-455 mt-1">
          Perbarui keamanan akun administrator dan kendalikan konfigurasi biaya pendaftaran serta link WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT & CENTER COLUMN: Integration Settings */}
        <div className="lg:col-span-2 space-y-6">
          <SecurityPasswordCard adminToken={adminToken} addToast={addToast} />
          <StudentSeederCard simulateRegistration={simulateRegistration} addToast={addToast} />
        </div>

        {/* RIGHT COLUMN: Panduan & Status Sistem */}
        <div className="space-y-6">
          <SecurityTipsCard />
        </div>
      </div>
    </div>
  );
}
