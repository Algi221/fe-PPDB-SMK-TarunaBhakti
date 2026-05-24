"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Eye, X, CheckCircle, Clock, XCircle, User, MapPin, Phone, Mail, FileText, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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
            placeholder="Cari Nama atau NISN..."
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
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama & NISN</th>
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
                      <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 opacity-80">{item.nisn}</div>
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

      {/* MODAL BIODATA */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}></div>
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText size={16} /> Biodata Calon Taruna
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-slate-700 border border-blue-100 dark:border-slate-600 flex flex-col items-center justify-center shrink-0">
                  <User size={28} className="text-blue-500 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white truncate">{selectedStudent.nama}</h3>
                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><FileText size={12} /> NISN: {selectedStudent.nisn}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> Asal: {selectedStudent.sekolah_asal || selectedStudent.sekolahAsal}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data Pribadi */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-1 uppercase flex items-center gap-1.5"><User size={12} className="text-blue-500" /> Data Pribadi</h4>
                  <div className="space-y-2">
                    <div><div className="text-[9px] text-slate-400">WhatsApp / Email</div><div className="text-xs font-bold dark:text-white text-blue-500">{selectedStudent.whatsapp || "-"} / {selectedStudent.email || "-"}</div></div>
                    <div><div className="text-[9px] text-slate-400">Alamat</div><div className="text-xs font-bold dark:text-white">{selectedStudent.alamat || "-"}</div></div>
                  </div>
                </div>

                {/* Akademik */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-1 uppercase flex items-center gap-1.5"><FileText size={12} className="text-blue-500" /> Akademik</h4>
                  <div className="space-y-2">
                    <div><div className="text-[9px] text-slate-400">Pilihan Utama</div><div className="text-xs font-bold text-blue-600 dark:text-blue-400">{selectedStudent.jurusan_1 || selectedStudent.jurusan1 || "-"}</div></div>
                    <div><div className="text-[9px] text-slate-400">Pilihan Alternatif</div><div className="text-xs font-bold dark:text-white">{selectedStudent.jurusan_2 || selectedStudent.jurusan2 || "-"}</div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-slate-900/50 px-5 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-lg font-bold text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
