"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { generateNipdMap } from "@/utils/nipd";
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
  Trash2,
  Pencil,
  PieChart,
  Upload,
  FileSpreadsheet,
  Check
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import KuotaTab from "@/components/KuotaTab";
import SiswaTidakLancarTab from "@/components/SiswaTidakLancarTab";
import Swal from 'sweetalert2';
import CustomSelect from "@/components/ui/CustomSelect";
import { AlertCircle } from "lucide-react";



const formatNoPendaftaran = (periode: string | null | undefined, id: number) => {
  try {
    const parts = (periode || "2026-2027").split("-");
    const year1 = parts[0].slice(-2);
    const year2 = parts[1].slice(-2);
    const prefix = `${year1}${year2}`;
    const sequence = 10000 + id;
    return `${prefix}${sequence}`;
  } catch (e) {
    return `2627${10000 + id}`;
  }
};

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
  berkas_foto?: string;
  [key: string]: any;
}

function ActiveStudentsDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePageTab = searchParams.get("tab") || "active";

  const handleTabChange = (tab: "active" | "kuota" | "tidak-lancar") => {
    router.push(`/dashboard/siswa-aktif?tab=${tab}`);
  };

  const { activeStudents, addToast, fetchActiveStudents, updateActiveStudent } = usePPDB();

  useEffect(() => {
    if (typeof fetchActiveStudents === "function") {
      fetchActiveStudents();
    }
  }, [fetchActiveStudents]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [genderFilter, setGenderFilter] = useState<string>("ALL");
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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [editApplicant, setEditApplicant] = useState<Applicant | null>(null);
  const [editForm, setEditForm] = useState<Partial<Applicant>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const handleViewDetail = async (student: Applicant) => {
    setSelectedApplicant(student);
    setEditForm({
      nama: student.nama || "",
      nisn: student.nisn || "",
      nik: student.nik || "",
      jurusan: student.jurusan || student.jurusan_1 || student.jurusan1 || ""
    });
    try {
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`http://localhost:5000/api/siswa-aktif/${student.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedApplicant(data.data);
        setEditForm({
          nama: data.data.nama || "",
          nisn: data.data.nisn || "",
          nik: data.data.nik || "",
          jurusan: data.data.jurusan || data.data.jurusan_1 || data.data.jurusan1 || ""
        });
      }
    } catch (err) {
      console.warn("Failed to lazy load active student detail:", err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editApplicant) return;
    if (!editForm.nama?.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }
    if (editForm.nisn?.length !== 10) {
      alert("NISN harus 10 digit!");
      return;
    }
    if (editForm.nik && editForm.nik.length !== 16) {
      alert("NIK harus 16 digit jika diisi!");
      return;
    }

    try {
      setIsSaving(true);
      const currentMajor = editApplicant.jurusan || editApplicant.jurusan_1 || editApplicant.jurusan1;
      const majorChanged = editForm.jurusan_1 !== currentMajor;

      // Sanitize null values by simply omitting them, so backend falls back to existing or defaults
      const sanitizedForm: any = {};
      for (const key in editForm) {
        if (editForm[key] !== null) {
          sanitizedForm[key] = editForm[key];
        }
      }

      const updatedPayload: any = {
        ...sanitizedForm,
        jurusan1: sanitizedForm.jurusan_1 || sanitizedForm.jurusan
      };

      if (majorChanged) {
        updatedPayload.diterimaKelas = null;
        updatedPayload.diterima_kelas = null;
      }

      const res = await updateActiveStudent(editApplicant.id, updatedPayload);
      setIsSaving(false);
      if (res && res.success) {
        setEditApplicant(null);
        if (selectedApplicant?.id === editApplicant.id) {
          // close detail modal too or let it update
          setSelectedApplicant(null);
        }
        if (typeof fetchActiveStudents === "function") {
          await fetchActiveStudents();
        }
      } else {
        alert(res?.message || "Gagal menyimpan perubahan.");
      }
    } catch (e: any) {
      setIsSaving(false);
      alert("Terjadi kesalahan: " + e.message);
    }
  };

  const handleBatalVerifikasi = async (id: number, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin membatalkan verifikasi untuk "${nama}"? Siswa ini akan dikembalikan ke daftar pendaftar dengan status Pending.`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`http://localhost:5000/api/siswa-aktif/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        addToast("Berhasil", `${nama} berhasil dikembalikan ke pendaftar.`, "success");
        if (typeof fetchActiveStudents === 'function') fetchActiveStudents();
      } else {
        addToast("Gagal", data.message || "Terjadi kesalahan.", "error");
      }
    } catch (err) {
      addToast("Error", "Gagal terhubung ke server", "error");
    }
  };

  const [activeTab, setActiveTab] = useState<string>("biodata");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedApplicant) {
      setSelectedDoc(null);
    }
  }, [selectedApplicant]);

  const activeApplicants = useMemo(() => {
    return activeStudents.filter((a: Applicant) => !!(a.diterima_kelas || a.diterimaKelas));
  }, [activeStudents]);

  const filteredApplicants = useMemo(() => {
    return activeApplicants.filter((a: Applicant) => {
      const nameMatch = (a.nama || "").toLowerCase().includes(searchTerm.toLowerCase());
      const nisnMatch = (a.nisn || "").toLowerCase().includes(searchTerm.toLowerCase());
      const schoolMatch = (a.sekolah_asal || a.sekolahAsal || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const searchMatch = nameMatch || nisnMatch || schoolMatch;
      if (!searchMatch) return false;
      
      if (majorFilter !== "ALL") {
        const maj = (a.jurusan || a.jurusan_1 || a.jurusan1 || "").toLowerCase();
        if (!maj.includes(majorFilter.toLowerCase())) return false;
      }
      
      if (classFilter !== "ALL") {
        const kls = a.diterima_kelas || a.diterimaKelas || "";
        if (kls !== classFilter) return false;
      }

      if (genderFilter !== "ALL") {
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (genderFilter === "L" && !jk.startsWith("l")) return false;
        if (genderFilter === "P" && !jk.startsWith("p")) return false;
      }
      
      return true;
    });
  }, [activeApplicants, searchTerm, majorFilter, classFilter, genderFilter]);

  const nipdMap = useMemo(() => generateNipdMap(activeApplicants), [activeApplicants]);

  const classStats = useMemo(() => {
    const stats: Record<string, { L: number, P: number, total: number }> = {};
    activeApplicants.forEach((a: Applicant) => {
      const k = a.diterima_kelas || a.diterimaKelas;
      if (k) {
        if (!stats[k]) stats[k] = { L: 0, P: 0, total: 0 };
        stats[k].total += 1;
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (jk.startsWith("l")) stats[k].L += 1;
        else if (jk.startsWith("p")) stats[k].P += 1;
      }
    });
    return stats;
  }, [activeApplicants]);

  const uniqueClasses = useMemo(() => {
    return Object.keys(classStats).sort();
  }, [classStats]);

  const groupedByPeriod = (() => {
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
  })();

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
      const choice = a.jurusan || a.jurusan_1 || a.jurusan1 || "Lainnya";
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

    const periods = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    const exportHeaders = [
      'No.',
      'No. Pendaftaran',
      'Nama Lengkap',
      'NISN',
      'NIK',
      'NIPD',
      'Jurusan',
      'Kelas',
      'Tahun Ajaran / Periode',
      'Jenis Kelamin (L/P)',
      'Tempat Lahir',
      'Tanggal Lahir (YYYY-MM-DD)',
      'Agama',
      'Alamat Lengkap',
      'No WhatsApp / HP',
      'Email',
      'Asal Sekolah',
      'Nama Ayah',
      'Nama Ibu',
      'Telpon Orang Tua'
    ];

    const columnWidths = [
      8, 18, 28, 18, 20, 18, 32, 15, 25, 22, 18, 26, 15, 35, 20, 26, 28, 22, 22, 22
    ];

    periods.forEach((period) => {
      const sheetName = `Periode ${period.replace(/[:\\/?*\[\]]/g, '')}`.substring(0, 31);
      const worksheet = workbook.addWorksheet(sheetName);

      // Title row (Row 1)
      worksheet.mergeCells('A1:T1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = `DATA SISWA AKTIF - PERIODE ${period}`;
      titleCell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF000000' } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getRow(1).height = 32;

      // Green border box around Title (Row 1)
      ['A1','B1','C1','D1','E1','F1','G1','H1','I1','J1','K1','L1','M1','N1','O1','P1','Q1','R1','S1','T1'].forEach((pos) => {
        const c = worksheet.getCell(pos);
        c.border = {
          top: { style: 'medium', color: { argb: 'FF107C41' } },
          bottom: { style: 'medium', color: { argb: 'FF107C41' } },
          left: pos === 'A1' ? { style: 'medium', color: { argb: 'FF107C41' } } : undefined,
          right: pos === 'T1' ? { style: 'medium', color: { argb: 'FF107C41' } } : undefined
        };
      });

      // Spacing Row (Row 2)
      worksheet.getRow(2).height = 15;

      // Header row (Row 3)
      const headerRow = worksheet.getRow(3);
      headerRow.height = 30;
      exportHeaders.forEach((h, idx) => {
        const cell = headerRow.getCell(idx + 1);
        cell.value = h;
        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF2F5597' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
        };
        worksheet.getColumn(idx + 1).width = columnWidths[idx];
      });

      // AutoFilter on Row 3
      worksheet.autoFilter = 'A3:T3';

      const periodStudents = groups[period];
      periodStudents.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

      periodStudents.forEach((a: Applicant, idx: number) => {
        const rowNum = idx + 4;
        const row = worksheet.getRow(rowNum);
        row.height = 22;

        const jkVal = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") 
          ? "L" 
          : (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("p") 
            ? "P" 
            : "-";

        let birthDateStr = "-";
        if (a.tgl_lahir || a.tglLahir) {
          try {
            birthDateStr = new Date(a.tgl_lahir || a.tglLahir!).toISOString().split('T')[0];
          } catch {
            birthDateStr = String(a.tgl_lahir || a.tglLahir);
          }
        }

        const values = [
          idx + 1,
          formatNoPendaftaran(a.periode, a.id),
          a.nama || "-",
          a.nisn || "-",
          a.nik || "-",
          nipdMap.get(a.id) || a.nipd || "-",
          a.jurusan || a.jurusan_1 || a.jurusan1 || "-",
          a.diterima_kelas || a.diterimaKelas || "-",
          a.periode || period,
          jkVal,
          a.tempat_lahir || a.tempatLahir || "-",
          birthDateStr,
          a.agama || "-",
          a.alamat || "-",
          a.whatsapp || "-",
          a.email || "-",
          a.sekolah_asal || a.sekolahAsal || "-",
          a.nama_ayah || a.namaAyah || "-",
          a.nama_ibu || a.namaIbu || "-",
          a.telepon_ortu || a.teleponOrtu || "-"
        ];

        values.forEach((v, colIdx) => {
          const cell = row.getCell(colIdx + 1);
          cell.value = v;
          cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF000000' } };
          // Zebra striping: even rows get light blue
          if (idx % 2 === 1) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD6E4F0' } };
          }
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
          };

          // Numbers/IDs as text format to show leading zeros
          if ([2, 4, 5, 6, 15, 20].includes(colIdx + 1)) {
            cell.numFmt = '@';
          }

          // Alignment
          if ([1, 2, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 20].includes(colIdx + 1)) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Data_Siswa_Aktif_${fileNameSuffix}_${Date.now()}.xlsx`);
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template_Import_Siswa');

    // Title Row (Row 1)
    worksheet.mergeCells('A1:T1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'DATA SISWA AKTIF - TEMPLATE IMPORT';
    titleCell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF000000' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 32;

    // Green border box around Title (Row 1)
    ['A1','B1','C1','D1','E1','F1','G1','H1','I1','J1','K1','L1','M1','N1','O1','P1','Q1','R1','S1','T1'].forEach((pos) => {
      const c = worksheet.getCell(pos);
      c.border = {
        top: { style: 'medium', color: { argb: 'FF107C41' } },
        bottom: { style: 'medium', color: { argb: 'FF107C41' } },
        left: pos === 'A1' ? { style: 'medium', color: { argb: 'FF107C41' } } : undefined,
        right: pos === 'T1' ? { style: 'medium', color: { argb: 'FF107C41' } } : undefined
      };
    });

    // Spacing Row (Row 2)
    worksheet.getRow(2).height = 15;

    // Header Row (Row 3) - 20 Columns
    const templateHeaders = [
      'NO.',
      'No. Pendaftaran',
      'Nama Lengkap *',
      'NISN *',
      'NIK',
      'NIPD',
      'Jurusan *',
      'Kelas *',
      'Tahun Ajaran / Periode *',
      'Jenis Kelamin (L/P) *',
      'Tempat Lahir',
      'Tanggal Lahir (YYYY-MM-DD)',
      'Agama',
      'Alamat Lengkap',
      'No WhatsApp / HP',
      'Email',
      'Asal Sekolah',
      'Nama Ayah',
      'Nama Ibu',
      'Telpon Orang Tua'
    ];

    const columnWidths = [
      8, 18, 28, 18, 20, 18, 32, 15, 25, 22, 18, 26, 15, 35, 20, 26, 28, 22, 22, 22
    ];

    const headerRow = worksheet.getRow(3);
    headerRow.height = 30;
    templateHeaders.forEach((h, idx) => {
      const cell = headerRow.getCell(idx + 1);
      cell.value = h;
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2F5597' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
      };
      worksheet.getColumn(idx + 1).width = columnWidths[idx];
    });

    // AutoFilter on Row 3
    worksheet.autoFilter = 'A3:T3';

    // Sample Rows with 20 columns matching user screenshot
    const sampleRows = [
      [
        1,
        '262710070',
        'Aditya Subagyo',
        '0075041975',
        '3276012502070001',
        '2627100008',
        'Rekayasa Perangkat Lunak',
        'X RPL 1',
        '2026-2027',
        'P',
        'Bogor',
        '2008-05-14',
        'Islam',
        'Jl. Raya Parung No. 12',
        '081234567890',
        'aditya.subagyo@gmail.com',
        'SMPN 1 Bogor',
        'Subagyo',
        'Sri Lestari',
        '081298765432'
      ],
      [
        2,
        '262710075',
        'Aditya Syahputra',
        '0075007407',
        '3276012502070002',
        '2627100001',
        'Teknik Komputer dan Jaringan',
        'X TKT 2',
        '2026-2027',
        'L',
        'Depok',
        '2008-08-20',
        'Islam',
        'Jl. Margonda Raya No. 45',
        '081398765432',
        'aditya.syah@gmail.com',
        'SMP Al-Azhar 9',
        'Syahputra',
        'Ratna Sari',
        '081387654321'
      ],
      [
        3,
        '262710057',
        'Ahmad Wahyudi',
        '0075096297',
        '3276016108070003',
        '2627100004',
        'Teknik Komputer dan Jaringan',
        'X TKT 2',
        '2026-2027',
        'L',
        'Jakarta',
        '2008-01-15',
        'Islam',
        'Jl. Dago Asri No. 10',
        '085712345678',
        'ahmad.wahyudi@gmail.com',
        'SMPN 1 Bojong',
        'Wahyudi',
        'Aminah',
        '085798765432'
      ]
    ];

    sampleRows.forEach((rowValues, rIdx) => {
      const rowNum = rIdx + 4;
      const row = worksheet.getRow(rowNum);
      row.height = 22;

      rowValues.forEach((val, colIdx) => {
        const cell = row.getCell(colIdx + 1);
        cell.value = val;
        cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF000000' } };
        // Zebra striping: even rows get light blue
        if (rIdx % 2 === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD6E4F0' } };
        }
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
        };

        // Numbers/IDs as text format to show leading zeros and green corner triangle
        if ([2, 4, 5, 6, 15, 20].includes(colIdx + 1)) {
          cell.numFmt = '@';
        }

        // Center alignments
        if ([1, 2, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 20].includes(colIdx + 1)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Template_Import_Siswa_Aktif.xlsx`);
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      addToast("Membaca dan memproses file Excel...", "info");
      
      const buffer = await file.arrayBuffer();
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(buffer);

      const worksheet = wb.worksheets[0];
      if (!worksheet) {
        throw new Error("File Excel tidak memiliki lembar kerja (worksheet).");
      }

      // Helper to extract text safely from cell value (string, object, richText, number)
      const extractCellText = (cell: ExcelJS.Cell): string => {
        if (!cell || cell.value === null || cell.value === undefined) return '';
        if (typeof cell.value === 'object') {
          if ('richText' in cell.value && Array.isArray((cell.value as any).richText)) {
            return (cell.value as any).richText.map((rt: any) => rt.text || '').join('');
          }
          if ('text' in cell.value) return String((cell.value as any).text || '');
          if ('result' in cell.value) return String((cell.value as any).result || '');
        }
        return String(cell.value);
      };

      // Find header row (scan rows 1 to 5)
      let headerRowNumber = 3;
      let colMap: Record<string, number> = {};

      for (let r = 1; r <= 5; r++) {
        const row = worksheet.getRow(r);
        const currentMap: Record<string, number> = {};

        row.eachCell((cell, colNumber) => {
          const val = extractCellText(cell).toLowerCase().trim();
          if (!val) return;

          if (val.includes('ayah')) currentMap['nama_ayah'] = colNumber;
          else if (val.includes('ibu')) currentMap['nama_ibu'] = colNumber;
          else if (val.includes('nisn') || val.includes('nis')) currentMap['nisn'] = colNumber;
          else if (val.includes('nik')) currentMap['nik'] = colNumber;
          else if (val.includes('nipd')) currentMap['nipd'] = colNumber;
          else if (val.includes('jurusan')) currentMap['jurusan'] = colNumber;
          else if (val.includes('kelas')) currentMap['kelas'] = colNumber;
          else if (val.includes('tahun') || val.includes('periode')) currentMap['periode'] = colNumber;
          else if (val.includes('kelamin') || val.includes('l/p') || val === 'jk') currentMap['jenis_kelamin'] = colNumber;
          else if (val.includes('tempat')) currentMap['tempat_lahir'] = colNumber;
          else if (val.includes('tanggal') || val.includes('tgl')) currentMap['tgl_lahir'] = colNumber;
          else if (val.includes('agama')) currentMap['agama'] = colNumber;
          else if (val.includes('alamat')) currentMap['alamat'] = colNumber;
          else if (val.includes('whatsapp') || val.includes('hp') || val.includes('wa')) currentMap['whatsapp'] = colNumber;
          else if (val.includes('email')) currentMap['email'] = colNumber;
          else if (val.includes('sekolah') || val.includes('asal')) currentMap['sekolah_asal'] = colNumber;
          else if (val.includes('telepon') || val.includes('telpon') || val.includes('ortu')) currentMap['telepon_ortu'] = colNumber;
          else if (val.includes('nama')) currentMap['nama'] = colNumber;
        });

        // If this row contains at least 'nama' or 'nisn' or 2+ valid mapped headers, it's the header row
        if ((currentMap['nama'] && currentMap['nisn']) || Object.keys(currentMap).length >= 2) {
          headerRowNumber = r;
          colMap = currentMap;
          break;
        }
      }

      // Fallback: Default to standard 20-column positions if header matching didn't catch specific columns
      if (!colMap['nama']) colMap['nama'] = 3;
      if (!colMap['nisn']) colMap['nisn'] = 4;
      if (!colMap['nik']) colMap['nik'] = 5;
      if (!colMap['nipd']) colMap['nipd'] = 6;
      if (!colMap['jurusan']) colMap['jurusan'] = 7;
      if (!colMap['kelas']) colMap['kelas'] = 8;
      if (!colMap['periode']) colMap['periode'] = 9;
      if (!colMap['jenis_kelamin']) colMap['jenis_kelamin'] = 10;
      if (!colMap['tempat_lahir']) colMap['tempat_lahir'] = 11;
      if (!colMap['tgl_lahir']) colMap['tgl_lahir'] = 12;
      if (!colMap['agama']) colMap['agama'] = 13;
      if (!colMap['alamat']) colMap['alamat'] = 14;
      if (!colMap['whatsapp']) colMap['whatsapp'] = 15;
      if (!colMap['email']) colMap['email'] = 16;
      if (!colMap['sekolah_asal']) colMap['sekolah_asal'] = 17;
      if (!colMap['nama_ayah']) colMap['nama_ayah'] = 18;
      if (!colMap['nama_ibu']) colMap['nama_ibu'] = 19;
      if (!colMap['telepon_ortu']) colMap['telepon_ortu'] = 20;

      const studentsToImport: any[] = [];
      const totalRows = worksheet.rowCount;

      for (let r = headerRowNumber + 1; r <= totalRows; r++) {
        const row = worksheet.getRow(r);
        const getCellVal = (key: string) => {
          const colIdx = colMap[key];
          if (!colIdx) return '';
          const cell = row.getCell(colIdx);
          return extractCellText(cell).trim();
        };

        const nama = getCellVal('nama');
        const nisn = getCellVal('nisn');

        if (!nama || !nisn || nama === '-' || nisn === '-') continue;

        studentsToImport.push({
          nama,
          nisn,
          nik: getCellVal('nik'),
          nipd: getCellVal('nipd'),
          jurusan: getCellVal('jurusan'),
          kelas: getCellVal('kelas'),
          periode: getCellVal('periode') || '2026-2027',
          jenis_kelamin: getCellVal('jenis_kelamin') || 'L',
          tempat_lahir: getCellVal('tempat_lahir'),
          tgl_lahir: getCellVal('tgl_lahir'),
          agama: getCellVal('agama'),
          alamat: getCellVal('alamat'),
          whatsapp: getCellVal('whatsapp'),
          email: getCellVal('email'),
          sekolah_asal: getCellVal('sekolah_asal'),
          nama_ayah: getCellVal('nama_ayah'),
          nama_ibu: getCellVal('nama_ibu'),
          telepon_ortu: getCellVal('telepon_ortu')
        });
      }

      if (studentsToImport.length === 0) {
        throw new Error("Tidak ada data siswa yang valid untuk diimpor.");
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem("ppdb_admin_token") : null;
      const res = await fetch("http://localhost:5000/api/siswa-aktif/import-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ students: studentsToImport })
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Gagal mengimpor ke server.");
      }

      if (typeof fetchActiveStudents === "function") {
        fetchActiveStudents();
      }

      await Swal.fire({
        icon: 'success',
        title: 'Impor Berhasil!',
        text: `Berhasil mengimpor ${resData.importedCount || studentsToImport.length} data siswa aktif ke sistem.`,
        confirmButtonColor: '#2563eb'
      });

    } catch (error: any) {
      console.error("Import error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Impor Excel',
        text: error.message || 'Terjadi kesalahan saat memproses file Excel.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {activePageTab === "kuota" ? (
        <KuotaTab />
      ) : activePageTab === "tidak-lancar" ? (
        <SiswaTidakLancarTab />
      ) : (
        <>
          {/* Executive Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 border-t-[3px] border-t-blue-600 dark:border-t-blue-500 rounded-2xl p-5 md:p-6 shadow-sm flex items-center justify-between transition-all duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Total Siswa Aktif</span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-3xl font-extrabold leading-none text-slate-800 dark:text-white">{stats.total}</h3>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Siswa</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /> Gabungan seluruh angkatan terverifikasi</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
            <GraduationCap size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 border-t-[3px] border-t-emerald-500 dark:border-t-emerald-500 rounded-2xl p-5 md:p-6 shadow-sm flex items-center justify-between transition-all duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Periode Terkini (2026-2027)</span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-3xl font-extrabold leading-none text-slate-800 dark:text-white">{stats.currentBatch}</h3>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Siswa</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Calon angkatan tahun ini</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Calendar size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 border-t-[3px] border-t-amber-500 dark:border-t-amber-500 rounded-2xl p-5 md:p-6 shadow-sm flex items-center justify-between transition-all duration-300">
          <div className="space-y-1.5 max-w-[calc(100%-48px)]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Konsentrasi Populer</span>
            <h3 className="text-base lg:text-lg font-bold leading-tight text-slate-800 dark:text-white uppercase tracking-tight line-clamp-2">{stats.popular}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-1 flex items-center gap-1.5 truncate"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" /> Kompetensi keahlian pendaftar terbanyak</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <BookOpen size={18} />
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-[#0b1121] border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 rounded-2xl p-2.5 shadow-sm flex flex-wrap md:flex-nowrap items-center justify-between gap-3 w-full mt-4 transition-colors duration-300 relative z-20">
        
        {/* Left Group: Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Universal Search Input */}
          <div className="relative w-60 lg:w-70 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Cari siswa, NISN, asal sekolah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#0b1121] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-normal text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Major/Prodi selection dropdown */}
          <div className="shrink-0 min-w-36.25">
            <CustomSelect
              value={majorFilter}
              onChange={(val) => setMajorFilter(val)}
              options={[
                { value: "ALL", label: "Semua Jurusan" },
                { value: "Rekayasa Perangkat Lunak", label: "RPL / PPLG" },
                { value: "Teknik Jaringan Komputer & Telekomunikasi", label: "TJKT / TKJ" },
                { value: "Desain Komunikasi Visual", label: "DKV" },
                { value: "Animasi", label: "Animasi" },
                { value: "Broadcasting & Perfilman", label: "Broadcasting / BCF" },
                { value: "Teknik Elektronika", label: "Teknik Elektronika / TE" }
              ]}
              triggerClassName="py-2 text-xs"
            />
          </div>

          {/* Class selection dropdown */}
          <div className="shrink-0 min-w-38.75">
            <CustomSelect
              value={classFilter}
              onChange={(val) => setClassFilter(val)}
              options={[
                { value: "ALL", label: "Semua Kelas" },
                ...uniqueClasses.map((kls) => ({
                  value: kls,
                  label: `${kls} (L: ${classStats[kls]?.L || 0}, P: ${classStats[kls]?.P || 0})`
                }))
              ]}
              triggerClassName="py-2 text-xs"
            />
          </div>

          {/* Gender selection dropdown */}
          <div className="shrink-0 min-w-32.5">
            <CustomSelect
              value={genderFilter}
              onChange={(val) => setGenderFilter(val)}
              options={[
                { value: "ALL", label: "Semua Gender" },
                { value: "L", label: "Laki-Laki" },
                { value: "P", label: "Perempuan" }
              ]}
              triggerClassName="py-2 text-xs"
            />
          </div>
        </div>

        {/* Right Group: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Add Period Button */}
          <button
            onClick={() => {
              setNewPeriodValue(getNextPeriod());
              setIsAddPeriodModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1121] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="text-sm font-bold">+</span> Tambah Periode
          </button>

          {/* Global Export active students */}
          <button
            onClick={() => handleExportExcel(filteredApplicants, "semua_periode")}
            disabled={filteredApplicants.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              filteredApplicants.length === 0
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
          >
            <Download size={13} />
            Ekspor Semua
          </button>
          
          {/* Import Excel */}
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 bg-[#10b981] hover:bg-[#059669] text-white cursor-pointer whitespace-nowrap"
          >
            <Upload size={13} />
            Impor Excel
          </button>

          {/* Template */}
          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0b1121] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
          >
            <FileText size={13} />
            Template
          </button>
        </div>
      </div>

      {/* Accordion List (Grouped by Period) */}
      <div className="space-y-4">
        {sortedPeriods.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-600">
              <Users size={28} />
            </div>
            <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">Tidak Ada Siswa Aktif</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold max-w-sm mx-auto mt-1 uppercase tracking-wider">
              {searchTerm || majorFilter !== "ALL" 
                ? "Tidak ada data siswa aktif yang cocok dengan kriteria filter pencarian Anda."
                : "Belum ada calon siswa yang berstatus 'Approved' (Terverifikasi) dari sistem PPDB."}
            </p>
          </div>
        ) : (
          sortedPeriods.map((period) => {
            const students = groupedByPeriod[period];
            const isExpanded = expandedPeriods[period] ?? false;

            const kelasCounts: Record<string, number> = {};
            students.forEach((s) => {
              const k = s.diterima_kelas || s.diterimaKelas;
              if (k && k !== "-" && k !== "BELUM ADA") {
                kelasCounts[k] = (kelasCounts[k] || 0) + 1;
              }
            });

            return (
              <div 
                key={period} 
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-colors duration-300"
              >
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => togglePeriod(period)}
                  className="px-6 py-4 md:py-5 flex items-center justify-between cursor-pointer select-none bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200/80 dark:border-white/5 transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-950/30"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-xs">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide leading-none">
                          Angkatan / Periode {period}
                        </h4>
                        <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                          {students.length} Siswa
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal flex items-center gap-1">
                          <Layers size={11} className="text-slate-400" /> Kelas Terisi:
                        </span>
                        {Object.entries(kelasCounts).length > 0 ? (
                          Object.entries(kelasCounts).map(([cls, count]) => (
                            <span key={cls} className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-mono text-[9px] font-normal px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/50">
                              {cls}({count})
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] text-slate-400 italic">Belum ada kelas terisi</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Separate Export Button for this specific Period */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportExcel(students, `angkatan_${period.replace("-", "_")}`);
                      }}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 dark:bg-[#0b1121] dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
                      title={`Ekspor Daftar Siswa Excel Periode ${period}`}
                    >
                      <Download size={13} />
                      <span className="hidden sm:inline">Ekspor Periode Ini</span>
                    </button>

                    {/* Delete button - only for custom-added periods */}
                    {customPeriods.includes(period) && students.length === 0 && (
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const result = await Swal.fire({
                            title: 'Konfirmasi',
                            text: `Hapus periode angkatan "${period}"? Tindakan ini tidak dapat dibatalkan.`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Ya',
                            cancelButtonText: 'Batal'
                          });
                          if (result.isConfirmed) {
                            const updated = customPeriods.filter(p => p !== period);
                            setCustomPeriods(updated);
                            if (typeof window !== 'undefined') {
                              localStorage.setItem("ppdb_custom_periods", JSON.stringify(updated));
                            }
                            addToast("Periode Dihapus", `Angkatan ${period} telah dihapus.`, "warning");
                          }
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 border border-rose-200/50 dark:border-rose-900/30 text-rose-500 dark:text-rose-400 rounded-xl transition-all shadow-xs"
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
                        className="p-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-slate-400 dark:text-slate-600 rounded-xl transition-all shadow-xs cursor-not-allowed"
                        title="Tidak bisa hapus periode yang masih ada siswanya"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
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
                        <table className="w-full text-xs text-slate-600 dark:text-slate-400 border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200/80 dark:border-white/5 text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] bg-slate-50/50 dark:bg-slate-950/20">
                              <th className="py-2.5 px-3 text-center w-12 font-semibold">NO</th>
                              <th className="py-2.5 px-4 text-left font-semibold">NIPD</th>
                              <th className="py-2.5 px-4 text-left font-semibold">KELAS</th>
                              <th className="py-2.5 px-4 text-left font-semibold">NAMA SISWA</th>
                              <th className="py-2.5 px-4 text-center w-14 font-semibold">L/P</th>
                              <th className="py-2.5 px-4 text-left font-semibold">NISN</th>
                              <th className="py-2.5 px-4 text-left font-semibold">ASAL SEKOLAH</th>
                              <th className="py-2.5 px-4 text-left font-semibold">JURUSAN</th>
                              <th className="py-2.5 px-3 text-center w-24 font-semibold">AKSI</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {students.map((student, idx) => (
                              <tr 
                                key={student.id}
                                className="hover:bg-slate-50/60 dark:hover:bg-slate-950/20 transition-colors"
                              >
                                <td className="py-3 px-3 text-slate-400 dark:text-slate-500 font-mono text-center text-xs font-normal">{idx + 1}</td>
                                <td className="py-3 px-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{nipdMap.get(student.id) || "-"}</td>
                                <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight text-xs">
                                  {student.diterima_kelas || student.diterimaKelas ? student.diterima_kelas || student.diterimaKelas : (
                                    <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-normal">BELUM ADA</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-bold text-slate-800 dark:text-white uppercase tracking-tight text-xs">{student.nama}</div>
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal uppercase tracking-wider block mt-0.5">
                                    Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tgl_lahir || student.tglLahir || "-"}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {(student.jenis_kelamin || student.jenisKelamin) ? (
                                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold uppercase border shadow-xs ${
                                      (student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l")
                                        ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                                        : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                                    }`}>
                                      {(student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 font-mono font-normal text-slate-600 dark:text-slate-300 text-xs">{student.nisn || "-"}</td>
                                <td className="py-3 px-4 uppercase font-normal text-slate-600 dark:text-slate-300 text-xs">{student.sekolah_asal || student.sekolahAsal || "-"}</td>
                                <td className="py-3 px-4">
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold uppercase text-xs tracking-tight">{student.jurusan || student.jurusan_1 || student.jurusan1}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => {
                                        handleViewDetail(student);
                                        setActiveTab("biodata");
                                      }}
                                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-all border border-slate-200 dark:border-slate-700/80 shadow-xs"
                                      title="Detail Siswa"
                                    >
                                      <Eye size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleBatalVerifikasi(student.id, student.nama)}
                                      className="w-7 h-7 flex items-center justify-center bg-rose-50/60 hover:bg-rose-100/80 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 rounded-lg transition-all border border-rose-200/60 dark:border-rose-500/20 shadow-xs"
                                      title="Batal Verifikasi (Kembalikan ke Pendaftar)"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedApplicant(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            
            {/* Modal Top Header (Compact & Styled as Foto 1) */}
            <div className="px-6 pt-6 pb-4 flex justify-between items-start border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex gap-4 items-center">
                {/* Gray Student Profile Initial Box */}
                <div className="w-12 h-12 md:w-13 md:h-13 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 font-black text-2xl shrink-0 shadow-sm">
                  {(selectedApplicant.nama || "K")[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedApplicant.nama}</h2>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-full uppercase tracking-wider whitespace-nowrap">
                      Siswa Aktif
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono tracking-wide">
                    NIPD: {nipdMap.get(selectedApplicant.id) || "-"}
                  </div>
                  {/* Clean Metadata Pill Container */}
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50/90 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap shadow-sm">
                    <BookOpen size={13} className="text-blue-500 shrink-0" />
                    <span className="text-blue-600 dark:text-blue-400 font-semibold font-mono">
                      NO. DAFTAR: {formatNoPendaftaran(selectedApplicant.periode, selectedApplicant.id)}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold font-mono">
                      NISN: {selectedApplicant.nisn}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      NIK: {selectedApplicant.nik || "-"}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      ANGKATAN: {selectedApplicant.periode || "2026-2027"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-300 transition-colors shrink-0 ml-4"
              >
                <X size={16} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-2.5 shrink-0">
              <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 w-full overflow-x-auto scrollbar-none">
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
                    className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg shrink-0 transition-colors ${
                      activeTab === t.id
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Tab Content Viewport */}
            <div className="flex-1 overflow-y-auto p-6 max-h-[55vh] transition-colors duration-300">
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

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nama Lengkap</div>
                      <div className="text-sm font-bold text-slate-800">{selectedApplicant.nama}</div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">NISN / NIK</div>
                      <div className="text-sm font-bold text-slate-600">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tempat, Tanggal Lahir</div>
                      <div className="text-sm font-bold text-slate-600">{selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}</div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
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

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp / Email</div>
                      <div className="text-sm font-bold text-blue-500">{selectedApplicant.whatsapp || "-"} / {selectedApplicant.email || "-"}</div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Alamat Tempat Tinggal</div>
                      <div className="text-sm font-bold text-slate-600">{selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})</div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kelurahan / Kecamatan</div>
                      <div className="text-sm font-bold text-slate-600">{selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}</div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
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
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tinggi / Berat Badan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jarak ke Sekolah</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Waktu Tempuh Perjalanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jumlah Saudara Kandung</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Heart size={12} className="text-blue-500" /> Kondisi Kesehatan
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Golongan Darah</span> <span className="text-slate-800 dark:text-white font-extrabold uppercase">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Riwayat Penyakit</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}</span></div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block mb-1.5 font-bold uppercase text-[9px] tracking-wider">Kebutuhan Khusus</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedApplicant.kebutuhan_khusus) ? selectedApplicant.kebutuhan_khusus.map((k, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase">{k}</span>
                          )) : <span className="text-slate-400 italic font-semibold">Tidak Ada</span>}
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
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penerima KPS</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} {selectedApplicant.no_kps || selectedApplicant.noKps ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})` : ""}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penerima KIP</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} {selectedApplicant.no_kip || selectedApplicant.noKip ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})` : ""}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Layers size={12} className="text-blue-500" /> Beasiswa & Prestasi
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Uraian Prestasi</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Uraian Beasiswa</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.uraian_beasiswa || selectedApplicant.uraianBeasiswa || "Tidak Ada"}</span></div>
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
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Pekerjaan Ayah</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <User size={12} className="text-blue-500" /> Ibu Kandung
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Pendidikan / Pekerjaan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.pendidikan_ibu || selectedApplicant.pendidikanIbu || "-"} / {selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Users size={12} className="text-blue-500" /> Wali & Kontak Darurat
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Wali</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_wali || selectedApplicant.namaWali || "Tidak Ada"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">No. Telepon Orang Tua</span> <span className="text-blue-600 dark:text-blue-455 font-mono text-sm font-extrabold">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span></div>
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
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Sekolah Asal</span> <span className="text-slate-850 dark:text-white text-sm font-extrabold">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">No. Ijazah / SKHUN</span> <span className="text-slate-800 dark:text-white font-mono font-extrabold">{selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"} / {selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tgl Lulus / Lama Belajar</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"} ({selectedApplicant.lama_belajar || selectedApplicant.lamaBelajar || 3} Tahun)</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Layers size={12} className="text-blue-500" /> Pilihan Minat Studi
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Kompetensi Keahlian / Jurusan</span>
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-extrabold uppercase">
                          {selectedApplicant.jurusan || selectedApplicant.jurusan_1 || selectedApplicant.jurusan1}
                        </span>
                      </div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Alasan Memilih Jurusan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}</span></div>
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
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tawuran / Perkelahian</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.perkelahian === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.perkelahian || "Tidak"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penyalahgunaan Narkoba</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.narkoba === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.narkoba || "Tidak"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pelanggaran Hukum Lain</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.pelanggaran_lain === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.pelanggaran_lain || "Tidak"}</span>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-500/10 rounded-2xl space-y-3">
                    <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider text-[9px] block">Pernyataan Kesanggupan Taruna Baru:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[10px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Patuh Aturan Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menerima Sanksi Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Hubungan Akrab Taruna</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Belajar Dengan Tekun</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menjaga Nama Baik Almamater</div>
                    </div>
                  </div>
                </div>
                  )}
            </div>

            {/* Modal Action Controls Footer */}
            <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <button
                  onClick={() => {
                    setEditApplicant(selectedApplicant);
                    setEditForm({
                      ...selectedApplicant,
                      jurusan_1: selectedApplicant.jurusan || selectedApplicant.jurusan_1 || selectedApplicant.jurusan1 || "",
                      tinggi_badan: String(selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || ""),
                      berat_badan: String(selectedApplicant.berat_badan || selectedApplicant.beratBadan || ""),
                      tempat_lahir: selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir || "",
                      tgl_lahir: selectedApplicant.tgl_lahir || selectedApplicant.tglLahir || "",
                      jenis_kelamin: selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin || "",
                      rt_rw: selectedApplicant.rt_rw || selectedApplicant.rtRw || "",
                      kode_pos: selectedApplicant.kode_pos || selectedApplicant.kodePos || "",
                      tinggal_dengan: selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan || "",
                      golongan_darah: selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "",
                      sekolah_asal: selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal || "",
                      tgl_lulus: selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "",
                      nama_ayah: selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "",
                      pekerjaan_ayah: selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "",
                      penghasilan_ayah: selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "",
                      nama_ibu: selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "",
                      pekerjaan_ibu: selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "",
                      penghasilan_ibu: selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "",
                      telepon_ortu: selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "",
                      cita_cita: selectedApplicant.cita_cita || selectedApplicant.citaCita || "",
                      alasan_memilih: selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "",
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
                >
                  Edit Data
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100 transition-colors"
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-sm flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 transition-colors duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/15">
              <h3 className="text-lg font-black text-slate-850 dark:text-white uppercase tracking-wide">
                Tambah Periode Angkatan
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">
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
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200/50 dark:border-white/5"
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
      {/* ===== EDIT MODAL ===== */}
      {editApplicant && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 lg:p-8 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between bg-white dark:bg-slate-900 shrink-0 relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm shrink-0">
                  <Pencil size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-850 dark:text-white uppercase tracking-wide">
                    Edit Data — {editApplicant.nama}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
                    <span className="text-blue-500">NISN:</span> {editApplicant.nisn}
                  </p>
                </div>
              </div>
              <button onClick={() => setEditApplicant(null)} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-rose-500 flex items-center justify-center transition-all relative z-10 shrink-0">
                <X size={16} />
              </button>
            </div>

            {/* Body — scrollable form */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950/20 hide-scrollbar">
              {[
                {
                  section: "Identitas Diri", icon: <User size={14} />, fields: [
                    { label: "Nama Lengkap", key: "nama" },
                    { label: "NISN", key: "nisn" },
                    { label: "NIK", key: "nik" },
                    { label: "Tempat Lahir", key: "tempat_lahir" },
                    { label: "Tanggal Lahir", key: "tgl_lahir", type: "date" },
                    { label: "Jenis Kelamin", key: "jenis_kelamin", type: "select", options: ["L", "P", "Laki-laki", "Perempuan"] },
                    { label: "Agama", key: "agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"] },
                    { label: "Golongan Darah", key: "golongan_darah", type: "select", options: ["A", "B", "AB", "O", "-"] },
                  ]
                },
                {
                  section: "Alamat & Kontak", icon: <School size={14} />, fields: [
                    { label: "Alamat", key: "alamat" },
                    { label: "RT/RW", key: "rt_rw" },
                    { label: "Kelurahan", key: "kelurahan" },
                    { label: "Kecamatan", key: "kecamatan" },
                    { label: "Kode Pos", key: "kode_pos" },
                    { label: "WhatsApp", key: "whatsapp" },
                    { label: "Email", key: "email" },
                    { label: "Tinggal Dengan", key: "tinggal_dengan" },
                    { label: "Transportasi", key: "transportasi" },
                  ]
                },
                {
                  section: "Data Fisik", icon: <Heart size={14} />, fields: [
                    { label: "Tinggi Badan (cm)", key: "tinggi_badan", type: "number" },
                    { label: "Berat Badan (kg)", key: "berat_badan", type: "number" },
                  ]
                },
                {
                  section: "Akademik & Jurusan", icon: <Layers size={14} />, fields: [
                    { label: "Sekolah Asal", key: "sekolah_asal" },
                    { label: "Tanggal Lulus", key: "tgl_lulus", type: "date" },
                    { label: "Program Studi", key: "jurusan_1", type: "select", options: ["Rekayasa Perangkat Lunak", "Teknik Jaringan Komputer & Telekomunikasi", "Desain Komunikasi Visual", "Broadcasting & Perfilman", "Teknik Elektronika", "Animasi"] },
                    { label: "Alasan Memilih", key: "alasan_memilih" },
                    { label: "Cita-cita", key: "cita_cita" },
                  ]
                },
                {
                  section: "Data Orang Tua", icon: <Users size={14} />, fields: [
                    { label: "Nama Ayah", key: "nama_ayah" },
                    { label: "Pekerjaan Ayah", key: "pekerjaan_ayah" },
                    { label: "Penghasilan Ayah", key: "penghasilan_ayah" },
                    { label: "Nama Ibu", key: "nama_ibu" },
                    { label: "Pekerjaan Ibu", key: "pekerjaan_ibu" },
                    { label: "Penghasilan Ibu", key: "penghasilan_ibu" },
                    { label: "Telepon Orang Tua", key: "telepon_ortu" },
                  ]
                }
              ].map((section) => (
                <div key={section.section} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      {section.icon}
                    </div>
                    {section.section}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {section.fields.map((f) => (
                      <div key={f.key} className="group">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-450 mb-2 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">{f.label}</label>
                        {f.type === "select" ? (
                          <CustomSelect
                            value={(editForm as any)[f.key] || ""}
                            onChange={(val) => setEditForm((prev) => ({ ...prev, [f.key]: val }))}
                            options={(f.options || []).map((o: string) => ({ value: o, label: o }))}
                            placeholder={`Pilih ${f.label}`}
                          />
                        ) : (
                          <input
                            type={f.type || "text"}
                            value={(editForm as any)[f.key] || ""}
                            onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                            className="w-full bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/40 flex items-center justify-end gap-4 shrink-0">
              <button
                onClick={() => setEditApplicant(null)}
                className="px-6 py-3 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-white/5"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] flex items-center gap-2"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsImportModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#0b1121] rounded-3xl w-full max-w-3xl flex flex-col relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="px-8 py-6 flex items-start justify-between border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50 shrink-0">
                  <FileSpreadsheet className="text-emerald-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">IMPOR DATA SISWA AKTIF (BULK MIGRASI)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Masukkan ratusan atau ribuan data siswa dari Dapodik / Excel sekaligus tanpa input manual.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              
              {/* Template Section */}
              <div className="bg-[#f8faff] dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-blue-700 dark:text-blue-400 font-black text-sm uppercase tracking-wide">1. BELUM MEMILIKI FORMAT FILE?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                    Unduh template resmi CationGate yang sudah disesuaikan dengan 18 kolom lengkap (Nama Lengkap, NISN, NIK, NIPD, Jurusan, Kelas, Periode, L/P, dll).
                  </p>
                </div>
                <button 
                  onClick={handleDownloadTemplate}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap shadow-sm shadow-blue-500/20 flex items-center gap-2 shrink-0 transition-colors"
                >
                  <Download size={14} />
                  UNDUH TEMPLATE (.XLSX)
                </button>
              </div>

              {/* Drag and Drop Upload */}
              <div 
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden ${
                  isDragging 
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" 
                    : "border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setImportFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".xlsx, .xls"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImportFile(e.target.files[0]);
                    }
                  }}
                />
                
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Upload size={24} />
                </div>
                
                {importFile ? (
                  <>
                    <h4 className="text-base font-black text-slate-800 dark:text-white uppercase mb-1">{importFile.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Siap untuk diimpor ({(importFile.size / 1024).toFixed(1)} KB)
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide mb-2">
                      TARIK & LEPAS FILE EXCEL DISINI, ATAU <span className="text-blue-600 dark:text-blue-400">PILIH FILE</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Mendukung format Microsoft Excel (.xlsx, .xls).
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#080d1a] rounded-b-3xl flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                }}
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                BATAL
              </button>
              <button 
                onClick={() => {
                  if (importFile) {
                    const mockEvent = { target: { files: [importFile] } } as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleImportExcel(mockEvent);
                    setIsImportModalOpen(false);
                    setImportFile(null);
                  }
                }}
                disabled={!importFile}
                className="px-6 py-2.5 rounded-xl bg-[#61d0a5] hover:bg-[#52ba92] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
              >
                <Check size={14} />
                MULAI IMPOR
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}

    </div>
  );
}

export default function ActiveStudentsDirectory() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold animate-pulse">Memuat direktori siswa...</div>}>
      <ActiveStudentsDirectoryContent />
    </Suspense>
  );
}
