"use client";

import React from "react";
import { AlertCircle, ArrowRight, Check, Copy, FileText, Upload, X } from "lucide-react";

interface BankTransferTabProps {
  bankConfigList: Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>;
  copied: boolean;
  handleCopy: (text: string) => void;
  manualReceiptBase64: string;
  setManualReceiptBase64: (val: string) => void;
  manualReceiptName: string;
  setManualReceiptName: (val: string) => void;
  handleReceiptFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmOption: (method: string, proof: string) => void;
  isSubmittingReceipt: boolean;
}

export default function BankTransferTab({
  bankConfigList,
  copied,
  handleCopy,
  manualReceiptBase64,
  setManualReceiptBase64,
  manualReceiptName,
  setManualReceiptName,
  handleReceiptFileChange,
  handleConfirmOption,
  isSubmittingReceipt,
}: BankTransferTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-2">
          Langkah Pembayaran Transfer Bank
        </h4>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
          Silakan lakukan transfer ke rekening resmi sekolah berikut sebesar biaya pendaftaran, kemudian unggah foto/file bukti transfer Anda.
        </p>
      </div>

      {/* Warning Limit Pembayaran 24 Jam */}
      <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-250/50 dark:border-amber-900/40 rounded-2xl p-4.5 flex items-start gap-3 text-amber-800 dark:text-amber-300">
        <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="text-[11px] font-bold leading-normal">
          <p className="font-black uppercase tracking-wider mb-0.5">PENTING: Batas Waktu Pembayaran 24 Jam!</p>
          Harap lakukan transfer dan unggah bukti pembayaran dalam waktu 24 jam. Jika melewati batas waktu tersebut, pendaftaran Anda akan otomatis dinyatakan <span className="text-red-500 font-extrabold">Gugur</span> oleh sistem.
        </div>
      </div>

      {/* Premium Bank Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
        {bankConfigList.map((bank, index) => {
          return (
            <div 
              key={index} 
              className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-2xl border border-white/10 w-full transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Elemen Dekoratif */}
              <div className="absolute right-[-10%] top-[-20%] w-48 h-48 rounded-full bg-linear-to-tr from-blue-500/10 to-indigo-500/10 blur-2xl pointer-events-none"></div>
              
              {/* Header Kartu */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Pilihan #{index + 1}</span>
                  <h4 className="text-sm md:text-base font-black tracking-wider uppercase text-slate-100">{bank.bankName || "BANK TRANSFER"}</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-5 rounded bg-amber-400/80 border border-amber-300/35 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-x-1 inset-y-0.5 border border-slate-900/10 grid grid-cols-3 gap-0.5 opacity-40">
                      <div className="border-r border-b border-slate-900/20"></div>
                      <div className="border-r border-b border-slate-900/20"></div>
                      <div className="border-b border-slate-900/20"></div>
                      <div className="border-r border-slate-900/20"></div>
                      <div className="border-r border-slate-900/20"></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nomor Rekening */}
              <div className="space-y-1 mb-6">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400/70">Nomor Rekening</span>
                <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl py-2 px-3 backdrop-blur-sm">
                  <span className="font-mono text-xs md:text-sm font-black tracking-wider text-slate-100 select-all">
                    {bank.accountNumber || "157-00-0174092-2"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bank.accountNumber || "157-00-0174092-2")}
                    className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-slate-350 hover:text-white rounded-lg transition duration-150 active:scale-95 cursor-pointer"
                    title="Salin Nomor Rekening"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {/* Footer Kartu */}
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400/70">Atas Nama (A.N.)</span>
                  <p className="text-[10px] font-extrabold tracking-wide uppercase text-slate-200">
                    {bank.accountHolder || "YAYASAN TARUNA BHAKTI"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Receipt Section */}
      <div className="space-y-3">
        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">
          Unggah Bukti Transfer Pembayaran
        </label>
        
        {/* File Upload Zone / Area */}
        {!manualReceiptBase64 ? (
          <div className="border-2 border-dashed border-slate-250 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl py-10 px-6 text-center transition bg-slate-50/20 dark:bg-slate-950/5 relative group cursor-pointer">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleReceiptFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center gap-2 pointer-events-none transition-transform duration-200 group-hover:scale-102">
              <div className="w-12 h-12 rounded-full bg-blue-55 dark:bg-slate-800/80 flex items-center justify-center text-blue-505 border border-blue-100 dark:border-slate-700/50 mb-1">
                <Upload size={22} className="animate-pulse" />
              </div>
              <p className="text-xs md:text-sm font-black text-slate-755 dark:text-slate-200">
                Pilih atau seret file bukti transfer
              </p>
              <p className="text-[10px] text-slate-400 font-bold">
                JPG, JPEG, PNG, atau PDF (Maksimal 3MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/80 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-850 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 flex items-center justify-center text-blue-550 shrink-0 shadow-sm overflow-hidden relative">
                {manualReceiptBase64.startsWith("data:application/pdf") ? (
                  <FileText size={32} className="text-red-500" />
                ) : (
                  <img src={manualReceiptBase64} alt="Preview Bukti Bayar" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="space-y-0.5 overflow-hidden w-full md:w-auto">
                <p className="text-xs font-black text-slate-750 dark:text-slate-200 truncate max-w-50 md:max-w-75">
                  {manualReceiptName}
                </p>
                <span className="text-[9px] font-black uppercase text-emerald-505 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/35 px-2 py-0.5 rounded-full inline-block">
                  File Siap Diunggah
                </span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setManualReceiptBase64("");
                setManualReceiptName("");
              }}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-105 dark:bg-red-950/40 dark:hover:bg-red-900/30 border border-red-100/60 dark:border-red-900/35 text-red-655 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5 w-full md:w-auto justify-center cursor-pointer"
            >
              <X size={12} />
              Hapus File
            </button>
          </div>
        )}
      </div>

      {/* Submit Action Button */}
      <button
        onClick={() => handleConfirmOption("Transfer Manual", manualReceiptBase64)}
        disabled={!manualReceiptBase64 || isSubmittingReceipt}
        className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs md:text-sm uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-lg disabled:opacity-40 disabled:pointer-events-none transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-4 cursor-pointer"
      >
        {isSubmittingReceipt ? "Mengirim Bukti..." : "Kirim Bukti Pembayaran"}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
