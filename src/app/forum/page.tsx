"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Megaphone,
  Sun,
  Moon,
  Calendar,
  ChevronRight,
  ArrowRight,
  User,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import BlurText from '../../components/BlurText';
import dompurify from "dompurify";

const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    });
  } catch (e) {
    return "";
  }
};

const sanitizeSrc = (src: string | undefined | null): string => sanitizeUrl(src);

const BACKEND_URL = "http://localhost:5000";

interface InformasiItem {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const formatDateShort = (dateStr: string | null | undefined) => {
  if (!dateStr) return { day: '-', month: '---' };
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  return { day: d.getDate(), month: months[d.getMonth()] };
};

const timeAgo = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  return `${diffDays} hari yang lalu`;
};

const parseMedia = (raw: string | null | undefined) => {
  if (!raw) return { foto: "", video: "", videoName: "", dokumen: "", dokumenName: "" };
  if (raw.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw);
      return {
        foto: parsed.foto || "",
        video: parsed.video || "",
        videoName: parsed.video_name || "",
        dokumen: parsed.dokumen || "",
        dokumenName: parsed.dokumen_name || ""
      };
    } catch (e) {
      // fallback
    }
  }
  return { foto: raw, video: "", videoName: "", dokumen: "", dokumenName: "" };
};

export default function ForumPage() {
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [informasi, setInformasi] = useState<InformasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<InformasiItem | null>(null);
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");

  useEffect(() => {
    const handleScroll = () => setIsNavbarScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/informasi`);
        const json = await res.json();
        if (json.success && json.data) {
          setInformasi(json.data);
        }
        
        try {
          const configRes = await fetch(`${BACKEND_URL}/api/config`);
          const configJson = await configRes.json();
          if (configJson.success && configJson.data && configJson.data.ppdb_school_period) {
            setSchoolPeriod(configJson.data.ppdb_school_period);
          }
        } catch (configErr) {
          console.warn("Gagal mengambil config sekolah:", configErr);
          const localPeriod = localStorage.getItem("ppdb_school_period");
          if (localPeriod) setSchoolPeriod(localPeriod);
        }
      } catch (e) {
        console.error("Gagal fetch informasi:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = informasi.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = searchQuery === '' || 
      (item.judul || "").toLowerCase().includes(searchLower) || 
      (item.konten || "").toLowerCase().includes(searchLower);
    return matchSearch;
  });

  const recentPosts = informasi.slice(0, 3);

  const getCategoryBadge = () => {
    return { label: 'INFORMASI', cls: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' };
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      
      {/* ── FLOATING NAVBAR (same as landing page) ── */}
      <div className="navbar-wrapper z-50">
        <nav className={`navbar ${isNavbarScrolled ? "scrolled" : ""}`}>
          <div className="nav-left">
            <Link href="/" className="logo-container">
              <img src="/logo_smktb.png" alt="Logo SMK TB" className="w-9 h-9 object-contain" />
              <span className="logo-text font-extrabold">PPDB <span>SMK TB</span></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/#alur" className="btn-nav-link">Alur Pendaftaran</Link>
            <Link href="/#majors" className="btn-nav-link">Jurusan</Link>
            <Link href="/#kemitraan" className="btn-nav-link">Mitra Industri</Link>
            <Link href="/forum" className="btn-nav-link" style={{color: 'var(--color-blue-600, #2563eb)', fontWeight: 700}}>Forum Informasi</Link>
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

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 w-full flex-grow">
        
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header */}
          <div>
            <BlurText 
              text="Forum Pengumuman" 
              className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
              delay={150}
              animateBy="words"
              direction="top"
            />
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-sm leading-relaxed mb-6">
              Pusat informasi resmi dan pengumuman terbaru dari panitia PPDB SMK Taruna Bhakti.
            </p>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider">Memuat pengumuman...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
                <Megaphone className="text-slate-400 dark:text-slate-500" size={28} />
              </div>
              <h3 className="text-slate-800 dark:text-white font-black uppercase tracking-wider mb-3">Belum Ada Informasi</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Belum ada pengumuman yang aktif saat ini dari panitia PPDB SMK Taruna Bhakti. Silakan cek kembali nanti.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item, index) => {
                const badge = getCategoryBadge();
                const media = parseMedia(item.foto_url);
                return (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    key={item.id}
                    onClick={() => setSelectedPost(item)}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${badge.cls}`}>
                          {badge.label}
                        </span>
                        {media.video && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 border border-blue-500/15">
                            🎥 Video
                          </span>
                        )}
                        {media.dokumen && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 border border-emerald-500/15">
                            📄 Dokumen
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <Calendar size={13} />
                        {formatDate(item.tanggal)}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 mb-4">
                      {media.foto && (
                        <div className="w-full sm:w-48 h-48 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                           <img src={sanitizeSrc(media.foto)} alt={item.judul || "Pengumuman"} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-350" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug break-all hyphens-auto">
                          {item.judul}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 break-all hyphens-auto">
                          {item.konten}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <User size={12} className="text-slate-400" />
                        </div>
                        Panitia PPDB SMK TB
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1">
                        Baca Selengkapnya
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder-slate-400 text-slate-800 dark:text-white shadow-sm"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#F0F4F8] dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/50 dark:border-slate-800 shadow-sm"
          >
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-5">Pengumuman Terbaru</h3>
            {recentPosts.length === 0 ? (
              <div className="py-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Belum ada pengumuman</p>
              </div>
            ) : (
              <div className="space-y-5">
                {recentPosts.map((item, index) => {
                  const { day, month } = formatDateShort(item.tanggal);
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                      key={item.id}
                      className="flex gap-4 items-start cursor-pointer group"
                      onClick={() => setSelectedPost(item)}
                    >
                      <div className="flex flex-col items-center justify-center w-10 h-11 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700 shadow-sm shrink-0">
                        <span className="text-[9px] font-bold text-blue-600 uppercase">{month}</span>
                        <span className="text-sm font-black text-slate-800 dark:text-white leading-none mt-0.5">{day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 break-all hyphens-auto">
                          {item.judul}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">{timeAgo(item.tanggal)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/20"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-200">PPDB {schoolPeriod.includes("-") ? schoolPeriod.split("-")[0] : schoolPeriod}</span>
              <h3 className="text-lg font-bold leading-snug mt-1 mb-4">Pendaftaran Siswa Baru Telah Dibuka</h3>
              <Link href="/daftar" className="inline-block bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
                Daftar Sekarang
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── DETAIL MODAL ── */}
      {selectedPost && (() => {
        const media = parseMedia(selectedPost.foto_url);
        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {media.foto && (
                <div className="relative border-b border-slate-100 dark:border-white/5 w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center max-h-[500px] overflow-hidden">
                  <img src={sanitizeSrc(media.foto)} alt={selectedPost.judul} className="w-full h-auto max-h-[500px] object-contain" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
                </div>
              )}
              
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/15">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900">
                  <Calendar size={11} />
                  {formatDate(selectedPost.tanggal)}
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:white flex items-center justify-center transition-all font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-8 space-y-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white leading-snug break-all">{selectedPost.judul}</h2>
                <p className="text-sm text-slate-605 dark:text-slate-300 leading-relaxed whitespace-pre-line break-all">{selectedPost.konten}</p>

                {/* Additional Media Section */}
                {(media.video || media.dokumen) && (
                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-6">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-left">
                      Lampiran Pengumuman
                    </h4>
                    
                    <div className="space-y-6">
                      {/* Video Player (Inline playback only, no download) */}
                      {media.video && (
                        <div className="space-y-3 text-left">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block">🎥 Video Lampiran:</span>
                          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 shadow-md">
                            <video src={sanitizeSrc(media.video)} controls className="w-full max-h-72 object-contain" />
                          </div>
                        </div>
                      )}

                      {/* Document Preview & Download Button */}
                      {media.dokumen && (
                        <div className="space-y-3 text-left w-full">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">📄 Pratinjau Dokumen Resmi / Surat Keputusan:</span>
                          
                          {media.dokumen.startsWith("data:application/pdf") ? (
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md bg-white">
                              <iframe src={sanitizeSrc(media.dokumen)} className="w-full h-[450px] border-0" />
                            </div>
                          ) : media.dokumen.startsWith("data:image/") ? (
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
                              <img src={sanitizeSrc(media.dokumen)} alt="Dokumen Preview" className="max-w-full max-h-96 object-contain rounded-xl" />
                            </div>
                          ) : (
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-650 dark:text-emerald-450 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                <BookOpen size={18} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{media.dokumenName || "dokumen.pdf"}</h6>
                                <span className="text-[9px] text-slate-400 dark:text-slate-550 block mt-0.5">Pratinjau langsung tidak tersedia untuk format berkas ini. Silakan unduh dokumen untuk melihat isi berkas.</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <a
                              href={sanitizeUrl(media.dokumen)}
                              download={media.dokumenName || "lampiran_dokumen.pdf"}
                              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]"
                            >
                              Unduh Lampiran Dokumen ({media.dokumenName || "dokumen.pdf"})
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50/50 dark:bg-slate-955/15 border-t border-slate-100 dark:border-white/5 flex justify-end">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
