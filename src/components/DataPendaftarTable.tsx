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

      {/* MODAL BIODATA */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Top Header */}
            <div className="px-8 pt-8 pb-6 flex justify-between items-start">
              <div className="flex gap-5 items-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/30">
                  {(selectedStudent.nama || "K")[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{selectedStudent.nama}</h2>
                    {selectedStudent.status === "Approved" ? (
                      <span className="px-3 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-500/30 rounded-full uppercase tracking-widest">
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-500/30 rounded-full uppercase tracking-widest">
                        Menunggu
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-blue-500">NISN: {selectedStudent.nisn}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>ASAL: {selectedStudent.sekolah_asal || selectedStudent.sekolahAsal || "SMPN 2 DEPOK"}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8">
              <div className="bg-slate-100 p-1.5 rounded-[16px] flex items-center gap-1 w-full overflow-x-auto">
                <button className="px-6 py-2.5 bg-white text-blue-600 text-[11px] font-bold uppercase tracking-widest rounded-[12px] shadow-sm shrink-0">Biodata</button>
                <button className="px-6 py-2.5 text-slate-500 hover:text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-[12px] hover:bg-slate-200/50 transition-colors shrink-0">Periodik</button>
                <button className="px-6 py-2.5 text-slate-500 hover:text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-[12px] hover:bg-slate-200/50 transition-colors shrink-0">Bantuan</button>
                <button className="px-6 py-2.5 text-slate-500 hover:text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-[12px] hover:bg-slate-200/50 transition-colors shrink-0">Orang Tua</button>
                <button className="px-6 py-2.5 text-slate-500 hover:text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-[12px] hover:bg-slate-200/50 transition-colors shrink-0">Akademik</button>
                <button className="px-6 py-2.5 text-slate-500 hover:text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-[12px] hover:bg-slate-200/50 transition-colors shrink-0">Pernyataan</button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[50vh] overflow-y-auto">
              {/* Identitas Diri Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <h3 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-widest">Identitas Diri</h3>
                </div>

                <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nama Lengkap</div>
                  <div className="text-sm font-bold text-slate-800">{selectedStudent.nama}</div>
                </div>

                <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">NISN / NIK</div>
                  <div className="text-sm font-bold text-slate-600">{selectedStudent.nisn} / {(selectedStudent as any).nik || "3276266362372757"}</div>
                </div>

                <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tempat, Tanggal Lahir</div>
                  <div className="text-sm font-bold text-slate-600">{(selectedStudent as any).tempat_lahir || "Depok"}, {(selectedStudent as any).tanggal_lahir || "2010-06-14T17:00:00.000Z"}</div>
                </div>

                <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Jenis Kelamin / Agama</div>
                  <div className="text-sm font-bold text-slate-600">{(selectedStudent as any).jenis_kelamin || "L"} / {(selectedStudent as any).agama || "Islam"}</div>
                </div>
              </div>

              {/* Alamat & Kontak Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center">
                    <span className="text-blue-500 font-bold" style={{fontSize: "12px"}}>!</span>
                  </div>
                  <h3 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-widest">Alamat & Kontak</h3>
                </div>

                <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp / Email</div>
                  <div className="text-sm font-bold text-blue-500">{selectedStudent.whatsapp || "081234085214"} / {selectedStudent.email || "kevinlestari@email.com"}</div>
                </div>

                <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Alamat Tempat Tinggal</div>
                  <div className="text-sm font-bold text-slate-600">{selectedStudent.alamat || "Jl. Pekapuran No. 83 (RT/RW 03/05)"}</div>
                </div>

                <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kelurahan / Kecamatan</div>
                  <div className="text-sm font-bold text-slate-600">{(selectedStudent as any).kelurahan || "Curug"} / {(selectedStudent as any).kecamatan || "Cimanggis"}</div>
                </div>

                <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tinggal Dengan / Transportasi</div>
                  <div className="text-sm font-bold text-slate-600">{(selectedStudent as any).tinggal_dengan || "Orang Tua"} / {(selectedStudent as any).transportasi || "Jalan Kaki"}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-white">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ID_SISWA: #{selectedStudent.id}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-6 py-2.5 rounded-[12px] font-bold text-[11px] uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                     if(confirm("Apakah Anda yakin ingin menolak / menggugurkan pendaftar ini?")) {
                       // Logic implementation here
                     }
                  }}
                  className="px-6 py-2.5 rounded-[12px] font-bold text-[11px] uppercase tracking-widest bg-[#ff0040] text-white hover:bg-red-600 transition-colors shadow-lg shadow-[#ff0040]/30"
                >
                  Tolak / Gugurkan
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
