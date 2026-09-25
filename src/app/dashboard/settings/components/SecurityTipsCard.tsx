"use client";

import React from "react";
import { ShieldAlert, Sparkles } from "lucide-react";

export default function SecurityTipsCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-37.5 h-37.5 rounded-full bg-blue-500/5 blur-[50px] pointer-events-none"></div>

      <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4 flex items-center gap-1.5">
        <ShieldAlert size={14} className="text-blue-500 animate-pulse" />
        Keamanan Akun & Tips
      </h4>
      
      <div className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-355 leading-relaxed">
        <p>Jaga keamanan dashboard administrator PPDB dengan mengikuti panduan dasar berikut:</p>
        
        <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="relative">
            <span className="absolute -left-7.75 top-0 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center shadow-md">
              1
            </span>
            <p className="font-extrabold text-slate-800 dark:text-white">Ganti Sandi Berkala</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Lakukan penggantian kata sandi secara rutin setiap 3-6 bulan untuk mencegah akses yang tidak sah.</p>
          </div>
          
          <div className="relative">
            <span className="absolute -left-7.75 top-0 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center shadow-md">
              2
            </span>
            <p className="font-extrabold text-slate-800 dark:text-white">Kombinasi Karakter</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Gunakan kombinasi huruf besar, huruf kecil, angka, dan karakter spesial untuk kekuatan sandi maksimal.</p>
          </div>
          
          <div className="relative">
            <span className="absolute -left-7.75 top-0 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center shadow-md">
              3
            </span>
            <p className="font-extrabold text-slate-800 dark:text-white">Hindari Berbagi Akun</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Pastikan kredensial login disimpan secara aman dan tidak dibagikan ke pihak luar demi menjaga integritas data pendaftar.</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-455 flex items-center gap-1">
            <Sparkles size={11} /> Menggunakan enkripsi satu arah BCrypt di level database.
          </span>
        </div>
      </div>
    </div>
  );
}
