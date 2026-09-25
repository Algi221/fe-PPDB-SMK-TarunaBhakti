"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { GelombangConfig, getGelombangStatus, formatDate } from "./types";

interface GelombangSectionProps {
  schoolPeriod: string;
  gelombangConfig: GelombangConfig;
}

export const GelombangSection: React.FC<GelombangSectionProps> = ({
  schoolPeriod,
  gelombangConfig
}) => {
  return (
    <section id="gelombang" className="py-20 max-w-6xl mx-auto px-6 relative z-10">
      <div className="text-center mb-12">
        <span className="inline-block mb-2 text-blue-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full">
          Jadwal Penerimaan · TP. {schoolPeriod}
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mt-3 mb-3">
          Gelombang Pendaftaran PPDB
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed">
          Perhatikan rentang tanggal pendaftaran di setiap gelombang untuk mengamankan kuota jurusan pilihan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Gelombang 1 Card */}
        {(() => {
          const status = getGelombangStatus(gelombangConfig.gelombang1.start, gelombangConfig.gelombang1.end);
          return (
            <div
              className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border ${
                status.active
                  ? "border-blue-500/30 dark:border-blue-500/20 shadow-blue-500/5"
                  : "border-white/50 dark:border-slate-800"
              } rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
            >
              {status.active && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-blue-500/10 to-transparent pointer-events-none" />
              )}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Periode Pertama
                  </span>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">Gelombang 1</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${status.color}`}
                >
                  {status.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                  {status.label}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-950/40 p-4.5 rounded-2xl border border-slate-150 dark:border-white/5">
                  <Calendar size={18} className="text-blue-500 shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                      Tanggal Pendaftaran
                    </span>
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                      {gelombangConfig.gelombang1.start
                        ? formatDate(gelombangConfig.gelombang1.start)
                        : "Belum diatur"}{" "}
                      -{" "}
                      {gelombangConfig.gelombang1.end
                        ? formatDate(gelombangConfig.gelombang1.end)
                        : "Belum diatur"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Gelombang 2 Card */}
        {(() => {
          const status = getGelombangStatus(gelombangConfig.gelombang2.start, gelombangConfig.gelombang2.end);
          return (
            <div
              className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border ${
                status.active
                  ? "border-blue-500/30 dark:border-blue-500/20 shadow-blue-500/5"
                  : "border-white/50 dark:border-slate-800"
              } rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
            >
              {status.active && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-blue-500/10 to-transparent pointer-events-none" />
              )}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Periode Kedua
                  </span>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">Gelombang 2</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${status.color}`}
                >
                  {status.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                  {status.label}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-950/40 p-4.5 rounded-2xl border border-slate-155 dark:border-white/5">
                  <Calendar size={18} className="text-blue-500 shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                      Tanggal Pendaftaran
                    </span>
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                      {gelombangConfig.gelombang2.start
                        ? formatDate(gelombangConfig.gelombang2.start)
                        : "Belum diatur"}{" "}
                      -{" "}
                      {gelombangConfig.gelombang2.end
                        ? formatDate(gelombangConfig.gelombang2.end)
                        : "Belum diatur"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
};
