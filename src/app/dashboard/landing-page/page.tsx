"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Settings, 
  Palette, 
  Globe, 
  RefreshCw, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Coins, 
  Layers, 
  Check, 
  Cpu, 
  BookOpen, 
  Video, 
  PlusCircle, 
  X,
  AlertCircle,
  ListOrdered,
  ArrowRightCircle,
  CreditCard,
  Users,
  Award,
  ShieldCheck
} from "lucide-react";

interface AlurItem {
  id: number;
  title: string;
  desc: string;
}

const DEFAULT_ALUR: AlurItem[] = [
  { id: 1, title: "Pendaftaran Online", desc: "Calon peserta didik mendaftar secara online melalui portal wizard PPDB dan mengisi data lengkap." },
  { id: 2, title: "Simulasi / Gateway Pembayaran", desc: "Melakukan pembayaran administrasi pendaftaran sebesar Rp 150.000" },
  { id: 3, title: "Verifikasi & Konfirmasi", desc: "Konfirmasi data pendaftaran otomatis secara real-time via WhatsApp di 08119892324." },
  { id: 4, title: "Pemberkasan & Seragam", desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik dan ukur seragam siswa baru." },
  { id: 5, title: "Uji Kelayakan (Tes Seleksi)", desc: "Mengikuti serangkaian tes bakat minat, wawancara kepribadian, serta tes kesehatan/fisik dasar calon siswa." },
  { id: 6, title: "Pengumuman & Kelulusan", desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru melalui web smktarunabhakti.net." }
];

interface MajorItem {
  code: string;
  title: string;
  desc: string;
  color: string;
  careers: string;
  facilities: string;
  logo?: string;
}

const DEFAULT_MAJORS: MajorItem[] = [
  {
    code: "RPL",
    title: "Rekayasa Perangkat Lunak",
    logo: "/jurusan/pplg.jpeg",
    desc: "Belajar pemrograman web, aplikasi mobile, game development, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
    color: "#0066ff",
    careers: "Software Engineer, Web Developer, Mobile Developer, Game Designer, AI Specialist",
    facilities: "Lab iMac Core-i9, Smart Classroom, AWS Cloud Academy, Google Developer Partner Studio"
  },
  {
    code: "TJKT",
    title: "Teknik Jaringan Komputer & Telekomunikasi",
    logo: "/jurusan/tjkt.jpeg",
    desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
    color: "#0ea5e9",
    careers: "Network Engineer, Cloud Administrator, Cybersecurity Analyst, System Administrator",
    facilities: "CISCO Networking Academy Lab, Mikrotik Academy Lab, Cyber Security Operations Center"
  },
  {
    code: "DKV",
    title: "Desain Komunikasi Visual",
    logo: "/jurusan/dkv.jpeg",
    desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
    color: "#6366f1",
    careers: "UI/UX Designer, Graphic Designer, Illustrator, Creative Director, Brand Specialist",
    facilities: "Wacom Creative Studio, Photo & Video Lighting Lab, Digital Illustration Studio"
  },
  {
    code: "BC",
    title: "Broadcasting & Perfilman",
    logo: "/jurusan/bc.jpeg",
    desc: "Pelajari dunia penyiaran televisi, podcasting, penulisan naskah, penyutradaraan film, tata kamera, serta editing video profesional.",
    color: "#f59e0b",
    careers: "Video Editor, Cameraman, Director, Scriptwriter, Podcast Producer, Content Creator",
    facilities: "Green Screen Studio, Professional TV Control Room, Podcast Soundproof Studio"
  },
  {
    code: "ANM",
    title: "Animasi",
    logo: "/jurusan/animasijpeg.jpeg",
    desc: "Kuasai seni pemodelan 2D/3D, karakter rigging, rendering, digital sculpting, storyboard, serta visual effects (VFX) standar industri perfilman.",
    color: "#ec4899",
    careers: "3D Animator, 2D Animator, 3D Modeler, Storyboard Artist, VFX Compositor, Character Designer",
    facilities: "iMac Render Farm Studio, Wacom Cintiq Digital Drawing Lab, Motion Capture Lab, Sound Recording Room"
  },
  {
    code: "TE",
    title: "Teknik Elektronika",
    logo: "/jurusan/te.jpeg",
    desc: "Pelajari teknologi mikroprosesor, Internet of Things (IoT), robotika cerdas, automasi industri, dan smart home system.",
    color: "#10b981",
    careers: "IoT Engineer, Robotics Technician, Automation Programmer, Hardware Specialist",
    facilities: "Robotics Design Lab, IoT Smart-Home Prototype Sandbox, Microcontroller Lab"
  }
];

export default function LandingPageConfigurator() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"landing" | "form" | "majors" | "alur">("landing");
  
  // Toasts / Notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form states - Landing Page
  const [heroTitle, setHeroTitle] = useState("");
  const [heroTitleSub, setHeroTitleSub] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Form states - Form Config
  const [schoolPeriod, setSchoolPeriod] = useState("");
  const [regCost, setRegCost] = useState("");

  // Form states - Alur
  const [alurList, setAlurList] = useState<AlurItem[]>([]);

  // Form states - Majors/Competencies
  const [majorsList, setMajorsList] = useState<MajorItem[]>([]);
  const [editingMajor, setEditingMajor] = useState<MajorItem | null>(null);
  const [isAddingMajor, setIsAddingMajor] = useState(false);
  const [majorForm, setMajorForm] = useState<MajorItem>({
    code: "",
    title: "",
    desc: "",
    color: "#3b82f6",
    careers: "",
    facilities: "",
    logo: "/logo_smktb.png"
  });

  // API Helper
  const saveConfig = async (key: string, value: any) => {
    try {
      // Simpan ke localStorage agar langsung update di landing page
      localStorage.setItem(key, typeof value === "object" ? JSON.stringify(value) : value);

      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ key, value })
      });
    } catch (err) {
      console.error("Gagal menyimpan ke backend", err);
    }
  };

  // Load all configurations on mount
  useEffect(() => {
    setMounted(true);

    const loadConfig = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/config");
        const data = await res.json();
        
        if (data.success && data.data) {
          const config = data.data;
          setHeroTitle(config.ppdb_hero_title || "Penerimaan Siswa Baru");
          setHeroTitleSub(config.ppdb_hero_title_sub || "Portal PPDB SMK Taruna Bhakti");
          setHeroSubtitle(config.ppdb_hero_subtitle || "Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.");
          setPhone(config.ppdb_phone || "(021) 8740756");
          setEmail(config.ppdb_email || "info@smktarunabhakti.sch.id");
          setAddress(config.ppdb_address || "Jl. Pekapuran Kel. Curug Kec. Cimanggis, Depok, Jawa Barat 16453");
          
          setSchoolPeriod(config.ppdb_school_period || "2026-2027");
          setRegCost(config.ppdb_reg_cost || "Rp 250.000");

          setAlurList(config.ppdb_alur_config || DEFAULT_ALUR);
          setMajorsList(config.ppdb_majors_config || DEFAULT_MAJORS);
        } else {
          // Defaults if no data in DB
          setHeroTitle("Penerimaan Siswa Baru");
          setHeroTitleSub("Portal PPDB SMK Taruna Bhakti");
          setHeroSubtitle("Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.");
          setPhone("(021) 8740756");
          setEmail("info@smktarunabhakti.sch.id");
          setAddress("Jl. Pekapuran Kel. Curug Kec. Cimanggis, Depok, Jawa Barat 16453");
          setSchoolPeriod("2026-2027");
          setRegCost("Rp 250.000");
          setAlurList(DEFAULT_ALUR);
          setMajorsList(DEFAULT_MAJORS);
        }
      } catch (err) {
        console.error("Gagal mengambil konfigurasi", err);
      }
    };

    loadConfig();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSaveLanding = async () => {
    await saveConfig("ppdb_hero_title", heroTitle);
    await saveConfig("ppdb_hero_title_sub", heroTitleSub);
    await saveConfig("ppdb_hero_subtitle", heroSubtitle);
    await saveConfig("ppdb_phone", phone);
    await saveConfig("ppdb_email", email);
    await saveConfig("ppdb_address", address);

    showToast("Konfigurasi Landing Page berhasil disimpan ke Server!");
  };

  const handleSaveFormSettings = async () => {
    await saveConfig("ppdb_school_period", schoolPeriod);
    await saveConfig("ppdb_reg_cost", regCost);

    showToast("Konfigurasi Form Pendaftaran berhasil disimpan ke Server!");
  };

  // Reset landing to default
  const handleResetLanding = async () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan semua data Landing Page ke setelan bawaan pabrik?")) {
      const defHeroTitle = "Penerimaan Siswa Baru";
      const defHeroTitleSub = "Portal PPDB SMK Taruna Bhakti";
      const defHeroSubtitle = "Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.";
      const defPhone = "(021) 8740756";
      const defEmail = "info@smktarunabhakti.sch.id";
      const defAddress = "Jl. Pekapuran Kel. Curug Kec. Cimanggis, Depok, Jawa Barat 16453";

      setHeroTitle(defHeroTitle);
      setHeroTitleSub(defHeroTitleSub);
      setHeroSubtitle(defHeroSubtitle);
      setPhone(defPhone);
      setEmail(defEmail);
      setAddress(defAddress);
      
      await saveConfig("ppdb_hero_title", defHeroTitle);
      await saveConfig("ppdb_hero_title_sub", defHeroTitleSub);
      await saveConfig("ppdb_hero_subtitle", defHeroSubtitle);
      await saveConfig("ppdb_phone", defPhone);
      await saveConfig("ppdb_email", defEmail);
      await saveConfig("ppdb_address", defAddress);
      
      showToast("Data Landing Page berhasil di-reset!");
    }
  };

  // Reset form to default
  const handleResetForm = async () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan setelan biaya & periode form ke default?")) {
      setSchoolPeriod("2026-2027");
      setRegCost("Rp 250.000");

      await saveConfig("ppdb_school_period", "2026-2027");
      await saveConfig("ppdb_reg_cost", "Rp 250.000");

      showToast("Setelan Form berhasil di-reset!");
    }
  };

  // Alur Logic
  const handleAlurChange = (id: number, field: "title" | "desc", value: string) => {
    setAlurList(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSaveAlur = async () => {
    await saveConfig("ppdb_alur_config", alurList);
    showToast("Alur pendaftaran berhasil disimpan ke Server!");
  };

  const handleResetAlur = async () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan alur ke bawaan pabrik?")) {
      setAlurList(DEFAULT_ALUR);
      await saveConfig("ppdb_alur_config", DEFAULT_ALUR);
      showToast("Alur pendaftaran berhasil di-reset!");
    }
  };

  // Majors CRUD Logic
  const handleSaveMajors = async (updatedList: MajorItem[]) => {
    setMajorsList(updatedList);
    await saveConfig("ppdb_majors_config", updatedList);
  };

  const handleEditMajorClick = (major: MajorItem) => {
    setEditingMajor(major);
    setMajorForm({ ...major });
    setIsAddingMajor(false);
  };

  const handleAddMajorClick = () => {
    setEditingMajor(null);
    setMajorForm({
      code: "",
      title: "",
      desc: "",
      color: "#3b82f6",
      careers: "",
      facilities: "",
      logo: "/logo_smktb.png"
    });
    setIsAddingMajor(true);
  };

  const handleSaveMajorForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!majorForm.code || !majorForm.title || !majorForm.desc) {
      showToast("Kode, Nama Jurusan, dan Deskripsi wajib diisi!", "error");
      return;
    }

    const cleanCode = majorForm.code.toUpperCase().replace(/\s+/g, "");
    const cleanForm = { ...majorForm, code: cleanCode };

    let updatedList: MajorItem[] = [];

    if (isAddingMajor) {
      // Check for duplicate code
      if (majorsList.some(m => m.code === cleanCode)) {
        showToast(`Jurusan dengan Kode ${cleanCode} sudah ada!`, "error");
        return;
      }
      updatedList = [...majorsList, cleanForm];
      showToast(`Jurusan ${cleanForm.title} berhasil ditambahkan!`);
    } else if (editingMajor) {
      updatedList = majorsList.map(m => m.code === editingMajor.code ? cleanForm : m);
      showToast(`Jurusan ${cleanForm.title} berhasil diperbarui!`);
    }

    handleSaveMajors(updatedList);
    setIsAddingMajor(false);
    setEditingMajor(null);
  };

  const handleDeleteMajor = (code: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Program Keahlian "${title}" (${code}) dari daftar PPDB?`)) {
      const updatedList = majorsList.filter(m => m.code !== code);
      handleSaveMajors(updatedList);
      showToast(`Program Keahlian ${title} berhasil dihapus!`);
    }
  };

  const handleResetMajors = () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan daftar Program Keahlian ke setelan default sekolah (6 jurusan utama)?")) {
      handleSaveMajors(DEFAULT_MAJORS);
      setMajorsList(DEFAULT_MAJORS);
      showToast("Daftar Program Keahlian di-reset ke default!");
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500">
      
      {/* Dynamic Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.2)] border text-xs font-bold animate-in slide-in-from-bottom duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900" 
            : "bg-rose-50 dark:bg-rose-950/90 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900"
        }`}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Intro Header */}
      <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden border border-blue-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] uppercase font-bold tracking-widest">Kustomisasi Dinamis</span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide">Studio Desain & Konfigurator PPDB</h2>
          <p className="text-xs text-blue-100 font-semibold leading-relaxed">
            Kelola konten Landing Page utama sekolah, periode ajaran aktif, biaya pendaftaran calon siswa, hingga Program Keahlian/Kompetensi yang tersedia. Semua perubahan langsung aktif seketika pada halaman pengunjung.
          </p>
        </div>
      </div>

      {/* Tabs Selector Layout */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        <button
          onClick={() => { setActiveTab("landing"); setIsAddingMajor(false); setEditingMajor(null); }}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-t-2xl text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "landing"
              ? "border-blue-500 text-blue-600 dark:text-white bg-white dark:bg-slate-900/50"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <Globe size={14} />
          <span>Landing Page Utama</span>
        </button>

        <button
          onClick={() => { setActiveTab("form"); setIsAddingMajor(false); setEditingMajor(null); }}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-t-2xl text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "form"
              ? "border-blue-500 text-blue-600 dark:text-white bg-white dark:bg-slate-900/50"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <FileText size={14} />
          <span>Form Pendaftaran</span>
        </button>

        <button
          onClick={() => { setActiveTab("majors"); setIsAddingMajor(false); setEditingMajor(null); }}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-t-2xl text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "majors"
              ? "border-blue-500 text-blue-600 dark:text-white bg-white dark:bg-slate-900/50"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <Layers size={14} />
          <span>Daftar Jurusan PPDB</span>
        </button>

        <button
          onClick={() => { setActiveTab("alur"); setIsAddingMajor(false); setEditingMajor(null); }}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-t-2xl text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "alur"
              ? "border-blue-500 text-blue-600 dark:text-white bg-white dark:bg-slate-900/50"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <ListOrdered size={14} />
          <span>Alur Pendaftaran</span>
        </button>
      </div>

      {/* Main Form Content Panels */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">
        
        {/* TAB 1: LANDING PAGE CONFIG */}
        {activeTab === "landing" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-white">Konten Banner Utama & Kontak Sekolah</h3>
              <button 
                onClick={handleResetLanding}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-850 dark:hover:text-white transition-all shadow-sm"
              >
                <RefreshCw size={12} />
                <span>Reset ke Default</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Judul Hero Utama</label>
                <input 
                  type="text" 
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Contoh: Penerimaan Siswa Baru"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sub-Judul Hero / Logo Text</label>
                <input 
                  type="text" 
                  value={heroTitleSub}
                  onChange={(e) => setHeroTitleSub(e.target.value)}
                  placeholder="Contoh: Portal PPDB SMK Taruna Bhakti"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Teks Deskripsi Hero (Subtitle)</label>
                <textarea 
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Teks pengantar di banner depan..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5"><Phone size={12} /> No. Telepon Sekolah</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(021) 8740756"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5"><Mail size={12} /> Email Sekolah</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@smktarunabhakti.sch.id"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5"><MapPin size={12} /> Alamat Sekolah Fisik</label>
                <textarea 
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat lengkap..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
              <button 
                onClick={handleSaveLanding}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-wider transition-all shadow-md hover:shadow-blue-500/20"
              >
                <Save size={14} />
                <span>Simpan Landing Page</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: FORM CONFIG */}
        {activeTab === "form" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-white">Pengaturan Periode & Biaya Administrasi</h3>
              <button 
                onClick={handleResetForm}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-850 dark:hover:text-white transition-all shadow-sm"
              >
                <RefreshCw size={12} />
                <span>Reset ke Default</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5"><Calendar size={12} /> Tahun Ajaran / Periode</label>
                <input 
                  type="text" 
                  value={schoolPeriod}
                  onChange={(e) => setSchoolPeriod(e.target.value)}
                  placeholder="Contoh: 2026-2027"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <p className="text-[10px] text-slate-450 font-semibold italic">Mempengaruhi label tahun ajaran yang tercantum di formulir pendaftaran.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5"><Coins size={12} /> Nominal Biaya Pendaftaran (Rp)</label>
                <input 
                  type="text" 
                  value={regCost}
                  onChange={(e) => setRegCost(e.target.value)}
                  placeholder="Contoh: Rp 250.000"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <p className="text-[10px] text-slate-450 font-semibold italic">Nominal yang dicantumkan pada Midtrans Simulator dan Lembar Tagihan/Invoice.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
              <button 
                onClick={handleSaveFormSettings}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-wider transition-all shadow-md hover:shadow-blue-500/20"
              >
                <Save size={14} />
                <span>Simpan Pengaturan Form</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ALUR PENDAFTARAN */}
        {activeTab === "alur" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-white">Alur Pendaftaran PPDB</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Ubah judul dan deskripsi dari tiap tahap alur pendaftaran.</p>
              </div>
              <button 
                onClick={handleResetAlur}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-850 dark:hover:text-white transition-all shadow-sm"
              >
                <RefreshCw size={12} />
                <span>Reset ke Default</span>
              </button>
            </div>

            <div className="space-y-4">
              {alurList.map((item) => (
                <div key={item.id} className="p-5 border border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl flex flex-col md:flex-row gap-4">
                  <div className="flex shrink-0">
                    <span className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
                      {item.id}
                    </span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      value={item.title}
                      onChange={(e) => handleAlurChange(item.id, "title", e.target.value)}
                      placeholder={`Judul Tahap 0${item.id}`}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <textarea 
                      rows={2}
                      value={item.desc}
                      onChange={(e) => handleAlurChange(item.id, "desc", e.target.value)}
                      placeholder="Deskripsi langkah..."
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-medium text-xs focus:outline-none focus:border-blue-500 transition-all leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
              <button 
                onClick={handleSaveAlur}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-wider transition-all shadow-md hover:shadow-blue-500/20"
              >
                <Save size={14} />
                <span>Simpan Alur</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: PROGRAM STUDI (JURUSAN) CONFIG */}
        {activeTab === "majors" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-white">Program Keahlian Terdaftar ({majorsList.length})</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Daftar Jurusan PPDB yang aktif untuk calon siswa</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleResetMajors}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-850 dark:hover:text-white transition-all shadow-sm"
                  title="Kembalikan ke 6 jurusan utama SMK Taruna Bhakti"
                >
                  <RefreshCw size={12} />
                  <span>Reset Jurusan</span>
                </button>

                <button 
                  onClick={handleAddMajorClick}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-[10px] uppercase font-black tracking-wider transition-all shadow-sm shadow-blue-500/10"
                >
                  <PlusCircle size={12} />
                  <span>Tambah Jurusan</span>
                </button>
              </div>
            </div>

            {/* Editing / Adding Panel */}
            {(isAddingMajor || editingMajor) && (
              <form onSubmit={handleSaveMajorForm} className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                    {isAddingMajor ? "Tambah Program Keahlian Baru" : `Edit Program Keahlian: ${editingMajor?.title}`}
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => { setIsAddingMajor(false); setEditingMajor(null); }}
                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-850 dark:hover:text-white transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Kode Singkat Jurusan</label>
                    <input 
                      type="text"
                      value={majorForm.code}
                      onChange={(e) => setMajorForm({ ...majorForm, code: e.target.value })}
                      placeholder="Misal: DKV, RPL, TKJ"
                      disabled={!!editingMajor}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 disabled:opacity-50 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 transition-all uppercase"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Lengkap Kompetensi Keahlian</label>
                    <input 
                      type="text"
                      value={majorForm.title}
                      onChange={(e) => setMajorForm({ ...majorForm, title: e.target.value })}
                      placeholder="Contoh: Rekayasa Perangkat Lunak"
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Warna Identitas Jurusan</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color"
                        value={majorForm.color}
                        onChange={(e) => setMajorForm({ ...majorForm, color: e.target.value })}
                        className="w-10 h-10 border border-slate-200 dark:border-white/5 rounded-xl cursor-pointer p-0 bg-transparent shrink-0"
                      />
                      <input 
                        type="text"
                        value={majorForm.color}
                        onChange={(e) => setMajorForm({ ...majorForm, color: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-mono font-bold text-xs uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Lokasi Path Foto / Logo</label>
                    <input 
                      type="text"
                      value={majorForm.logo}
                      onChange={(e) => setMajorForm({ ...majorForm, logo: e.target.value })}
                      placeholder="/jurusan/rpl.jpeg"
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Fasilitas Laboratorium & Kelas</label>
                    <input 
                      type="text"
                      value={majorForm.facilities}
                      onChange={(e) => setMajorForm({ ...majorForm, facilities: e.target.value })}
                      placeholder="Smart Classroom, CSOC, Lab iMac..."
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Teks Deskripsi Profil Jurusan</label>
                    <textarea 
                      rows={2}
                      value={majorForm.desc}
                      onChange={(e) => setMajorForm({ ...majorForm, desc: e.target.value })}
                      placeholder="Deskripsi komprehensif..."
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 transition-all leading-relaxed"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Peluang Karir / Profesi Lulusan</label>
                    <input 
                      type="text"
                      value={majorForm.careers}
                      onChange={(e) => setMajorForm({ ...majorForm, careers: e.target.value })}
                      placeholder="Software Engineer, Network Architect, Graphic Designer..."
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-white/5">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddingMajor(false); setEditingMajor(null); }}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-350 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all"
                  >
                    Batalkan
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] uppercase font-black tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Check size={12} />
                    <span>Simpan Jurusan</span>
                  </button>
                </div>
              </form>
            )}

            {/* Majors List Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {majorsList.map((major, idx) => {
                return (
                  <div 
                    key={major.code || idx}
                    className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 rounded-3xl p-5 hover:shadow-md transition-all flex flex-col group overflow-hidden"
                  >
                    {/* Color Accent Stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: major.color }} />

                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 shadow-sm"
                          style={{ backgroundColor: major.color }}
                        >
                          {major.logo ? (
                            <img src={major.logo} alt={major.code} className="w-full h-full object-cover" onError={(e: any) => { e.target.style.display = 'none'; }} />
                          ) : (
                            <span className="text-white font-black text-[10px]">{major.code}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-850 dark:text-white text-sm leading-tight truncate max-w-[150px]">{major.title}</h4>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{major.code}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditMajorClick(major)}
                          className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 hover:border-blue-500/30 text-slate-500 hover:text-blue-550 dark:hover:text-white rounded-xl transition-all shadow-sm"
                          title="Edit Jurusan"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteMajor(major.code, major.title)}
                          className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 hover:border-rose-500/30 text-slate-400 hover:text-rose-550 dark:hover:text-white rounded-xl transition-all shadow-sm"
                          title="Hapus Jurusan"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-semibold mb-4 flex-1">
                      {major.desc}
                    </p>

                    <div className="space-y-2 border-t border-slate-200/50 dark:border-white/5 pt-3 mt-auto text-[10px] font-semibold text-slate-450">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Lab / Fasilitas:</span>
                        <span className="text-slate-700 dark:text-slate-350 truncate block">{major.facilities || "Fasilitas Belum Diatur"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Karir Utama:</span>
                        <span className="text-slate-700 dark:text-slate-350 truncate block">{major.careers || "Karir Belum Diatur"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {majorsList.length === 0 && (
                <div className="md:col-span-2 xl:col-span-3 text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase tracking-wider">
                  Tidak ada program keahlian yang terdaftar. Klik "+ Tambah Jurusan" untuk membuat baru.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
