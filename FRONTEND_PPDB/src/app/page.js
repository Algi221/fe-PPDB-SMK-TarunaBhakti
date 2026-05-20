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
  ChevronRight,
  BookOpen,
  Cpu,
  Layers,
  Video,
  AlertCircle,
  Palette,
  Sun,
  Moon,
  Users
} from "lucide-react";

import DataPendaftarTable from "../components/DataPendaftarTable";

export default function Home() {
  // Navigation & UI States
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  
  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'syarat' | 'alur' | 'beasiswa'
  const [selectedMajorDetail, setSelectedMajorDetail] = useState(null); // PPLG | TKJ | DKV | BC | TE
  


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
      desc: "Belajar pemrograman web, aplikasi mobile, game development, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
      color: "#0066ff",
      careers: "Software Engineer, Web Developer, Mobile Developer, Game Designer, AI Specialist",
      facilities: "Lab iMac Core-i9, Smart Classroom, AWS Cloud Academy, Google Developer Partner Studio"
    },
    {
      code: "TJKT",
      title: "Teknik Jaringan Komputer & Telekomunikasi",
      icon: Layers,
      desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
      color: "#0ea5e9",
      careers: "Network Engineer, Cloud Administrator, Cybersecurity Analyst, System Administrator",
      facilities: "CISCO Networking Academy Lab, Mikrotik Academy Lab, Cyber Security Operations Center"
    },
    {
      code: "DKV",
      title: "Desain Komunikasi Visual",
      icon: BookOpen,
      desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
      color: "#6366f1",
      careers: "UI/UX Designer, Graphic Designer, Illustrator, Creative Director, Brand Specialist",
      facilities: "Wacom Creative Studio, Photo & Video Lighting Lab, Digital Illustration Studio"
    },
    {
      code: "BC",
      title: "Broadcasting & Perfilman",
      icon: Video,
      desc: "Pelajari dunia penyiaran televisi, podcasting, penulisan naskah, penyutradaraan film, tata kamera, serta editing video profesional.",
      color: "#f59e0b",
      careers: "Video Editor, Cameraman, Director, Scriptwriter, Podcast Producer, Content Creator",
      facilities: "Green Screen Studio, Professional TV Control Room, Podcast Soundproof Studio"
    },
    {
      code: "AN",
      title: "Animasi",
      icon: Palette,
      desc: "Kuasai seni pemodelan 2D/3D, karakter rigging, rendering, digital sculpting, storyboard, serta visual effects (VFX) standar industri perfilman.",
      color: "#ec4899",
      careers: "3D Animator, 2D Animator, 3D Modeler, Storyboard Artist, VFX Compositor, Character Designer",
      facilities: "iMac Render Farm Studio, Wacom Cintiq Digital Drawing Lab, Motion Capture Lab, Sound Recording Room"
    },
    {
      code: "TE",
      title: "Teknik Elektronika",
      icon: Cpu,
      desc: "Pelajari teknologi mikroprosesor, Internet of Things (IoT), robotika cerdas, automasi industri, dan smart home system.",
      color: "#10b981",
      careers: "IoT Engineer, Robotics Technician, Automation Programmer, Hardware Specialist",
      facilities: "Robotics Design Lab, IoT Smart-Home Prototype Sandbox, Microcontroller Lab"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      
      {/* Background Glowing Blobs */}
      <div className="bg-glow-container">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>

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

      {/* HERO SECTION */}
      <section className="hero">
        
        {/* Floating elements representing major names as requested */}
        <div className="floating-badge badge-aset" onClick={() => { setSelectedMajorDetail(majors[0]); }}>
          <div className="badge-icon">
            <Cpu size={18} />
          </div>
          <div className="badge-info">
            <span>RPL</span>
          </div>
        </div>

        <div className="floating-badge badge-peminjaman" onClick={() => { setSelectedMajorDetail(majors[1]); }}>
          <div className="badge-icon">
            <Layers size={18} />
          </div>
          <div className="badge-info">
            <span>TJKT</span>
          </div>
        </div>

        <div className="floating-badge badge-laporan" onClick={() => { setSelectedMajorDetail(majors[2]); }}>
          <div className="badge-icon">
            <BookOpen size={18} />
          </div>
          <div className="badge-info">
            <span>DKV</span>
          </div>
        </div>

        <div className="floating-badge badge-animasi" onClick={() => { setSelectedMajorDetail(majors[4]); }}>
          <div className="badge-icon">
            <Palette size={18} />
          </div>
          <div className="badge-info">
            <span>Animasi</span>
          </div>
        </div>

        <div className="floating-badge badge-kelas" onClick={() => { setSelectedMajorDetail(majors[3]); }}>
          <div className="badge-icon">
            <Video size={18} />
          </div>
          <div className="badge-info">
            <span>Broadcasting</span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="badge-wrapper">
          <span className="badge-pill">SMK TARUNA BHAKTI DEPOK</span>
        </div>

        <h1 className="hero-title">
          Penerimaan Siswa Baru <br />
          <span>Portal PPDB SMK Taruna Bhakti</span>
        </h1>

        <p className="hero-subtitle">
          Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi. 
          Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.
        </p>

        <div className="hero-action">
          <Link href="/daftar" className="btn-hero-action">
            Daftar Sekarang <ArrowRight size={18} />
          </Link>
        </div>

        {/* APP MOCKUP WRAPPER */}
        <div className="mockup-container">
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

      {/* ALUR PENDAFTARAN */}
      <section id="alur" className="py-24 bg-white/40 backdrop-blur-md relative z-10 border-y border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full">Proses Mudah & Transparan</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-4 mb-4">Alur Pendaftaran PPDB</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Ikuti langkah-langkah sederhana berikut untuk menjadi bagian dari Taruna Bhakti.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-100 -translate-y-1/2 z-0 opacity-50 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <FileText size={28} />
                </div>
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold mb-3">Tahap 1</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Pendaftaran Online</h3>
                <p className="text-sm text-slate-500">Mengisi formulir pendaftaran dan memilih kompetensi keahlian.</p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Upload size={28} />
                </div>
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold mb-3">Tahap 2</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Berkas</h3>
                <p className="text-sm text-slate-500">Melengkapi dokumen persyaratan seperti rapor dan KK.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <User size={28} />
                </div>
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold mb-3">Tahap 3</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Tes Wawancara</h3>
                <p className="text-sm text-slate-500">Sesi wawancara calon peserta didik dan orang tua/wali.</p>
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
              <div 
                key={major.code} 
                className={`bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-700 cursor-pointer flex flex-col justify-between relative overflow-hidden group transform ${isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onClick={() => setSelectedMajorDetail(major)}
              >
                {/* Expanding radial spotlight glow on hover */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                
                {/* Glowing Top Accent Line on hover */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 to-sky-400 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-500 z-10"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-115 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-500">
                    <IconComp size={24} />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 mb-3">
                    {major.code === "AN" ? major.title : `${major.title} (${major.code})`}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{major.desc.substring(0, 105)}...</p>
                </div>
                <span className="flex items-center gap-2 text-blue-600 text-sm font-bold group-hover:text-blue-700 transition-colors relative z-10">
                  Lihat Selengkapnya <ChevronRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </div>
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
      <footer>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
          <div className="text-left flex items-start gap-4">
            <img src="/logo_smktb.png" alt="Logo SMK TB" className="w-12 h-12 object-contain mt-1 shrink-0" />
            <div>
              <span className="logo-text font-bold text-slate-700 block mb-1">PPDB SMK Taruna Bhakti Depok</span>
              <p className="max-w-xs text-xs leading-relaxed">Jalan Pekapuran Kel. Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16453</p>
            </div>
          </div>
          <div className="text-xs">
            &copy; {new Date().getFullYear()} SMK Taruna Bhakti Depok. Made with 💙 for futuristic education.
          </div>
        </div>
      </footer>


      {/* ================= MODAL DIALOGS ================= */}

      {/* 3. JURUSAN DETAIL MODAL */}
      <div className={`modal-overlay ${selectedMajorDetail ? "active" : ""}`} onClick={() => setSelectedMajorDetail(null)}>
        {selectedMajorDetail && (
          <div className="modal-container text-left" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMajorDetail(null)}>
              <X size={18} />
            </button>
            <div className="detail-modal-header">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: selectedMajorDetail.color }}>
                {React.createElement(selectedMajorDetail.icon, { size: 28 })}
              </div>
              <div className="detail-modal-title">
                <h3>{selectedMajorDetail.title}</h3>
                {selectedMajorDetail.code !== "AN" && <p>{selectedMajorDetail.code}</p>}
              </div>
            </div>

            <div className="detail-content">
              <p className="mb-6">{selectedMajorDetail.desc}</p>
              
              <div className="detail-features">
                <div className="feature-item">
                  <h4>Prospek Karir Utama</h4>
                  <p>{selectedMajorDetail.careers}</p>
                </div>
                <div className="feature-item">
                  <h4>Fasilitas Praktik Khusus</h4>
                  <p>{selectedMajorDetail.facilities}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
