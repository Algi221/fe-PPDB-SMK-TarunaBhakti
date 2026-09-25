"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, Eye, Moon, Sun, User, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";
import PublicStudentDetailModal, { StatusBadge } from "./components/PublicStudentDetailModal";

export default function DataPendaftarPage() {
  const { publicApplicants } = usePPDB();
  const [isDark, setIsDark] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const saved = localStorage.getItem('ppdb-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
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

  const filteredData = publicApplicants.filter(item => {
    const matchName = (item.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) || (item.nisn || "").includes(searchTerm);
    const matchJurusan = filterJurusan === "Semua" || (item.jurusan_1 || item.jurusan1 || "").includes(filterJurusan);
    
    return matchName && matchJurusan;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Background Glowing Blobs */}
      <div className="bg-glow-container opacity-60">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
            <ArrowLeft size={18} className="text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white hidden sm:block">Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">
            PPDB <span className="text-blue-600">SMK TB</span>
          </span>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <button 
            onClick={toggleDark} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700" 
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Pangkalan Data Pendaftar</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">Transparansi data pendaftar PPDB Online SMK Taruna Bhakti secara real-time. Anda dapat mencari dan melihat rincian biodata calon siswa.</p>
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 shrink-0">
            <User size={20} className="text-blue-500" />
            <div>
              <div className="text-xs font-semibold opacity-75">Total Pendaftar</div>
              <div className="text-xl font-black">{publicApplicants.length} Siswa</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Nama atau NISN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-white transition-all"
            />
          </div>
          <div className="flex gap-4 md:w-auto w-full">
            <div className="relative w-full md:w-48 shrink-0">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <label htmlFor="pendaftar-filter-jurusan" className="sr-only">Filter Jurusan</label>
              <select 
                id="pendaftar-filter-jurusan"
                value={filterJurusan}
                onChange={(e) => setFilterJurusan(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-white appearance-none cursor-pointer transition-all"
              >
                <option value="Semua">Semua Jurusan</option>
                <option value="Rekayasa Perangkat Lunak">RPL</option>
                <option value="Teknik Jaringan Komputer & Telekomunikasi">TJKT</option>
                <option value="Desain Komunikasi Visual">DKV</option>
                <option value="Broadcasting">Broadcasting</option>
                <option value="Animasi">Animasi</option>
                <option value="Teknik Elektronika">Teknik Elektronika</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <User size={18} /> Daftar Calon Taruna Baru
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama & NISN</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asal Sekolah</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Program Studi Pilihan 1</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{startIndex + index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">{item.nama}</div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 opacity-80">{item.nisn}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.sekolah_asal || item.asalSekolah}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.jurusan_1 || item.jurusan1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedStudent(item)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          Lihat Detail <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={40} className="text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-sm font-medium">Tidak ada data pendaftar yang cocok dengan filter Anda.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} Data
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 px-4">
                  {currentPage} dari {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL BIODATA */}
      <PublicStudentDetailModal
        selectedStudent={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

    </div>
  );
}
