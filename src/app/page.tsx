"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Menu,
  ArrowRight,
  X,
  GraduationCap,
  FileText,
  Award,
  Milestone,
  Check,
  Upload,
  User,
  MapPin,
  Calendar,
  Bell,
  ArrowLeft,
  HelpCircle,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Cpu,
  Layers,
  Video,
  AlertCircle,
  Palette,
  Sun,
  Moon,
  Users,
  Phone,
  Megaphone,
  Clock,
  Radio,
  Search
} from "lucide-react";

import DataPendaftarTable from "../components/DataPendaftarTable";
import { usePPDB } from "@/context/PPDBContext";

interface InformasiItem {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
}

export default function Home() {
  const { publicApplicants, wsStatus } = usePPDB();
  const [rosterSearch, setRosterSearch] = useState("");
  const [selectedRosterClass, setSelectedRosterClass] = useState("Semua");

  // Navigation & UI States
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Dynamic Announcements/Informasi State
  const [informasi, setInformasi] = useState<InformasiItem[]>([]);
  const [loadingInformasi, setLoadingInformasi] = useState(true);
  const [selectedNews, setSelectedNews] = useState<InformasiItem | null>(null);

  // Dynamic Landing Page Config States
  const [heroTitle, setHeroTitle] = useState("Penerimaan Siswa Baru");
  const [heroTitleSub, setHeroTitleSub] = useState("Portal PPDB SMK Taruna Bhakti");
  const [heroSubtitle, setHeroSubtitle] = useState("Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.");
  const [phone, setPhone] = useState("(021) 8740756");
  const [email, setEmail] = useState("info@smktarunabhakti.sch.id");
  const [address, setAddress] = useState("Jl. Pekapuran Kel. Curug Kec. Cimanggis, Depok, Jawa Barat 16453");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [majors, setMajors] = useState([
    {
      code: "RPL",
      title: "Rekayasa Perangkat Lunak",
      icon: Cpu,
      logo: "/jurusan/pplg.jpeg",
      desc: "Belajar pemrograman web, aplikasi mobile, game development, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
      color: "#0066ff",
      careers: "Software Engineer, Web Developer, Mobile Developer, Game Designer, AI Specialist",
      facilities: "Lab iMac Core-i9, Smart Classroom, AWS Cloud Academy, Google Developer Partner Studio"
    },
    {
      code: "TJKT",
      title: "Teknik Jaringan Komputer & Telekomunikasi",
      icon: Layers,
      logo: "/jurusan/tjkt.jpeg",
      desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
      color: "#0ea5e9",
      careers: "Network Engineer, Cloud Administrator, Cybersecurity Analyst, System Administrator",
      facilities: "CISCO Networking Academy Lab, Mikrotik Academy Lab, Cyber Security Operations Center"
    },
    {
      code: "DKV",
      title: "Desain Komunikasi Visual",
      icon: BookOpen,
      logo: "/jurusan/dkv.jpeg",
      desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
      color: "#6366f1",
      careers: "UI/UX Designer, Graphic Designer, Illustrator, Creative Director, Brand Specialist",
      facilities: "Wacom Creative Studio, Photo & Video Lighting Lab, Digital Illustration Studio"
    },
    {
      code: "BC",
      title: "Broadcasting & Perfilman",
      icon: Video,
      logo: "/jurusan/bc.jpeg",
      desc: "Pelajari dunia penyiaran televisi, podcasting, penulisan naskah, penyutradaraan film, tata kamera, serta editing video profesional.",
      color: "#f59e0b",
      careers: "Video Editor, Cameraman, Director, Scriptwriter, Podcast Producer, Content Creator",
      facilities: "Green Screen Studio, Professional TV Control Room, Podcast Soundproof Studio"
    },
    {
      code: "ANM",
      title: "Animasi",
      icon: Palette,
      logo: "/jurusan/animasijpeg.jpeg",
      desc: "Kuasai seni pemodelan 2D/3D, karakter rigging, rendering, digital sculpting, storyboard, serta visual effects (VFX) standar industri perfilman.",
      color: "#ec4899",
      careers: "3D Animator, 2D Animator, 3D Modeler, Storyboard Artist, VFX Compositor, Character Designer",
      facilities: "iMac Render Farm Studio, Wacom Cintiq Digital Drawing Lab, Motion Capture Lab, Sound Recording Room"
    },
    {
      code: "TE",
      title: "Teknik Elektronika",
      icon: Cpu,
      logo: "/jurusan/te.jpeg",
      desc: "Pelajari teknologi mikroprosesor, Internet of Things (IoT), robotika cerdas, automasi industri, dan smart home system.",
      color: "#10b981",
      careers: "IoT Engineer, Robotics Technician, Automation Programmer, Hardware Specialist",
      facilities: "Robotics Design Lab, IoT Smart-Home Prototype Sandbox, Microcontroller Lab"
    }
  ]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchInformasi = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/informasi");
        const data = await res.json();
        if (data.success) {
          setInformasi(data.data);
        }
      } catch (e) {
        console.log("Failed to fetch public informasi:", e);
        setInformasi([
          {
            id: 101,
            judul: "Pendaftaran Peserta Didik Baru (PPDB) SMK Taruna Bhakti 2026/2027 Resmi Dibuka!",
            konten: "SMK Taruna Bhakti Depok resmi membuka pendaftaran bagi calon peserta didik baru untuk tahun ajaran 2026/2027. Tersedia 6 Program Keahlian unggulan yaitu Rekayasa Perangkat Lunak, Teknik Jaringan Komputer, Desain Komunikasi Visual, Broadcasting & Perfilman, Teknik Elektronika, dan Animasi. Segera lakukan registrasi online dan unggah berkas Anda sebelum kuota penuh!",
            tanggal: "2026-05-15",
            foto_url: ""
          },
          {
            id: 102,
            judul: "Sosialisasi Jurusan Baru: Teknik Elektronika (TE) dengan Fokus Robotika Industri",
            konten: "Menjawab tantangan revolusi industri 4.0, SMK Taruna Bhakti menghadirkan inovasi di jurusan Teknik Elektronika. Kurikulum diperkuat dengan pemelajaran mikrokontroler, IoT, PLC, dan Robotika Industri modern. Lulusan TE siap diserap oleh industri manufaktur dan teknologi terkemuka.",
            tanggal: "2026-05-20",
            foto_url: ""
          }
        ]);
      } finally {
        setLoadingInformasi(false);
      }
    };
    fetchInformasi();
  }, []);

  // Video Background Logic
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = ["/videos/vid1.mp4", "/videos/vid2.mp4"];
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log(e));
    }
  }, [currentVideo]);

  // Dark Mode
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ppdb-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    const savedTitle = localStorage.getItem('ppdb_hero_title');
    if (savedTitle) setHeroTitle(savedTitle);

    const savedTitleSub = localStorage.getItem('ppdb_hero_title_sub');
    if (savedTitleSub) setHeroTitleSub(savedTitleSub);

    const savedSubtitle = localStorage.getItem('ppdb_hero_subtitle');
    if (savedSubtitle) setHeroSubtitle(savedSubtitle);

    const savedPhone = localStorage.getItem('ppdb_phone');
    if (savedPhone) setPhone(savedPhone);

    const savedEmail = localStorage.getItem('ppdb_email');
    if (savedEmail) setEmail(savedEmail);

    const savedAddress = localStorage.getItem('ppdb_address');
    if (savedAddress) setAddress(savedAddress);

    const savedPeriod = localStorage.getItem('ppdb_school_period');
    if (savedPeriod) setSchoolPeriod(savedPeriod);

    const savedMajors = localStorage.getItem('ppdb_majors_config');
    if (savedMajors) {
      try {
        const parsed = JSON.parse(savedMajors);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const iconMap: Record<string, any> = {
            RPL: Cpu,
            TJKT: Layers,
            DKV: BookOpen,
            BC: Video,
            ANM: Palette,
            TE: Cpu
          };
          const mapped = parsed.map((m: any) => ({
            ...m,
            icon: iconMap[m.code] || Cpu
          }));
          setMajors(mapped);
        }
      } catch (e) {
        console.log("Failed to load dynamic majors configuration:", e);
      }
    }
  }, []);

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

  // Handle Scroll to make Navbar beautiful
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsNavbarScrolled(true);
      } else {
        setIsNavbarScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isMajorsVisible, setIsMajorsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMajorsVisible(true);
          observer.unobserve(entry.target); // Animate once
        }
      },
      { threshold: 0.05 }
    );
    const element = document.getElementById("majors");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  // Memoized Roster filters & unique class list
  const uniqueRosterClasses = useMemo(() => {
    const classesSet = new Set<string>();
    publicApplicants.forEach((a: any) => {
      const cls = a.diterima_kelas || a.diterimaKelas;
      if (cls) classesSet.add(cls);
    });
    return Array.from(classesSet).sort();
  }, [publicApplicants]);

  const filteredRosterStudents = useMemo(() => {
    return publicApplicants.filter((a: any) => {
      const hasClass = a.diterima_kelas || a.diterimaKelas;
      const isApproved = a.status === "Approved";
      if (!isApproved || !hasClass) return false;

      const matchesSearch = (a.nama || "").toLowerCase().includes(rosterSearch.toLowerCase()) || 
                            (a.nisn || "").includes(rosterSearch);
      
      if (selectedRosterClass === "Semua") return matchesSearch;
      
      const cls = a.diterima_kelas || a.diterimaKelas || "";
      return matchesSearch && cls === selectedRosterClass;
    });
  }, [publicApplicants, rosterSearch, selectedRosterClass]);

  // majors is now a dynamic state variable loaded from localStorage on mount.

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">

      {/* FLOATING NAVBAR */}
      <div className="navbar-wrapper">
        <nav className={`navbar ${isNavbarScrolled ? "scrolled" : ""}`}>
          <div className="nav-left">
            <a href="#" className="logo-container">
              <img src="/logo_smktb.png" alt="Logo SMK TB" className="w-9 h-9 object-contain" />
              <span className="logo-text font-extrabold">PPDB <span>SMK TB</span></span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <a href="#alur" className="btn-nav-link">Alur Pendaftaran</a>
            <a href="#majors" className="btn-nav-link">Jurusan</a>
            <Link href="/forum" className="btn-nav-link">Forum Informasi</Link>
            <a href="#kemitraan" className="btn-nav-link">Mitra Industri</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/daftar" className="btn-primary-pill hidden md:inline-flex">
              Daftar
            </Link>

            {/* Hamburger Button visible only on mobile/tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 z-[101]"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Fullscreen Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/98 backdrop-blur-2xl animate-in fade-in duration-300 md:hidden">
          {/* Decorative gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col items-center gap-6 text-center p-6 w-full max-w-sm relative z-10">
            <Link href="#" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 mb-6">
              <img src="/logo_smktb.png" alt="Logo SMK TB" className="w-12 h-12 object-contain" />
              <span className="text-2xl font-black text-slate-800 dark:text-white">PPDB <span className="text-blue-600 dark:text-blue-400">SMK TB</span></span>
            </Link>
            
            <a 
              href="#alur" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Alur Pendaftaran
            </a>
            <a 
              href="#majors" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Jurusan
            </a>
            <Link 
              href="/forum" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Forum Informasi
            </Link>
            <a 
              href="#kemitraan" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Mitra Industri
            </a>

            <div className="w-full flex flex-col gap-3 mt-8">
              <Link 
                href="/daftar" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 text-center text-sm font-black uppercase tracking-wider rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
              >
                Daftar Sekarang
              </Link>
              <button 
                onClick={() => { toggleDark(); setMobileMenuOpen(false); }}
                className="w-full py-4 text-center text-sm font-black uppercase tracking-wider rounded-2xl border border-slate-200 dark:border-slate-700/80 text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION WRAPPER */}
      <div className="relative w-full overflow-hidden">
        {/* Video Background - Full Width */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-100">
          <video
            ref={videoRef}
            src={videos[currentVideo]}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/60 backdrop-blur-sm"></div>
        </div>

        {/* HERO SECTION */}
        <section className="hero">

          {/* Floating elements representing major names as requested */}
          <Link href="/jurusan/rpl" className="floating-badge badge-aset">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <img src="/jurusan/pplg.jpeg" alt="RPL" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="badge-info">
              <span>PPLG</span>
            </div>
          </Link>

          <Link href="/jurusan/tjkt" className="floating-badge badge-peminjaman">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <img src="/jurusan/tjkt.jpeg" alt="TJKT" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="badge-info">
              <span>TJKT</span>
            </div>
          </Link>

          <Link href="/jurusan/te" className="floating-badge badge-te">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <img src="/jurusan/te.jpeg" alt="TE" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="badge-info">
              <span>TE</span>
            </div>
          </Link>

          <Link href="/jurusan/dkv" className="floating-badge badge-laporan">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <img src="/jurusan/dkv.jpeg" alt="DKV" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="badge-info">
              <span>DKV</span>
            </div>
          </Link>

          <Link href="/jurusan/an" className="floating-badge badge-animasi">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <img src="/jurusan/animasijpeg.jpeg" alt="Animasi" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="badge-info">
              <span>Animasi</span>
            </div>
          </Link>

          <Link href="/jurusan/bc" className="floating-badge badge-kelas">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <img src="/jurusan/bc.jpeg" alt="Broadcasting" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="badge-info">
              <span>Broadcasting</span>
            </div>
          </Link>

          {/* Hero Copy */}
          <div className="badge-wrapper relative z-10">
            <span className="badge-pill">SMK TARUNA BHAKTI DEPOK</span>
          </div>

          <h1 className="hero-title relative z-10">
            {heroTitle} <br />
            <span>{heroTitleSub}</span>
          </h1>

          <p className="hero-subtitle relative z-10">
            {heroSubtitle}
          </p>

          <div className="hero-action">
            <Link href="/daftar" className="btn-hero-action">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>

          {/* APP MOCKUP WRAPPER */}
          <div className="mockup-container relative z-10">
            <div className="app-mockup">

              {/* Mockup Browser Top bar */}
              <div className="mockup-browser-bar">
                <div className="browser-dots">
                  <span className="dot-red"></span>
                  <span className="dot-yellow"></span>
                  <span className="dot-green"></span>
                </div>
                <div className="browser-address">ppdb.smktarunabhakti.sch.id/dashboard</div>
                <div className="w-4"></div>
              </div>

              {/* Data Pendaftar Table View */}
              <div className="dashboard-view block w-full p-6 h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative z-10 rounded-2xl transition-colors duration-300">
                <DataPendaftarTable />
              </div>

            </div>
          </div>

        </section>
      </div>

      {/* ALUR PENDAFTARAN */}
      <section id="alur" className="py-24 bg-slate-50 dark:bg-slate-900/60 relative z-10 border-y border-slate-200/50 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full">Proses Mudah &amp; Transparan · TP. {schoolPeriod}</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-4 drop-shadow-sm">Alur Pendaftaran PPDB</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium">
              Ikuti 6 langkah sederhana berikut untuk menjadi bagian dari SMK Taruna Bhakti Depok.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-sky-400 to-indigo-500 transform -translate-x-1/2 z-0 rounded-full opacity-70"></div>
            <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-1 border-l-2 border-dashed border-white/40 dark:border-slate-950/40 transform -translate-x-1/2 z-0"></div>

            <div className="space-y-16 relative z-10">

              {/* Step 1: Left Card */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-20 items-center">
                <div className="pl-20 md:pl-0 md:pr-12 md:text-right">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300">
                    <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-500 dark:text-blue-400 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3">Tahap 01</span>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Pendaftaran Online</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Calon peserta didik mendaftar secara online melalui portal wizard PPDB dan mengisi data lengkap.</p>
                  </div>
                </div>
                <div className="hidden md:block"></div>
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 text-white flex items-center justify-center font-black text-lg z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300">
                  <FileText size={22} />
                </div>
              </div>

              {/* Step 2: Right Card */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-20 items-center">
                <div className="hidden md:block"></div>
                <div className="pl-20 md:pl-12 md:text-left">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:border-amber-500/20 hover:-translate-y-1 transition-all duration-300">
                    <span className="inline-block px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3">Tahap 02</span>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Simulasi / Gateway Pembayaran</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Melakukan pembayaran administrasi pendaftaran sebesar Rp 150.000</p>
                  </div>
                </div>
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-amber-500 border-4 border-white dark:border-slate-900 text-white flex items-center justify-center font-black text-lg z-10 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300">
                  <CreditCard size={22} />
                </div>
              </div>

              {/* Step 3: Left Card */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-20 items-center">
                <div className="pl-20 md:pl-0 md:pr-12 md:text-right">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:border-teal-500/20 hover:-translate-y-1 transition-all duration-300">
                    <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-950/60 text-teal-500 dark:text-teal-400 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3">Tahap 03</span>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Verifikasi & Konfirmasi</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Konfirmasi data pendaftaran otomatis secara real-time via WhatsApp di <span className="font-extrabold text-teal-600 dark:text-teal-400">08119892324</span>.</p>
                  </div>
                </div>
                <div className="hidden md:block"></div>
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-teal-500 border-4 border-white dark:border-slate-900 text-white flex items-center justify-center font-black text-lg z-10 shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300">
                  <Phone size={22} />
                </div>
              </div>

              {/* Step 4: Right Card */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-20 items-center">
                <div className="hidden md:block"></div>
                <div className="pl-20 md:pl-12 md:text-left">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:border-rose-500/20 hover:-translate-y-1 transition-all duration-300">
                    <span className="inline-block px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3">Tahap 04</span>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Pemberkasan & Seragam</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Datang langsung to school to verify physical original documents and measure new student uniforms.</p>
                  </div>
                </div>
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-rose-500 border-4 border-white dark:border-slate-900 text-white flex items-center justify-center font-black text-lg z-10 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all duration-300">
                  <Users size={22} />
                </div>
              </div>

              {/* Step 5: Left Card */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-20 items-center">
                <div className="pl-20 md:pl-0 md:pr-12 md:text-right">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:border-indigo-500/20 hover:-translate-y-1 transition-all duration-300">
                    <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3">Tahap 05</span>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Uji Kelayakan (Tes Seleksi)</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Mengikuti serangkaian tes bakat minat, wawancara kepribadian, serta tes kesehatan/fisik dasar calon siswa.</p>
                  </div>
                </div>
                <div className="hidden md:block"></div>
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 text-white flex items-center justify-center font-black text-lg z-10 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300">
                  <Award size={22} />
                </div>
              </div>

              {/* Step 6: Right Card */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-20 items-center">
                <div className="hidden md:block"></div>
                <div className="pl-20 md:pl-12 md:text-left">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
                    <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 dark:text-emerald-400 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3">Tahap 06</span>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Pengumuman & Kelulusan</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru melalui web <span className="font-extrabold text-emerald-600 dark:text-emerald-400">smktarunabhakti.net</span>.</p>
                  </div>
                </div>
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 text-white flex items-center justify-center font-black text-lg z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300">
                  <ShieldCheck size={22} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM KEAHLIAN / JURUSAN GRID */}
      <section id="majors" className="py-24 max-w-6xl mx-auto px-6 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Program Kompetensi Keahlian</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">Tersedia 6 jurusan unggulan dengan kurikulum berstandar industri nasional maupun internasional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {majors.map((major, index) => {
            return (
              <Link
                href={`/jurusan/${major.code.toLowerCase()}`}
                key={major.code}
                className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-700 cursor-pointer flex flex-col justify-between relative overflow-hidden group transform ${isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 to-sky-400 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-500 z-10"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-white border border-slate-100 shadow-md group-hover:shadow-xl group-hover:shadow-blue-500/20">
                    <img
                      src={major.logo}
                      alt={`Logo ${major.code}`}
                      className="w-14 h-14 object-contain drop-shadow-sm"
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-blue-50');
                        e.target.parentElement.innerHTML = `<div style="color:#0066ff;display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-weight:800;font-size:11px">${major.code}</div>`;
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-3">
                    {major.code === "AN" ? major.title : `${major.title} (${major.code})`}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{major.desc.substring(0, 105)}...</p>
                </div>
                <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors relative z-10">
                  Lihat Selengkapnya <ChevronRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEKSI DAFTAR ROMBEL SISWA RESMI (WEB SOCKET LIVE SYNC) */}
      <section className="py-24 max-w-6xl mx-auto px-6 relative z-10 border-t border-slate-200/30">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-full flex items-center gap-2 border border-blue-100 dark:border-blue-900/30">
              <span className={`w-2 h-2 rounded-full ${wsStatus === "CONNECTED" ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 animate-pulse"}`} />
              <span className="tracking-widest font-black uppercase">LIVE WS SYNC</span>
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mt-1 mb-4">
            Rombongan Belajar Resmi Siswa Baru
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Daftar resmi calon peserta didik baru SMK Taruna Bhakti periode {schoolPeriod} yang telah diverifikasi kelulusannya dan secara resmi dialokasikan ke dalam kelas rombel masing-masing.
          </p>
        </div>

        {/* Toolbar & Search */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={rosterSearch}
              onChange={(e) => setRosterSearch(e.target.value)}
              placeholder="Cari nama siswa atau NISN..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 transition-all font-semibold"
            />
          </div>

          {/* Dynamic Class Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-auto overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setSelectedRosterClass("Semua")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                selectedRosterClass === "Semua"
                  ? "bg-blue-650 border-blue-700 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 border-slate-200/50 hover:bg-slate-200/60 dark:bg-slate-800 dark:border-slate-700 text-slate-655 dark:text-slate-350"
              }`}
            >
              Semua Rombel
            </button>
            {uniqueRosterClasses.map((clsName) => (
              <button
                key={clsName}
                onClick={() => setSelectedRosterClass(clsName)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  selectedRosterClass === clsName
                    ? "bg-blue-650 border-blue-700 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 border-slate-200/50 hover:bg-slate-200/60 dark:bg-slate-800 dark:border-slate-700 text-slate-655 dark:text-slate-350"
                }`}
              >
                {clsName}
              </button>
            ))}
          </div>
        </div>

        {/* Large Table Container */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-md">
          <div className="max-h-[500px] overflow-y-auto scrollbar-none">
            <table className="w-full text-left text-xs font-bold text-slate-655 dark:text-slate-350 border-collapse">
              <thead>
                <tr className="border-b border-slate-150 dark:border-white/5 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/20 sticky top-0 backdrop-blur-xl z-20">
                  <th className="py-4 px-6 text-left w-16">No</th>
                  <th className="py-4 px-6">Nama Lengkap Siswa</th>
                  <th className="py-4 px-6 text-center">NISN Resmi</th>
                  <th className="py-4 px-6">Asal Sekolah SMP</th>
                  <th className="py-4 px-6">Kompetensi Keahlian</th>
                  <th className="py-4 px-6 text-center">Rombongan Belajar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredRosterStudents.map((student: any, idx: number) => {
                  const assignedClass = student.diterima_kelas || student.diterimaKelas;
                  
                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all"
                    >
                      <td className="py-3.5 px-6 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-6 font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">{student.nama}</td>
                      <td className="py-3.5 px-6 text-center font-mono tracking-wide">{student.nisn}</td>
                      <td className="py-3.5 px-6 uppercase text-slate-550 dark:text-slate-400 font-semibold">{student.sekolah_asal || student.sekolahAsal || "-"}</td>
                      <td className="py-3.5 px-6">
                        <span className="text-blue-600 dark:text-blue-400 font-extrabold uppercase text-[10px]">
                          {student.jurusan_1 || student.jurusan1}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          {assignedClass}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredRosterStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-400 font-bold uppercase tracking-wider">
                      {selectedRosterClass === "Semua" 
                        ? "Belum ada data pendaftar resmi yang dibagi ke dalam kelas." 
                        : `Belum ada siswa terdaftar di rombel kelas ${selectedRosterClass}.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* KEMITRAAN INDUSTRI */}
      <section id="kemitraan" className="py-24 max-w-6xl mx-auto px-6 relative z-10 border-t border-slate-200/30">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full">Kemitraan Industri</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-4 mb-4">Gerbang Karir Global Taruna Bhakti</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Kurikulum berstandar internasional yang diselaraskan langsung dengan raksasa teknologi dunia, menghasilkan lulusan berdaya saing tinggi.
          </p>
        </div>

        <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-100 dark:border-slate-800/60 rounded-3xl p-8 mb-12 shadow-sm">
          <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">
            Partner Industri Utama &amp; Sertifikasi Internasional &middot;
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-10 max-w-5xl mx-auto">
            {(() => {
              const remotePartners = [
                { name: "Dinas Pendidikan Propinsi Jabar", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2019/02/logojabarprov.png", url: "http://disdik.jabarprov.go.id/", h: "h-20" },
                { name: "SMK Bisa Hebat", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2019/02/logosmk.png", url: "https://smk.kemendikdasmen.go.id/", h: "h-16" },
                { name: "SMK PK", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Logo-SMK-Bisa.jpg", url: "https://smk.kemendikdasmen.go.id/", h: "h-16" },
                { name: "Icon+", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/56e83c6db8cd5587e87161281dfba75b.webp", url: "https://iconnet.id/", h: "h-14" },
                { name: "Biznet", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/biznet_vertical_logo.png", url: "https://www.biznetnetworks.com/", h: "h-20" },
                { name: "Prasimax", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Prasimax_Logo.png", url: "https://prasimax.com/", h: "h-10" },
                { name: "Agate", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Logo-Agate-Color.png", url: "https://agate.id/", h: "h-10" },
                { name: "Panasonic", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/8225.png", url: "https://www.panasonic.com/id/", h: "h-8" },
                { name: "Citra Film School", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/cropped-Logo-baru-citra.png", url: "https://citrafilmschool.net/", h: "h-20" },
                { name: "Samsung Tech Institute", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2019/02/STI-logo-1.png", url: "https://www.samsung.com/", h: "h-8" },
                { name: "MD Animation", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Logo_md_animation.png", url: "https://mdentertainment.com/id/md-animations/", h: "h-8" },
                { name: "Daun Biru Engineering", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/E-Learning-5.png", url: "https://www.daunbiru.co.id/", h: "h-12" },
                { name: "Assemblr", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/6156e76e275fa19ed9a33fa3_Group-33959.png", url: "https://www.assemblrworld.co.id/id", h: "h-20" },
                { name: "TOA", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/PT-TOA.png", url: "https://toa.co.id/", h: "h-8" },
                { name: "Infection Studio", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Alpha-InfectionTagline_Square-FullColor-cut.png", url: "https://infectionstudio.com/", h: "h-8" },
                { name: "Beyond Education", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/1661238758520.jpg", url: "https://beyondeducation.id/", h: "h-12" },
                { name: "Animakini", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/logo-animakini-2022_.png", url: "https://animakini.id/", h: "h-12" },
                { name: "IMP Studio", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/vgphayksj5yyqkq5zze5.png", url: "https://impstudio.id/", h: "h-12" },
                { name: "Mikrotik Academy", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2025/07/mikrotikacademy.jpg", url: "https://mikrotik.com/training/academy/asia/indonesia", h: "h-10" },
                { name: "Cisco Networking Academy", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2025/07/netacad.webp", url: "https://www.netacad.com/", h: "h-12" },
                { name: "AWS Academy", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2025/07/awsacademy.jpeg", url: "https://aws.amazon.com/training/awsacademy/", h: "h-12" },
                { name: "Red Hat Academy", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2025/07/redhatacademy.webp", url: "https://www.redhat.com/en/services/training/red-hat-academy", h: "h-10" },
                { name: "Oracle Academy", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2025/07/oracleacademy.webp", url: "https://academy.oracle.com/en/oa-web-overview.html", h: "h-10" },
              ];

              return remotePartners.map((partner, idx) => (
                <a
                  key={idx}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center p-2 transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
                  title={partner.name}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className={`w-auto object-contain ${partner.h} max-w-[150px] transition-all duration-300 drop-shadow-sm`}
                  />
                </a>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900 py-16 transition-colors duration-300 relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-slate-500 dark:text-slate-400">
            {/* Col 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/logo_smktb.png" alt="Logo SMK TB" className="w-12 h-12 object-contain shrink-0" />
                <div>
                  <span className="logo-text font-black text-slate-800 dark:text-white text-lg">PPDB <span className="text-blue-600 dark:text-sky-400">SMK TB</span></span>
                  <span className="block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">SMK Taruna Bhakti</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                Pionir pendidikan kejuruan teknologi informasi dan industri kreatif. Membina talenta unggul berkarakter mulia dan berdaya saing global sejak 1987.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-950 transition-all duration-300 hover:-translate-y-0.5">
                  <span className="text-xs font-bold">IG</span>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-950 transition-all duration-300 hover:-translate-y-0.5">
                  <span className="text-xs font-bold">YT</span>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-950 transition-all duration-300 hover:-translate-y-0.5">
                  <span className="text-xs font-bold">FB</span>
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Program Keahlian</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><Link href="/jurusan/rpl" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Rekayasa Perangkat Lunak (PPLG)</Link></li>
                <li><Link href="/jurusan/tjkt" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Teknik Jaringan Komputer &amp; Telkom (TJKT)</Link></li>
                <li><Link href="/jurusan/dkv" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Desain Komunikasi Visual (DKV)</Link></li>
                <li><Link href="/jurusan/bc" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Broadcasting &amp; Perfilman (BC)</Link></li>
                <li><Link href="/jurusan/an" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Animasi (AN)</Link></li>
                <li><Link href="/jurusan/te" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Teknik Elektronika (TE)</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Link Terkait</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Brosur PPDB {schoolPeriod.split("-")[0]}</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Syarat Pendaftaran</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Simulasi Mock Payment</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Dasbor Admin Verifikator</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Sekretariat PPDB</h4>
              <p className="text-xs leading-relaxed font-semibold">
                {address}
              </p>
              <div className="text-xs font-bold space-y-1">
                <div>Telp: {phone}</div>
                <div>Email: {email}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <div>© {new Date().getFullYear()} SMK Taruna Bhakti Depok. All Rights Reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Kebijakan Privasi</a>
              <span>·</span>
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Syarat &amp; Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL BERITA / INFORMASI DETAIL */}
      {selectedNews && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedNews(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            {selectedNews.foto_url ? (
              <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-200 dark:bg-slate-850">
                <img
                  src={selectedNews.foto_url}
                  alt={selectedNews.judul}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 z-10 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-md border border-blue-500">
                  <Calendar size={11} />
                  <span>{formatDate(selectedNews.tanggal)}</span>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-white hover:bg-slate-950 flex items-center justify-center transition-all font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="p-6 border-b border-slate-150 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/15">
                <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-sm">
                  <Calendar size={11} />
                  <span>{formatDate(selectedNews.tanggal)}</span>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="p-8 space-y-6">
              <h2 className="text-xl font-black text-slate-850 dark:text-white uppercase leading-snug tracking-tight text-left">
                {selectedNews.judul}
              </h2>
              <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-semibold whitespace-pre-line text-left">
                {selectedNews.konten}
              </p>
            </div>

            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/15 border-t border-slate-150 dark:border-white/5 flex items-center justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
              >
                Tutup Informasi
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
