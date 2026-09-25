"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Megaphone, ChevronRight } from 'lucide-react';
import BlurText from '../../components/BlurText';
import { usePPDB } from "@/context/PPDBContext";
import { InformasiItem } from './components/types';
import ForumCard from './components/ForumCard';
import ForumDetailModal from './components/ForumDetailModal';
import LightboxModal from './components/LightboxModal';
import ForumNavbar from './components/ForumNavbar';
import ForumSidebar from './components/ForumSidebar';

const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";

export default function ForumPage() {
  const { ppdbLogo, ppdbTitle } = usePPDB();
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [informasi, setInformasi] = useState<InformasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<InformasiItem | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleViewDetail = async (id: number) => {
    try {
      setLoadingDetailId(id);
      const res = await fetch(`${BACKEND_URL}/api/informasi/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedPost(json.data);
      } else {
        alert("Gagal mengambil detail informasi.");
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
      alert("Gagal terhubung ke server untuk mengambil detail informasi.");
    } finally {
      setLoadingDetailId(null);
    }
  };

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
    return searchQuery === '' || 
      (item.judul || "").toLowerCase().includes(searchLower) || 
      (item.konten || "").toLowerCase().includes(searchLower);
  });

  const recentPosts = informasi.slice(0, 3);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <ForumNavbar
        ppdbLogo={ppdbLogo}
        ppdbTitle={ppdbTitle}
        isNavbarScrolled={isNavbarScrolled}
        isDark={isDark}
        toggleDark={toggleDark}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* ── BREADCRUMB ── */}
      <div className="pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Beranda</Link>
          <ChevronRight size={12} />
          <span className="text-blue-600 dark:text-blue-400 font-bold">Forum Informasi</span>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* ── LEFT COLUMN: POSTS LIST ── */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">
              PENGUMUMAN RESMI
            </span>
            <BlurText
              text="Forum Informasi PPDB"
              className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-2"
              delay={40}
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
              {filtered.map((item, index) => (
                <ForumCard
                  key={item.id}
                  item={item}
                  index={index}
                  loadingDetailId={loadingDetailId}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <ForumSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          recentPosts={recentPosts}
          loadingDetailId={loadingDetailId}
          handleViewDetail={handleViewDetail}
          schoolPeriod={schoolPeriod}
        />
      </main>

      {/* ── DETAIL MODAL ── */}
      <ForumDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onOpenLightbox={(src) => setLightboxImage(src)}
      />

      {/* ── LIGHTBOX MODAL ── */}
      <LightboxModal
        imageSrc={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
