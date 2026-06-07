"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, MapPin, User, Calendar, Award, ArrowLeft } from "lucide-react";

interface VerificationData {
  id: number;
  nama: string;
  nisn: string;
  sekolah_asal: string;
  jenis_kelamin: string;
  tgl_lahir: string;
  status: string;
  tgl_daftar: string;
  jurusan_1: string;
  periode: string;
}

export default function VerificationPage() {
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VerificationData | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb-theme");
      if (saved === "dark" || document.documentElement.classList.contains("dark")) {
        setIsDark(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchVerificationData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/applicants/verify/${id}`);
        const json = await res.json();
        
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.message || "Data pendaftar tidak ditemukan.");
        }
      } catch (err) {
        console.error("Fetch verification error:", err);
        setError("Gagal menghubungi server verifikasi.");
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationData();
  }, [id]);

  const getGenderLabel = (g: string | null | undefined) => {
    if (!g) return "Laki-laki";
    const clean = g.toUpperCase().trim();
    if (clean === "L" || clean === "LAKI-LAKI" || clean === "LAKI_LAKI") return "Laki-laki";
    if (clean === "P" || clean === "PEREMPUAN") return "Perempuan";
    return g;
  };

  const getFormattedDate = (d: string | null | undefined) => {
    if (!d) return "14 Juni 2010";
    try {
      const date = new Date(d);
      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("id-ID", options);
    } catch (e) {
      return d;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-800 dark:text-white transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs font-black uppercase tracking-wider text-slate-450">Memuat Sistem Verifikasi...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-800 dark:text-white transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] p-8 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 mx-auto border border-rose-100 dark:border-rose-900/30">
            <XCircle size={32} />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-850 dark:text-white">Verifikasi Gagal</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-2 uppercase tracking-wide">
              {error || "Data pendaftaran tidak sah atau tidak ditemukan di server PPDB SMK Taruna Bhakti."}
            </p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-black uppercase tracking-wider transition-all"
          >
            <ArrowLeft size={14} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl md:max-w-2xl w-full space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Premium flex ticket card display (same layout as DataPendaftarTable detail but read-only) */}
        <div className="w-full bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 dark:from-slate-950 dark:via-slate-900/90 dark:to-indigo-950/30 border border-slate-200 dark:border-blue-500/20 rounded-[32px] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors duration-300">
          {/* Perforated Ticket Notches */}
          <div className="hidden md:block absolute -top-3.5 left-[66.67%] -translate-x-1/2 w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 z-20 transition-colors" />
          <div className="hidden md:block absolute -bottom-3.5 left-[66.67%] -translate-x-1/2 w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 z-20 transition-colors" />

          {/* Ticket Top bar */}
          <div className="flex justify-between items-center border-b border-slate-150 dark:border-white/5 pb-4 mb-4 transition-colors">
            <div className="flex items-center gap-3">
              <img src="/logo_smktb.png" alt="Logo TB" className="w-9 h-9 object-contain" />
              <div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider leading-none">SMK Taruna Bhakti</h4>
                <span className="text-[8px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mt-0.5">PPDB ONLINE {data.periode}</span>
              </div>
            </div>
            <div>
              {data.status === "Approved" ? (
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                  TERVERIFIKASI
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                  DALAM PROSES
                </span>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 py-2">
            
            {/* Left Side: Student Info */}
            <div className="md:col-span-7 flex flex-col justify-center py-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center border border-blue-200 dark:border-blue-500/30">
                  <User size={14} className="text-blue-700 dark:text-blue-400" />
                </div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Calon Peserta Didik Baru</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-slate-850 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-indigo-200 uppercase tracking-tight leading-tight truncate mb-4">
                {data.nama}
              </h2>
              
              {/* Sekolah Asal Details - Clean & borderless */}
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <MapPin size={16} />
                 </div>
                 <div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] block mb-0.5">Asal Sekolah</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                      {data.sekolah_asal || "-"}
                    </span>
                 </div>
              </div>
            </div>

            {/* Right Side: Major selection */}
            <div className="md:col-span-5 flex flex-col justify-center h-full">
              <div className="relative w-full h-full min-h-[140px] bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900/80 dark:to-indigo-950/40 border border-slate-200/80 dark:border-blue-500/20 rounded-[24px] p-6 transition-all flex flex-col items-center justify-center overflow-hidden group hover:border-blue-400/50 dark:hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10">
                {/* Decorative background circle */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/15 transition-colors duration-500" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-colors duration-500" />
                
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4 relative z-10 shadow-inner border border-blue-200 dark:border-blue-800">
                  <Award size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase block mb-2 relative z-10 text-center">Program Keahlian</span>
                <span className="text-base md:text-lg font-black text-slate-800 dark:text-white uppercase block tracking-wider leading-tight text-center relative z-10">
                  {data.jurusan_1}
                </span>
                <div className="mt-4 inline-block px-4 py-1.5 bg-white/80 dark:bg-slate-950/50 rounded-full border border-slate-200 dark:border-white/10 relative z-10 shadow-sm">
                  <span className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">SMK Taruna Bhakti</span>
                </div>
              </div>
            </div>

          </div>

          {/* Ticket Footer */}
          <div className="border-t border-slate-150 dark:border-white/5 pt-3.5 mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] font-bold text-slate-450 dark:text-slate-400 tracking-wider transition-colors">
            <div></div>
            <span className="text-slate-500 font-black">TERVERIFIKASI SISTEM PPDB</span>
          </div>

        </div>

        {/* Verification Success Alert Panel (Diletakkan di bawah kartu detail pendaftar sesuai request user) */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250 dark:border-emerald-900/40 rounded-[28px] p-6 shadow-md text-center flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 border-2 border-white dark:border-slate-900">
            <CheckCircle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-emerald-700 dark:text-emerald-400 text-sm font-black uppercase tracking-wider">Pendaftaran Terverifikasi Sah</h3>
            <p className="text-emerald-600 dark:text-emerald-450 text-xs md:text-sm font-bold leading-relaxed max-w-md mx-auto">
              Selamat, <span className="underline font-black text-slate-800 dark:text-white uppercase tracking-wider">{data.nama}</span>! Data pendaftaran Anda telah secara resmi diverifikasi sah oleh Panitia PPDB SMK Taruna Bhakti.
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-slate-350 hover:bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-all shadow-sm"
          >
            <ArrowLeft size={12} />
            Ke Halaman Utama PPDB
          </Link>
        </div>

      </div>
    </div>
  );
}
