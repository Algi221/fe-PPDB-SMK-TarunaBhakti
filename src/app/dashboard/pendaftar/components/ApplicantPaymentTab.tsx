"use client";

import React from "react";
import { FileImage, FileText, Check } from "lucide-react";
import Swal from "sweetalert2";
import { sanitizeUrl, sanitizeSrc } from "@/app/daftar/daftarUtils";
import { Applicant } from "../types";

interface ApplicantPaymentTabProps {
  selectedApplicant: Applicant;
  setSelectedApplicant: React.Dispatch<React.SetStateAction<Applicant | null>>;
  setIsFullscreenImageOpen: (open: boolean) => void;
  updateApplicant: (id: number, data: any) => Promise<any>;
}

export default function ApplicantPaymentTab({
  selectedApplicant,
  setSelectedApplicant,
  setIsFullscreenImageOpen,
  updateApplicant,
}: ApplicantPaymentTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
        <FileImage size={12} className="text-blue-500" /> Status & Bukti Pembayaran
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
          <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Metode Pembayaran</span>
          <span className="text-slate-800 dark:text-white font-extrabold text-sm uppercase">
            {selectedApplicant.metode_pembayaran || "Payment Gateway"}
          </span>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
          <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Status Pembayaran</span>
          <div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                selectedApplicant.payment_status === "Paid"
                  ? "bg-emerald-50 border-emerald-250 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900"
                  : "bg-rose-50 border-rose-250 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900"
              }`}
            >
              {selectedApplicant.payment_status === "Paid" ? "Lunas" : "Belum Lunas"}
            </span>
          </div>
        </div>
      </div>

      {selectedApplicant.payment_status === "Paid" && (
        <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-900/50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-blue-600 dark:text-sky-400 font-black uppercase tracking-widest text-[9px] block">Invoice Resmi Pembayaran</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-455 font-bold mt-1 leading-relaxed">
              Invoice pendaftaran resmi telah diterbitkan dan diverifikasi untuk calon siswa ini. Klik tombol di bawah untuk melihat, mencetak, atau menyimpannya sebagai file PDF.
            </p>
          </div>
          <button
            onClick={() => window.open(`/invoice?nisn=${selectedApplicant.nisn}`, '_blank')}
            className="px-5 py-3 bg-linear-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2 shrink-0 animate-pulse"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak / Unduh Invoice</span>
          </button>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 space-y-4">
        <span className="text-slate-400 dark:text-slate-555 block font-bold uppercase text-[9px] tracking-wider">
          Dokumen Bukti Transfer Manual
        </span>
        {selectedApplicant.bukti_bayar ? (
          <div className="flex flex-col items-center gap-4">
            {selectedApplicant.bukti_bayar.startsWith("data:application/pdf") ? (
              <div className="w-full py-10 bg-slate-100 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center border dark:border-white/5">
                <FileText size={48} className="text-blue-500 mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-355">Dokumen PDF Bukti Transfer</p>
                <a
                  href={sanitizeUrl(selectedApplicant.bukti_bayar)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow animate-bounce"
                >
                  Unduh / Lihat PDF
                </a>
              </div>
            ) : (
              <div className="max-w-sm rounded-xl overflow-hidden border dark:border-white/5 shadow-md">
                <img
                  src={sanitizeSrc(selectedApplicant.bukti_bayar)}
                  alt="Bukti Transfer Manual"
                  className="max-h-64 object-contain mx-auto bg-white rounded-lg cursor-pointer hover:brightness-95 transition-all w-full"
                  onClick={() => setIsFullscreenImageOpen(true)}
                />
              </div>
            )}
            
            {selectedApplicant.payment_status !== "Paid" && (
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: 'Konfirmasi',
                    text: "Apakah Anda yakin ingin memverifikasi bukti pembayaran ini dan menandai Lunas?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya',
                    cancelButtonText: 'Batal'
                  });
                  if (result.isConfirmed) {
                    const res = await updateApplicant(selectedApplicant.id, { payment_status: "Paid" });
                    if (res?.success) {
                      setSelectedApplicant(prev => prev ? { ...prev, payment_status: "Paid" } : null);
                      window.location.href = `/invoice?nisn=${selectedApplicant.nisn}&isAdmin=true`;
                    } else {
                      alert(res?.message || "Gagal memperbarui status pembayaran.");
                    }
                  }
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                <Check size={14} />
                <span>Verifikasi Pembayaran Lunas</span>
              </button>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 italic font-semibold">
            Tidak ada bukti transfer manual yang diunggah oleh pendaftar.
          </div>
        )}
      </div>
    </div>
  );
}
