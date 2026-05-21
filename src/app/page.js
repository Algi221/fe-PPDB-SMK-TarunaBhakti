"use client";

import React, { useState, useEffect } from "react";
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
  Phone
} from "lucide-react";

import DataPendaftarTable from "../components/DataPendaftarTable";

export default function Home() {
  // Navigation & UI States
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  
  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'syarat' | 'alur' | 'beasiswa'
  
  // Video Background Logic
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = ["/videos/vid1.mp4", "/videos/vid2.mp4"];
  const videoRef = React.useRef(null);

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
      // eslint-disable-next-line
      setIsDark(true);
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



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Majors list for SMK Taruna Bhakti
  const majors = [
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
      code: "AN",
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
  ];

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
            <Link href="/daftar" className="btn-primary-pill">
              Daftar
            </Link>
          </div>
        </nav>
      </div>

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
          {/* Overlay agar teks tetap bisa dibaca */}
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/60 backdrop-blur-sm"></div>
        </div>

        {/* HERO SECTION */}
        <section className="hero">
        
        {/* Floating elements representing major names as requested */}
        <Link href="/jurusan/rpl" className="floating-badge badge-aset">
          <div className="badge-icon overflow-hidden" style={{background: 'transparent'}}>
            <img src="/jurusan/pplg.jpeg" alt="RPL" className="w-full h-full object-cover rounded-full" onError={(e) => { e.target.style.display='none'; }} />
          </div>
          <div className="badge-info">
            <span>PPLG</span>
          </div>
        </Link>

        <Link href="/jurusan/tjkt" className="floating-badge badge-peminjaman">
          <div className="badge-icon overflow-hidden" style={{background: 'transparent'}}>
            <img src="/jurusan/tjkt.jpeg" alt="TJKT" className="w-full h-full object-cover rounded-full" onError={(e) => { e.target.style.display='none'; }} />
          </div>
          <div className="badge-info">
            <span>TJKT</span>
          </div>
        </Link>

        <Link href="/jurusan/dkv" className="floating-badge badge-laporan">
          <div className="badge-icon overflow-hidden" style={{background: 'transparent'}}>
            <img src="/jurusan/dkv.jpeg" alt="DKV" className="w-full h-full object-cover rounded-full" onError={(e) => { e.target.style.display='none'; }} />
          </div>
          <div className="badge-info">
            <span>DKV</span>
          </div>
        </Link>

        <Link href="/jurusan/an" className="floating-badge badge-animasi">
          <div className="badge-icon overflow-hidden" style={{background: 'transparent'}}>
            <img src="/jurusan/animasijpeg.jpeg" alt="Animasi" className="w-full h-full object-cover rounded-full" onError={(e) => { e.target.style.display='none'; }} />
          </div>
          <div className="badge-info">
            <span>Animasi</span>
          </div>
        </Link>

        <Link href="/jurusan/bc" className="floating-badge badge-kelas">
          <div className="badge-icon overflow-hidden" style={{background: 'transparent'}}>
            <img src="/jurusan/bc.jpeg" alt="Broadcasting" className="w-full h-full object-cover rounded-full" onError={(e) => { e.target.style.display='none'; }} />
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
          Penerimaan Siswa Baru <br />
          <span>Portal PPDB SMK Taruna Bhakti</span>
        </h1>

        <p className="hero-subtitle relative z-10">
          Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi. 
          Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.
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

      {/* ALUR PENDAFTARAN (Vertical Redesign) */}
      <section id="alur" className="py-24 bg-slate-50 dark:bg-slate-900/60 relative z-10 border-y border-slate-200/50 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full">Proses Mudah &amp; Transparan · TP. 2026/2027</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-4 drop-shadow-sm">Alur Pendaftaran PPDB</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium">
              Ikuti 6 langkah sederhana berikut untuk menjadi bagian dari SMK Taruna Bhakti Depok.
            </p>
          </div>

          <div className="relative">
            {/* Central Vertical Connector Line */}
            <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-sky-400 to-indigo-500 transform -translate-x-1/2 z-0 rounded-full opacity-70"></div>
            {/* Dashed overlay line for cool tech look */}
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
                {/* Center Glowing Marker */}
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Melakukan pembayaran administrasi pendaftaran sebesar Rp 150.000 melalui payment gateway Xendit sandbox terintegrasi.</p>
                  </div>
                </div>
                {/* Center Glowing Marker */}
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
                {/* Center Glowing Marker */}
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Datang langsung ke sekolah untuk memverifikasi dokumen fisik asli serta melakukan pengukuran baju seragam siswa.</p>
                  </div>
                </div>
                {/* Center Glowing Marker */}
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
                {/* Center Glowing Marker */}
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
                {/* Center Glowing Marker */}
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
            const IconComp = major.icon;
            return (
              <Link 
                href={`/jurusan/${major.code.toLowerCase()}`}
                key={major.code} 
                className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-700 cursor-pointer flex flex-col justify-between relative overflow-hidden group transform ${isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Expanding radial spotlight glow on hover */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                
                {/* Glowing Top Accent Line on hover */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 to-sky-400 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-500 z-10"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-white border border-slate-100 shadow-md group-hover:shadow-xl group-hover:shadow-blue-500/20">
                    <img 
                      src={major.logo} 
                      alt={`Logo ${major.code}`} 
                      className="w-14 h-14 object-contain drop-shadow-sm"
                      onError={(e) => { 
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

      {/* KEMITRAAN INDUSTRI */}
      <section id="kemitraan" className="py-24 max-w-6xl mx-auto px-6 relative z-10 border-t border-slate-200/30">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full">Kemitraan Industri</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-4 mb-4">Gerbang Karir Global Taruna Bhakti</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Kurikulum berstandar internasional yang diselaraskan langsung dengan raksasa teknologi dunia, menghasilkan lulusan berdaya saing tinggi.
          </p>
        </div>

        {/* Tech Partnerships Badges */}
        <div className="bg-white/50 backdrop-blur-md border border-slate-100 rounded-3xl p-8 mb-12 shadow-sm">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Partner Industri Utama & Sertifikasi Internasional</p>
          <div className="flex justify-center items-center">
            <img src="/partners.png" alt="Mitra Industri SMK Taruna Bhakti" className="max-w-full h-auto object-contain max-h-[300px]" />
          </div>
        </div>


      </section>

      {/* FOOTER */}
      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900 py-16 transition-colors duration-300 relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-slate-500 dark:text-slate-400">
            {/* Col 1: Brand & Socials */}
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

            {/* Col 2: Kompetensi Keahlian */}
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

            {/* Col 3: Portal Informasi */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Portal PPDB</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><Link href="/daftar" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Pendaftaran Online</Link></li>
                <li><a href="#alur" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Alur &amp; Prosedur</a></li>
                <li><a href="#majors" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Syarat Kompetensi</a></li>
                <li><a href="#kemitraan" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Kerjasama Industri</a></li>
                <li><Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Dashboard Seleksi Admin</Link></li>
              </ul>
            </div>

            {/* Col 4: Hubungi Kami */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Hubungi Kami</h4>
              <p className="text-xs leading-relaxed font-semibold">
                Jalan Pekapuran Kel. Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16453
              </p>
              <div className="space-y-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <p>Telp: <span className="text-slate-700 dark:text-slate-350">+62 21 874 4810</span></p>
                <p>WhatsApp: <span className="text-slate-700 dark:text-slate-350">08119892324</span></p>
                <p>Email: <span className="text-slate-700 dark:text-slate-350">info@smktarunabhakti.sch.id</span></p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs font-semibold text-slate-400 dark:text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} SMK Taruna Bhakti Depok. All rights reserved.
            </div>
            <div className="flex items-center gap-1.5">
              <span>Made with 💙 for futuristic education</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
