"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Sun, Moon, Palette } from "lucide-react";
import {
  hexToRgb,
  getDarkerColor
} from "./components/majorTypes";
import { majorsData } from "./components/majorData";
import MajorHeroSection from "./components/MajorHeroSection";
import MajorCurriculumAndGallery from "./components/MajorCurriculumAndGallery";
import MajorCareersAndPartners from "./components/MajorCareersAndPartners";
import MajorFooter from "./components/MajorFooter";

export default function MajorPage() {
  const params = useParams();
  const rawCode = params?.code ? params.code.toString().toLowerCase() : "";
  const code = rawCode === "anm" ? "an" : rawCode;
  const majorKeys = ["rpl", "tjkt", "dkv", "bc", "an", "te"];
  const [nextCode] = useState(() => {
    const otherKeys = majorKeys.filter(k => k !== code);
    return otherKeys[Math.floor(Math.random() * otherKeys.length)] || "rpl";
  });

  const [major, setMajor] = useState<any>(null);
  const [nextMajor, setNextMajor] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const [kuotaData, setKuotaData] = useState<any[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ppdb-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (code && majorsData[code]) {
      setMajor({ ...majorsData[code] });
    } else if (code) {
      setMajor({
        code: code.toUpperCase(),
        title: code.toUpperCase(),
        alias: code.toUpperCase(),
        subtitle: "Program Keahlian Baru",
        tagline: "Coding the Future, Building Creative Solutions.",
        desc: "",
        color: "from-blue-600 to-indigo-600",
        accentColor: "#0066ff",
        bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
        textAccent: "text-blue-600 dark:text-blue-400",
        glowColor: "rgba(0,102,255,0.15)",
        logo: "/logo_smktb.png",
        banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
        syllabus: [
          { subject: "Dasar Kompetensi", desc: "Mempelajari dasar-dasar keahlian program studi baru." }
        ],
        careers: [
          { title: "Tenaga Ahli", desc: "Menjadi profesional kompeten di bidangnya." }
        ],
        facilities: [
          "Laboratorium Praktikum Baru"
        ],
        gallery: [],
        partners: "Mitra Industri SMK Taruna Bhakti"
      });
    }
    if (nextCode && majorsData[nextCode]) {
      setNextMajor({ ...majorsData[nextCode] });
    }
  }, [code, nextCode]);

  useEffect(() => {
    const loadDynamicConfig = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/config");
        const json = await res.json();
        if (json.success && json.data) {
          const config = json.data;
          if (config.ppdb_majors_config && Array.isArray(config.ppdb_majors_config)) {
            const found = config.ppdb_majors_config.find((m: any) => m.code.toLowerCase() === code || (m.code.toLowerCase() === "anm" && code === "an"));
            if (found) {
              setMajor((prev: any) => {
                const base = prev || {
                  code: found.code,
                  title: found.title || found.code,
                  alias: found.code,
                  subtitle: found.title || found.code,
                  tagline: "Coding the Future, Building Creative Solutions.",
                  desc: found.desc || "",
                  color: "from-blue-600 to-indigo-600",
                  accentColor: found.color || "#0066ff",
                  bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
                  textAccent: "text-blue-600 dark:text-blue-400",
                  glowColor: "rgba(0,102,255,0.15)",
                  logo: found.logo || "/logo_smktb.png",
                  banner: found.banner || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
                  syllabus: [{ subject: "Dasar Kompetensi", desc: "Mempelajari dasar-dasar keahlian program studi." }],
                  careers: Array.isArray(found.careers) ? found.careers : [{ title: "Tenaga Ahli", desc: "Menjadi profesional kompeten di bidangnya." }],
                  facilities: Array.isArray(found.facilities) ? found.facilities : ["Laboratorium Praktikum Baru"],
                  gallery: Array.isArray(found.gallery) ? found.gallery : [],
                  partners: "Mitra Industri SMK Taruna Bhakti"
                };
                return {
                  ...base,
                  title: found.title || base.title,
                  desc: found.desc || base.desc,
                  accentColor: found.color || base.accentColor,
                  logo: found.logo || base.logo,
                  banner: found.banner || base.banner,
                  video: found.video || base.video,
                  careers: Array.isArray(found.careers) ? found.careers : base.careers,
                  facilities: Array.isArray(found.facilities) ? found.facilities : base.facilities,
                  gallery: Array.isArray(found.gallery) ? found.gallery : base.gallery
                };
              });
            }

            const foundNext = config.ppdb_majors_config.find((m: any) => m.code.toLowerCase() === nextCode || (m.code.toLowerCase() === "anm" && nextCode === "an"));
            if (foundNext) {
              setNextMajor((prev: any) => {
                if (!prev) return null;
                return {
                  ...prev,
                  title: foundNext.title || prev.title,
                  desc: foundNext.desc || prev.desc,
                  accentColor: foundNext.color || prev.accentColor,
                  logo: foundNext.logo || prev.logo
                };
              });
            }
          }
        }
      } catch (err) {
        console.error("Gagal mengambil konfigurasi dinamis jurusan:", err);
      }
    };
    if (code) {
      loadDynamicConfig();
    }
  }, [code, nextCode]);

  useEffect(() => {
    const loadKuota = async () => {
      try {
        const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
        const res = await fetch(`${BACKEND_URL}/api/kuota`);
        const json = await res.json();
        if (json.success && json.data) {
          setKuotaData(json.data.pendaftar);
        }
      } catch (err) {
        console.log("Failed to fetch kuota data:", err);
      }
    };
    loadKuota();
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ppdb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ppdb-theme", "light");
    }
  };

  if (!major) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 transition-colors duration-300">
        <div className="absolute inset-0 bg-glow-container">
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
        </div>
        
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800 p-10 rounded-4xl max-w-md w-full text-center shadow-2xl relative z-10">
          <div className="w-20 h-20 bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Palette size={40} />
          </div>
          <h1 className="text-2xl font-black mb-3">Jurusan Tidak Ditemukan</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Program keahlian yang Anda cari tidak terdaftar atau telah diupdate. Silakan kembali ke beranda untuk melihat list jurusan lengkap.
          </p>
          <Link href="/" className="btn-primary-pill w-full flex gap-2">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const accentColor = major.accentColor || "#0066ff";
  const accentRgb = hexToRgb(accentColor);
  const darkerColor = getDarkerColor(accentColor, 15);
  const glowColor = `rgba(${accentRgb}, 0.15)`;

  const nextAccentColor = nextMajor?.accentColor || "#0066ff";
  const nextAccentRgb = hexToRgb(nextAccentColor);
  const nextDarkerColor = getDarkerColor(nextAccentColor, 15);

  return (
    <div 
      className="relative min-h-screen flex flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
      style={{
        '--major-accent': accentColor,
        '--major-accent-rgb': accentRgb,
        '--major-darker': darkerColor,
        '--major-glow': glowColor,
        '--next-accent': nextAccentColor,
        '--next-accent-rgb': nextAccentRgb,
        '--next-darker': nextDarkerColor
      } as React.CSSProperties}
    >
      <style>{`
        .major-gradient-bg {
          background-image: linear-gradient(135deg, var(--major-accent) 0%, var(--major-darker) 100%) !important;
        }
        .major-text-clip {
          background-image: linear-gradient(135deg, var(--major-accent) 0%, var(--major-darker) 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .major-bg-accent {
          background-color: rgba(var(--major-accent-rgb), 0.1) !important;
        }
        .dark .major-bg-accent {
          background-color: rgba(var(--major-accent-rgb), 0.2) !important;
        }
        .major-text-accent {
          color: var(--major-accent) !important;
        }
        .major-glow-border:hover {
          border-color: rgba(var(--major-accent-rgb), 0.25) !important;
          box-shadow: 0 0 20px rgba(var(--major-accent-rgb), 0.08) !important;
        }
        .major-accent-border {
          border-color: var(--major-accent) !important;
        }
        .next-gradient-bg {
          background-image: linear-gradient(135deg, var(--next-accent) 0%, var(--next-darker) 100%) !important;
        }
        .next-text-clip {
          background-image: linear-gradient(135deg, var(--next-accent) 0%, var(--next-darker) 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .next-bg-accent {
          background-color: rgba(var(--next-accent-rgb), 0.1) !important;
        }
        .dark .next-bg-accent {
          background-color: rgba(var(--next-accent-rgb), 0.2) !important;
        }
        .next-text-accent {
          color: var(--next-accent) !important;
        }
      `}</style>
      
      {/* Floating Background Glow System */}
      <div className="absolute inset-0 bg-glow-container">
        <div 
          className="bg-glow bg-glow-1"
          style={{ background: `radial-gradient(circle, var(--major-glow) 0%, transparent 70%)` }}
        ></div>
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

      <main className="grow w-full">
        <MajorHeroSection major={major} kuotaData={kuotaData} />
        <MajorCurriculumAndGallery major={major} />
        <MajorCareersAndPartners major={major} nextMajor={nextMajor} nextCode={nextCode} />
      </main>

      <MajorFooter />
    </div>
  );
}
