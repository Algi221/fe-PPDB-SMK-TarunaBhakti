"use client";

import React from "react";
import { User, Check, CreditCard, School, Clock, CheckCircle2, Upload, HelpCircle } from "lucide-react";
import { getMajorDetails } from "../daftarUtils";

interface PaymentSummaryPanelProps {
  submittedCandidate: any;
  activePaymentMethod: string;
  manualReceiptBase64: string;
}

export default function PaymentSummaryPanel({
  submittedCandidate,
  activePaymentMethod,
  manualReceiptBase64,
}: PaymentSummaryPanelProps) {
  const majorDetail = getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1);

  return (
    <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-4xl p-6 relative overflow-hidden">
      <div className="space-y-6">
        {/* Profil Calon Siswa */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200/50 dark:border-slate-800">
          <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg ring-4 ring-blue-500/10">
            <User className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-tight">
            {submittedCandidate?.nama}
          </h4>
          <p className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 mt-1">
            NISN: {submittedCandidate?.nisn}
          </p>
        </div>

        {/* Stepper Vertikal */}
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center border border-emerald-200 dark:border-emerald-900 shadow-sm shrink-0">
              <Check size={14} className="stroke-3" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Informasi Siswa</span>
          </div>

          <div className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950/45 border border-blue-100/50 dark:border-blue-900/40">
            <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <CreditCard size={14} />
            </div>
            <span className="text-xs font-black text-blue-600 dark:text-sky-400">Metode Pembayaran</span>
          </div>

          {activePaymentMethod === "tu" ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0">
                  <School size={14} />
                </div>
                <span className="text-xs font-bold text-slate-450 dark:text-slate-500">Datang ke Sekolah</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0">
                  <Clock size={14} />
                </div>
                <span className="text-xs font-bold text-slate-450 dark:text-slate-500">Menunggu Verifikasi</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-xs font-bold text-slate-450 dark:text-slate-500">Selesai</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                  manualReceiptBase64 
                    ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 text-emerald-500"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                }`}>
                  {manualReceiptBase64 ? <Check size={14} className="stroke-3" /> : <Upload size={14} />}
                </div>
                <span className={`text-xs font-bold ${
                  manualReceiptBase64 
                    ? "text-emerald-500 dark:text-emerald-400" 
                    : "text-slate-400 dark:text-slate-500"
                }`}>
                  Upload Bukti
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0">
                  <Clock size={14} />
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Selesai</span>
              </div>
            </>
          )}
        </div>

        {/* Box Info Pendaftaran */}
        <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/35 dark:border-blue-900/30">
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-sky-400 block mb-3">
            Info Pendaftaran
          </span>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${majorDetail.bg}`}>
              {majorDetail.logoPath ? (
                <img 
                  src={majorDetail.logoPath} 
                  alt={majorDetail.logoText} 
                  className="w-7 h-7 object-contain"
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
              ) : (
                majorDetail.icon
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black text-slate-450 uppercase tracking-wider">Jurusan</p>
              <p className="text-xs font-extrabold text-slate-800 dark:text-white truncate">
                {submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1 || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Bantuan Pembayaran */}
      <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/80">
        <a
          href="https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB%20SMK%20Taruna%20Bhakti,%20saya%20butuh%20bantuan%20terkait%20pembayaran..."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-650 dark:text-sky-400 font-extrabold text-xs hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <HelpCircle size={14} />
          <span>Bantuan Pembayaran</span>
        </a>
      </div>
    </div>
  );
}
