"use client";

import React, { useState } from "react";
import { 
  Building, 
  CreditCard, 
  Sparkles,
  School,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight
} from "lucide-react";
import Swal from "sweetalert2";
import { sanitizeSrc, getMajorDetails } from "../daftarUtils";
import PaymentSummaryPanel from "./PaymentSummaryPanel";
import BankTransferTab from "./BankTransferTab";

interface PaymentGateViewProps {
  submittedCandidate: any;
  setShowPaymentGate: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessData: React.Dispatch<React.SetStateAction<any>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  fetchPublicApplicants?: () => Promise<void>;
  addToast?: (title: string, message: string, type: string) => void;
  regCost: number;
  bankConfigList: Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>;
}

export default function PaymentGateView({
  submittedCandidate,
  setShowPaymentGate,
  setIsSuccess,
  setSuccessData,
  setFormData,
  fetchPublicApplicants,
  addToast,
  regCost,
  bankConfigList,
}: PaymentGateViewProps) {
  const [manualReceiptBase64, setManualReceiptBase64] = useState("");
  const [manualReceiptName, setManualReceiptName] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState("transfer");

    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (typeof addToast === "function") {
        addToast("Nomor Rekening Disalin", "Nomor rekening berhasil disalin ke clipboard.", "success");
      }
    };

    const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      if (file.size > 3 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'Ukuran File Terlalu Besar',
          text: "Ukuran bukti pembayaran maksimal adalah 3MB!",
          confirmButtonColor: '#3b82f6',
          customClass: {
            popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
            confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
            title: 'text-base font-extrabold text-slate-850 dark:text-white'
          }
        });
        return;
      }
      
      const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      if (!allowed.includes(file.type)) {
        Swal.fire({
          icon: 'warning',
          title: 'Format File Tidak Sesuai',
          text: "Format file harus JPG, PNG, atau PDF!",
          confirmButtonColor: '#3b82f6',
          customClass: {
            popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
            confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
            title: 'text-base font-extrabold text-slate-850 dark:text-white'
          }
        });
        return;
      }
      
      setManualReceiptName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setManualReceiptBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    };

    const handleConfirmOption = async (metode: string, receiptBase64: string = "") => {
      setIsSubmittingReceipt(true);
      try {
        const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
        const res = await fetch(`${BACKEND_URL}/api/payment/confirm-payment-option`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nisn: submittedCandidate.nisn,
            bukti_bayar: receiptBase64 || null,
            metode_pembayaran: metode
          })
        });
        const data = await res.json();
        if (data.success) {
          if (typeof window !== "undefined") {
            localStorage.removeItem('ppdb_active_checkout');
            localStorage.setItem('ppdb_registration_success', JSON.stringify({
              nisn: submittedCandidate.nisn,
              success: true,
              successData: data.data
            }));
          }
          setShowPaymentGate(false);
          setFormData(prev => ({ ...prev, nisn: submittedCandidate.nisn }));
          setSuccessData(data.data);
          setIsSuccess(true);
          fetchPublicApplicants?.();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Konfirmasi Gagal',
            text: "Gagal mengonfirmasi pembayaran: " + data.message,
            confirmButtonColor: '#3b82f6',
            customClass: {
              popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
              confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
              title: 'text-base font-extrabold text-slate-850 dark:text-white'
            }
          });
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: err.message,
          confirmButtonColor: '#3b82f6',
          customClass: {
            popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
            confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
            title: 'text-base font-extrabold text-slate-850 dark:text-white'
          }
        });
      } finally {
        setIsSubmittingReceipt(false);
      }
    };

    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 lg:p-10">
        {/* Background Glowing Blobs */}
        <div className="bg-glow-container">
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
          <div className="bg-glow bg-glow-3"></div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem] p-6 md:p-10 lg:p-12 max-w-7xl w-full relative z-10 animate-in fade-in zoom-in duration-300">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Grid Layout: Left Side (Billing Summary), Right Side (Payment Options) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Side: Summary Panel (Col Span 4) */}
            <PaymentSummaryPanel
              submittedCandidate={submittedCandidate}
              activePaymentMethod={activePaymentMethod}
              manualReceiptBase64={manualReceiptBase64}
            />

            {/* Right Side: Payment Form Selection (Col Span 8) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="text-left space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
                
                {/* Pengantar Formal */}
                <div className="space-y-1 bg-linear-to-r from-blue-50/50 to-transparent dark:from-blue-950/10 p-4 rounded-2xl border-l-4 border-blue-600">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                    Penyelesaian Pembayaran Formulir
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                    Harap selesaikan pembayaran biaya pendaftaran untuk melanjutkan proses verifikasi dokumen administrasi Anda di SMK Taruna Bhakti.
                  </p>
                </div>

                {/* Billing Summary Box */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
                  <div className="absolute right-6 top-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <Sparkles size={120} className="text-blue-600" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500">Jumlah Tagihan</span>
                      <h3 className="text-2xl font-black text-blue-600 dark:text-sky-400 mt-0.5">
                        Rp {regCost.toLocaleString("id-ID")}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/35 dark:border-blue-900/30 px-4 py-2 rounded-2xl shrink-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).bg}`}>
                        {getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).logoPath ? (
                          <img 
                            src={getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).logoPath} 
                            alt={getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).logoText} 
                            className="w-5 h-5 object-contain"
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).icon
                        )}
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-455 uppercase tracking-widest block leading-none">Pilihan Jurusan</span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white uppercase">
                          {submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1 || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-600 dark:text-slate-350">
                    <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/10 px-4 py-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
                      <span className="text-slate-400 dark:text-slate-500">Nama Lengkap:</span>
                      <span className="text-slate-850 dark:text-white uppercase truncate max-w-37.5">{submittedCandidate?.nama}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/10 px-4 py-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
                      <span className="text-slate-400 dark:text-slate-500">NISN Pendaftar:</span>
                      <span className="text-slate-850 dark:text-white font-mono tracking-wider">{submittedCandidate?.nisn}</span>
                    </div>
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 rounded-2xl max-w-md">
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod("transfer")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activePaymentMethod === "transfer"
                        ? "bg-white dark:bg-slate-900 text-blue-650 dark:text-sky-400 shadow-sm border border-slate-200/40 dark:border-slate-800"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-250"
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Transfer Bank (Online)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod("tu")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activePaymentMethod === "tu"
                        ? "bg-white dark:bg-slate-900 text-blue-650 dark:text-sky-400 shadow-sm border border-slate-200/40 dark:border-slate-800"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-250"
                    }`}
                  >
                    <Building size={14} />
                    <span>Bayar di TU (Offline)</span>
                  </button>
                </div>

                {activePaymentMethod === "transfer" ? (
                  <BankTransferTab
                    bankConfigList={bankConfigList}
                    copied={copied}
                    handleCopy={handleCopy}
                    manualReceiptBase64={manualReceiptBase64}
                    setManualReceiptBase64={setManualReceiptBase64}
                    manualReceiptName={manualReceiptName}
                    setManualReceiptName={setManualReceiptName}
                    handleReceiptFileChange={handleReceiptFileChange}
                    handleConfirmOption={handleConfirmOption}
                    isSubmittingReceipt={isSubmittingReceipt}
                  />
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-2">
                        Langkah Pembayaran Langsung ke TU Sekolah
                      </h4>
                      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                        Silakan datang langsung ke loket Tata Usaha (TU) SMK Taruna Bhakti untuk melakukan pembayaran biaya pendaftaran formulir secara tunai.
                      </p>
                    </div>

                    {/* Himbauan dan Checklist Dokumen */}
                    <div className="bg-blue-50/60 dark:bg-blue-950/15 border border-blue-200/55 dark:border-blue-900/40 rounded-3xl p-6 text-left space-y-3.5 shadow-sm">
                      <div className="font-black text-xs uppercase tracking-wider text-blue-800 dark:text-sky-400 flex items-center gap-1.5 border-b border-blue-200/50 dark:border-blue-900/20 pb-2">
                        <FileText size={14} className="shrink-0" />
                        PENTING: BAWA BERKAS PERSYARATAN DI BAWAH INI!
                      </div>
                      <p className="text-[11px] text-slate-605 dark:text-slate-350 leading-relaxed font-bold">
                        Calon siswa diimbau untuk langsung membawa surat-surat/dokumen berikut saat melakukan pembayaran di sekolah guna mempercepat verifikasi fisik berkas:
                      </p>
                      <ul className="text-[11px] text-slate-700 dark:text-slate-200 font-bold space-y-1.5 pl-4.5 list-disc leading-normal">
                        <li>Fotokopi Kartu Keluarga (KK)</li>
                        <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
                        <li>Akta Kelahiran asli &amp; Fotokopi</li>
                        <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
                        <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
                      </ul>
                    </div>

                    {/* Submit Action Button */}
                    <button
                      onClick={() => handleConfirmOption("Bayar di Sekolah", "")}
                      disabled={isSubmittingReceipt}
                      className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs md:text-sm uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-lg disabled:opacity-40 disabled:pointer-events-none transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-4 cursor-pointer"
                    >
                      {isSubmittingReceipt ? "Memproses..." : "Konfirmasi Pembayaran di TU & Daftar"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
