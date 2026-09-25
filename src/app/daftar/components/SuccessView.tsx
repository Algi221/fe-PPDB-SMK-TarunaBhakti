"use client";

import React from "react";
import Link from "next/link";
import { Check, AlertCircle, Phone, Printer, Home, CheckCircle2 } from "lucide-react";
import { sanitizeUrl } from "../daftarUtils";
import RegistrationPrintStyles from "./RegistrationPrintStyles";
import PrintableInvoiceSheet from "./PrintableInvoiceSheet";
import { handleResetRegistration } from "../registrationFormReset";

interface SuccessViewProps {
  successData: any;
  setSuccessData: React.Dispatch<React.SetStateAction<any>>;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setWizardStep: React.Dispatch<React.SetStateAction<number>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setSubmittedCandidate: React.Dispatch<React.SetStateAction<any>>;
  ppdbLogo?: string;
  ppdbTitle?: string;
  schoolPeriod: string;
  regCost: number;
  waGroupUrl: string;
}

export default function SuccessView({
  successData,
  setSuccessData,
  setIsSuccess,
  setWizardStep,
  setFormData,
  setSubmittedCandidate,
  ppdbLogo,
  ppdbTitle,
  schoolPeriod,
  regCost,
  waGroupUrl,
}: SuccessViewProps) {
  const isSuccess = true;

    if (!successData) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">Memuat Invoice & Konfirmasi...</p>
        </div>
      );
    }

    const tglDaftarFormatted = new Date(successData.tgl_daftar).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const handleNewRegistration = () => {
      handleResetRegistration({
        setIsSuccess,
        setSuccessData,
        setSubmittedCandidate,
        setWizardStep,
        setFormData,
        schoolPeriod,
      });
    };

    return (
      <div className="ppdb-print-container relative min-h-screen flex flex-col items-center justify-center p-4 lg:p-10 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 print:bg-white print:p-0">
        
        {/* CSS print override style block to hide headers/footers (localhost URL) and fix blank page */}
        <RegistrationPrintStyles />

        {/* Background Glowing Blobs */}
        <div className="bg-glow-container">
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
          <div className="bg-glow bg-glow-3"></div>
        </div>

        {/* MOBILE VIEW (Congrats card matching mockup, only on screen < 1024px) */}
        <div className="block lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 shadow-2xl rounded-3xl p-8 max-w-md w-full text-center relative z-10 print-hide-sidebar">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
            <Check size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Pendaftaran Sukses!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-6 leading-relaxed">
            Terima kasih, <strong>{successData.nama || "Calon Bintang"}</strong>.
            Data pendaftaran Anda telah berhasil direkam di sistem PPDB SMK Taruna Bhakti.
          </p>
          <div className="bg-slate-50/70 dark:bg-slate-950/30 backdrop-blur-sm border border-slate-100 dark:border-slate-800 rounded-xl p-4 mb-6 text-left text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-850">
              <span className="text-slate-400 dark:text-slate-500">NISN:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{successData.nisn}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-850">
              <span className="text-slate-400 dark:text-slate-500">Sekolah Asal:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{successData.sekolah_asal || successData.sekolahAsal || "-"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 dark:text-slate-500">Jurusan Utama:</span>
              <span className="font-bold text-blue-600 dark:text-sky-400">{successData.jurusan_1 || successData.jurusan1 || "-"}</span>
            </div>
          </div>

          {/* Warning box */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900 rounded-2xl p-4.5 mb-6 text-left text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
            <div className="font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle size={14} className="shrink-0" />
              PENTING: Bawa Berkas Fisik!
            </div>
            Calon siswa diimbau untuk datang langsung ke sekretariat PPDB sekolah guna melakukan verifikasi berkas fisik. Mohon persiapkan dan bawa dokumen berikut:
            <ul className="list-disc pl-4.5 mt-1 space-y-0.5 font-semibold">
              <li>Fotokopi Kartu Keluarga (KK)</li>
              <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
              <li>Akta Kelahiran asli &amp; Fotokopi</li>
              <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
              <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
            </ul>
          </div>

          {/* Whatsapp join CTA */}
          {((successData && successData.payment_status === "Paid") || isSuccess) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900 rounded-2xl p-4.5 mb-6 text-center text-xs">
              <p className="font-bold text-blue-800 dark:text-blue-300 mb-2.5">
                Mari Bergabung ke Grup PPDB WhatsApp!
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mb-3.5">
                Dapatkan info berkas fisik, jadwal tes bakat minat, dan pengumuman resmi langsung di ponsel Anda.
              </p>
              <a 
                href={sanitizeUrl(waGroupUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-6 bg-linear-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow shadow-emerald-500/20 transition duration-300"
              >
                <Phone size={14} />
                <span>Gabung Grup WA Pendaftar</span>
              </a>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link href={`/invoice?nisn=${successData.nisn}`} target="_blank" className="w-full flex justify-center items-center py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]">
              Lihat &amp; Cetak Invoice
            </Link>
            <Link href="/" className="w-full flex justify-center items-center py-3.5 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all">
              Kembali ke Beranda
            </Link>
            <button
              type="button"
              onClick={handleNewRegistration}
              className="w-full flex justify-center items-center gap-1.5 py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-blue-200/50 dark:border-blue-800/30"
            >
              Daftar Calon Baru Lainnya
            </button>
          </div>
        </div>

        {/* DESKTOP VIEW (Congrats + Merged Invoice Side-by-Side, screen >= 1024px) */}
        <div className="ppdb-print-content hidden lg:grid grid-cols-12 gap-8 max-w-6xl w-full relative z-10 items-start">
          
          {/* Left Column: Sidebar Stats, Documents checklist and WhatsApp CTA (print:hidden) */}
          <div className="lg:col-span-5 space-y-6 print-hide-sidebar">
            
            {/* Congrats Info Box */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute right-4 top-4 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center mb-4.5 shadow-sm">
                <CheckCircle2 size={28} className="animate-pulse" />
              </div>
              
              <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2 leading-tight">Pendaftaran Sukses!</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-bold">
                Terima kasih, <strong className="text-slate-750 dark:text-white">{successData.nama}</strong>. Data registrasi administrasi Anda telah tersimpan secara resmi di sistem PPDB SMK Taruna Bhakti Depok.
              </p>
            </div>

            {/* Documents Checklist warning Box */}
            <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-250/50 dark:border-amber-900/40 rounded-3xl p-6 text-left space-y-3 shadow-sm">
              <div className="font-black text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5 border-b border-amber-200/50 dark:border-amber-900/20 pb-2">
                <AlertCircle size={14} className="shrink-0" />
                PENTING: BAWA BERKAS FISIK KE SEKOLAH
              </div>
              <p className="text-[10px] text-amber-700/90 dark:text-amber-300/85 leading-relaxed font-bold">
                Harap datang langsung ke loket sekretariat PPDB sekolah untuk verifikasi fisik berkas-berkas pendaftaran berikut:
              </p>
              <ul className="text-[10px] text-amber-805 dark:text-amber-350 font-bold space-y-1 pl-4 list-disc leading-normal">
                <li>Fotokopi Kartu Keluarga (KK)</li>
                <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
                <li>Akta Kelahiran asli &amp; Fotokopi</li>
                <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
                <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
              </ul>
            </div>

            {/* WhatsApp Group card (Only show if payment_status === "Paid" or successfully completed) */}
            {((successData && successData.payment_status === "Paid") || isSuccess) && (
              <div className="bg-blue-50/60 dark:bg-blue-950/15 border border-blue-200/55 dark:border-blue-900/45 rounded-3xl p-6 text-center space-y-3.5 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Phone size={18} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-wide">Mari Bergabung ke Grup WhatsApp</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-1 font-bold">
                    Hubungkan dengan calon pendaftar lainnya dan dapatkan pembaruan informasi seleksi bakat minat.
                  </p>
                </div>
                <a
                  href={sanitizeUrl(waGroupUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center gap-2 py-3 bg-linear-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow shadow-emerald-500/10 transition"
                >
                  <Phone size={12} />
                  Gabung Grup WA Pendaftar
                </a>
              </div>
            )}

            {/* Print and Main Action controls */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-6 space-y-4">
              <button 
                onClick={() => window.print()}
                className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-755 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/15 transition transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <Printer size={14} />
                Cetak Invoice Resmi (PDF)
              </button>

              <Link href="/" className="w-full flex justify-center items-center gap-1.5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider rounded-xl transition">
                <Home size={13} />
                Kembali ke Beranda
              </Link>

              <button
                type="button"
                onClick={handleNewRegistration}
                className="w-full flex justify-center items-center gap-1.5 py-3.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-blue-200/55 dark:border-blue-800/45"
              >
                Daftar Calon Baru Lainnya
              </button>
            </div>

          </div>

          {/* Right Column: Detailed High-Fidelity Printable Invoice Container */}
          <PrintableInvoiceSheet
            successData={successData}
            ppdbLogo={ppdbLogo}
            ppdbTitle={ppdbTitle}
            schoolPeriod={schoolPeriod}
            regCost={regCost}
            tglDaftarFormatted={tglDaftarFormatted}
          />

        </div>

      </div>
    );
}
