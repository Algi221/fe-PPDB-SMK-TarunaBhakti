"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Eye, X, CheckCircle, Clock, XCircle, User, MapPin, Phone, Mail, FileText, ChevronLeft, ChevronRight, ArrowRight, Calendar, Sparkles } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";

interface Student {
  id: number;
  nama: string;
  nisn: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  jurusan_1?: string;
  jurusan1?: string;
  jurusan_2?: string;
  jurusan2?: string;
  status: string;
  whatsapp?: string;
  email?: string;
  alamat?: string;
  isNew?: boolean;
  isFadingOut?: boolean;
}

export default function DataPendaftarTable() {
  const { publicApplicants } = usePPDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Local state for smooth fade-out / fade-in animations
  const [activeRows, setActiveRows] = useState<Student[]>([]);
  const prevApplicantsRef = useRef<Student[]>([]);

  useEffect(() => {
    // Initialize if empty
    if (activeRows.length === 0 && publicApplicants.length > 0) {
      setActiveRows(publicApplicants.map((a: any) => ({ ...a, isNew: false, isFadingOut: false })));
      prevApplicantsRef.current = publicApplicants;
      return;
    }

    const currentIds = publicApplicants.map((a: any) => a.id);

    // Find what was removed (rejected)
    const removedApplicants = prevApplicantsRef.current.filter((a: any) => !currentIds.includes(a.id));

    let updatedRows = [...activeRows];

    // 1. Mark removed applicants as fading out
    removedApplicants.forEach(removed => {
      const idx = updatedRows.findIndex(r => r.id === removed.id);
      if (idx > -1) {
        updatedRows[idx] = { ...updatedRows[idx], isFadingOut: true };
      } else {
        updatedRows.push({ ...removed, isFadingOut: true });
      }
    });

    // 2. Add or update currently active applicants
    publicApplicants.forEach((newItem: any) => {
      const idx = updatedRows.findIndex(r => r.id === newItem.id);
      if (idx > -1) {
        updatedRows[idx] = { 
          ...updatedRows[idx], 
          ...newItem, 
          isFadingOut: false 
        };
      } else {
        // New registration (from wizard submit or WS simulation)
        updatedRows.unshift({ ...newItem, isNew: true, isFadingOut: false });
      }
    });

    setActiveRows(updatedRows);
    prevApplicantsRef.current = publicApplicants;

    // 3. Clear fading rows and reset isNew flag after animation duration (500ms)
    const timer = setTimeout(() => {
      setActiveRows(prev => 
        prev
          .filter(r => !r.isFadingOut)
          .map(r => ({ ...r, isNew: false }))
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [publicApplicants, activeRows.length]);

  if (selectedStudent) {
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
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
      } catch (e) {
        return d;
      }
    };

    return (
      <div className="flex flex-col h-full animate-in slide-in-from-right duration-500 ease-out text-left relative z-10">
        {/* Back navigation header inside mockup browser */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <button
            onClick={() => setSelectedStudent(null)}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Kembali ke Daftar</span>
          </button>
          
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            ID: #TB-{selectedStudent.id}
          </span>
        </div>

        {/* Premium Flexing Card */}
        <div className="flex-1 w-full flex flex-col items-center py-4 overflow-y-auto scrollbar-none">
          
          <div className="w-full max-w-xl md:max-w-2xl bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 dark:from-slate-950 dark:via-slate-900/90 dark:to-indigo-950/30 border border-slate-200 dark:border-blue-500/20 rounded-[24px] p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors duration-300 shrink-0 mb-6">
            {/* Ambient Background Lights - Dark Mode Only */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-600/10 dark:bg-indigo-650/15 rounded-full blur-[80px] pointer-events-none" />

            {/* Perforated Ticket Notches (Desktop Only) */}
            <div className="hidden md:block absolute -top-3 left-[58.33%] -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-20 transition-colors" />
            <div className="hidden md:block absolute -bottom-3 left-[58.33%] -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-20 transition-colors" />

            {/* Card Header */}
            <div className="flex justify-between items-center border-b border-slate-150 dark:border-white/5 pb-3 mb-4 transition-colors">
              <div className="flex items-center gap-2.5">
                <img src="/logo_smktb.png" alt="Logo TB" className="w-8 h-8 object-contain animate-pulse" />
                <div>
                  <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider leading-none">SMK Taruna Bhakti</h4>
                  <span className="text-[7.5px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mt-0.5">PPDB ONLINE 2026/2027</span>
                </div>
              </div>
              <div>
                {selectedStudent.status === "Approved" ? (
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[8.5px] font-black uppercase tracking-widest rounded-md animate-pulse">
                    Terverifikasi
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-[8.5px] font-black uppercase tracking-widest rounded-md animate-pulse">
                    Dalam Proses
                  </span>
                )}
              </div>
            </div>

            {/* Card Grid Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative z-10">
              
              {/* Left Side: Student Info */}
              <div className="md:col-span-7 pr-0 md:pr-4 border-r-0 md:border-r md:border-dashed border-slate-200 dark:border-slate-800/80 space-y-3.5">
                <div>
                  <span className="text-[7.5px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest block mb-0.5">Calon Peserta Didik Baru</span>
                  <h2 className="text-lg md:text-xl font-black text-slate-850 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-sky-200 uppercase tracking-tight leading-snug truncate">
                    {selectedStudent.nama}
                  </h2>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1.5" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-150 dark:border-white/5 rounded-xl p-2.5 transition-colors flex items-start gap-2">
                    <div className="w-6.5 h-6.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={13} />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Sekolah Asal</span>
                      <div className="text-[10px] font-black text-slate-700 dark:text-slate-200 truncate">
                        {selectedStudent.sekolah_asal || selectedStudent.sekolahAsal || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-150 dark:border-white/5 rounded-xl p-2.5 transition-colors flex items-start gap-2">
                    <div className="w-6.5 h-6.5 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={13} />
                    </div>
                    <div>
                      <span className="text-[7px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest block mb-0.5">Jenis Kelamin</span>
                      <div className="text-[10px] font-black text-slate-700 dark:text-slate-200">
                        {getGenderLabel((selectedStudent as any).jenis_kelamin)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-150 dark:border-white/5 rounded-xl p-2.5 transition-colors flex items-start gap-2">
                    <div className="w-6.5 h-6.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar size={13} />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[7px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest block mb-0.5">Tanggal Lahir</span>
                      <div className="text-[10px] font-black text-slate-700 dark:text-slate-200 truncate">
                        {getFormattedDate((selectedStudent as any).tanggal_lahir)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-150 dark:border-white/5 rounded-xl p-2.5 transition-colors flex items-start gap-2">
                    <div className="w-6.5 h-6.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle size={13} />
                    </div>
                    <div>
                      <span className="text-[7px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-widest block mb-0.5">No Registrasi</span>
                      <div className="text-[10px] font-black text-slate-700 dark:text-slate-200">
                        TB-{selectedStudent.id}-{selectedStudent.nisn ? selectedStudent.nisn.substring(0, 4) : '2026'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: QR Code Verification Badge (Large) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-2.5 pl-0 md:pl-2">
                <div className="relative p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-blue-500/20 dark:border-blue-500/40 group hover:scale-[1.02] transition-transform duration-300">
                  {/* Viewfinder corner lines */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-blue-600 dark:border-blue-400 rounded-tl" />
                  <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-blue-600 dark:border-blue-400 rounded-tr" />
                  <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-blue-600 dark:border-blue-400 rounded-bl" />
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-blue-600 dark:border-blue-400 rounded-br" />
                  
                  {(() => {
                    const verifyUrl = typeof window !== 'undefined' 
                      ? `${window.location.origin}/verify/${selectedStudent.id}` 
                      : `http://localhost:3000/verify/${selectedStudent.id}`;
                    return (
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(verifyUrl)}`} 
                        alt="Verification QR" 
                        className="w-36 h-36 object-contain rounded-xl"
                      />
                    );
                  })()}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 tracking-widest uppercase block animate-pulse">SCAN VERIFIKASI</span>
                  <span className="text-[7px] text-slate-400 dark:text-slate-500 font-extrabold uppercase block tracking-wider">PANITIA PPDB SMK TB</span>
                </div>
              </div>

            </div>

            {/* Card Footer */}
            <div className="border-t border-slate-150 dark:border-white/5 pt-3 mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[8px] font-bold text-slate-450 dark:text-slate-400 tracking-wider transition-colors">
              <span className="uppercase">REGISTERED NO: TB-{selectedStudent.id}-{(selectedStudent as any).jenis_kelamin || 'L'}-{selectedStudent.nisn ? selectedStudent.nisn.substring(0, 4) : '2026'}</span>
              <span className="text-slate-500 font-black">TP. 2026/2027</span>
            </div>

          </div>
        </div>

      </div>
    );
  }

  // Filter local active rows
  const filteredData = activeRows.filter(item => {
    const matchName = 
      (item.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.nisn || "").includes(searchTerm);
    
    const matchJurusan = 
      filterJurusan === "Semua" || 
      (item.jurusan_1 || item.jurusan1 || "").includes(filterJurusan);
    
    return matchName && matchJurusan;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      
      {/* Header Inside Mockup Box */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Calon Peserta Didik Baru</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Data pendaftar PPDB Online secara real-time.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 shrink-0">
          <User size={16} className="text-blue-500" />
          <div className="text-xs font-semibold">Total: <span className="font-bold text-sm">{publicApplicants.length}</span></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Cari Nama Pendaftar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterJurusan}
            onChange={(e) => setFilterJurusan(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white transition-all"
          >
            <option value="Semua">Semua Jurusan</option>
            <option value="Rekayasa Perangkat Lunak">RPL</option>
            <option value="Teknik Jaringan Komputer & Telekomunikasi">TJKT</option>
            <option value="Desain Komunikasi Visual">DKV</option>
            <option value="Broadcasting & Perfilman">BC</option>
            <option value="Animasi">Animasi</option>
            <option value="Teknik Elektronika">TE</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asal Sekolah</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      opacity: item.isFadingOut ? 0 : 1,
                      transform: item.isFadingOut ? "translateX(-50px)" : "translateX(0)",
                      transition: "all 0.5s ease"
                    }}
                    className={`hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors group ${
                      item.isNew ? "bg-emerald-500/10 dark:bg-emerald-500/5 animate-pulse" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="text-xs font-bold text-slate-800 dark:text-white mb-0.5">{item.nama}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.sekolah_asal || item.sekolahAsal}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        item.status === "Approved"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                      }`}>
                        {item.status === "Approved" ? "Terverifikasi" : "Menunggu Verifikasi"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedStudent(item); }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50/50 dark:bg-blue-900/20 px-2 py-1.5 rounded-md"
                      >
                        Detail <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    <p className="text-xs font-medium">Tidak ada data pendaftar yang cocok dengan filter Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between mt-auto">
            <div className="text-[10px] font-semibold text-slate-500">
              Hal {currentPage} dari {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200/50 dark:border-slate-700/50 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft size={12} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200/50 dark:border-slate-700/50 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
