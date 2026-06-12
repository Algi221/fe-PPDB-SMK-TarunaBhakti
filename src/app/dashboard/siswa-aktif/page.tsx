"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePPDB } from "@/context/PPDBContext";
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
import { motion, AnimatePresence } from "framer-motion";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { 
  Search, 
  Download, 
  GraduationCap, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  User, 
  Info, 
  Heart, 
  Layers, 
  HelpCircle, 
  FileCheck, 
  FileText, 
  FileImage, 
  FileWarning, 
  Eye, 
  X, 
  Filter, 
  BookOpen, 
  School,
  Sparkles,
  Trash2
} from "lucide-react";

interface Applicant {
  id: number;
  nama: string;
  nisn: string;
  nik?: string;
  tempat_lahir?: string;
  tempatLahir?: string;
  tgl_lahir?: string;
  tglLahir?: string;
  jenis_kelamin?: string;
  jenisKelamin?: string;
  agama?: string;
  alamat?: string;
  rt_rw?: string;
  rtRw?: string;
  kelurahan?: string;
  kecamatan?: string;
  kode_pos?: string;
  kodePos?: string;
  whatsapp?: string;
  email?: string;
  tinggal_dengan?: string;
  tinggalDengan?: string;
  transportasi?: string;
  tinggi_badan?: string | number;
  tinggiBadan?: string | number;
  berat_badan?: string | number;
  beratBadan?: string | number;
  golongan_darah?: string;
  golonganDarah?: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  tgl_lulus?: string;
  tglLulus?: string;
  jurusan_1?: string;
  jurusan1?: string;
  jurusan_2?: string;
  jurusan2?: string;
  nama_ayah?: string;
  namaAyah?: string;
  pekerjaan_ayah?: string;
  pekerjaanAyah?: string;
  penghasilan_ayah?: string;
  penghasilanAyah?: string;
  nama_ibu?: string;
  namaIbu?: string;
  pendidikan_ibu?: string;
  pendidikanIbu?: string;
  pekerjaan_ibu?: string;
  pekerjaanIbu?: string;
  penghasilan_ibu?: string;
  penghasilanIbu?: string;
  telepon_ortu?: string;
  teleponOrtu?: string;
  cita_cita?: string;
  citaCita?: string;
  alasan_memilih?: string;
  alasanMemilih?: string;
  status?: string;
  tgl_daftar?: string;
  createdAt?: string;
  nama_wali?: string;
  namaWali?: string;
  no_ijazah?: string;
  noIjazah?: string;
  no_skhun?: string;
  noSkhun?: string;
  lama_belajar?: string | number;
  lamaBelajar?: string | number;
  jarak_sekolah?: string | number;
  jarakSekolah?: string | number;
  waktu_jam?: number;
  waktuJam?: number;
  waktu_menit?: number;
  waktuMenit?: number;
  jumlah_saudara?: number;
  jumlahSaudara?: number;
  penyakit_diderita?: string;
  penyakitDiderita?: string;
  kebutuhan_khusus?: string[];
  punya_kps?: string;
  punyaKps?: string;
  no_kps?: string;
  noKps?: string;
  punya_kip?: string;
  punyaKip?: string;
  no_kip?: string;
  noKip?: string;
  uraian_prestasi?: string;
  uraianPrestasi?: string;
  uraian_beasiswa?: string;
  uraianBeasiswa?: string;
  perkelahian?: string;
  narkoba?: string;
  pelanggaran_lain?: string;
  periode?: string;
  berkas_kk?: string;
  berkas_ktp?: string;
  berkas_akta?: string;
  berkas_ijazah?: string;
  berkas_foto?: string;
  [key: string]: any;
}

export default function ActiveStudentsDirectory() {
  const { applicants, addToast, fetchAdminApplicants } = usePPDB();

  useEffect(() => {
    if (typeof fetchAdminApplicants === "function") {
      fetchAdminApplicants();
    }
  }, [fetchAdminApplicants]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({});

  const [customPeriods, setCustomPeriods] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("ppdb_custom_periods");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState(false);
  const [newPeriodValue, setNewPeriodValue] = useState("");

  const getNextPeriod = () => {
    const allPeriods = [
      ...Object.keys(groupedByPeriod),
      ...customPeriods
    ];
    if (allPeriods.length === 0) {
      const y = new Date().getFullYear();
      return `${y}-${y + 1}`;
    }
    
    const maxStartYear = Math.max(
      ...allPeriods.map(p => parseInt(p.split("-")[0]) || 0)
    );
    return `${maxStartYear + 1}-${maxStartYear + 2}`;
  };

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [activeTab, setActiveTab] = useState<string>("biodata");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedApplicant) {
      setSelectedDoc(null);
    }
  }, [selectedApplicant]);

  const activeApplicants = useMemo(() => {
    return applicants.filter((a: Applicant) => a.status === "Approved" && !!(a.diterima_kelas || a.diterimaKelas));
  }, [applicants]);

  const filteredApplicants = useMemo(() => {
    return activeApplicants.filter((a: Applicant) => {
      const nameMatch = (a.nama || "").toLowerCase().includes(searchTerm.toLowerCase());
      const nisnMatch = (a.nisn || "").toLowerCase().includes(searchTerm.toLowerCase());
      const schoolMatch = (a.sekolah_asal || a.sekolahAsal || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const searchMatch = nameMatch || nisnMatch || schoolMatch;
      
      if (majorFilter === "ALL") return searchMatch;
      
      const maj1 = (a.jurusan_1 || a.jurusan1 || "").toLowerCase();
      const maj2 = (a.jurusan_2 || a.jurusan2 || "").toLowerCase();
      const target = majorFilter.toLowerCase();
      
      const majorMatch = maj1.includes(target) || maj2.includes(target);
      return searchMatch && majorMatch;
    });
  }, [activeApplicants, searchTerm, majorFilter]);

  const groupedByPeriod = useMemo(() => {
    const groups: Record<string, Applicant[]> = {};

    customPeriods.forEach(p => {
      groups[p] = [];
    });

    filteredApplicants.forEach((a: Applicant) => {
      const period = a.periode || "2026-2027";
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(a);
    });

    Object.keys(groups).forEach(p => {
      groups[p].sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));
    });

    return groups;
  }, [filteredApplicants, customPeriods]);

  const sortedPeriods = useMemo(() => {
    return Object.keys(groupedByPeriod).sort((a, b) => b.localeCompare(a));
  }, [groupedByPeriod]);

  useEffect(() => {
    if (sortedPeriods.length > 0) {
      setExpandedPeriods(prev => {
        
        if (Object.keys(prev).length === 0) {
          const defaults: Record<string, boolean> = {};
          sortedPeriods.forEach((p, idx) => {
            defaults[p] = idx === 0; 
          });
          return defaults;
        }
        return prev;
      });
    }
  }, [sortedPeriods]);

  const togglePeriod = (period: string) => {
    setExpandedPeriods(prev => ({
      ...prev,
      [period]: !prev[period]
    }));
  };

  const stats = useMemo(() => {
    const total = activeApplicants.length;
    const currentBatch = activeApplicants.filter(a => (a.periode || "2026-2027") === "2026-2027").length;

    const majors: Record<string, number> = {};
    activeApplicants.forEach(a => {
      const choice = a.jurusan_1 || a.jurusan1 || "Lainnya";
      majors[choice] = (majors[choice] || 0) + 1;
    });

    let popular = "Belum Ada";
    let max = 0;
    Object.entries(majors).forEach(([name, count]) => {
      if (count > max) {
        max = count;
        popular = name;
      }
    });

    return { total, currentBatch, popular };
  }, [activeApplicants]);

  const handleExportExcel = async (students: Applicant[], fileNameSuffix: string) => {
    if (students.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    
    // Group students by period
    const groups: Record<string, Applicant[]> = {};
    students.forEach((a: Applicant) => {
      const period = a.periode || '2026-2027';
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(a);
    });

    // Sort periods descending to have the latest period first
    const periods = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    periods.forEach((period) => {
      // Sheet name must not exceed 31 characters and cannot contain special characters like : \ / ? * [ ]
      const sheetName = `Periode ${period.replace(/[:\\/?*\[\]]/g, '')}`.substring(0, 31);
      const worksheet = workbook.addWorksheet(sheetName);

      worksheet.columns = [
        { header: 'Periode Angkatan', key: 'periode', width: 20 },
        { header: 'Nama Lengkap', key: 'nama', width: 35 },
        { header: 'NISN', key: 'nisn', width: 25 },
        { header: 'NIK', key: 'nik', width: 25 },
        { header: 'Asal Sekolah', key: 'sekolah', width: 35 },
        { header: 'Jurusan', key: 'jurusan', width: 35 },
        { header: 'Kelas', key: 'kelas', width: 20 },
        { header: 'No. WhatsApp', key: 'whatsapp', width: 25 },
        { header: 'Email', key: 'email', width: 35 },
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.height = 35;
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FF000000' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF9BC2E6' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      const periodStudents = groups[period];
      // Sort periodStudents alphabetically by name
      periodStudents.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

      periodStudents.forEach((a: Applicant) => {
        worksheet.addRow({
          periode: a.periode || '2026-2027',
          nama: a.nama || "",
          nisn: a.nisn || "",
          nik: a.nik || "",
          sekolah: a.sekolah_asal || a.sekolahAsal || "",
          jurusan: a.jurusan_1 || a.jurusan1 || "",
          kelas: a.diterima_kelas || a.diterimaKelas || "-",
          whatsapp: a.whatsapp || "",
          email: a.email || "",
        });
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.height = 25;
        }
        row.eachCell((cell, colNumber) => {
          if (rowNumber > 1) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            if ([1, 3, 4, 7, 8, 9].includes(colNumber)) {
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
              cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
            }
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Data_Siswa_Aktif_${fileNameSuffix}_${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      
      {/* Executive Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-950/60 dark:to-indigo-900/40 border border-indigo-400/20 dark:border-indigo-850/40 rounded-3xl p-6 shadow-sm text-white flex items-center justify-between transition-all duration-300 hover:shadow-md">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Total Siswa Aktif</span>
            <h3 className="text-3xl font-black leading-none">{stats.total} <span className="text-xs font-bold text-indigo-200">Siswa</span></h3>
            <p className="text-[10px] text-indigo-150 font-bold mt-1">Gabungan seluruh angkatan terverifikasi</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
            <GraduationCap size={24} className="text-indigo-100" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors duration-300">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-black tracking-widest">Periode Terkini (2026-2027)</span>
            <h3 className="text-3xl font-black leading-none text-slate-800 dark:text-white">{stats.currentBatch} <span className="text-xs font-bold text-slate-400">Siswa</span></h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Calon angkatan tahun ini</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30 shrink-0">
            <Calendar size={24} className="text-emerald-600 dark:text-emerald-450" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors duration-300">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-black tracking-widest">Konsentrasi Populer</span>
            <h3 className="text-base font-black truncate max-w-[200px] leading-tight text-slate-800 dark:text-white uppercase tracking-wider">{stats.popular}</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Kompetensi keahlian pendaftar terbanyak</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30 shrink-0">
            <BookOpen size={24} className="text-blue-600 dark:text-blue-450" />
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row gap-4 items-center justify-between transition-colors duration-300">
        <div className="w-full xl:w-auto flex flex-col md:flex-row items-center gap-3 flex-1">
          {/* Universal Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550" size={16} />
            <input
              type="text"
              placeholder="Cari nama siswa, NISN, atau asal sekolah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Major/Prodi selection dropdown */}
          <div className="relative w-full md:w-80">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 animate-pulse" size={14} />
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all appearance-none cursor-pointer uppercase tracking-wider"
            >
              <option value="ALL">Semua Jurusan</option>
              <option value="Rekayasa Perangkat Lunak">RPL / PPLG</option>
              <option value="Teknik Jaringan Komputer & Telekomunikasi">TJKT / TKJ</option>
              <option value="Desain Komunikasi Visual">DKV</option>
              <option value="Animasi">Animasi</option>
              <option value="Broadcasting & Perfilman">Broadcasting / BCF</option>
              <option value="Teknik Elektronika">Teknik Elektronika / TE</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-3 w-full xl:w-auto">
          {/* Add Period Button */}
          <button
            onClick={() => {
              setNewPeriodValue(getNextPeriod());
              setIsAddPeriodModalOpen(true);
            }}
            className="w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            + Tambah Periode
          </button>

          {/* Global Export active student roster */}
          <button
            onClick={() => handleExportExcel(filteredApplicants, "semua_periode")}
            disabled={filteredApplicants.length === 0}
            className={`w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border shadow-sm ${
              filteredApplicants.length === 0
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 border-transparent cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 hover:border-blue-400 shadow-[0_4px_12px_rgba(59,130,246,0.15)] cursor-pointer"
            }`}
          >
            <Download size={14} />
            Ekspor Semua Siswa
          </button>
        </div>
      </div>

      {/* Accordion List (Grouped by Period) */}
      <div className="space-y-4">
        {sortedPeriods.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-600">
              <Users size={28} />
            </div>
            <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">Tidak Ada Siswa Aktif</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold max-w-sm mx-auto mt-1 uppercase tracking-wider">
              {searchTerm || majorFilter !== "ALL" 
                ? "Tidak ada data siswa aktif yang cocok dengan kriteria filter pencarian Anda."
                : "Belum ada calon siswa yang berstatus 'Approved' (Terverifikasi) dari sistem PPDB."}
            </p>
          </div>
        ) : (
          sortedPeriods.map((period) => {
            const students = groupedByPeriod[period];
            const isExpanded = expandedPeriods[period] ?? false;

            return (
              <div 
                key={period} 
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-colors duration-300"
              >
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => togglePeriod(period)}
                  className="px-6 py-5 flex items-center justify-between cursor-pointer select-none bg-slate-50/40 dark:bg-slate-950/15 border-b border-slate-100 dark:border-white/5 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-950/25"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 leading-none">
                        Angkatan Periode {period}
                        {period === "2026-2027" && (
                          <span className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest">
                            Terbaru
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">Kelompok siswa aktif periode pendidikan {period}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100/80 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase">
                      {students.length} Siswa
                    </span>
                    
                    {/* Separate Export Button for this specific Period */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportExcel(students, `angkatan_${period.replace("-", "_")}`);
                      }}
                      className="p-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-white/5 dark:hover:bg-blue-950/40 border border-slate-200/50 dark:border-white/5 text-slate-500 dark:text-slate-400 rounded-xl transition-all shadow-sm"
                      title={`Ekspor Roster Excel Periode ${period}`}
                    >
                      <Download size={14} />
                    </button>

                    {/* Delete button - only for custom-added periods */}
                    {customPeriods.includes(period) && students.length === 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Hapus periode angkatan "${period}"? Tindakan ini tidak dapat dibatalkan.`)) {
                            const updated = customPeriods.filter(p => p !== period);
                            setCustomPeriods(updated);
                            if (typeof window !== 'undefined') {
                              localStorage.setItem("ppdb_custom_periods", JSON.stringify(updated));
                            }
                            addToast("Periode Dihapus", `Angkatan ${period} telah dihapus.`, "warning");
                          }
                        }}
                        className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 border border-rose-200/50 dark:border-rose-900/30 text-rose-500 dark:text-rose-400 rounded-xl transition-all shadow-sm"
                        title={`Hapus Periode ${period}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    {/* Delete button - warn if has students */}
                    {customPeriods.includes(period) && students.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToast("Tidak Bisa Dihapus", `Periode ${period} masih memiliki ${students.length} siswa aktif.`, "warning");
                        }}
                        className="p-2 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-slate-400 dark:text-slate-600 rounded-xl transition-all shadow-sm cursor-not-allowed"
                        title="Tidak bisa hapus periode yang masih ada siswanya"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    
                    <div className="p-1 rounded-lg text-slate-400 dark:text-slate-600">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Accordion Table Body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 overflow-x-auto">
                        <table className="w-full text-xs font-bold text-slate-655 dark:text-slate-400 border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-550 uppercase tracking-widest text-[9px]">
                              <th className="py-3 px-3 text-left w-12">No</th>
                              <th className="py-3 px-4 text-left">Nama Siswa</th>
                              <th className="py-3 px-4 text-left">NISN</th>
                              <th className="py-3 px-4 text-left">Asal Sekolah</th>
                              <th className="py-3 px-4 text-left">Jurusan</th>
                              <th className="py-3 px-3 text-center w-24">Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student, idx) => (
                              <tr 
                                key={student.id}
                                className="border-b border-slate-100/50 dark:border-white/5 hover:bg-slate-50/30 dark:hover:bg-slate-950/10 transition-colors"
                              >
                                <td className="py-3.5 px-3 text-slate-400 dark:text-slate-600 font-mono">{idx + 1}</td>
                                <td className="py-3.5 px-4">
                                  <div className="font-black text-slate-800 dark:text-white uppercase tracking-wider">{student.nama}</div>
                                  <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider block mt-0.5">
                                    Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tgl_lahir || student.tglLahir || "-"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-mono">{student.nisn}</td>
                                <td className="py-3.5 px-4 uppercase">{student.sekolah_asal || student.sekolahAsal || "-"}</td>
                                <td className="py-3.5 px-4">
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="text-blue-600 dark:text-blue-400 font-extrabold uppercase">{student.jurusan_1 || student.jurusan1}</span>
                                    {(student.diterima_kelas || student.diterimaKelas) && (
                                      <span className="inline-flex items-center w-fit px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-wider mt-1">
                                        Kelas: {student.diterima_kelas || student.diterimaKelas}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3.5 px-3 text-center">
                                  <button
                                    onClick={() => {
                                      setSelectedApplicant(student);
                                      setActiveTab("biodata");
                                    }}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-white/5 dark:hover:bg-blue-950/40 border border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl transition-all flex items-center justify-center gap-1.5 mx-auto font-black uppercase text-[9px] tracking-wide"
                                  >
                                    <Eye size={10} /> Detail
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Beautiful Rich ReadOnly Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedApplicant(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Top Header */}
            <div className="px-8 pt-8 pb-6 flex justify-between items-start">
              <div className="flex gap-5 items-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/30 shrink-0">
                  {(selectedApplicant.nama || "K")[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{selectedApplicant.nama}</h2>
                    <span className="px-3 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-500/30 rounded-full uppercase tracking-widest whitespace-nowrap">
                      Siswa Aktif
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 flex-wrap">
                    <span className="text-blue-500">NISN: {selectedApplicant.nisn}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>ASAL: {selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal || "-"}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>ANGKATAN: {selectedApplicant.periode || "2026-2027"}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors shrink-0 ml-4"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 shrink-0">
              <div className="bg-slate-100 p-1.5 rounded-[16px] flex items-center gap-1 w-full overflow-x-auto scrollbar-none">
                {[
                  { id: "biodata", label: "Biodata" },
                  { id: "periodik", label: "Periodik" },
                  { id: "bantuan", label: "Bantuan" },
                  { id: "orangtua", label: "Orang Tua" },
                  { id: "akademik", label: "Akademik" },
                  { id: "pernyataan", label: "Pernyataan" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id);
                      setSelectedDoc(null);
                    }}
                    className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-[12px] shrink-0 transition-colors ${
                      activeTab === t.id
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Tab Content Viewport */}
            <div className="flex-1 overflow-y-auto p-8 max-h-[60vh] transition-colors duration-300">
              {activeTab === "biodata" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      <div className="text-sm font-bold text-slate-800">{selectedApplicant.nama}</div>
                    </div>

                    <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">NISN / NIK</div>
                      <div className="text-sm font-bold text-slate-600">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</div>
                    </div>

                    <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tempat, Tanggal Lahir</div>
                      <div className="text-sm font-bold text-slate-600">{selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}</div>
                    </div>

                    <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Jenis Kelamin / Agama</div>
                      <div className="text-sm font-bold text-slate-600">{selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin} / {selectedApplicant.agama}</div>
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
                      <div className="text-sm font-bold text-blue-500">{selectedApplicant.whatsapp || "-"} / {selectedApplicant.email || "-"}</div>
                    </div>

                    <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Alamat Tempat Tinggal</div>
                      <div className="text-sm font-bold text-slate-600">{selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})</div>
                    </div>

                    <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kelurahan / Kecamatan</div>
                      <div className="text-sm font-bold text-slate-600">{selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}</div>
                    </div>

                    <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tinggal Dengan / Transportasi</div>
                      <div className="text-sm font-bold text-slate-600">{selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan} / {selectedApplicant.transportasi}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "periodik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Calendar size={12} className="text-blue-500" /> Data Fisik & Periodik
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tinggi / Berat Badan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jarak ke Sekolah</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Waktu Tempuh Perjalanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jumlah Saudara Kandung</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Heart size={12} className="text-blue-500" /> Kondisi Kesehatan
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Golongan Darah</span> <span className="text-slate-800 dark:text-white font-extrabold uppercase">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Riwayat Penyakit</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}</span></div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-550 block mb-1.5 font-bold uppercase text-[9px] tracking-wider">Kebutuhan Khusus</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedApplicant.kebutuhan_khusus) ? selectedApplicant.kebutuhan_khusus.map((k, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-355 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase">{k}</span>
                          )) : <span className="text-slate-455 italic font-semibold">Tidak Ada</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bantuan" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <HelpCircle size={12} className="text-blue-500" /> Jaminan Sosial / Bantuan
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penerima KPS</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} {selectedApplicant.no_kps || selectedApplicant.noKps ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})` : ""}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penerima KIP</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} {selectedApplicant.no_kip || selectedApplicant.noKip ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})` : ""}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Layers size={12} className="text-blue-500" /> Beasiswa & Prestasi
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Uraian Prestasi</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Uraian Beasiswa</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.uraian_beasiswa || selectedApplicant.uraianBeasiswa || "Tidak Ada"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orangtua" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <User size={12} className="text-blue-500" /> Ayah Kandung
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Pekerjaan Ayah</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <User size={12} className="text-blue-500" /> Ibu Kandung
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Pendidikan / Pekerjaan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.pendidikan_ibu || selectedApplicant.pendidikanIbu || "-"} / {selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Users size={12} className="text-blue-500" /> Wali & Kontak Darurat
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Wali</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_wali || selectedApplicant.namaWali || "Tidak Ada"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">No. Telepon Orang Tua</span> <span className="text-blue-600 dark:text-blue-455 font-mono text-sm font-extrabold">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "akademik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Info size={12} className="text-blue-500" /> Pendidikan Asal
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Sekolah Asal</span> <span className="text-slate-850 dark:text-white text-sm font-extrabold">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">No. Ijazah / SKHUN</span> <span className="text-slate-800 dark:text-white font-mono font-extrabold">{selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"} / {selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tgl Lulus / Lama Belajar</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"} ({selectedApplicant.lama_belajar || selectedApplicant.lamaBelajar || 3} Tahun)</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Layers size={12} className="text-blue-500" /> Pilihan Minat Studi
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Program Studi Pilihan Utama</span> <span className="text-blue-600 dark:text-blue-400 text-sm font-extrabold uppercase">{selectedApplicant.jurusan_1 || selectedApplicant.jurusan1}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Program Studi Pilihan Cadangan</span> <span className="text-slate-500 dark:text-slate-400 text-sm font-extrabold uppercase">{selectedApplicant.jurusan_2 || selectedApplicant.jurusan2}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Alasan Memilih Jurusan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pernyataan" && (
                <div className="space-y-6">
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                    <FileCheck size={12} className="text-blue-500" /> Komitmen & Janji Kedisiplinan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tawuran / Perkelahian</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.perkelahian === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.perkelahian || "Tidak"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penyalahgunaan Narkoba</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.narkoba === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.narkoba || "Tidak"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pelanggaran Hukum Lain</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.pelanggaran_lain === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.pelanggaran_lain || "Tidak"}</span>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-500/10 rounded-2xl space-y-3">
                    <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider text-[9px] block">Pernyataan Kesanggupan Taruna Baru:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[10px] text-slate-655 dark:text-slate-350">
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Patuh Aturan Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menerima Sanksi Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Hubungan Akrab Taruna</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Belajar Dengan Tekun</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menjaga Nama Baik Almamater</div>
                    </div>
                  </div>
                </div>
              )}

              {false && (
                <div className="space-y-6">
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                    <FileText size={12} className="text-blue-500" /> Dokumen & Berkas Pendukung
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { key: 'berkas_kk', label: 'Kartu Keluarga', name: 'KK' },
                      { key: 'berkas_ktp', label: 'KTP Ortu / Wali', name: 'KTP' },
                      { key: 'berkas_akta', label: 'Akta Kelahiran', name: 'Akta' },
                      { key: 'berkas_ijazah', label: 'Ijazah / SKL', name: 'Ijazah' },
                      { key: 'berkas_foto', label: 'Pas Foto (3x4)', name: 'Foto' }
                    ].map((doc) => {
                      const value = selectedApplicant[doc.key] || selectedApplicant[`${doc.key}Base64`] || '';
                      const hasDoc = !!value;
                      
                      return (
                        <button
                          key={doc.key}
                          type="button"
                          onClick={() => {
                            if (hasDoc) {
                              setSelectedDoc(doc.key);
                            }
                          }}
                          className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2.5 text-center ${
                            !hasDoc 
                              ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-150 dark:border-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed"
                              : selectedDoc === doc.key
                              ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-500/50 text-blue-600 dark:text-blue-400 shadow-sm"
                              : "bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300"
                          }`}
                          disabled={!hasDoc}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            !hasDoc 
                              ? "bg-slate-100 dark:bg-slate-800/60" 
                              : selectedDoc === doc.key
                              ? "bg-blue-100/80 dark:bg-blue-900/50"
                              : "bg-slate-50 dark:bg-slate-800"
                          }`}>
                            {doc.name === 'Foto' ? (
                              <FileImage size={18} />
                            ) : (
                              <FileText size={18} />
                            )}
                          </div>
                          <div>
                            <p className="font-extrabold text-[10px] tracking-wide uppercase leading-tight">{doc.label}</p>
                            <span className="text-[9px] font-bold text-slate-400 mt-1 block">
                              {hasDoc ? "Tersedia (Klik)" : "Tidak Ada"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline Document Preview Box */}
                  {selectedDoc && selectedApplicant[selectedDoc] ? (
                    <div className="mt-6 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-950/40 p-4 transition-colors">
                      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-3 mb-4">
                        <span className="text-slate-800 dark:text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                          <Eye size={12} className="text-blue-500" />
                          Pratinjau: {
                            selectedDoc === 'berkas_kk' ? 'Kartu Keluarga' :
                            selectedDoc === 'berkas_ktp' ? 'KTP Orang Tua / Wali' :
                        selectedDoc === 'berkas_akta' ? 'Akta Kelahiran' :
                            selectedDoc === 'berkas_ijazah' ? 'Ijazah / SKL' : 'Pas Foto'
                          }
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <a 
                            href={sanitizeUrl(selectedApplicant[selectedDoc])}
                            download={`berkas_${selectedDoc}_${selectedApplicant.nisn}.png`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase tracking-wider text-[9px] transition-all flex items-center gap-1 shadow-sm"
                          >
                            <Download size={10} /> Unduh File
                          </a>
                          
                          <button
                            type="button"
                            onClick={() => setSelectedDoc(null)}
                            className="p-1.5 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5 rounded-2xl min-h-[300px] max-h-[500px] overflow-auto p-4">
                        {selectedApplicant[selectedDoc].startsWith("data:application/pdf") ? (
                          <iframe 
                            src={sanitizeSrc(selectedApplicant[selectedDoc])} 
                            className="w-full h-[400px] rounded-xl border border-slate-200 dark:border-white/5"
                            title="Pratinjau PDF"
                          />
                        ) : selectedApplicant[selectedDoc].startsWith("data:image/") || selectedApplicant[selectedDoc].startsWith("/") || selectedApplicant[selectedDoc].includes("base64") || selectedApplicant[selectedDoc].startsWith("http") ? (
                          <img 
                            src={selectedApplicant[selectedDoc].includes("Mock_Data_Base64") ? "/logo_smktb.png" : sanitizeSrc(selectedApplicant[selectedDoc])} 
                            alt="Pratinjau Dokumen" 
                            className="max-w-full max-h-[400px] object-contain rounded-xl shadow-sm animate-in fade-in"
                            onError={(e) => {
                              
                              e.currentTarget.src = "/logo_smktb.png";
                            }}
                          />
                        ) : (
                          <div className="text-center p-8 space-y-3">
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/30 dark:border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
                              <FileWarning size={32} />
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">Dokumen Tidak Dapat Dipratinjau</p>
                              <p className="text-slate-400 dark:text-slate-550 text-[10px] mt-1">Dokumen disimpan dalam format text mentah atau link luar. Silakan klik tombol 'Unduh File' di atas.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 border border-dashed border-slate-200 dark:border-slate-800/60 rounded-3xl p-8 text-center text-slate-455 dark:text-slate-500 transition-colors">
                      <p className="font-black uppercase text-[10px] tracking-widest text-slate-400 dark:text-slate-550 mb-1">Tidak ada dokumen yang dipilih</p>
                      <p className="text-[10px] text-slate-400/80">Silakan klik salah satu tombol dokumen di atas untuk mempratinjau.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Action Controls Footer */}
            <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-end bg-white shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-6 py-2.5 rounded-[12px] font-bold text-[11px] uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Period Modal */}
      {isAddPeriodModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-sm flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 transition-colors duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/15">
              <h3 className="text-lg font-black text-slate-850 dark:text-white uppercase tracking-wide">
                Tambah Periode Angkatan
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-550 font-bold mt-1">
                Otomatis terisi tahun ajaran berikutnya. Bisa diubah jika perlu.
              </p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newPeriodValue.trim()) return;
              const added = [...customPeriods, newPeriodValue.trim()];
              setCustomPeriods(added);
              if (typeof window !== 'undefined') {
                localStorage.setItem("ppdb_custom_periods", JSON.stringify(added));
              }
              setNewPeriodValue("");
              setIsAddPeriodModalOpen(false);
              addToast("Periode Ditambahkan", `Angkatan ${newPeriodValue.trim()} berhasil dibuat!`, "success");
            }}>
              <div className="p-6">
                <input
                  type="text"
                  placeholder={getNextPeriod()}
                  value={newPeriodValue}
                  onChange={(e) => setNewPeriodValue(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all uppercase"
                  required
                />
              </div>
              <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPeriodModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-355 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200/50 dark:border-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md"
                >
                  Simpan Periode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
