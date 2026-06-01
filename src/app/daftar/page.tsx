"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check, Upload, ArrowLeft, Home, Monitor, Code, Palette, Film, Cpu, Sun, Moon, CreditCard, ShieldCheck, Sparkles, X, FileText, AlertCircle, Phone, Copy, ChevronRight, Building, CheckCircle2, DollarSign, Printer } from "lucide-react";
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

  // 3-Option Checkout Custom States
  const [activePaymentTab, setActivePaymentTab] = useState("transfer"); // "transfer" | "midtrans" | "cash"
  const [manualReceiptBase64, setManualReceiptBase64] = useState("");
  const [manualReceiptName, setManualReceiptName] = useState("");
  const [copiedBank, setCopiedBank] = useState(null); // null | 'mandiri' | 'bjb'
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  // Dark Mode
  const [isDark, setIsDark] = useState(false);
  const [regCost, setRegCost] = useState(250000);
  const [waGroupUrl, setWaGroupUrl] = useState("https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [majors, setMajors] = useState([
    { code: "RPL", title: "Rekayasa Perangkat Lunak" },
    { code: "TJKT", title: "Teknik Jaringan Komputer & Telekomunikasi" },
    { code: "DKV", title: "Desain Komunikasi Visual" },
    { code: "ANM", title: "Animasi" },
    { code: "BRF", title: "Broadcasting & Perfilman" },
    { code: "TE", title: "Teknik Elektronika" }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('ppdb-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      // eslint-disable-next-line
      setIsDark(true);
    }

    // Load initial fast values from localStorage if available
    const savedCost = localStorage.getItem('ppdb_reg_cost');
    if (savedCost) {
      const parsed = parseInt(savedCost);
      if (!isNaN(parsed)) setRegCost(parsed);
    }

    const savedPeriod = localStorage.getItem('ppdb_school_period');
    if (savedPeriod) {
      setSchoolPeriod(savedPeriod);
      setFormData(prev => ({ ...prev, periode: savedPeriod }));
    }

    const savedWaGroup = localStorage.getItem('ppdb_wa_group_url');
    if (savedWaGroup) {
      setWaGroupUrl(savedWaGroup);
    }

    const savedMajors = localStorage.getItem('ppdb_majors_config');
    if (savedMajors) {
      try {
        const parsed = JSON.parse(savedMajors);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMajors(parsed);
        }
      } catch (e) {
        console.log("Failed to parse custom majors config:", e);
      }
    }

    // Fetch live config dynamically from backend config endpoint
    const loadLiveConfig = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/config");
        const json = await res.json();
        if (json.success && json.data) {
          const config = json.data;
          try {
            if (config.ppdb_form_fee) {
              const parsed = parseInt(config.ppdb_form_fee);
              if (!isNaN(parsed)) {
                setRegCost(parsed);
                localStorage.setItem('ppdb_reg_cost', config.ppdb_form_fee);
              }
            }
            if (config.ppdb_school_period) {
              setSchoolPeriod(config.ppdb_school_period);
              setFormData(prev => ({ ...prev, periode: config.ppdb_school_period }));
              localStorage.setItem('ppdb_school_period', config.ppdb_school_period);
            }
            if (config.ppdb_wa_group_url) {
              setWaGroupUrl(config.ppdb_wa_group_url);
              localStorage.setItem('ppdb_wa_group_url', config.ppdb_wa_group_url);
            }
            if (config.ppdb_majors_config && Array.isArray(config.ppdb_majors_config) && config.ppdb_majors_config.length > 0) {
              setMajors(config.ppdb_majors_config);
              localStorage.setItem('ppdb_majors_config', JSON.stringify(config.ppdb_majors_config));
            }
          } catch (storageErr) {
            console.warn("Storage quota exceeded or unavailable. LocalStorage config cache sync bypassed.", storageErr);
          }
        }
      } catch (err) {
        console.log("Failed to fetch live config on registration page, using local storage fallback:", err);
      }
    };
    loadLiveConfig();
  }, []);

  // Read URL query params for payment success/failure redirects
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      const nisn = params.get("nisn");
      if (payment === "success" && nisn) {
        const forceVerifyAndShowSuccess = async () => {
          try {
            // Automatically confirm/force-verify payment gateway transaction
            const backendUrl = "http://localhost:5000";
            await fetch(`${backendUrl}/api/payment/confirm-payment-option`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nisn: nisn,
                bukti_bayar: null,
                metode_pembayaran: "Payment Gateway"
              })
            });
            setFormData(prev => ({ ...prev, nisn: nisn }));
            setIsSuccess(true);
            fetchPublicApplicants?.();
          } catch (err) {
            console.log("Error force verifying redirected payment status:", err);
          }
        };
        forceVerifyAndShowSuccess();
      }
    }
  }, [checkPaymentStatus, fetchPublicApplicants]);

  // Fetch full details upon success to render the clean congrats sheet and high-fidelity invoice
  useEffect(() => {
    if (isSuccess) {
      const targetNisn = formData.nisn || (submittedCandidate && (submittedCandidate.nisn || submittedCandidate.nisn));
      if (targetNisn) {
        const fetchSuccessData = async () => {
          try {
            const backendUrl = "http://localhost:5000";
            const res = await fetch(`${backendUrl}/api/applicants/public-invoice/${targetNisn}`);
            const json = await res.json();
            if (json.success && json.data) {
              setSuccessData(json.data);
            }
          } catch (err) {
            console.log("Failed to fetch success candidate details:", err);
          }
        };
        fetchSuccessData();
      }
    }
  }, [isSuccess, formData.nisn, submittedCandidate]);

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

  // majors is now a state variable loaded dynamically from localStorage on mount.

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
      let cleanValue = value.replace(/\D/g, "");
      if (cleanValue.startsWith("0")) {
        cleanValue = "+62" + cleanValue.slice(1);
      } else if (cleanValue.startsWith("62")) {
        cleanValue = "+" + cleanValue;
      } else if (cleanValue && !cleanValue.startsWith("+62")) {
        cleanValue = "+62" + cleanValue;
      }
      cleanValue = cleanValue.slice(0, 16);
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
    if (wizardStep === 1) {
      if (!formData.nama || formData.nama.trim() === "") {
        alert("Nama Lengkap wajib diisi!");
        return;
      }
      if (!formData.jenisKelamin) {
        alert("Jenis Kelamin wajib dipilih!");
        return;
      }
      if (!formData.nisn || formData.nisn.length !== 10) {
        alert("NISN wajib diisi dan harus tepat 10 digit angka!");
        return;
      }
      if (!formData.nik || formData.nik.length !== 16) {
        alert("NIK wajib diisi dan harus tepat 16 digit angka!");
        return;
      }
      if (!formData.tempatLahir || !formData.tglLahir) {
        alert("Tempat dan Tanggal Lahir wajib diisi!");
        return;
      }
      if (!formData.agama) {
        alert("Agama wajib dipilih!");
        return;
      }
    }

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
    if (step > 1 && wizardStep === 1) {
      if (!formData.nama || formData.nama.trim() === "") {
        alert("Nama Lengkap wajib diisi!");
        return;
      }
      if (!formData.jenisKelamin) {
        alert("Jenis Kelamin wajib dipilih!");
        return;
      }
      if (!formData.nisn || formData.nisn.length !== 10) {
        alert("NISN wajib diisi dan harus tepat 10 digit angka!");
        return;
      }
      if (!formData.nik || formData.nik.length !== 16) {
        alert("NIK wajib diisi dan harus tepat 16 digit angka!");
        return;
      }
      if (!formData.tempatLahir || !formData.tglLahir) {
        alert("Tempat dan Tanggal Lahir wajib diisi!");
        return;
      }
      if (!formData.agama) {
        alert("Agama wajib dipilih!");
        return;
      }
    }
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

    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 lg:p-10 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 print:bg-white print:p-0">
        
        {/* CSS print override style block to hide headers/footers (localhost URL) and fix blank page */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            /* Hide all non-printable elements */
            .bg-glow-container, .print-hide-sidebar, .floating-action-nav, button, a, nav, header, footer {
              display: none !important;
            }
            
            /* Reset parent wrappers to normal block display with visible overflow */
            body, html, main, #__next, .min-h-screen, .relative, .grid, .col-span-12, .col-span-7, .max-w-6xl {
              display: block !important;
              overflow: visible !important;
              background: white !important;
              color: black !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              box-shadow: none !important;
              border: none !important;
            }
            
            /* Apply custom padding and formatting on the invoice sheet itself */
            .printable-invoice-sheet {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 1.5cm !important;
              box-shadow: none !important;
              border: none !important;
              background: white !important;
            }
            
            @page {
              size: auto;
              margin: 0mm; /* hides default browser header (title) and footer (localhost URL) */
            }
          }
        `}} />

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
                href={waGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-6 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow shadow-emerald-500/20 transition duration-300"
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
            <Link href="/" className="w-full flex justify-center items-center py-3 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-355 font-bold text-xs rounded-xl transition-all">
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* DESKTOP VIEW (Congrats + Merged Invoice Side-by-Side, screen >= 1024px) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 max-w-6xl w-full relative z-10 items-start">
          
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
                  href={waGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow shadow-emerald-500/10 transition"
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
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-755 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/15 transition transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <Printer size={14} />
                Cetak Invoice Resmi (PDF)
              </button>

              <Link href="/" className="w-full flex justify-center items-center gap-1.5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider rounded-xl transition">
                <Home size={13} />
                Kembali ke Beranda
              </Link>
            </div>

          </div>

          {/* Right Column: Detailed High-Fidelity Printable Invoice Container */}
          <div className="lg:col-span-7 w-full bg-white text-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200/50 print-full-width relative overflow-hidden invoice-sheet-container printable-invoice-sheet">
            
            {/* Elegant official diagonal stamp seal inside sheet */}
            {successData.payment_status === "Paid" ? (
              <div className="absolute top-28 right-8 border-4 border-emerald-500/60 text-emerald-500/60 font-black text-sm uppercase tracking-widest px-4 py-2 rounded-xl rotate-[-12deg] pointer-events-none select-none z-10 bg-white/70 backdrop-blur-xs font-mono">
                LUNAS / VERIFIED
              </div>
            ) : (
              <div className="absolute top-28 right-8 border-4 border-amber-500/60 text-amber-500/60 font-black text-xs uppercase tracking-widest px-3 py-1.5 rounded-xl rotate-[-12deg] pointer-events-none select-none z-10 bg-white/70 backdrop-blur-xs font-mono">
                PROSES VERIFIKASI
              </div>
            )}

            {/* School Letterhead */}
            <div className="flex items-center gap-4 border-b-4 border-double border-slate-800 pb-4 mb-6">
              <img src="/logo_smktb.png" alt="Logo SMK Taruna Bhakti" className="w-14 h-14 object-contain" onError={(e:any) => e.target.src = "https://smktarunabhakti.sch.id/wp-content/uploads/2019/02/cropped-logo-tb-32x32.png"} />
              <div className="text-left">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-0.5">Panitia Penerimaan Peserta Didik Baru</h4>
                <h2 className="text-lg font-black text-slate-900 leading-tight">SMK TARUNA BHAKTI DEPOK</h2>
                <p className="text-[9px] font-bold text-slate-500">Terakreditasi A · Jl. Pekapuran No. 22, Cimanggis, Depok, Jawa Barat</p>
                <p className="text-[9px] text-slate-400">Telp: (021) 874 7475 · Website: www.smktarunabhakti.sch.id</p>
              </div>
            </div>

            {/* Invoice Header */}
            <div className="text-center mb-6">
              <h1 className="text-base font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 inline-block pb-1.5 mb-1.5">TANDA BUKTI REGISTRASI & INVOICE PEMBAYARAN</h1>
              <p className="text-[10px] font-mono font-bold text-slate-450">Nomor Dokumen: INV-{successData.nisn}</p>
            </div>

            {/* Invoice details layout: 2-Columns grid */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4.5 text-[10px] leading-relaxed text-left text-slate-700 font-bold mb-6">
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">No. Invoice:</span>
                  <span className="text-slate-900 font-mono font-extrabold">INV-{successData.nisn}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">Tanggal Daftar:</span>
                  <span className="text-slate-900">{tglDaftarFormatted}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">Periode Ajaran:</span>
                  <span className="text-slate-900 font-extrabold">{successData.periode || schoolPeriod}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">Nama Pendaftar:</span>
                  <span className="text-slate-900 uppercase font-extrabold">{successData.nama}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">NISN Pendaftar:</span>
                  <span className="text-slate-900 font-mono font-extrabold">{successData.nisn}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">Program Rombel:</span>
                  <span className="text-blue-600 font-extrabold uppercase">{successData.jurusan_1 || successData.jurusan1 || "-"}</span>
                </div>
              </div>
            </div>

            {/* Fee item details table */}
            <table className="w-full text-left text-[11px] font-bold text-slate-700 border-collapse mb-6">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-450">
                  <th className="py-2.5">Deskripsi Alokasi Tagihan</th>
                  <th className="py-2.5 text-right w-36">Jumlah (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 text-slate-900 font-extrabold">
                    Biaya Registrasi Formulir PPDB SMK Taruna Bhakti
                    <span className="block text-[9px] font-bold text-slate-400 mt-0.5">Alokasi administrasi berkas dan formulir online</span>
                  </td>
                  <td className="py-3 text-right text-slate-900 font-black">
                    Rp { regCost.toLocaleString("id-ID") }
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Bottom Total summary */}
            <div className="flex justify-end mb-6">
              <div className="w-64 space-y-1.5 text-[10px] font-bold">
                <div className="flex justify-between text-slate-500 py-1.5 border-b border-slate-100">
                  <span>Subtotal:</span>
                  <span>Rp {regCost.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-550">
                  <span>Pajak (PPN 0%):</span>
                  <span>Nihil</span>
                </div>
                <div className="flex justify-between text-slate-955 font-black text-xs py-2 border-t-2 border-slate-800">
                  <span>Total Tagihan:</span>
                  <span className="text-blue-600 font-black text-sm">Rp {regCost.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* Payment Details footer and official approval stamp */}
            <div className="flex justify-between items-center text-[9px] text-slate-500 leading-normal border-t border-slate-150 pt-4 mb-8 print:hidden">
              <div className="flex gap-4">
                <div>
                  <span className="font-black">Metode Bayar:</span> <span className="text-slate-800 font-bold uppercase">{successData.metode_pembayaran}</span>
                </div>
                <div>
                  <span className="font-black">Status Bayar:</span> <span className={`font-black uppercase ${successData.payment_status === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}`}>{successData.payment_status === 'Paid' ? 'LUNAS (VERIFIED)' : 'PENDING'}</span>
                </div>
              </div>
              <p className="text-[8px] font-bold text-slate-400">
                * Tanda terima digital PPDB SMK Taruna Bhakti.
              </p>
            </div>

            {/* Dual Signature Block */}
            <div className="grid grid-cols-2 gap-8 text-[11px] font-bold text-slate-800 text-left pt-6 relative border-t-2 border-dashed border-slate-200">
              
              {/* Visual circle approved seal watermark */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] select-none pointer-events-none">
                <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="#10B981" strokeWidth="4" />
                  <text x="50" y="42" fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle">SMK TB</text>
                  <text x="50" y="52" fill="#10B981" fontSize="10" fontWeight="black" textAnchor="middle">VERIFIED</text>
                  <text x="50" y="62" fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle">APPROVED</text>
                </svg>
              </div>

              {/* Left Signature: Kepala Sekolah */}
              <div className="flex flex-col justify-between h-36">
                <div>
                  <p className="text-slate-500 font-medium">Mengetahui,</p>
                  <p className="text-slate-850 font-black">Kepala SMK Taruna Bhakti</p>
                </div>
                <div>
                  <span className="font-black text-slate-900 border-b border-slate-900 pb-0.5 uppercase tracking-wide">
                    AINA NOVERA, S.Pd., MM
                  </span>
                </div>
              </div>

              {/* Right Signature: Ketua Pelaksana */}
              <div className="flex flex-col justify-between h-36 pl-12">
                <div>
                  <p className="text-slate-500 font-medium">Depok, {tglDaftarFormatted}</p>
                  <p className="text-slate-855 font-black">Ketua Pelaksana</p>
                </div>
                <div>
                  <span className="font-black text-slate-900 border-b border-slate-900 pb-0.5 uppercase tracking-wide font-mono">
                    RATNA WATI, SE
                  </span>
                </div>
              </div>

            </div>

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
                console.log("Midtrans payment result:", result);
                let detail = "Payment Gateway";
                if (result) {
                  const paymentChannel = result.payment_type || 'Midtrans';
                  let channelDetail = paymentChannel;
                  if (paymentChannel === 'bank_transfer' && result.va_numbers?.[0]) {
                    channelDetail = `Bank Transfer (${result.va_numbers[0].bank?.toUpperCase()})`;
                  } else if (paymentChannel === 'bank_transfer' && result.permata_va_number) {
                    channelDetail = `Bank Transfer (PERMATA)`;
                  } else if (paymentChannel === 'credit_card') {
                    channelDetail = `Credit Card`;
                  } else if (paymentChannel === 'cstore') {
                    channelDetail = `Retail Store (${result.store?.toUpperCase() || ''})`;
                  } else if (paymentChannel === 'qris') {
                    channelDetail = `QRIS`;
                  } else if (paymentChannel === 'gopay') {
                    channelDetail = `GoPay`;
                  } else if (paymentChannel === 'shopeepay') {
                    channelDetail = `ShopeePay`;
                  }
                  detail = `Payment Gateway (Midtrans - ${channelDetail})`;
                }
                handleConfirmOption(detail);
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
            alert("Sistem pembayaran online belum siap, silakan coba lagi dalam beberapa detik.");
          }
        } else {
          alert("Gagal membuat transaksi: " + data.message);
        }
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    };

    const handleCopy = (text: string, type: 'mandiri' | 'bjb') => {
      navigator.clipboard.writeText(text);
      setCopiedBank(type);
      setTimeout(() => setCopiedBank(null), 2000);
    };

    const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      if (file.size > 3 * 1024 * 1024) {
        alert("Ukuran bukti pembayaran maksimal adalah 3MB!");
        return;
      }
      
      const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      if (!allowed.includes(file.type)) {
        alert("Format file harus JPG, PNG, atau PDF!");
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
        const backendUrl = "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/payment/confirm-payment-option`, {
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
          setPaymentPolling(false);
          setShowPaymentGate(false);
          setFormData(prev => ({ ...prev, nisn: submittedCandidate.nisn }));
          setIsSuccess(true);
          fetchPublicApplicants?.();
        } else {
          alert("Gagal mengonfirmasi pembayaran: " + data.message);
        }
      } catch (err: any) {
        alert("Error: " + err.message);
      } finally {
        setIsSubmittingReceipt(false);
      }
    };

    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 lg:p-10 overflow-hidden">
        {/* Background Glowing Blobs */}
        <div className="bg-glow-container">
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
          <div className="bg-glow bg-glow-3"></div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800/80 shadow-2xl rounded-[2.5rem] p-6 md:p-10 lg:p-12 max-w-7xl w-full relative z-10 animate-in fade-in zoom-in duration-300">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Grid Layout: Left Side (Billing Summary), Right Side (Payment Options) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left Side: Summary Panel (Col Span 4) */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-[2rem] p-8 relative overflow-hidden">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-650 text-white rounded-2xl flex items-center justify-center shadow-md">
                    <CreditCard size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-sky-400 bg-blue-50/75 dark:bg-blue-950/60 border border-blue-100/55 dark:border-blue-900/50 px-3 py-1.5 rounded-full shadow-xs">
                      Checkout PPDB
                    </span>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1.5 leading-none">Metode Pembayaran</h3>
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed font-bold">
                  Selesaikan biaya pendaftaran untuk merampungkan berkas administrasi Anda di SMK Taruna Bhakti.
                </p>

                {/* Billing Summary Box */}
                <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-[1.5rem] p-6 relative overflow-hidden shadow-md">
                  <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
                    <Sparkles size={64} className="text-blue-600 animate-pulse" />
                  </div>
                  
                  <div className="flex justify-between items-center mb-4.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Jumlah Tagihan</span>
                    <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-650 to-indigo-650 dark:from-sky-455 dark:to-indigo-400">Rp {regCost.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/85 pt-4 text-xs text-slate-655 dark:text-slate-350 space-y-3 font-bold">
                    <div className="flex justify-between gap-2.5">
                      <span className="text-slate-400 dark:text-slate-500">Nama Lengkap:</span>
                      <span className="text-slate-900 dark:text-white font-extrabold text-right uppercase tracking-wider">{submittedCandidate.nama}</span>
                    </div>
                    <div className="flex justify-between gap-2.5">
                      <span className="text-slate-400 dark:text-slate-500">NISN Pendaftar:</span>
                      <span className="text-slate-900 dark:text-white font-mono font-black text-right tracking-widest">{submittedCandidate.nisn}</span>
                    </div>
                    <div className="flex justify-between gap-2.5">
                      <span className="text-slate-400 dark:text-slate-500">Pilihan Rombel:</span>
                      <span className="text-blue-600 dark:text-sky-400 text-right font-black uppercase">{submittedCandidate.jurusan_1 || submittedCandidate.jurusan1}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-8 lg:mt-0 pt-6 border-t border-slate-250/20 dark:border-slate-850 text-[10px] text-slate-400 dark:text-slate-500 font-black justify-center tracking-wide">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span>Enkripsi SSL & Keamanan Terjamin</span>
              </div>
            </div>

            {/* Right Side: Payment Form Selection (Col Span 8) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                {/* 2-Option Tabs Switcher (Large and Spacious) */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/65 mb-8 shadow-inner">
                  <button
                    onClick={() => setActivePaymentTab("transfer")}
                    className={`flex-1 py-4.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-3 ${activePaymentTab === "transfer"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-md border border-slate-200/20"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
                    }`}
                  >
                    <Building size={18} />
                    <span>Transfer Manual</span>
                  </button>
                  <button
                    onClick={() => setActivePaymentTab("midtrans")}
                    className={`flex-1 py-4.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-3 ${activePaymentTab === "midtrans"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-md border border-slate-200/20"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
                    }`}
                  >
                    <CreditCard size={18} />
                    <span>Payment Gateway</span>
                  </button>
                </div>

                {/* Tab Content 1: Transfer Manual (Spacious accounts Cards) */}
                {activePaymentTab === "transfer" && (
                  <div className="text-left space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold text-center">
                      Silakan lakukan transfer ke salah satu rekening yayasan sekolah resmi berikut, lalu unggah slip bukti transfer.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Mandiri Card with Real SVG Logo - Enlarge Text */}
                      <div className="bg-slate-50/70 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-[1.5rem] p-6 flex justify-between items-center transition hover:border-blue-500/40 hover:shadow-md">
                        <div className="space-y-3 w-full pr-4">
                          <svg className="h-7 w-auto" viewBox="0 0 120 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="120" height="35" rx="6" fill="#0A2F5C"/>
                            <path d="M15 22C18.5 15.5 25.5 11 30 11C33.5 11 35.5 13 35.5 16C35.5 20 28.5 25 21 25C18.5 25 15 24 15 22Z" fill="#F2A900" />
                            <text x="42" y="22" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="system-ui, sans-serif">mandiri</text>
                          </svg>
                          <div>
                            <p className="font-mono text-base md:text-lg lg:text-xl font-black text-slate-850 dark:text-white tracking-widest">157-00-0174092-2</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">a.n. Yayasan Taruna Bhakti</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy("157-00-0174092-2", "mandiri")}
                          className="p-3.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/50 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl transition shadow-sm shrink-0"
                          title="Copy Rekening"
                        >
                          {copiedBank === "mandiri" ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </div>

                      {/* BJB Card with Real SVG Logo - Enlarge Text */}
                      <div className="bg-slate-50/70 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-[1.5rem] p-6 flex justify-between items-center transition hover:border-blue-500/40 hover:shadow-md">
                        <div className="space-y-3 w-full pr-4">
                          <svg className="h-7 w-auto" viewBox="0 0 120 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="120" height="35" rx="6" fill="#00529C" />
                            <path d="M15 10 C18 10 24 14 24 18 C24 22 18 26 15 26 Z" fill="#FFD100" />
                            <path d="M22 10 C25 10 31 14 31 18 C31 22 25 26 22 26 Z" fill="#FFFFFF" />
                            <text x="38" y="22" fill="#FFFFFF" fontSize="13" fontWeight="955" fontFamily="system-ui, sans-serif" fontStyle="italic">bank bjb</text>
                          </svg>
                          <div>
                            <p className="font-mono text-base md:text-lg lg:text-xl font-black text-slate-850 dark:text-white tracking-widest">0010260271100</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">a.n. SMK Taruna Bhakti</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy("0010260271100", "bjb")}
                          className="p-3.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/50 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl transition shadow-sm shrink-0"
                          title="Copy Rekening"
                        >
                          {copiedBank === "bjb" ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* File Upload receipt - Enlarge Area */}
                    <div className="space-y-2.5">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Unggah Bukti Pembayaran Resmi</label>
                      <div className="border-2 border-dashed border-slate-250 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-[1.5rem] py-10 px-6 text-center transition bg-slate-50/20 dark:bg-slate-950/5 relative">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleReceiptFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                          <Upload size={28} className="text-blue-500 animate-pulse" />
                          <p className="text-xs md:text-sm font-black text-slate-750 dark:text-slate-200 truncate max-w-[450px]">
                            {manualReceiptName ? manualReceiptName : "Pilih File Foto Slip Transfer / Dokumen PDF"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold">Format file diperbolehkan: JPG, PNG, PDF (Maksimal file 3MB)</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleConfirmOption("Transfer Manual", manualReceiptBase64)}
                      disabled={!manualReceiptBase64 || isSubmittingReceipt}
                      className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs md:text-sm uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-lg disabled:opacity-40 disabled:pointer-events-none transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-2"
                    >
                      {isSubmittingReceipt ? "Mengirim Bukti..." : "Kirim Bukti Transfer Sekarang"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* Tab Content 2: Payment Gateway (Enlarge details) */}
                {activePaymentTab === "midtrans" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200 text-center lg:text-left">
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold text-center">
                      Bayar instan secara aman 24/7 menggunakan QRIS, e-Wallet (Gopay, ShopeePay), Virtual Account Bank (BCA, Mandiri, BNI, BRI), atau Kartu Kredit.
                    </p>

                    <div className="flex items-center justify-center gap-3 py-4 px-6 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-655 dark:text-slate-400 shadow-inner">
                      <span className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-blue-500 border-t-transparent shrink-0"></span>
                      <span>Sistem siap menerima pembayaran instan otomatis...</span>
                    </div>

                    <div className="space-y-4">
                      <button 
                        onClick={handlePay}
                        className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs md:text-sm uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-lg shadow-blue-500/15 transition transform hover:scale-[1.01] active:scale-[0.99]"
                      >
                        Bayar Sekarang via Payment Gateway
                        <ArrowRight size={16} />
                      </button>

                      {/* Simulation Bypass Button */}
                      <button
                        onClick={() => handleConfirmOption("Payment Gateway")}
                        className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 font-bold py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-800 text-xs transition uppercase tracking-wider"
                      >
                        Simulasi Bayar Sukses (Bypass Admin)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

        <div className="flex justify-between items-center mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-100 dark:bg-slate-800/80 -translate-y-1/2 z-0 rounded-full"></div>
          <div
            className="absolute top-1/2 left-0 h-[3px] bg-blue-600 dark:bg-blue-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
            style={{ width: `${((wizardStep - 1) / 12) * 100}%` }}
          ></div>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((step) => {
            const isCompleted = wizardStep > step;
            const isCurrent = wizardStep === step;
            return (
              <div
                key={step}
                onClick={() => goToStep(step)}
                title={`Tahap ${step}`}
                className={`rounded-full z-10 transition-all duration-500 ease-out cursor-pointer select-none relative ${
                  isCurrent
                    ? "w-7 h-7 bg-blue-600 dark:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.65)] scale-125 ring-[6px] ring-blue-500/20"
                    : isCompleted
                      ? "w-4.5 h-4.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 ring-[4px] ring-blue-500/10"
                      : "w-4 h-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500"
                }`}
              >
                {/* Clean indicator dot for active step to look premium */}
                {isCurrent && (
                  <span className="absolute inset-1.5 bg-white rounded-full animate-pulse"></span>
                )}
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
                <input type="text" inputMode="tel" name="whatsapp" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 081234567890" value={formData.whatsapp} onChange={handleInputChange} />
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
                  {majors.map((major) => {
                    const option = `${major.title} (${major.code})`;
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
                  <input type="text" inputMode="tel" name="teleponOrtu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Nomor yang mudah dihubungi" value={formData.teleponOrtu} onChange={handleInputChange} />
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

        {/* STEP 13: DEKLARASI & KONFIRMASI (NO UPLOADS) */}
        {wizardStep === 13 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 13: Berkas & Konfirmasi</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              Konfirmasi data pendaftaran Anda dan tinjau persyaratan berkas fisik.
            </p>

            {/* Premium Notice Box - Expanded and Amber Highlighted */}
            <div className="bg-amber-500/[0.07] dark:bg-amber-500/[0.03] border-2 border-amber-500/30 rounded-[2.5rem] p-8 md:p-10 mb-8 shadow-lg shadow-amber-500/[0.02]">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-14 h-14 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-500/20 animate-bounce">
                  <AlertCircle size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 dark:text-amber-400 text-lg md:text-xl mb-2 tracking-tight">
                    PENTING: Informasi Verifikasi Berkas Fisik Calon Siswa
                  </h4>
                  <p className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed mb-6 font-semibold">
                    Anda <span className="text-amber-600 dark:text-amber-400 font-black underline underline-offset-4">tidak perlu mengunggah berkas digital</span> di dalam formulir online ini. Sebagai gantinya, silakan lengkapi dan bawa berkas fisik/fotokopi berikut ini langsung ke panitia PPDB di sekolah saat melakukan proses verifikasi langsung:
                  </p>
                  
                  {/* Grid of Documents */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Kartu Keluarga (KK)", desc: "1 Lembar Fotokopi Sah" },
                      { title: "KTP Orang Tua / Wali", desc: "1 Lembar Fotokopi (Kedua Orang Tua / Wali)" },
                      { title: "Akta Kelahiran", desc: "1 Lembar Fotokopi Sah" },
                      { title: "Pas Foto Berwarna (3x4)", desc: "2 Lembar (Latar Belakang Merah atau Biru)" },
                      { title: "SKL / Ijazah SMP Asal", desc: "1 Lembar Fotokopi (Bisa disusulkan jika belum lulus)" }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex gap-4 items-center p-4 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 shadow-md shadow-slate-100/50 dark:shadow-none hover:border-amber-500/30 transition-all duration-300 hover:scale-[1.01]">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-450 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-500/20">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">{doc.title}</p>
                          <p className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">{doc.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="form-group">
              <label className="flex items-start gap-3.5 cursor-pointer p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 transition-all hover:bg-slate-100/60 dark:hover:bg-slate-900/40">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 accent-blue-600 rounded border-slate-350 dark:border-slate-700 shrink-0 cursor-pointer"
                  checked={formData.deklarasi}
                  onChange={(e) => setFormData(prev => ({ ...prev, deklarasi: e.target.checked }))}
                />
                <span className="text-xs md:text-sm text-slate-650 dark:text-slate-350 leading-relaxed cursor-pointer font-medium">
                  <strong>Pernyataan Kebenaran Data:</strong> Saya menyatakan dengan sadar dan penuh tanggung jawab bahwa seluruh data yang saya isikan di dalam formulir pendaftaran online ini adalah benar, lengkap, dan sesuai dengan dokumen asli. Apabila di kemudian hari ditemukan ketidaksesuaian atau pemalsuan data, saya bersedia menerima sanksi administrasi termasuk pembatalan pendaftaran di SMK Taruna Bhakti.
                </span>
              </label>
              {!formData.deklarasi && (
                <p className="text-rose-500 text-xs mt-3 ml-2 font-bold animate-pulse flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Wajib menyetujui pernyataan kebenaran data untuk mengirim pendaftaran.
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
                (wizardStep === 13 && !formData.deklarasi)
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
