"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check, Upload, ArrowLeft, Home, Monitor, Code, Palette, Film, Cpu, Sun, Moon, CreditCard, ShieldCheck, Sparkles, X } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";

export default function DaftarPage() {
  const { registerApplicant, checkPaymentStatus, fetchPublicApplicants } = usePPDB();
  const [wizardStep, setWizardStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    nisn: "",
    nik: "",
    tempatLahir: "",
    tglLahir: "",
    jenisKelamin: "",
    agama: "",
    kewarganegaraan: "",
    alamat: "",
    rtRw: "",
    kelurahan: "",
    kecamatan: "",
    kodePos: "",
    whatsapp: "",
    email: "",
    tinggalDengan: "",
    transportasi: "",
    tinggiBadan: "",
    beratBadan: "",
    jarakSekolah: "",
    jarakKm: "",
    waktuJam: "",
    waktuMenit: "",
    jumlahSaudara: "",
    golonganDarah: "",
    penyakitDiderita: "",
    kebutuhanKhusus: [],
    jenisPrestasi: [],
    tingkatPrestasi: [],
    uraianPrestasi: "",
    tahunPrestasi: "",
    penyelenggara: "",
    jenisBeasiswa: [],
    uraianBeasiswa: "",
    tahunMulaiBeasiswa: "",
    tahunSelesaiBeasiswa: "",
    namaAyah: "",
    tempatLahirAyah: "",
    tglLahirAyah: "",
    agamaAyah: "",
    kewarganegaraanAyah: "WNI",
    pendidikanAyah: "",
    pekerjaanAyah: "",
    penghasilanAyah: "",
    alamatAyah: "",
    rtrwAyah: "",
    kelurahanAyah: "",
    kecamatanAyah: "",
    kodePosAyah: "",
    statusAyah: "Masih Hidup",
    namaIbu: "",
    tempatLahirIbu: "",
    tglLahirIbu: "",
    agamaIbu: "",
    kewarganegaraanIbu: "WNI",
    pendidikanIbu: "",
    pekerjaanIbu: "",
    penghasilanIbu: "",
    alamatIbu: "",
    rtrwIbu: "",
    kelurahanIbu: "",
    kecamatanIbu: "",
    kodePosIbu: "",
    statusIbu: "Masih Hidup",
    namaWali: "",
    tempatLahirWali: "",
    tglLahirWali: "",
    agamaWali: "",
    kewarganegaraanWali: "WNI",
    pendidikanWali: "",
    pekerjaanWali: "",
    penghasilanWali: "",
    alamatWali: "",
    rtrwWali: "",
    kelurahanWali: "",
    kecamatanWali: "",
    kodePosWali: "",
    statusWali: "Masih Hidup",
    teleponOrtu: "",
    sekolahAsal: "",
    tglLulus: "",
    noIjazah: "",
    noSKHUN: "",
    noPesertaUN: "",
    lamaBelajar: "",
    pindahanDari: "",
    alasanPindah: "",
    diterimaKelas: "",
    diterimaTanggal: "",
    jurusan1: "",
    jurusan2: "",
    hobi: [],
    citaCita: "",
    nilaiUSTeori: "",
    nilaiUSPraktik: "",
    nilaiMuatanLokal: "",
    alasanMemilih: "",
    citaCitaSetelahLulus: "",
    pelajaranDisenangi: "",
    punyaKPS: "Tidak",
    noKPS: "",
    punyaKIP: "Tidak",
    noKIP: "",
    alasanDisenangi: "",
    kesulitanBelajar: "",
    perkelahian: "",
    ketPerkelahian: "",
    narkoba: "",
    ketNarkoba: "",
    pelanggaranLain: "",
    ketPelanggaranLain: "",
    janjiTaat: "",
    janjiSanksi: "",
    janjiAkrab: "",
    janjiBelajar: "",
    janjiNamaBaik: "",
    deklarasi: false,
    periode: "2026-2027",
    berkasKKOk: false,
    berkasKKFile: null,
    berkasKKName: "",
    berkasKKBase64: "",
    berkasKTPOk: false,
    berkasKTPFile: null,
    berkasKTPName: "",
    berkasKTPBase64: "",
    berkasAktaOk: false,
    berkasAktaFile: null,
    berkasAktaName: "",
    berkasAktaBase64: "",
    berkasIjazahOk: false,
    berkasIjazahFile: null,
    berkasIjazahName: "",
    berkasIjazahBase64: "",
    berkasFotoOk: false,
    berkasFotoFile: null,
    berkasFotoName: "",
    berkasFotoBase64: ""
  });

  // Billing and Payment States
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] = useState(null);
  const [paymentPolling, setPaymentPolling] = useState(false);
  const snapScriptLoaded = useRef(false);
  const [paymentError, setPaymentError] = useState(null);

  // Dark Mode
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ppdb-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      // eslint-disable-next-line
      setIsDark(true);
    }
  }, []);

  // Read URL query params for payment success/failure redirects
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      const nisn = params.get("nisn");
      if (payment === "success" && nisn) {
        const checkStatus = async () => {
          try {
            const res = await checkPaymentStatus(nisn);
            if (res && res.success && res.payment_status === "Paid") {
              setFormData(prev => ({ ...prev, nisn: nisn }));
              setIsSuccess(true);
            }
          } catch (err) {
            console.log("Error checking redirected payment status:", err);
          }
        };
        checkStatus();
      }
    }
  }, [checkPaymentStatus]);

  // Polling check payment status every 4 seconds
  useEffect(() => {
    let intervalId;
    if (paymentPolling && submittedCandidate?.nisn) {
      intervalId = setInterval(async () => {
        try {
          const res = await checkPaymentStatus(submittedCandidate.nisn);
          if (res && res.success && res.payment_status === "Paid") {
            setPaymentPolling(false);
            setShowPaymentGate(false);
            setIsSuccess(true);
            fetchPublicApplicants?.();
          }
        } catch (err) {
          console.log("Polling payment status error:", err);
        }
      }, 4000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentPolling, submittedCandidate, checkPaymentStatus, fetchPublicApplicants]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ppdb-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ppdb-theme', 'light');
    }
  };

  const majors = [
    { code: "RPL", title: "Rekayasa Perangkat Lunak" },
    { code: "TJKT", title: "Teknik Jaringan Komputer & Telekomunikasi" },
    { code: "DKV", title: "Desain Komunikasi Visual" },
    { code: "BC", title: "Broadcasting & Perfilman" },
    { code: "TE", title: "Teknik Elektronika" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "nisn") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "nik") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 16);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "kodePos") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "whatsapp" || name === "teleponOrtu") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 15);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "tinggiBadan" || name === "beratBadan" || name === "jarakKm") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "waktuJam" || name === "waktuMenit" || name === "jumlahSaudara") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 2);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => {
      const current = prev.kebutuhanKhusus || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, kebutuhanKhusus: updated };
    });
  };

  const nextStep = async () => {
    if (wizardStep < 13) {
      setWizardStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        const res = await registerApplicant(formData);
        if (res && res.success) {
          setSubmittedCandidate(res.data);
          setShowPaymentGate(true);
          setPaymentPolling(true);
        } else {
          alert(res?.message || "Gagal mengirimkan formulir pendaftaran. Silakan coba lagi.");
        }
      } catch (err) {
        console.error("Submit error:", err);
        alert("Terjadi kesalahan koneksi. Silakan coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(prev => prev - 1);
    }
  };

  const goToStep = (step) => {
    setWizardStep(step);
  };

  // Load Midtrans Snap script dynamically
  useEffect(() => {
    if (showPaymentGate && !snapScriptLoaded.current) {
      const existingScript = document.querySelector('script[src*="snap.js"]');
      if (existingScript) {
        snapScriptLoaded.current = true;
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder');
      script.async = true;
      script.onload = () => { snapScriptLoaded.current = true; };
      document.head.appendChild(script);
    }
  }, [showPaymentGate]);

  if (isSuccess) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
        {/* Background Glowing Blobs */}
        <div className="bg-glow-container">
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
          <div className="bg-glow bg-glow-3"></div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 max-w-md w-full text-center relative z-10">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
            <Check size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Pendaftaran Sukses!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Terima kasih, <strong>{formData.nama || "Calon Bintang"}</strong>.
            Data pendaftaran Anda telah berhasil direkam di sistem PPDB SMK Taruna Bhakti.
          </p>
          <div className="bg-slate-50/70 backdrop-blur-sm border border-slate-100 rounded-xl p-4 mb-6 text-left text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-400">NISN:</span>
              <span className="font-bold text-slate-700">{formData.nisn}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-400">Sekolah Asal:</span>
              <span className="font-bold text-slate-700">{formData.sekolahAsal}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Jurusan Utama:</span>
              <span className="font-bold text-blue-600">{formData.jurusan1 || "-"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link href={`/invoice?nisn=${formData.nisn}`} target="_blank" className="w-full flex justify-center items-center py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-[1.02]">
              Lihat & Cetak Invoice
            </Link>
            <Link href="/" className="btn-primary-pill w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-[1.02]">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }


  if (showPaymentGate && submittedCandidate) {
    const handlePay = async () => {
      try {
        const backendUrl = "http://localhost:5000"; // Should use env in prod
        const res = await fetch(`${backendUrl}/api/payment/create-transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nisn: submittedCandidate.nisn })
        });
        const data = await res.json();
        if (data.success && data.token) {
          // @ts-ignore
          if (window.snap) {
            // @ts-ignore
            window.snap.pay(data.token, {
              onSuccess: function (result: any) {
                setPaymentPolling(false);
                setShowPaymentGate(false);
                setFormData(prev => ({ ...prev, nisn: submittedCandidate.nisn }));
                setIsSuccess(true);
              },
              onPending: function (result: any) {
                alert("Menunggu pembayaran...");
              },
              onError: function (result: any) {
                alert("Pembayaran gagal!");
              },
              onClose: function () {
                console.log("Customer closed the popup without finishing the payment");
              }
            });
          } else {
            alert("Midtrans script belum dimuat, coba lagi dalam beberapa detik.");
          }
        } else {
          alert("Gagal membuat transaksi: " + data.message);
        }
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    };

    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
        
        {/* Background Glowing Blobs */}
        <div className="bg-glow-container">
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
          <div className="bg-glow bg-glow-3"></div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 shadow-2xl rounded-3xl p-8 max-w-md w-full text-center relative z-10 animate-in fade-in zoom-in duration-300">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-2xl"></div>

          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/10 ring-4 ring-blue-500/5 dark:ring-blue-500/10">
            <CreditCard size={28} className="animate-pulse" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100/50 dark:border-blue-900 px-3.5 py-1.5 rounded-full">
            Invoice Registrasi
          </span>

          <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-4 mb-2">Selesaikan Pembayaran</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            Untuk merampungkan registrasi PPDB, silakan selesaikan pembayaran biaya administrasi pendaftaran Anda.
          </p>

          {/* Pricing Box */}
          <div className="bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 mb-6 text-left relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5 dark:opacity-10 pointer-events-none">
              <Sparkles size={64} className="text-blue-600 animate-pulse" />
            </div>
            
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
              Jumlah yang Harus Dibayar
            </span>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 block mb-4">
              Rp 150.000
            </span>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs text-slate-600 dark:text-slate-350 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Nama Lengkap:</span>
                <span className="font-extrabold text-slate-855 dark:text-white">{submittedCandidate.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">NISN Pendaftar:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedCandidate.nisn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Jurusan Terpilih:</span>
                <span className="font-semibold text-blue-600 dark:text-sky-400">{submittedCandidate.jurusan_1 || submittedCandidate.jurusan1}</span>
              </div>
            </div>
          </div>

          {/* Polling / Waiting Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-blue-500 border-t-transparent"></span>
            <span>Menunggu konfirmasi pembayaran otomatis...</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handlePay}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 transition duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Bayar Sekarang via Midtrans
              <ArrowRight size={16} />
            </button>

            {/* Offline Simulation / Bypass Button */}
            <button
              onClick={() => {
                setPaymentPolling(false);
                setShowPaymentGate(false);
                setFormData(prev => ({ ...prev, nisn: submittedCandidate.nisn }));
                setIsSuccess(true);
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-700 text-xs transition duration-300"
            >
              Simulasi Bayar Sukses (Bypass Luring)
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-slate-400 dark:text-slate-500">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>Terintegrasi secara aman dengan Midtrans Sandbox API</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center py-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      
      {/* Background Glowing Blobs */}
      <div className="bg-glow-container">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition-all group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali</span>
        </Link>
      </div>

      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={toggleDark} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition-all" 
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
        >
          {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-750" />}
        </button>
      </div>

      <div className="mb-10 text-center mt-12 relative z-10 flex flex-col items-center">
        <div className="mb-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100/50 dark:border-blue-900/50 text-blue-600 dark:text-sky-400 text-xs font-bold shadow-sm shadow-blue-500/5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-sky-400 animate-pulse"></span>
          Tahap {wizardStep} dari 13
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-2 drop-shadow-sm">Formulir Pendaftaran PPDB</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium bg-white/60 dark:bg-slate-900/60 backdrop-blur-md inline-block px-4 py-1.5 rounded-full border border-white/60 dark:border-slate-800/60 shadow-sm mt-2">SMK Taruna Bhakti Tahun Ajaran 2026/2027</p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 shadow-[0_20px_50px_rgba(0,102,255,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] p-6 md:p-10 max-w-4xl w-full relative z-10">

        <div className="flex justify-between items-center mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-600 dark:bg-blue-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
            style={{ width: `${((wizardStep - 1) / 12) * 100}%` }}
          ></div>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((step) => {
            const isCompleted = wizardStep > step;
            const isCurrent = wizardStep === step;
            return (
              <div
                key={step}
                title={`Tahap ${step}`}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300 select-none ${isCurrent
                  ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110"
                  : isCompleted
                    ? "bg-blue-600 dark:bg-blue-500 text-white ring-2 ring-blue-300 dark:ring-blue-900 ring-offset-2 dark:ring-offset-slate-900"
                    : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-2 border-slate-200 dark:border-slate-800"
                  }`}
              >
                {isCompleted ? <Check size={16} /> : step}
              </div>
            );
          })}
        </div>

        {/* STEP 1: PERSONAL DETAILS */}
        {wizardStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 1: Data Pribadi Siswa</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Masukkan informasi dasar sesuai dengan Kartu Keluarga / Akta Kelahiran.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Lengkap</label>
                <input type="text" name="nama" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Sesuai Ijazah" value={formData.nama} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Jenis Kelamin</label>
                <select name="jenisKelamin" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.jenisKelamin} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">NISN (10 Digit)</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="nisn" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Misal: 0081234567" value={formData.nisn} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">NIK (16 Digit)</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="nik" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Sesuai KK" value={formData.nik} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Tempat & Tanggal Lahir</label>
              <div className="flex gap-2">
                <input type="text" name="tempatLahir" className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Tempat" value={formData.tempatLahir} onChange={handleInputChange} />
                <input type="date" name="tglLahir" className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tglLahir} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Agama</label>
                <select name="agama" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.agama} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Kewarganegaraan</label>
                <select name="kewarganegaraan" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.kewarganegaraan} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="WNI">Warga Negara Indonesia (WNI)</option>
                  <option value="WNA">Warga Negara Asing (WNA)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TEMPAT TINGGAL */}
        {wizardStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 2: Data Tempat Tinggal</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Informasi alamat tempat tinggal dan kontak yang dapat dihubungi.</p>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Alamat Rumah (Jalan, No. Rumah)</label>
              <textarea name="alamat" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" rows={2} placeholder="Contoh: Jl. Pekapuran No. 10" value={formData.alamat} onChange={handleInputChange}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">RT / RW</label>
                <input type="text" name="rtRw" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 002/005" value={formData.rtRw} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Kode Pos</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="kodePos" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 16453" value={formData.kodePos} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Kelurahan</label>
                <input type="text" name="kelurahan" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Curug" value={formData.kelurahan} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Kecamatan</label>
                <input type="text" name="kecamatan" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Cimanggis" value={formData.kecamatan} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nomor Telepon / Handphone (HP)</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="whatsapp" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 081234567890" value={formData.whatsapp} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Electronic Mail (E-mail) Pribadi</label>
                <input type="email" name="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="nama@email.com" value={formData.email} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Tinggal Bersama dengan</label>
                <select name="tinggalDengan" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.tinggalDengan} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Saudara">Saudara</option>
                  <option value="Kos/Asrama">Kos / Asrama</option>
                  <option value="Wali">Wali</option>
                  <option value="Panti Asuhan">Panti Asuhan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Moda Transportasi</label>
                <select name="transportasi" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.transportasi} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="Jalan Kaki">Jalan Kaki</option>
                  <option value="Angkutan Umum">Angkutan Umum</option>
                  <option value="Mobil Antar Jemput">Mobil Antar Jemput</option>
                  <option value="Kereta Api">Kereta Api</option>
                  <option value="Mobil Pribadi">Mobil Pribadi</option>
                  <option value="Sepeda Motor">Sepeda Motor</option>
                  <option value="Sepeda">Sepeda</option>
                  <option value="Ojek">Ojek</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DATA PERIODIK */}
        {wizardStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 3: Data Rincian (Data Periodik)</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Mohon isi data periodik fisik dan perjalanan Anda ke sekolah.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Tinggi Badan (Cm)</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="tinggiBadan" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 165" value={formData.tinggiBadan} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Cm</span>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Berat Badan (Kg)</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="beratBadan" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 55" value={formData.beratBadan} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Kg</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Jarak Rumah ke Sekolah</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="jarakSekolah" value="Kurang dari 1 km" checked={formData.jarakSekolah === "Kurang dari 1 km"} onChange={handleInputChange} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-600">Kurang dari 1 Km</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="jarakSekolah" value="Lebih dari 1 km" checked={formData.jarakSekolah === "Lebih dari 1 km"} onChange={handleInputChange} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-600">Lebih dari 1 Km</span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Sebutkan Jarak Tepatnya (Km)</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="jarakKm" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 3" value={formData.jarakKm} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Km</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Waktu Tempuh ke Sekolah</label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <input type="text" inputMode="numeric" pattern="[0-9]*" name="waktuJam" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="0" value={formData.waktuJam} onChange={handleInputChange} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Jam</span>
                  </div>
                  <span className="text-slate-400 font-bold">:</span>
                  <div className="relative flex-1">
                    <input type="text" inputMode="numeric" pattern="[0-9]*" name="waktuMenit" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="25" value={formData.waktuMenit} onChange={handleInputChange} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Menit</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Jumlah Saudara Kandung</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="jumlahSaudara" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-16 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 2" value={formData.jumlahSaudara} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Orang</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: KESEHATAN & BERKEBUTUHAN KHUSUS */}
        {wizardStep === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 4: Data Kesehatan & Berkebutuhan Khusus</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Mohon isi data golongan darah, riwayat penyakit, serta kebutuhan khusus jika ada.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Golongan Darah</label>
                <select name="golonganDarah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.golonganDarah} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="Tidak Tahu">Tidak Tahu</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Penyakit Yang Pernah Diderita</label>
                <input type="text" name="penyakitDiderita" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Misal: Asma, TBC, dll (kosongkan jika tidak ada)" value={formData.penyakitDiderita} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 mb-3">Berkebutuhan Khusus / Kelainan</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Netra",
                  "Rungu",
                  "Grahita Sedang",
                  "Grahita Ringan",
                  "Laras",
                  "Wicara",
                  "Daksa Sedang",
                  "Daksa Ringan",
                  "Autis",
                  "Indigo",
                  "Hyper Aktif",
                  "Bakat Istimewa",
                  "Cerdas Istimewa",
                  "Down Syndrome",
                  "Narkoba",
                  "Kesulitan Belajar",
                  "Lainnya"
                ].map((option) => {
                  const isChecked = formData.kebutuhanKhusus?.includes(option) || false;
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/75 hover:border-slate-300"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(option)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 accent-blue-600"
                      />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DATA PRESTASI */}
        {wizardStep === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 5: Data Prestasi (Opsional)</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Isi data prestasi yang pernah diraih. Klik &quot;Lewati&quot; jika tidak ada.</p>

            <div className="form-group mb-5">
              <label className="block text-xs font-bold text-slate-600 mb-3">1. Jenis Prestasi</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Sains", "Seni", "Olahraga", "Lainnya"].map((option) => {
                  const isChecked = formData.jenisPrestasi?.includes(option) || false;
                  return (
                    <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/75 hover:border-slate-300"
                      }`}>
                      <input type="checkbox" checked={isChecked}
                        onChange={() => setFormData(prev => {
                          const cur = prev.jenisPrestasi || [];
                          return { ...prev, jenisPrestasi: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                        })}
                        className="w-4 h-4 accent-blue-600" />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group mb-5">
              <label className="block text-xs font-bold text-slate-600 mb-3">2. Tingkat</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Sekolah", "Kecamatan", "Kab/Kota", "Propinsi", "Nasional", "Internasional", "Lainnya"].map((option) => {
                  const isChecked = formData.tingkatPrestasi?.includes(option) || false;
                  return (
                    <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/75 hover:border-slate-300"
                      }`}>
                      <input type="checkbox" checked={isChecked}
                        onChange={() => setFormData(prev => {
                          const cur = prev.tingkatPrestasi || [];
                          return { ...prev, tingkatPrestasi: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                        })}
                        className="w-4 h-4 accent-blue-600" />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Uraian Prestasi</label>
                <input type="text" name="uraianPrestasi" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Misal: Juara 1 Olimpiade Matematika" value={formData.uraianPrestasi} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Tahun Prestasi</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="tahunPrestasi" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 2024" value={formData.tahunPrestasi} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Penyelenggara</label>
              <input type="text" name="penyelenggara" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Misal: Dinas Pendidikan Kota Depok" value={formData.penyelenggara} onChange={handleInputChange} />
            </div>
          </div>
        )}

        {/* STEP 6: DATA BEASISWA */}
        {wizardStep === 6 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 6: Data Beasiswa (Opsional)</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Isi data beasiswa yang pernah atau sedang diterima. Klik &quot;Lewati&quot; jika tidak ada.</p>

            <div className="form-group mb-5">
              <label className="block text-xs font-bold text-slate-600 mb-3">1. Jenis Beasiswa</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["Prestasi", "Kemiskinan", "Pendidikan", "Unggulan", "Lainnya"].map((option) => {
                  const isChecked = formData.jenisBeasiswa?.includes(option) || false;
                  return (
                    <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/75 hover:border-slate-300"
                      }`}>
                      <input type="checkbox" checked={isChecked}
                        onChange={() => setFormData(prev => {
                          const cur = prev.jenisBeasiswa || [];
                          return { ...prev, jenisBeasiswa: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                        })}
                        className="w-4 h-4 accent-blue-600" />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Uraian Beasiswa</label>
              <input type="text" name="uraianBeasiswa" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Misal: Beasiswa Prestasi dari Pemkot Depok" value={formData.uraianBeasiswa} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Tahun Mulai Menerima Beasiswa</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="tahunMulaiBeasiswa" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 2022" value={formData.tahunMulaiBeasiswa} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Tahun Selesai Menerima Beasiswa</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="tahunSelesaiBeasiswa" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 2024" value={formData.tahunSelesaiBeasiswa} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: PENDIDIKAN & JURUSAN */}
        {wizardStep === 7 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 7: Data Rincian (Data Pendidikan)</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Data riwayat pendidikan, status pindahan, dan peminatan kompetensi.</p>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">G</span>
                1. Pendidikan Sebelumnya
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">a. Lulusan dari SMP/MTs</label>
                  <input type="text" name="sekolahAsal" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Nama sekolah asal" value={formData.sekolahAsal} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">b. Tanggal Lulus dari SMP/MTs</label>
                  <input type="date" name="tglLulus" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tglLulus} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">c. Nomor Seri Ijazah SMP/MTs</label>
                  <input type="text" name="noIjazah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Kosongkan jika tidak ada" value={formData.noIjazah} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">d. Nomor Seri SKHUN SMP/MTs</label>
                  <input type="text" name="noSKHUN" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Kosongkan jika tidak ada" value={formData.noSKHUN} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">e. Nomor Peserta UN SMP/MTs</label>
                  <input type="text" name="noPesertaUN" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Kosongkan jika tidak ada" value={formData.noPesertaUN} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">f. Lama Belajar (Tahun)</label>
                  <div className="flex items-center gap-3">
                    <input type="number" name="lamaBelajar" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 3" value={formData.lamaBelajar} onChange={handleInputChange} />
                    <span className="text-sm font-bold text-slate-500">Tahun</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Pindahan (Hanya Untuk Murid Pindahan)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">a. Dari SMP/MTs</label>
                  <input type="text" name="pindahanDari" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Kosongkan jika bukan pindahan" value={formData.pindahanDari} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">b. Alasan Pindah Sekolah</label>
                  <input type="text" name="alasanPindah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Opsional" value={formData.alasanPindah} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                Diterima di Sekolah Ini
              </h4>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-3">a. Di Tingkat/Kelas</label>
                <div className="flex flex-wrap gap-3">
                  {["X (Sepuluh)", "XI (Sebelas)", "XII (Dua Belas)"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.diterimaKelas === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}>
                      <input
                        type="radio"
                        name="diterimaKelas"
                        value={option}
                        checked={formData.diterimaKelas === option}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-600 mb-3">b. Program Keahlian</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Teknik Komputer dan Jaringan (TKJ)",
                    "Animasi (ANM)",
                    "Rekayasa Perangkat Lunak (RPL)",
                    "Produksi dan Siaran Program Televisi (PSPT)",
                    "Teknik Elektronika Industri (TEI)"
                  ].map((option) => {
                    return (
                      <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData.jurusan1 === option ? "bg-blue-50 border-blue-400 text-blue-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                        }`}>
                        <input
                          type="radio"
                          name="jurusan1"
                          value={option}
                          checked={formData.jurusan1 === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs font-bold">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: DATA AYAH KANDUNG */}
        {wizardStep === 8 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 8: Data Ayah Kandung</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Isi identitas lengkap ayah kandung sesuai dokumen resmi (KK/KTP).</p>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">H</span>
                Data Ayah Kandung
              </h4>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">1. Nama Lengkap</label>
                <input type="text" name="namaAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Sesuai KTP/KK" value={formData.namaAyah} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Tempat Lahir</label>
                  <input type="text" name="tempatLahirAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tempatLahirAyah} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Tanggal Lahir</label>
                  <input type="date" name="tglLahirAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tglLahirAyah} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Agama</label>
                  <select name="agamaAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.agamaAyah} onChange={handleInputChange}>
                    <option value="">-- Pilih Agama --</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Kewarganegaraan</label>
                  <select name="kewarganegaraanAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.kewarganegaraanAyah} onChange={handleInputChange}>
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Pendidikan Terakhir</label>
                  <input type="text" name="pendidikanAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="SD/SMP/SMA/S1" value={formData.pendidikanAyah} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">6. Pekerjaan</label>
                  <input type="text" name="pekerjaanAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Pekerjaan" value={formData.pekerjaanAyah} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">7. Penghasilan Per Bulan</label>
                  <select name="penghasilanAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.penghasilanAyah} onChange={handleInputChange}>
                    <option value="">-- Pilih --</option>
                    <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                    <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                    <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">8. Alamat Rumah</label>
                <input type="text" name="alamatAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-3" placeholder="Nama Jalan / Perumahan / Kampung" value={formData.alamatAyah} onChange={handleInputChange} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">RT/RW</label>
                    <input type="text" name="rtrwAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.rtrwAyah} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kelurahan</label>
                    <input type="text" name="kelurahanAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kelurahanAyah} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kecamatan</label>
                    <input type="text" name="kecamatanAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kecamatanAyah} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kode Pos</label>
                    <input type="text" name="kodePosAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kodePosAyah} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">9. Status Hidup/Meninggal Dunia</label>
                <select name="statusAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.statusAyah} onChange={handleInputChange}>
                  <option value="Masih Hidup">Masih Hidup</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: DATA IBU KANDUNG */}
        {wizardStep === 9 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 9: Data Ibu Kandung</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Isi identitas lengkap ibu kandung sesuai dokumen resmi (KK/KTP).</p>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">I</span>
                Data Ibu Kandung
              </h4>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">1. Nama Lengkap</label>
                <input type="text" name="namaIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Sesuai KTP/KK" value={formData.namaIbu} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Tempat Lahir</label>
                  <input type="text" name="tempatLahirIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tempatLahirIbu} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Tanggal Lahir</label>
                  <input type="date" name="tglLahirIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tglLahirIbu} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Agama</label>
                  <select name="agamaIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.agamaIbu} onChange={handleInputChange}>
                    <option value="">-- Pilih Agama --</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Kewarganegaraan</label>
                  <select name="kewarganegaraanIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.kewarganegaraanIbu} onChange={handleInputChange}>
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Pendidikan Terakhir</label>
                  <input type="text" name="pendidikanIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="SD/SMP/SMA/S1" value={formData.pendidikanIbu} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">6. Pekerjaan</label>
                  <input type="text" name="pekerjaanIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Pekerjaan" value={formData.pekerjaanIbu} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">7. Penghasilan Per Bulan</label>
                  <select name="penghasilanIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.penghasilanIbu} onChange={handleInputChange}>
                    <option value="">-- Pilih --</option>
                    <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                    <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                    <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">8. Alamat Rumah</label>
                <input type="text" name="alamatIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-3" placeholder="Nama Jalan / Perumahan / Kampung" value={formData.alamatIbu} onChange={handleInputChange} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">RT/RW</label>
                    <input type="text" name="rtrwIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.rtrwIbu} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kelurahan</label>
                    <input type="text" name="kelurahanIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kelurahanIbu} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kecamatan</label>
                    <input type="text" name="kecamatanIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kecamatanIbu} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kode Pos</label>
                    <input type="text" name="kodePosIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kodePosIbu} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">9. Status Hidup/Meninggal Dunia</label>
                <select name="statusIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.statusIbu} onChange={handleInputChange}>
                  <option value="Masih Hidup">Masih Hidup</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: DATA WALI PESERTA DIDIK */}
        {wizardStep === 10 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 10: Data Wali (Opsional)</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Isi identitas lengkap wali murid (jika ada) sesuai dokumen resmi (KK/KTP).</p>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">J</span>
                Data Wali Peserta Didik
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">1. Nama Lengkap</label>
                  <input type="text" name="namaWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Kosongkan jika tidak ada wali" value={formData.namaWali} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Nomor Telepon (Ayah/Ibu/Wali)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="teleponOrtu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Nomor yang mudah dihubungi" value={formData.teleponOrtu} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Tempat Lahir</label>
                  <input type="text" name="tempatLahirWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tempatLahirWali} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Tanggal Lahir</label>
                  <input type="date" name="tglLahirWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tglLahirWali} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Agama</label>
                  <select name="agamaWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.agamaWali} onChange={handleInputChange}>
                    <option value="">-- Pilih Agama --</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Kewarganegaraan</label>
                  <select name="kewarganegaraanWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.kewarganegaraanWali} onChange={handleInputChange}>
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Pendidikan Terakhir</label>
                  <input type="text" name="pendidikanWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="SD/SMP/SMA/S1" value={formData.pendidikanWali} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">6. Pekerjaan</label>
                  <input type="text" name="pekerjaanWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Pekerjaan" value={formData.pekerjaanWali} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">7. Penghasilan Per Bulan</label>
                  <select name="penghasilanWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.penghasilanWali} onChange={handleInputChange}>
                    <option value="">-- Pilih --</option>
                    <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                    <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                    <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">8. Alamat Rumah</label>
                <input type="text" name="alamatWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-3" placeholder="Nama Jalan / Perumahan / Kampung" value={formData.alamatWali} onChange={handleInputChange} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">RT/RW</label>
                    <input type="text" name="rtrwWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.rtrwWali} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kelurahan</label>
                    <input type="text" name="kelurahanWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kelurahanWali} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kecamatan</label>
                    <input type="text" name="kecamatanWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kecamatanWali} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kode Pos</label>
                    <input type="text" name="kodePosWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kodePosWali} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">9. Status Hidup/Meninggal Dunia</label>
                <select name="statusWali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.statusWali} onChange={handleInputChange}>
                  <option value="Masih Hidup">Masih Hidup</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 11: KEGEMARAN & MINAT (K, L) */}
        {wizardStep === 11 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 11: Data Kegemaran & Minat</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Isi data hobi, cita-cita, dan minat bakat siswa.</p>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">K</span>
                Data Kegemaran Peserta Didik
              </h4>
              <div className="form-group mb-5">
                <label className="block text-xs font-bold text-slate-600 mb-3">1. Hobi</label>
                <div className="flex flex-wrap gap-3">
                  {["Olahraga", "Kesenian", "Membaca", "Menulis", "Travelling", "Lainnya"].map((option) => {
                    const isChecked = formData.hobi?.includes(option) || false;
                    return (
                      <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-blue-50 border-blue-400 text-blue-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}>
                        <input type="checkbox" checked={isChecked}
                          onChange={() => setFormData(prev => {
                            const cur = prev.hobi || [];
                            return { ...prev, hobi: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                          })}
                          className="w-4 h-4 accent-blue-600" />
                        <span className="text-xs font-bold">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-3">2. Cita-cita</label>
                <select name="citaCita" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.citaCita} onChange={handleInputChange}>
                  <option value="">-- Pilih Cita-cita --</option>
                  <option value="PNS">PNS</option>
                  <option value="TNI/POLRI">TNI/POLRI</option>
                  <option value="Guru/Dosen">Guru/Dosen</option>
                  <option value="Dokter">Dokter</option>
                  <option value="Politikus">Politikus</option>
                  <option value="Wiraswasta">Wiraswasta</option>
                  <option value="Seni Lukis/Artis">Seni Lukis/Artis/Sejenisnya</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">L</span>
                Data Minat dan Kemampuan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">1. Nilai US (Teori)</label>
                  <input type="number" name="nilaiUSTeori" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.nilaiUSTeori} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Nilai US (Praktik)</label>
                  <input type="number" name="nilaiUSPraktik" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.nilaiUSPraktik} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Nilai Muatan Lokal</label>
                <input type="number" name="nilaiMuatanLokal" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.nilaiMuatanLokal} onChange={handleInputChange} />
              </div>
              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Memilih SMK Taruna Bhakti Karena</label>
                <div className="flex gap-4">
                  {["Diri Sendiri", "Orang Tua/Wali"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.alasanMemilih === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}>
                      <input type="radio" name="alasanMemilih" value={option} checked={formData.alasanMemilih === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Cita-cita Setelah Lulus SMK</label>
                <input type="text" name="citaCitaSetelahLulus" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Kuliah / Bekerja di Industri" value={formData.citaCitaSetelahLulus} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Pelajaran Yg Disenangi di SMP/MTs</label>
                  <input type="text" name="pelajaranDisenangi" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Matematika" value={formData.pelajaranDisenangi} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Alasan Disenangi</label>
                  <input type="text" name="alasanDisenangi" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Alasan" value={formData.alasanDisenangi} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">6. Kesulitan Belajar di SMP/MTs</label>
                <input type="text" name="kesulitanBelajar" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Ada hambatan/kesulitan apa?" value={formData.kesulitanBelajar} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 12: BUDI PEKERTI & EKONOMI (M, N) */}
        {wizardStep === 12 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 12: Data Budi Pekerti & Ekonomi</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Pernyataan kepribadian serta data bantuan sosial (jika ada).</p>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">M</span>
                Data Budi Pekerti
              </h4>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">1. Perkelahian antar Pelajar</label>
                <div className="flex gap-4 mb-2">
                  {["Pernah", "Tidak Pernah"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.perkelahian === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}>
                      <input type="radio" name="perkelahian" value={option} checked={formData.perkelahian === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-500">Kalau Pernah Dimana dan Kapan :</span>
                  <input type="text" name="ketPerkelahian" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-100" value={formData.ketPerkelahian} onChange={handleInputChange} disabled={formData.perkelahian !== "Pernah"} />
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Obat Terlarang, Minuman Keras, Narkotika</label>
                <div className="flex gap-4 mb-2">
                  {["Pernah", "Tidak Pernah"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.narkoba === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}>
                      <input type="radio" name="narkoba" value={option} checked={formData.narkoba === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-500">Kalau Pernah atau Masih, Berikan Alasannya :</span>
                  <input type="text" name="ketNarkoba" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-100" value={formData.ketNarkoba} onChange={handleInputChange} disabled={formData.narkoba !== "Pernah"} />
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Pelanggaran Tingkah Laku Sosial</label>
                <div className="flex gap-4 mb-2">
                  {["Pernah", "Tidak Pernah"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.pelanggaranLain === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}>
                      <input type="radio" name="pelanggaranLain" value={option} checked={formData.pelanggaranLain === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-500">Bentuk Pelanggaran :</span>
                  <input type="text" name="ketPelanggaranLain" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-100" value={formData.ketPelanggaranLain} onChange={handleInputChange} disabled={formData.pelanggaranLain !== "Pernah"} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Apakah anda sanggup mentaati tata tertib yang berlaku di SMK Taruna Bhakti Depok ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiTaat === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                        <input type="radio" name="janjiTaat" value={option} checked={formData.janjiTaat === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Apakah anda sanggup dikenakan sangsi apabila melanggar tata tertib peraturan sekolah ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiSanksi === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                        <input type="radio" name="janjiSanksi" value={option} checked={formData.janjiSanksi === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">6. Apakah Anda Sanggup Untuk Menjalin Keakraban dengan Sesama Rekan di Sekolah ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiAkrab === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                        <input type="radio" name="janjiAkrab" value={option} checked={formData.janjiAkrab === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">7. Apakah anda sanggup belajar sungguh-sungguh ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiBelajar === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                        <input type="radio" name="janjiBelajar" value={option} checked={formData.janjiBelajar === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">8. Apakah anda sanggup menjaga nama baik sekolah baik didalam maupun diluar sekolah ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiNamaBaik === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                        <input type="radio" name="janjiNamaBaik" value={option} checked={formData.janjiNamaBaik === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">N</span>
                Data Ekonomi Keluarga
              </h4>

              <div className="space-y-6">
                <div className="form-group">
                  <div className="flex text-xs font-bold text-slate-600 mb-1.5">
                    <span className="mr-2">1.</span>
                    <div>
                      <p>Apakah Orang Tua Mempunyai / Memiliki /</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="w-[280px]">Penerima Kartu Perlindungan Sosial (KPS)</p>
                        <span>:</span>
                        <div className="flex gap-4 ml-2">
                          {["Ya", "Tidak"].map((option) => (
                            <label key={option} className="flex items-center gap-1.5 cursor-pointer">
                              <input type="radio" name="punyaKPS" value={option} checked={formData.punyaKPS === option} onChange={handleInputChange} className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-slate-500 mt-2 ml-4 pl-1.5">
                    <div className="w-[280px]">
                      <p>Jika Ya, Sebutkan Nomor KPS-nya, dan</p>
                      <p>Lampirkan Fotocopy Kartu KPS-nya</p>
                    </div>
                    <span>:</span>
                    <div className="flex items-center gap-2 ml-2 flex-1">
                      <span>Nomor :</span>
                      <input type="text" name="noKPS" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" value={formData.noKPS} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="flex text-xs font-bold text-slate-600 mb-1.5">
                    <span className="mr-2">2.</span>
                    <div>
                      <p>Apakah Orang Tua Mempunyai / Memiliki /</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="w-[280px]">Penerima Kartu Indonesia Pintar (KIP)</p>
                        <span>:</span>
                        <div className="flex gap-4 ml-2">
                          {["Ya", "Tidak"].map((option) => (
                            <label key={option} className="flex items-center gap-1.5 cursor-pointer">
                              <input type="radio" name="punyaKIP" value={option} checked={formData.punyaKIP === option} onChange={handleInputChange} className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-slate-500 mt-2 ml-4 pl-1.5">
                    <div className="w-[280px]">
                      <p>Jika Ya, Sebutkan Nomor KIP-nya, dan</p>
                      <p>Lampirkan Fotocopy Kartu KIP-nya</p>
                    </div>
                    <span>:</span>
                    <div className="flex items-center gap-2 ml-2 flex-1">
                      <span>No :</span>
                      <input type="text" name="noKIP" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" value={formData.noKIP} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 13: DEKLARASI & UPLOAD */}
        {wizardStep === 13 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 13: Berkas & Konfirmasi</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Lengkapi dokumen terakhir dan nyatakan kebenaran data.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { id: 'berkasKK', label: 'Kartu Keluarga (KK)', desc: 'Wajib | PDF/JPG max 5MB' },
                { id: 'berkasKTP', label: 'KTP Ortu / Wali', desc: 'Wajib | PDF/JPG max 5MB' },
                { id: 'berkasAkta', label: 'Akta Kelahiran', desc: 'Wajib | PDF/JPG max 5MB' },
                { id: 'berkasIjazah', label: 'SKL / Ijazah (Opsional)', desc: 'Boleh dikosongi jika belum ada' },
                { id: 'berkasFoto', label: 'Pas Foto (3x4)', desc: 'Wajib | JPG/PNG max 5MB' }
              ].map((field) => (
                <div key={field.id} className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">{field.label}</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id={field.id}
                      className="hidden" 
                      accept=".pdf,image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ 
                              ...prev, 
                              [`${field.id}Ok`]: true, 
                              [`${field.id}File`]: file, 
                              [`${field.id}Name`]: file.name,
                              [`${field.id}Base64`]: reader.result as string
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor={field.id}
                      className={`block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${formData[`${field.id}Ok`] ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"}`}
                    >
                      <div className="mb-2">
                        {formData[`${field.id}Ok`] ? (
                          <Check className="text-emerald-500 mx-auto" size={24} />
                        ) : (
                          <Upload className="text-slate-400 mx-auto" size={24} />
                        )}
                      </div>
                      {formData[`${field.id}Ok`] ? (
                        <div>
                          <p className="text-emerald-700 font-bold text-xs mb-0.5 truncate px-2">{formData[`${field.id}Name`]}</p>
                          <span className="text-[10px] text-slate-400">Klik untuk mengganti</span>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-slate-700 text-xs mb-0.5">Pilih Berkas</p>
                          <span className="text-[10px] text-slate-400">{field.desc}</span>
                        </div>
                      )}
                    </label>
                    {formData[`${field.id}Ok`] && (
                      <button 
                        type="button"
                        className="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-200 p-1 rounded-full transition-colors z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData(prev => ({
                            ...prev,
                            [`${field.id}Ok`]: false,
                            [`${field.id}File`]: null,
                            [`${field.id}Name`]: "",
                            [`${field.id}Base64`]: ""
                          }));
                          const inputElement = document.getElementById(field.id) as HTMLInputElement;
                          if (inputElement) inputElement.value = "";
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-100">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 accent-blue-600 rounded border-slate-300 shrink-0 cursor-pointer"
                  checked={formData.deklarasi}
                  onChange={(e) => setFormData(prev => ({ ...prev, deklarasi: e.target.checked }))}
                />
                <span className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                  <strong>Pernyataan:</strong> Saya menyatakan bahwa data yang saya isikan di formulir ini adalah benar. Apabila di kemudian hari terbukti palsu, saya bersedia menerima sanksi yang berlaku.
                </span>
              </label>
              {(!formData.deklarasi || !formData.berkasKKOk || !formData.berkasKTPOk || !formData.berkasAktaOk || !formData.berkasFotoOk) && (
                <p className="text-red-500 text-xs mt-2 ml-1 font-semibold animate-pulse">
                  * Wajib melengkapi semua berkas (kecuali opsional) & mencentang pernyataan.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-between items-center border-t border-slate-100 pt-6">
          {wizardStep > 1 ? (
            <button
              className="btn-nav-link px-4 py-2"
              onClick={prevStep}
            >
              Kembali
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3 items-center">
            {(wizardStep === 5 || wizardStep === 6) && (
              <button
                className="btn-secondary"
                onClick={nextStep}
              >
                Lewati
              </button>
            )}
            <button
              className="btn-primary-pill px-8 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={nextStep}
              disabled={
                isSubmitting ||
                (wizardStep === 1 && (!formData.nama || !formData.nisn)) ||
                (wizardStep === 13 && (!formData.deklarasi || !formData.berkasKKOk || !formData.berkasKTPOk || !formData.berkasAktaOk || !formData.berkasFotoOk))
              }
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Mengirim...
                </span>
              ) : wizardStep === 13 ? (
                "Kirim Pendaftaran"
              ) : (
                "Selanjutnya"
              )}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
