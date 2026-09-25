import React from "react";
import { GraduationCap, Calendar, BookOpen } from "lucide-react";

interface ActiveStudentStatsProps {
  stats: {
    total: number;
    currentBatch: number;
    popular: string;
  };
}

export const ActiveStudentStats: React.FC<ActiveStudentStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-linear-to-br from-indigo-500 to-indigo-600 dark:from-indigo-950/60 dark:to-indigo-900/40 border border-indigo-400/20 dark:border-indigo-850/40 rounded-3xl p-6 shadow-sm text-white flex items-center justify-between transition-all duration-300 hover:shadow-md">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Total Siswa Aktif</span>
          <h3 className="text-3xl font-black leading-none">
            {stats.total} <span className="text-xs font-bold text-indigo-200">Siswa</span>
          </h3>
          <p className="text-[10px] text-indigo-150 font-bold mt-1">Gabungan seluruh angkatan terverifikasi</p>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
          <GraduationCap size={24} className="text-indigo-100" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors duration-300">
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-black tracking-widest">
            Periode Terkini (2026-2027)
          </span>
          <h3 className="text-3xl font-black leading-none text-slate-800 dark:text-white">
            {stats.currentBatch} <span className="text-xs font-bold text-slate-400">Siswa</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1">Calon angkatan tahun ini</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30 shrink-0">
          <Calendar size={24} className="text-emerald-600 dark:text-emerald-450" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors duration-300">
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-black tracking-widest">
            Konsentrasi Populer
          </span>
          <h3 className="text-base font-black truncate max-w-50 leading-tight text-slate-800 dark:text-white uppercase tracking-wider">
            {stats.popular}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1">Kompetensi keahlian pendaftar terbanyak</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30 shrink-0">
          <BookOpen size={24} className="text-blue-600 dark:text-blue-450" />
        </div>
      </div>
    </div>
  );
};
