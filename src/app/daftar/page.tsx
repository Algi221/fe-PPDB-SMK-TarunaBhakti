"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Sun, 
  Moon, 
  ShieldCheck, 
  AlertCircle, 
  School, 
  User, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  BookOpen, 
  FileText,
  Printer,
  MessageSquare,
  Search,
  RefreshCw,
  X,
  CheckCheck
} from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";
import Swal from 'sweetalert2';
import { toggleThemeWithTransition } from "@/utils/themeTransition";

export default function DaftarTahapSatuPage() {
  const { ppdbLogo, ppdbTitle } = usePPDB();
  const schoolPeriod = "2027/2028";
  const [isDark, setIsDark] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  
  const [successData, setSuccessData] = useState<{
    noPendaftaran: string;
    kodeAkses: string;
    nama: string;
    jurusan: string;
    whatsapp?: string;
    nisn?: string;
    savedAt?: string;
  } | null>(null);

  const [storedCredentials, setStoredCredentials] = useState<{
    noPendaftaran: string;
    kodeAkses: string;
    nama: string;
    jurusan: string;
    whatsapp?: string;
    nisn?: string;
    savedAt?: string;
  } | null>(null);

  // Modal Lupa / Cek Kode
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [recoverNisn, setRecoverNisn] = useState("");
  const [recoverTglLahir, setRecoverTglLahir] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverError, setRecoverError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    // Kolom Kiri: Identitas & Alamat
    nama: "",
    nisn: "",
    noKK: "",
    jenisKelamin: "L",
    tempatLahir: "",
    tglLahir: "",
    agama: "Islam",
    alamat: "",
    kelurahan: "",
    kecamatan: "",
    kabupatenKota: "Kota Depok",

    // Kolom Kanan: Asal Sekolah, Ortu, Peminatan, Kontak
    sekolahAsal: "",
    namaAyah: "",
    namaIbu: "",
    pekerjaanAyah: "",
    pekerjaanIbu: "",
    teleponOrtu: "",
    whatsapp: "",
    anakKe: "1",
    jumlahSaudara: "1",
    jurusan1: "",
    email: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('ppdb-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    // Periksa apakah pernah mendaftar sebelumnya di browser ini
    try {
      const cached = localStorage.getItem('ppdb_tb_tahap1_credentials');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.noPendaftaran && parsed.kodeAkses) {
          setStoredCredentials(parsed);
        }
      }
    } catch (e) {
      console.warn("Gagal membaca cache pendaftaran:", e);
    }
  }, []);

  const toggleDark = (e?: React.MouseEvent<HTMLElement>) => {
    toggleThemeWithTransition(e?.currentTarget || null, isDark, setIsDark);
  };

  const JURUSAN_OPTIONS = [
    { code: "RPL", name: "Rekayasa Perangkat Lunak (PPLG)", desc: "Pemrograman Web, Mobile, Cloud, & AI" },
    { code: "TJKT", name: "Teknik Jaringan Komputer & Telekomunikasi", desc: "Cyber Security, Server, & Jaringan Cloud" },
    { code: "DKV", name: "Desain Komunikasi Visual", desc: "UI/UX, Grafis, Ilustrasi Digital, & Branding" },
    { code: "ANM", name: "Animasi", desc: "2D/3D Modeling, Rigging, & Visual Effects" },
    { code: "BC", name: "Broadcasting & Perfilman", desc: "Produksi Film, Podcast, TV, & Penyiaran" },
    { code: "TE", name: "Teknik Elektronika", desc: "IoT, Mikrokontroler, & Robotika Industri" }
  ];

  const AGAMA_OPTIONS = [
    "Islam",
    "Kristen Protestan",
    "Katolik",
    "Hindu",
    "Buddha",
    "Konghucu"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) newErrors.nama = "Nama lengkap wajib diisi";
    
    if (!formData.nisn.trim()) {
      newErrors.nisn = "NISN wajib diisi";
    } else if (!/^\d{10}$/.test(formData.nisn.trim())) {
      newErrors.nisn = "NISN harus berupa 10 digit angka";
    }

    if (!formData.noKK.trim()) {
      newErrors.noKK = "Nomor Kartu Keluarga wajib diisi";
    } else if (!/^\d{16}$/.test(formData.noKK.trim())) {
      newErrors.noKK = "Nomor KK harus berupa 16 digit angka";
    }

    if (!formData.tempatLahir.trim()) newErrors.tempatLahir = "Tempat lahir wajib diisi";
    if (!formData.tglLahir.trim()) newErrors.tglLahir = "Tanggal lahir wajib diisi";
    if (!formData.alamat.trim()) newErrors.alamat = "Alamat lengkap wajib diisi";
    if (!formData.kelurahan.trim()) newErrors.kelurahan = "Kelurahan wajib diisi";
    if (!formData.kecamatan.trim()) newErrors.kecamatan = "Kecamatan wajib diisi";
    if (!formData.kabupatenKota.trim()) newErrors.kabupatenKota = "Kabupaten/Kota wajib diisi";

    if (!formData.sekolahAsal.trim()) newErrors.sekolahAsal = "Asal sekolah (SMP/MTs) wajib diisi";
    if (!formData.namaAyah.trim()) newErrors.namaAyah = "Nama ayah wajib diisi";
    if (!formData.namaIbu.trim()) newErrors.namaIbu = "Nama ibu wajib diisi";

    if (!formData.teleponOrtu.trim()) {
      newErrors.teleponOrtu = "Nomor HP orang tua wajib diisi";
    } else if (!/^[0-9+ -]{8,16}$/.test(formData.teleponOrtu.trim())) {
      newErrors.teleponOrtu = "Format nomor HP tidak valid";
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "Nomor HP siswa wajib diisi";
    } else if (!/^[0-9+ -]{8,16}$/.test(formData.whatsapp.trim())) {
      newErrors.whatsapp = "Format nomor WhatsApp tidak valid";
    }

    if (!formData.jurusan1.trim()) newErrors.jurusan1 = "Peminatan jurusan wajib dipilih";

    if (!formData.email.trim()) {
      newErrors.email = "Alamat Gmail / Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Format email tidak valid (contoh: nama@gmail.com)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = document.querySelector('.border-rose-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nama: formData.nama.trim(),
        nisn: formData.nisn.trim(),
        noKK: formData.noKK.trim(),
        no_kk: formData.noKK.trim(),
        jenisKelamin: formData.jenisKelamin,
        tempatLahir: formData.tempatLahir.trim(),
        tglLahir: formData.tglLahir,
        agama: formData.agama,
        alamat: formData.alamat.trim(),
        kelurahan: formData.kelurahan.trim(),
        kecamatan: formData.kecamatan.trim(),
        kabupatenKota: formData.kabupatenKota.trim(),
        kabupaten_kota: formData.kabupatenKota.trim(),
        sekolahAsal: formData.sekolahAsal.trim(),
        namaAyah: formData.namaAyah.trim(),
        namaIbu: formData.namaIbu.trim(),
        pekerjaanAyah: formData.pekerjaanAyah.trim() || "-",
        pekerjaanIbu: formData.pekerjaanIbu.trim() || "-",
        teleponOrtu: formData.teleponOrtu.trim(),
        whatsapp: formData.whatsapp.trim(),
        anakKe: parseInt(formData.anakKe) || 1,
        jumlahSaudara: parseInt(formData.jumlahSaudara) || 1,
        jurusan1: formData.jurusan1,
        email: formData.email.trim()
      };

      const res = await fetch("http://localhost:5000/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal memproses pendaftaran");
      }

      const newCreds = {
        noPendaftaran: data.no_pendaftaran || data.data?.no_pendaftaran || "SPMB 2728-10-XXX",
        kodeAkses: data.kode_akses || data.data?.kode_akses || "TB-XXXXXX",
        nama: formData.nama.trim(),
        jurusan: formData.jurusan1,
        whatsapp: formData.whatsapp.trim(),
        nisn: formData.nisn.trim(),
        savedAt: new Date().toISOString()
      };

      setSuccessData(newCreds);
      setStoredCredentials(newCreds);
      try {
        localStorage.setItem("ppdb_tb_tahap1_credentials", JSON.stringify(newCreds));
      } catch (storageErr) {
        console.warn("Gagal menyimpan ke localStorage:", storageErr);
      }

    } catch (err: any) {
      console.error("Submit error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Pendaftaran Gagal',
        text: err.message || "Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.",
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (successData?.kodeAkses) {
      navigator.clipboard.writeText(successData.kodeAkses);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleCopyAll = () => {
    if (!successData) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const text = `BUKTI PENDAFTARAN TAHAP 1 - PPDB SMK TARUNA BHAKTI\n` +
      `Nama: ${successData.nama}\n` +
      `Nomor Pendaftaran: ${successData.noPendaftaran}\n` +
      `Kode Unik Rahasia (PIN): ${successData.kodeAkses}\n` +
      `Jurusan: ${successData.jurusan}\n` +
      `Lanjut Tahap 2: ${origin}/lengkapi_data?no=${encodeURIComponent(successData.noPendaftaran)}&code=${encodeURIComponent(successData.kodeAkses)}`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!successData) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const msg = `*BUKTI PENDAFTARAN TAHAP 1 - PPDB SMK TARUNA BHAKTI*\n\n` +
      `Halo *${successData.nama}*,\n` +
      `Data pendaftaran awal Anda telah tersimpan resmi di sistem PPDB SMK Taruna Bhakti.\n\n` +
      `*Nomor Pendaftaran:* ${successData.noPendaftaran}\n` +
      `*Kode Unik Rahasia (PIN):* ${successData.kodeAkses}\n` +
      `*Pilihan Jurusan:* ${successData.jurusan}\n\n` +
      `Lanjutkan pengisian berkas & data keluarga di Tahap 2 (Lengkapi Data) melalui tautan berikut:\n` +
      `${origin}/lengkapi_data?no=${encodeURIComponent(successData.noPendaftaran)}&code=${encodeURIComponent(successData.kodeAkses)}\n\n` +
      `_Harap simpan pesan ini dengan baik sebagai bukti pendaftaran resmi._`;

    const phone = (successData.whatsapp || formData.whatsapp || "").replace(/\D/g, "");
    const waUrl = phone
      ? `https://wa.me/${phone.startsWith("0") ? "62" + phone.slice(1) : phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverNisn.trim() || !recoverTglLahir.trim()) {
      setRecoverError("NISN dan Tanggal Lahir wajib diisi keduanya.");
      return;
    }
    setIsRecovering(true);
    setRecoverError("");

    try {
      const res = await fetch("http://localhost:5000/api/applicants/recover-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nisn: recoverNisn.trim(),
          tglLahir: recoverTglLahir.trim()
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Data pendaftaran tidak ditemukan.");
      }

      const recovered = {
        noPendaftaran: json.data.noPendaftaran,
        kodeAkses: json.data.kodeAkses,
        nama: json.data.nama,
        jurusan: json.data.jurusan,
        nisn: json.data.nisn,
        savedAt: new Date().toISOString()
      };

      setSuccessData(recovered);
      setStoredCredentials(recovered);
      try {
        localStorage.setItem("ppdb_tb_tahap1_credentials", JSON.stringify(recovered));
      } catch (e) {}
      setShowRecoverModal(false);

      Swal.fire({
        icon: 'success',
        title: 'Data Ditemukan!',
        text: `Nomor Pendaftaran dan PIN atas nama ${recovered.nama} berhasil dipulihkan.`,
        confirmButtonColor: '#2563eb'
      });
    } catch (err: any) {
      setRecoverError(err.message || "Gagal mencari data pendaftaran.");
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-between p-4 md:p-8 relative selection:bg-blue-500 selection:text-white transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-sky-500/10 dark:bg-sky-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Header Actions */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali</span>
        </Link>
      </div>

      <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5">
        <button 
          type="button"
          onClick={() => {
            setRecoverError("");
            setShowRecoverModal(true);
          }} 
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-lg shadow-slate-200/20 dark:shadow-none cursor-pointer" 
          title="Cari / Pulihkan Nomor Pendaftaran & Kode Unik"
        >
          <Search size={14} className="text-blue-500" />
          <span>Cek / Lupa PIN</span>
        </button>

        <button 
          onClick={(e) => toggleDark(e)} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs hover:scale-105 active:scale-95 group" 
          title={isDark ? "Mode Terang" : "Mode Gelap"}
          aria-label="Toggle Mode Gelap atau Terang"
        >
          {isDark ? (
            <Sun size={18} className="transition-transform duration-300 group-hover:rotate-45" />
          ) : (
            <Moon size={18} className="transition-transform duration-300 group-hover:-rotate-12" />
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl relative z-10 my-8">

        {/* Success Modal / Screen */}
        {successData ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 md:p-10 text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300 printable-slip">
            
            {/* Kop Kartu Pendaftaran */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 text-left">
              <div className="flex items-center gap-3">
                {ppdbLogo ? (
                  <img src={ppdbLogo} alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    TB
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-850 dark:text-white uppercase leading-tight">
                    SMK TARUNA BHAKTI DEPOK
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Tanda Bukti Pendaftaran Awal (Tahap 1) &bull; TA {schoolPeriod}
                  </p>
                </div>
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                Tahap 1 Berhasil
              </span>
            </div>

            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 mb-4 shadow-inner no-print">
              <CheckCircle2 size={36} />
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-1.5">
              Pendaftaran Berhasil Dikirim!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-md mx-auto mb-6">
              Selamat <strong className="text-slate-800 dark:text-slate-200">{successData.nama}</strong>, data identitas pendaftaran awal Anda telah tersimpan di sistem PPDB SMK Taruna Bhakti.
            </p>

            {/* Ticket Credentials Box */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-6 mb-6 text-left shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Nomor Pendaftaran
                  </span>
                  <span className="font-mono text-lg md:text-xl font-black text-blue-600 dark:text-sky-400 tracking-wider block">
                    {successData.noPendaftaran}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                    Pilihan: <strong className="text-slate-700 dark:text-slate-300">{successData.jurusan}</strong>
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Kode Unik Rahasia (PIN)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-xs text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 flex items-center gap-1 font-bold cursor-pointer no-print"
                    >
                      {copiedCode ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copiedCode ? "Tersalin!" : "Salin"}</span>
                    </button>
                  </div>
                  <span className="font-mono text-lg md:text-xl font-black text-amber-600 dark:text-amber-400 tracking-widest bg-amber-500/10 dark:bg-amber-500/15 px-3 py-1.5 rounded-xl border border-amber-500/30 inline-block">
                    {successData.kodeAkses}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Gunakan untuk login Tahap 2
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-700 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-slate-800 dark:text-white">PENTING:</strong> Catat dan simpan <strong>Nomor Pendaftaran</strong> &amp; <strong>Kode Unik</strong> ini. Anda memerlukan kedua data ini untuk mengisi <strong>Tahap 2 (Lengkapi Data)</strong>.
                </p>
              </div>
            </div>

            {/* Quick Action Tools: WhatsApp, Print/PDF, Copy All */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 no-print">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer shadow-sm"
                title="Kirim dan simpan data ini ke chat WhatsApp"
              >
                <MessageSquare size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Simpan di WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer shadow-sm"
                title="Cetak atau Simpan sebagai PDF"
              >
                <Printer size={14} />
                <span>Cetak / Unduh PDF</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAll}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-sky-300 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all cursor-pointer shadow-sm"
                title="Salin seluruh informasi pendaftaran ke clipboard"
              >
                {copiedAll ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copiedAll ? "Tersalin Semua!" : "Salin Semua Info"}</span>
              </button>
            </div>

            {/* Navigation Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 no-print">
              <Link
                href={`/lengkapi_data?no=${encodeURIComponent(successData.noPendaftaran)}&code=${encodeURIComponent(successData.kodeAkses)}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Lanjut ke Tahap 2 (Lengkapi Data)</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={() => setSuccessData(null)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup Kartu
              </button>
            </div>
          </div>
        ) : (
          /* Pendaftaran Tahap 1 Form */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem] p-6 md:p-10 relative">

            {/* Header Document Style matching physical form */}
            <div className="text-center pb-8 mb-8 border-b-2 border-slate-100 dark:border-slate-800">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                <FileText size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Formulir Pendaftaran Tahap 1</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-850 dark:text-white uppercase tracking-tight">
                Data Identitas Calon Murid
              </h1>
              <p className="text-base md:text-lg font-bold text-slate-700 dark:text-slate-300 mt-1 uppercase">
                SMK Taruna Bhakti Depok
              </p>
              <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Tahun Ajaran 2027/2028 (Seleksi Penerimaan Murid Baru)
              </p>

              <div className="mt-4 inline-block bg-slate-100 dark:bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                No. Pendaftaran : <span className="text-blue-600 dark:text-blue-400 font-bold">SPMB 2728-10-..... (Otomatis Diterbitkan)</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                {/* ===================== KOLOM KIRI ===================== */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-blue-600 dark:text-sky-400 font-extrabold text-sm uppercase tracking-wider">
                    <User size={16} />
                    <span>Identitas Calon Siswa &amp; Alamat</span>
                  </div>

                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => handleInputChange("nama", e.target.value)}
                      placeholder="Masukkan nama lengkap sesuai ijazah"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.nama ? 'border-rose-500 dark:border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.nama && <p className="text-xs text-rose-500 mt-1">{errors.nama}</p>}
                  </div>

                  {/* NISN & No KK (2 columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        NISN (10 Digit) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={formData.nisn}
                        onChange={(e) => handleInputChange("nisn", e.target.value.replace(/\D/g, ''))}
                        placeholder="Contoh: 0081234567"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.nisn ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.nisn && <p className="text-xs text-rose-500 mt-1">{errors.nisn}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        No. Kartu Keluarga <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        value={formData.noKK}
                        onChange={(e) => handleInputChange("noKK", e.target.value.replace(/\D/g, ''))}
                        placeholder="16 Digit No. KK"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.noKK ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.noKK && <p className="text-xs text-rose-500 mt-1">{errors.noKK}</p>}
                    </div>
                  </div>

                  {/* Jenis Kelamin */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Jenis Kelamin <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange("jenisKelamin", "L")}
                        className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          formData.jenisKelamin === "L"
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                            : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                        }`}
                      >
                        Laki-laki
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInputChange("jenisKelamin", "P")}
                        className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          formData.jenisKelamin === "P"
                            ? "bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-500/20"
                            : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                        }`}
                      >
                        Perempuan
                      </button>
                    </div>
                  </div>

                  {/* Tempat & Tanggal Lahir */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Tempat Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.tempatLahir}
                        onChange={(e) => handleInputChange("tempatLahir", e.target.value)}
                        placeholder="Contoh: Depok"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.tempatLahir ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.tempatLahir && <p className="text-xs text-rose-500 mt-1">{errors.tempatLahir}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Tanggal Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.tglLahir}
                        onChange={(e) => handleInputChange("tglLahir", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.tglLahir ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.tglLahir && <p className="text-xs text-rose-500 mt-1">{errors.tglLahir}</p>}
                    </div>
                  </div>

                  {/* Agama */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Agama <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.agama}
                      onChange={(e) => handleInputChange("agama", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      {AGAMA_OPTIONS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  {/* Alamat Lengkap */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Alamat Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.alamat}
                      onChange={(e) => handleInputChange("alamat", e.target.value)}
                      placeholder="Nama Jalan, Gang, RT/RW, No. Rumah"
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.alamat ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all resize-none`}
                    />
                    {errors.alamat && <p className="text-xs text-rose-500 mt-1">{errors.alamat}</p>}
                  </div>

                  {/* Wilayah: Kelurahan, Kecamatan, Kota (3 grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Kelurahan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.kelurahan}
                        onChange={(e) => handleInputChange("kelurahan", e.target.value)}
                        placeholder="Kelurahan"
                        className={`w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.kelurahan ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.kelurahan && <p className="text-[10px] text-rose-500 mt-0.5">{errors.kelurahan}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Kecamatan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.kecamatan}
                        onChange={(e) => handleInputChange("kecamatan", e.target.value)}
                        placeholder="Kecamatan"
                        className={`w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.kecamatan ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.kecamatan && <p className="text-[10px] text-rose-500 mt-0.5">{errors.kecamatan}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Kabupaten / Kota <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.kabupatenKota}
                        onChange={(e) => handleInputChange("kabupatenKota", e.target.value)}
                        placeholder="Kota Depok"
                        className={`w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.kabupatenKota ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.kabupatenKota && <p className="text-[10px] text-rose-500 mt-0.5">{errors.kabupatenKota}</p>}
                    </div>
                  </div>
                </div>

                {/* ===================== KOLOM KANAN ===================== */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-blue-600 dark:text-sky-400 font-extrabold text-sm uppercase tracking-wider">
                    <School size={16} />
                    <span>Sekolah, Orang Tua &amp; Peminatan</span>
                  </div>

                  {/* Asal Sekolah */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Asal Sekolah (SMP / MTs) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.sekolahAsal}
                      onChange={(e) => handleInputChange("sekolahAsal", e.target.value)}
                      placeholder="Contoh: SMPN 11 Depok"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.sekolahAsal ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.sekolahAsal && <p className="text-xs text-rose-500 mt-1">{errors.sekolahAsal}</p>}
                  </div>

                  {/* Orang Tua: Nama Ayah & Nama Ibu */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nama Ayah <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.namaAyah}
                        onChange={(e) => handleInputChange("namaAyah", e.target.value)}
                        placeholder="Nama lengkap ayah"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.namaAyah ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.namaAyah && <p className="text-xs text-rose-500 mt-1">{errors.namaAyah}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nama Ibu <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.namaIbu}
                        onChange={(e) => handleInputChange("namaIbu", e.target.value)}
                        placeholder="Nama lengkap ibu"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.namaIbu ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.namaIbu && <p className="text-xs text-rose-500 mt-1">{errors.namaIbu}</p>}
                    </div>
                  </div>

                  {/* Pekerjaan Ayah & Ibu */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Pekerjaan Ayah
                      </label>
                      <input
                        type="text"
                        value={formData.pekerjaanAyah}
                        onChange={(e) => handleInputChange("pekerjaanAyah", e.target.value)}
                        placeholder="Contoh: Karyawan Swasta"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Pekerjaan Ibu
                      </label>
                      <input
                        type="text"
                        value={formData.pekerjaanIbu}
                        onChange={(e) => handleInputChange("pekerjaanIbu", e.target.value)}
                        placeholder="Contoh: Ibu Rumah Tangga"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Kontak: No HP Ortu & Siswa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nomor HP Orang Tua <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.teleponOrtu}
                        onChange={(e) => handleInputChange("teleponOrtu", e.target.value)}
                        placeholder="Contoh: 0812XXXXXXXX"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.teleponOrtu ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.teleponOrtu && <p className="text-xs text-rose-500 mt-1">{errors.teleponOrtu}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nomor HP Siswa (WhatsApp) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                        placeholder="Contoh: 0898XXXXXXXX"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.whatsapp ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                      />
                      {errors.whatsapp && <p className="text-xs text-rose-500 mt-1">{errors.whatsapp}</p>}
                    </div>
                  </div>

                  {/* Anak ke & Dari Berapa Bersaudara */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Anak ke-
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.anakKe}
                        onChange={(e) => handleInputChange("anakKe", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Dari Berapa Bersaudara
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={formData.jumlahSaudara}
                        onChange={(e) => handleInputChange("jumlahSaudara", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Peminatan Jurusan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Peminatan Jurusan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.jurusan1}
                      onChange={(e) => handleInputChange("jurusan1", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.jurusan1 ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer font-medium`}
                    >
                      <option value="">-- Pilih Peminatan Jurusan --</option>
                      {JURUSAN_OPTIONS.map((j) => (
                        <option key={j.code} value={j.name}>
                          {j.name}
                        </option>
                      ))}
                    </select>
                    {errors.jurusan1 && <p className="text-xs text-rose-500 mt-1">{errors.jurusan1}</p>}
                  </div>

                  {/* Alamat Gmail / Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Alamat Gmail / Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="contoh: calon.siswa@gmail.com"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>

                </div>

              </div>

              {/* Submit Action Bar */}
              <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-rose-500 font-bold">*</span>
                  <span>Menandakan isian wajib diisi sesuai berkas fisik.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Menyimpan Pendaftaran...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Formulir Pendaftaran</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>

      {/* Modal Cek / Lupa Nomor Pendaftaran & PIN */}
      {showRecoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowRecoverModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-sky-400 mb-4">
              <Search size={24} />
            </div>

            <h3 className="text-lg font-black text-slate-850 dark:text-white">
              Cek / Pulihkan Data Pendaftaran
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
              Masukkan NISN dan Tanggal Lahir calon siswa untuk mencari kembali Nomor Pendaftaran &amp; Kode Unik (PIN) Anda.
            </p>

            <form onSubmit={handleRecover} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nomor Induk Siswa Nasional (NISN) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={recoverNisn}
                  onChange={(e) => setRecoverNisn(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 digit NISN Anda"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tanggal Lahir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={recoverTglLahir}
                  onChange={(e) => setRecoverTglLahir(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {recoverError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
                  {recoverError}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowRecoverModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!recoverNisn.trim() || !recoverTglLahir.trim() || isRecovering}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isRecovering ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Mencari...</span>
                    </>
                  ) : (
                    <>
                      <Search size={14} />
                      <span>Cari Data</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print CSS styling */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .no-print, header, nav, footer, button, a {
            display: none !important;
          }
          .printable-slip {
            box-shadow: none !important;
            border: 2px solid #000000 !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            color: #000000 !important;
          }
        }
      `}</style>

      {/* Footer minimal info */}
      <div className="text-center text-xs text-slate-600 dark:text-slate-350 relative z-10 py-4 no-print">
        &copy; {new Date().getFullYear()} SMK Taruna Bhakti Depok &bull; Seleksi Penerimaan Murid Baru (SPMB)
      </div>

    </div>
  );
}
