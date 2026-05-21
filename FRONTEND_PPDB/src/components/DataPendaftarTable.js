"use client";

import React, { useState } from "react";
import { Search, Filter, Eye, X, CheckCircle, Clock, XCircle, User, MapPin, Phone, Mail, FileText, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// Mock Data untuk Pendaftar
const mockData = [
  { id: 1, nama: "Ahmad Bintang Pratama", nisn: "0081234567", kelamin: "Laki-laki", asalSekolah: "SMPN 1 Depok", jurusan1: "Rekayasa Perangkat Lunak", jurusan2: "Teknik Komputer dan Jaringan", status: "Terverifikasi", tglDaftar: "12 Mei 2026", noHp: "081234567890", email: "bintang@email.com", alamat: "Jl. Margonda Raya No. 1, Depok", ayah: "Budi Santoso", ibu: "Siti Aminah" },
  { id: 2, nama: "Putri Ayu Lestari", nisn: "0087654321", kelamin: "Perempuan", asalSekolah: "SMPN 2 Depok", jurusan1: "Desain Komunikasi Visual", jurusan2: "Animasi", status: "Menunggu Verifikasi", tglDaftar: "13 Mei 2026", noHp: "082345678901", email: "putri@email.com", alamat: "Jl. Raya Bogor KM 30, Depok", ayah: "Ahmad Yani", ibu: "Nurhayati" },
  { id: 3, nama: "Bima Arya", nisn: "0091122334", kelamin: "Laki-laki", asalSekolah: "SMPN 3 Depok", jurusan1: "Teknik Elektronika", jurusan2: "Rekayasa Perangkat Lunak", status: "Terverifikasi", tglDaftar: "13 Mei 2026", noHp: "083456789012", email: "bima@email.com", alamat: "Jl. Nusantara Raya, Depok", ayah: "Hendro", ibu: "Sulastri" },
  { id: 4, nama: "Rina Maharani", nisn: "0094455667", kelamin: "Perempuan", asalSekolah: "SMP IT Al-Hikmah", jurusan1: "Broadcasting & Perfilman", jurusan2: "Desain Komunikasi Visual", status: "Ditolak", tglDaftar: "14 Mei 2026", noHp: "084567890123", email: "rina@email.com", alamat: "Perumahan Pesona Khayangan, Depok", ayah: "Wahyudi", ibu: "Endang" },
  { id: 5, nama: "Kevin Wijaya", nisn: "0089988776", kelamin: "Laki-laki", asalSekolah: "SMP Mardi Yuana", jurusan1: "Teknik Jaringan Komputer & Telekomunikasi", jurusan2: "Teknik Elektronika", status: "Menunggu Verifikasi", tglDaftar: "14 Mei 2026", noHp: "085678901234", email: "kevin@email.com", alamat: "Jl. Siliwangi, Depok", ayah: "Hendra Wijaya", ibu: "Linda" },
  { id: 6, nama: "Siti Nurhaliza", nisn: "0092233445", kelamin: "Perempuan", asalSekolah: "MTsN 1 Depok", jurusan1: "Animasi", jurusan2: "Rekayasa Perangkat Lunak", status: "Terverifikasi", tglDaftar: "15 Mei 2026", noHp: "086789012345", email: "siti@email.com", alamat: "Jl. Sawangan, Depok", ayah: "Umar", ibu: "Khadijah" },
  { id: 7, nama: "Fajar Siddiq", nisn: "0083344556", kelamin: "Laki-laki", asalSekolah: "SMPN 4 Depok", jurusan1: "Rekayasa Perangkat Lunak", jurusan2: "Desain Komunikasi Visual", status: "Terverifikasi", tglDaftar: "15 Mei 2026", noHp: "087890123456", email: "fajar@email.com", alamat: "Cimanggis, Depok", ayah: "Rahman", ibu: "Dewi" },
  { id: 8, nama: "Dian Sastro", nisn: "0095566778", kelamin: "Perempuan", asalSekolah: "SMP Budi Kharisma", jurusan1: "Broadcasting & Perfilman", jurusan2: "Animasi", status: "Menunggu Verifikasi", tglDaftar: "16 Mei 2026", noHp: "088901234567", email: "dian@email.com", alamat: "Beji, Depok", ayah: "Tono", ibu: "Yanti" }
];



export default function DataPendaftarTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("Semua");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Data
  const filteredData = mockData.filter(item => {
    const matchName = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.nisn.includes(searchTerm);
    const matchJurusan = filterJurusan === "Semua" || item.jurusan1.includes(filterJurusan);
    return matchName && matchJurusan;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">

      {/* Header Inside Dashboard */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Calon Peserta Didik Baru</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Data pendaftar PPDB Online secara real-time.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 shrink-0">
          <User size={16} className="text-blue-500" />
          <div className="text-xs font-semibold">Total: <span className="font-bold text-sm">{mockData.length}</span></div>
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
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jurusan</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="text-xs font-bold text-slate-800 dark:text-white mb-0.5">{item.nama}</div>
                      <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 opacity-80">{item.nisn}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.asalSekolah}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.jurusan1}</div>
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
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
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
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText size={18} /> Biodata Calon Taruna
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl bg-blue-50 dark:bg-slate-700 border border-blue-100 dark:border-slate-600 flex flex-col items-center justify-center shrink-0">
                  <User size={32} className="text-blue-500 dark:text-slate-400 mb-1" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">{selectedStudent.nama}</h3>
                  <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><FileText size={14} /> NISN: {selectedStudent.nisn}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {selectedStudent.asalSekolah}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data Pribadi */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-1 uppercase flex items-center gap-1.5"><User size={14} className="text-blue-500" /> Data Pribadi</h4>
                  <div className="space-y-2">
                    <div><div className="text-[10px] text-slate-400">Jenis Kelamin</div><div className="text-xs font-bold dark:text-white">{selectedStudent.kelamin}</div></div>
                    <div><div className="text-[10px] text-slate-400">Alamat</div><div className="text-xs font-bold dark:text-white">{selectedStudent.alamat}</div></div>
                  </div>
                </div>

                {/* Akademik */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-1 uppercase flex items-center gap-1.5"><FileText size={14} className="text-blue-500" /> Akademik</h4>
                  <div className="space-y-2">
                    <div><div className="text-[10px] text-slate-400">Pilihan Utama</div><div className="text-xs font-bold text-blue-600 dark:text-blue-400">{selectedStudent.jurusan1}</div></div>
                    <div><div className="text-[10px] text-slate-400">Pilihan Alternatif</div><div className="text-xs font-bold dark:text-white">{selectedStudent.jurusan2}</div></div>
                  </div>
                </div>

                {/* Data Orang Tua */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-1 uppercase flex items-center gap-1.5"><User size={14} className="text-blue-500" /> Data Orang Tua</h4>
                  <div className="space-y-2">
                    <div><div className="text-[10px] text-slate-400">Nama Ayah</div><div className="text-xs font-bold dark:text-white">{selectedStudent.ayah}</div></div>
                    <div><div className="text-[10px] text-slate-400">Nama Ibu</div><div className="text-xs font-bold dark:text-white">{selectedStudent.ibu}</div></div>
                  </div>
                </div>

                {/* Kontak */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-1 uppercase flex items-center gap-1.5"><Phone size={14} className="text-blue-500" /> Kontak</h4>
                  <div className="space-y-2">
                    <div><div className="text-[10px] text-slate-400">WhatsApp</div><div className="text-xs font-bold dark:text-white">{selectedStudent.noHp}</div></div>
                    <div><div className="text-[10px] text-slate-400">Email</div><div className="text-xs font-bold dark:text-white">{selectedStudent.email}</div></div>
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
