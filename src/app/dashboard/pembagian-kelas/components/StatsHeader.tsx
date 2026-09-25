"use client";

import React from "react";
import { GraduationCap } from "lucide-react";

interface StatsHeaderProps {
  selectedGrade: number;
  selectedMajor: string;
  totalClasses: number;
  totalClassesFilled: number;
}

export default function StatsHeader({
  selectedGrade,
  selectedMajor,
  totalClasses,
  totalClassesFilled,
}: StatsHeaderProps) {
  return (
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        
        {/* Info Box */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-colors duration-300">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100 dark:border-indigo-900/40 shrink-0 shadow-sm">
            <GraduationCap size={22} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase text-slate-800 dark:text-white tracking-wider">Manajemen Pembagian Kelas</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-0.5">SMK Taruna Bhakti · PPDB Portal Kelas</p>
          </div>
        </div>

        {/* Metric 1: Total Classes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-colors duration-300 text-left">
          <span className="text-[9px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-widest">Kelas Terbentuk (Kelas {selectedGrade} {selectedMajor})</span>
          <span className="text-2xl font-black text-slate-800 dark:text-white mt-1">{totalClasses} <span className="text-xs text-slate-455 font-bold">Kelas</span></span>
        </div>

        {/* Metric 2: Filled Classes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-colors duration-300 text-left">
          <span className="text-[9px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-widest">Jumlah Kelas Terisi Siswa</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{totalClassesFilled} <span className="text-xs text-slate-455 font-bold">Terisi</span></span>
        </div>

      </div>
  );
}
