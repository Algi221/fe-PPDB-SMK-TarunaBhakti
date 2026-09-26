"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Search, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Pencil, 
  FileSpreadsheet, 
  Filter, 
  AlertCircle, 
  Check, 
  X, 
  Phone, 
  CreditCard, 
  UserCheck, 
  ChevronDown,
  ChevronUp,
  Calendar,
  Layers,
  RefreshCw,
  FileText
} from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

export interface SiswaTidakLancar {
  id: number;
  no_kk: string | null;
  nama: string;
  nisn: string | null;
  nik: string | null;
  jurusan: string | null;
  kelas: string | null;
  telepon_ortu: string | null;
  whatsapp: string | null;
  nominal_tunggakan: number | string | null;
  keterangan: string | null;
  status: string | null;
  periode: string | null;
  created_at?: string;
}

const formatRupiah = (val: number | string | null | undefined): string => {
  const num = typeof val === "number" ? val : parseFloat(String(val || 0)) || 0;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
};

// Base default 5-year periods for dropdown selection
const DEFAULT_PERIODS = [
  "2026-2027",
  "2025-2026",
  "2024-2025",
  "2023-2024",
  "2022-2023",
  "2021-2022"
];

export default function SiswaTidakLancarTab() {
  const [data, setData] = useState<SiswaTidakLancar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");
  const [periodFilter, setPeriodFilter] = useState<string>("ALL");

  // State to track expanded period accordions
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({});

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<SiswaTidakLancar | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    no_kk: "",
    nama: "",
    nisn: "",
    nik: "",
    jurusan: "Rekayasa Perangkat Lunak",
    kelas: "X RPL 1",
    telepon_ortu: "",
    whatsapp: "",
    nominal_tunggakan: "",
    keterangan: "",
    status: "Belum Lancar",
    periode: "2026-2027"
  });

  // Import Excel Modal States
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null;
      const res = await fetch("http://localhost:5000/api/siswa-tidak-lancar", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const resData = await res.json();
      if (resData.success && Array.isArray(resData.data)) {
        setData(resData.data);
      }
    } catch (err) {
      console.error("Fetch siswa tidak lancar error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Automatically expand periods that contain data
  useEffect(() => {
    if (data.length > 0) {
      const initialExpanded: Record<string, boolean> = {};
      data.forEach((item) => {
        const p = item.periode || "2026-2027";
        initialExpanded[p] = true;
      });
      setExpandedPeriods((prev) => ({ ...initialExpanded, ...prev }));
    }
  }, [data]);

  // Dynamic available periods list for filter dropdown
  const availablePeriods = useMemo(() => {
    const set = new Set<string>(DEFAULT_PERIODS);
    data.forEach((item) => {
      if (item.periode) set.add(item.periode);
    });
    return Array.from(set).sort((a, b) => {
      const startA = parseInt(a.split("-")[0]) || 0;
      const startB = parseInt(b.split("-")[0]) || 0;
      return startB - startA;
    });
  }, [data]);

  // Filtered List
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchStatus = statusFilter === "ALL" || (item.status || "Belum Lancar") === statusFilter;
      const matchMajor = majorFilter === "ALL" || (item.jurusan || "").toLowerCase().includes(majorFilter.toLowerCase());
      const matchPeriod = periodFilter === "ALL" || (item.periode || "2026-2027") === periodFilter;

      const query = searchTerm.toLowerCase().trim();
      if (!query) return matchStatus && matchMajor && matchPeriod;

      const matchSearch =
        (item.no_kk || "").toLowerCase().includes(query) ||
        (item.nama || "").toLowerCase().includes(query) ||
        (item.nisn || "").toLowerCase().includes(query) ||
        (item.nik || "").toLowerCase().includes(query) ||
        (item.kelas || "").toLowerCase().includes(query) ||
        (item.jurusan || "").toLowerCase().includes(query) ||
        (item.keterangan || "").toLowerCase().includes(query) ||
        (item.telepon_ortu || "").toLowerCase().includes(query) ||
        (item.whatsapp || "").toLowerCase().includes(query) ||
        (item.periode || "").toLowerCase().includes(query);

      return matchStatus && matchMajor && matchPeriod && matchSearch;
    });
  }, [data, searchTerm, statusFilter, majorFilter, periodFilter]);

  // Dynamically group filtered data by Period ONLY for periods that have actual data
  const groupedByPeriod = useMemo(() => {
    const map: Record<string, SiswaTidakLancar[]> = {};

    filteredData.forEach((item) => {
      const p = item.periode || "2026-2027";
      if (!map[p]) {
        map[p] = [];
      }
      map[p].push(item);
    });

    return map;
  }, [filteredData]);

  // Sort periods in descending order (e.g., 2026-2027, 2025-2026...)
  const sortedPeriods = useMemo(() => {
    return Object.keys(groupedByPeriod).sort((a, b) => {
      const startA = parseInt(a.split("-")[0]) || 0;
      const startB = parseInt(b.split("-")[0]) || 0;
      return startB - startA;
    });
  }, [groupedByPeriod]);

  // Toggle Accordion Period
  const togglePeriod = (period: string) => {
    setExpandedPeriods((prev) => ({
      ...prev,
      [period]: !prev[period]
    }));
  };

  // Global Statistics
  const stats = useMemo(() => {
    const totalCount = data.length;
    let totalTunggakan = 0;
    let belumLancarCount = 0;
    let cicilanCount = 0;
    let lunasCount = 0;

    data.forEach((d) => {
      const num = typeof d.nominal_tunggakan === "number" ? d.nominal_tunggakan : parseFloat(String(d.nominal_tunggakan || 0)) || 0;
      totalTunggakan += num;
      const st = d.status || "Belum Lancar";
      if (st === "Belum Lancar") belumLancarCount++;
      else if (st === "Dalam Cicilan") cicilanCount++;
      else if (st === "Lunas") lunasCount++;
    });

    return { totalCount, totalTunggakan, belumLancarCount, cicilanCount, lunasCount };
  }, [data]);

  // Save/Create Record
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) {
      Swal.fire("Peringatan", "Nama siswa wajib diisi.", "warning");
      return;
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null;
      const isEdit = !!selectedRecord;
      const url = isEdit
        ? `http://localhost:5000/api/siswa-tidak-lancar/${selectedRecord.id}`
        : "http://localhost:5000/api/siswa-tidak-lancar";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Gagal menyimpan data.");
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: resData.message || "Data berhasil disimpan.",
        timer: 1500,
        showConfirmButton: false
      });

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedRecord(null);
      fetchData();
    } catch (err: any) {
      Swal.fire("Gagal", err.message || "Terjadi kesalahan.", "error");
    }
  };

  // Open Edit Modal
  const handleEdit = (item: SiswaTidakLancar) => {
    setSelectedRecord(item);
    setFormData({
      no_kk: item.no_kk || "",
      nama: item.nama || "",
      nisn: item.nisn || "",
      nik: item.nik || "",
      jurusan: item.jurusan || "Rekayasa Perangkat Lunak",
      kelas: item.kelas || "",
      telepon_ortu: item.telepon_ortu || "",
      whatsapp: item.whatsapp || "",
      nominal_tunggakan: String(item.nominal_tunggakan || "0"),
      keterangan: item.keterangan || "",
      status: item.status || "Belum Lancar",
      periode: item.periode || "2026-2027"
    });
    setIsEditModalOpen(true);
  };

  // Delete Record
  const handleDelete = async (id: number, nama: string) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus riwayat tidak lancar siswa "${nama}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null;
        const res = await fetch(`http://localhost:5000/api/siswa-tidak-lancar/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        const resData = await res.json();
        if (resData.success) {
          Swal.fire("Berhasil", "Data riwayat berhasil dihapus.", "success");
          fetchData();
        } else {
          throw new Error(resData.message);
        }
      } catch (err: any) {
        Swal.fire("Gagal", err.message || "Gagal menghapus data.", "error");
      }
    }
  };

  // Export to Excel (Specific List or All)
  const handleExportExcel = (exportList: SiswaTidakLancar[] = filteredData, filenameSuffix = "semua_periode") => {
    if (exportList.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Siswa Tidak Lancar");

    worksheet.columns = [
      { header: "No", key: "no", width: 6 },
      { header: "No. KK", key: "no_kk", width: 20 },
      { header: "Nama Siswa", key: "nama", width: 25 },
      { header: "NISN", key: "nisn", width: 15 },
      { header: "NIK", key: "nik", width: 18 },
      { header: "Jurusan", key: "jurusan", width: 25 },
      { header: "Kelas", key: "kelas", width: 15 },
      { header: "No. Telepon / WA Ortu", key: "telepon_ortu", width: 18 },
      { header: "Nominal Tunggakan (Rp)", key: "nominal_tunggakan", width: 22 },
      { header: "Keterangan Kendala", key: "keterangan", width: 30 },
      { header: "Status Pembayaran", key: "status", width: 18 },
      { header: "Periode / Angkatan", key: "periode", width: 18 }
    ];

    // Style Header Row
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E40AF" }
    };

    exportList.forEach((item, idx) => {
      worksheet.addRow({
        no: idx + 1,
        no_kk: item.no_kk || "-",
        nama: item.nama,
        nisn: item.nisn || "-",
        nik: item.nik || "-",
        jurusan: item.jurusan || "-",
        kelas: item.kelas || "-",
        telepon_ortu: item.telepon_ortu || item.whatsapp || "-",
        nominal_tunggakan: typeof item.nominal_tunggakan === "number" ? item.nominal_tunggakan : parseFloat(String(item.nominal_tunggakan || 0)) || 0,
        keterangan: item.keterangan || "-",
        status: item.status || "Belum Lancar",
        periode: item.periode || "2026-2027"
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `Riwayat_Siswa_Tidak_Lancar_${filenameSuffix}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    });
  };

  // Download Template Excel
  const handleDownloadTemplate = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template Siswa Tidak Lancar");

    worksheet.columns = [
      { header: "No. KK", key: "no_kk", width: 20 },
      { header: "Nama Siswa", key: "nama", width: 25 },
      { header: "NISN", key: "nisn", width: 15 },
      { header: "NIK", key: "nik", width: 18 },
      { header: "Jurusan", key: "jurusan", width: 25 },
      { header: "Kelas", key: "kelas", width: 15 },
      { header: "No. Telepon Ortu / WA", key: "telepon_ortu", width: 18 },
      { header: "Nominal Tunggakan", key: "nominal_tunggakan", width: 20 },
      { header: "Keterangan / Catatan Kendala", key: "keterangan", width: 30 },
      { header: "Status (Belum Lancar/Dalam Cicilan/Lunas)", key: "status", width: 25 },
      { header: "Periode (Contoh: 2021-2022 s.d 2026-2027)", key: "periode", width: 25 }
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E40AF" }
    };

    // Add Example Rows across 5 years
    worksheet.addRow({
      no_kk: "3276012345670001",
      nama: "Ahmad Subagja",
      nisn: "0081234567",
      nik: "3276012345670002",
      jurusan: "Rekayasa Perangkat Lunak",
      kelas: "X RPL 1",
      telepon_ortu: "081234567890",
      nominal_tunggakan: 1500000,
      keterangan: "Tunggakan SPP Bulan Jan-Mar 2026",
      status: "Belum Lancar",
      periode: "2026-2027"
    });

    worksheet.addRow({
      no_kk: "3276012345670005",
      nama: "Siti Rahmawati",
      nisn: "0081234568",
      nik: "3276012345670006",
      jurusan: "Teknik Jaringan Komputer",
      kelas: "XI TJKT 2",
      telepon_ortu: "085678901234",
      nominal_tunggakan: 500000,
      keterangan: "Sisa Biaya Perlengkapan Angkatan Lalu",
      status: "Dalam Cicilan",
      periode: "2025-2026"
    });

    worksheet.addRow({
      no_kk: "3276012345670009",
      nama: "Budi Santoso",
      nisn: "0071234569",
      nik: "3276012345670010",
      jurusan: "Desain Komunikasi Visual",
      kelas: "XII DKV 1",
      telepon_ortu: "087812345678",
      nominal_tunggakan: 2100000,
      keterangan: "Tunggakan SPP Angkatan 2021-2022",
      status: "Belum Lancar",
      periode: "2021-2022"
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "Template_Import_Siswa_Tidak_Lancar.xlsx");
    });
  };

  // Handle Import Excel Process
  const handleProcessImportExcel = async () => {
    if (!importFile) return;

    try {
      const buffer = await importFile.arrayBuffer();
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(buffer);

      const worksheet = wb.worksheets[0];
      if (!worksheet) {
        throw new Error("File Excel tidak memiliki lembar kerja (worksheet).");
      }

      const extractCellText = (cell: ExcelJS.Cell): string => {
        if (!cell || cell.value === null || cell.value === undefined) return "";
        if (typeof cell.value === "object") {
          if ("richText" in cell.value && Array.isArray((cell.value as any).richText)) {
            return (cell.value as any).richText.map((rt: any) => rt.text || "").join("");
          }
          if ("text" in cell.value) return String((cell.value as any).text || "");
          if ("result" in cell.value) return String((cell.value as any).result || "");
        }
        return String(cell.value);
      };

      // Detect header row
      let headerRowNumber = 1;
      let colMap: Record<string, number> = {};

      for (let r = 1; r <= 5; r++) {
        const row = worksheet.getRow(r);
        const currentMap: Record<string, number> = {};

        row.eachCell((cell, colNumber) => {
          const val = extractCellText(cell).toLowerCase().trim();
          if (!val) return;

          if (val.includes("kk") || val.includes("kartu keluarga")) currentMap["no_kk"] = colNumber;
          else if (val.includes("nama")) currentMap["nama"] = colNumber;
          else if (val.includes("nisn") || val.includes("nis")) currentMap["nisn"] = colNumber;
          else if (val.includes("nik")) currentMap["nik"] = colNumber;
          else if (val.includes("jurusan")) currentMap["jurusan"] = colNumber;
          else if (val.includes("kelas")) currentMap["kelas"] = colNumber;
          else if (val.includes("telepon") || val.includes("hp") || val.includes("wa")) currentMap["telepon_ortu"] = colNumber;
          else if (val.includes("tunggakan") || val.includes("nominal") || val.includes("biaya")) currentMap["nominal_tunggakan"] = colNumber;
          else if (val.includes("ket") || val.includes("catatan") || val.includes("kendala")) currentMap["keterangan"] = colNumber;
          else if (val.includes("status")) currentMap["status"] = colNumber;
          else if (val.includes("periode") || val.includes("tahun") || val.includes("angkatan") || val.includes("thn")) currentMap["periode"] = colNumber;
        });

        if (currentMap["nama"] || currentMap["no_kk"]) {
          headerRowNumber = r;
          colMap = currentMap;
          break;
        }
      }

      const importedItems: any[] = [];
      const totalRows = worksheet.rowCount;

      for (let r = headerRowNumber + 1; r <= totalRows; r++) {
        const row = worksheet.getRow(r);

        const getCellVal = (key: string): string => {
          const colIdx = colMap[key];
          if (!colIdx) return "";
          return extractCellText(row.getCell(colIdx)).trim();
        };

        const nama = getCellVal("nama");
        const no_kk = getCellVal("no_kk");
        if (!nama && !no_kk) continue;

        const rawPeriod = getCellVal("periode");
        const formattedPeriod = rawPeriod ? rawPeriod.replace("/", "-").trim() : "2026-2027";

        importedItems.push({
          no_kk: no_kk || null,
          nama: nama || "Siswa Tanpa Nama",
          nisn: getCellVal("nisn") || null,
          nik: getCellVal("nik") || null,
          jurusan: getCellVal("jurusan") || "Rekayasa Perangkat Lunak",
          kelas: getCellVal("kelas") || "X RPL 1",
          telepon_ortu: getCellVal("telepon_ortu") || null,
          whatsapp: getCellVal("telepon_ortu") || null,
          nominal_tunggakan: getCellVal("nominal_tunggakan"),
          keterangan: getCellVal("keterangan") || "Tunggakan Pembayaran",
          status: getCellVal("status") || "Belum Lancar",
          periode: formattedPeriod
        });
      }

      if (importedItems.length === 0) {
        throw new Error("Tidak ada data valid yang dapat diimpor dari file Excel.");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null;
      const res = await fetch("http://localhost:5000/api/siswa-tidak-lancar/import-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ students: importedItems })
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Gagal mengimpor data.");
      }

      Swal.fire({
        icon: "success",
        title: "Impor Berhasil!",
        text: `Berhasil mengimpor ${resData.importedCount || importedItems.length} riwayat siswa tidak lancar ke sistem.`,
        confirmButtonColor: "#2563eb"
      });

      setIsImportModalOpen(false);
      setImportFile(null);
      fetchData();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Impor Excel",
        text: err.message || "Terjadi kesalahan saat membaca file Excel.",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 border-t-[3px] border-t-red-600 dark:border-t-red-500 rounded-2xl p-4 md:p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Total Siswa Kendala</span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">{stats.totalCount}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Siswa</span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Memiliki riwayat tidak lancar</p>
          </div>
          <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400">
            <AlertCircle size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 border-t-[3px] border-t-amber-500 dark:border-t-amber-500 rounded-2xl p-4 md:p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Total Nominal Tunggakan</span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-xl font-black text-amber-600 dark:text-amber-400">{formatRupiah(stats.totalTunggakan)}</h3>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Estimasi total sisa belum terbayar</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400">
            <CreditCard size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 border-t-[3px] border-t-rose-500 dark:border-t-rose-500 rounded-2xl p-4 md:p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Status Belum Lancar</span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats.belumLancarCount}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Siswa</span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Perlu follow-up penagihan</p>
          </div>
          <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400">
            <Phone size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 border-t-[3px] border-t-emerald-500 dark:border-t-emerald-500 rounded-2xl p-4 md:p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Dalam Cicilan / Lunas</span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.cicilanCount + stats.lunasCount}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Siswa</span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Progress pembayaran berjalan</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <UserCheck size={18} />
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-[#0b1121] border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 rounded-2xl p-2.5 shadow-sm flex items-center justify-between gap-3 w-full overflow-x-auto whitespace-nowrap hide-scrollbar">
        
        {/* Universal Search Input focusing on No. KK */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-[280px] lg:w-[320px] shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400" size={15} />
            <input
              type="text"
              placeholder="Cari No. KK, Nama Siswa, NISN, NIK, atau Kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#0b1121] border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-xs"
            />
          </div>

          {/* Filter Periode (Dynamic) */}
          <div className="relative min-w-[135px] shrink-0">
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full pl-3 pr-7 py-2 bg-white dark:bg-[#0b1121] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">Semua Periode</option>
              {availablePeriods.map((p) => (
                <option key={p} value={p}>Periode {p}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={13} />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[130px] shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-7 py-2 bg-white dark:bg-[#0b1121] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="Belum Lancar">Belum Lancar</option>
              <option value="Dalam Cicilan">Dalam Cicilan</option>
              <option value="Lunas">Lunas</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={13} />
            </div>
          </div>

          {/* Major Filter */}
          <div className="relative min-w-[135px] shrink-0">
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="w-full pl-3 pr-7 py-2 bg-white dark:bg-[#0b1121] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer truncate"
            >
              <option value="ALL">Semua Jurusan</option>
              <option value="Rekayasa Perangkat Lunak">RPL / PPLG</option>
              <option value="Teknik Jaringan Komputer">TJKT / TKJ</option>
              <option value="Desain Komunikasi Visual">DKV</option>
              <option value="Animasi">Animasi</option>
              <option value="Broadcasting">Broadcasting / BCF</option>
              <option value="Teknik Elektronika">Teknik Elektronika / TE</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={13} />
            </div>
          </div>
        </div>

        {/* Right Action Group */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchData}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          {/* Download Template Excel */}
          <button
            onClick={handleDownloadTemplate}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5"
            title="Unduh Template Excel"
          >
            <FileSpreadsheet size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Template Excel</span>
          </button>

          {/* Import Excel Button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Upload size={13} />
            Impor Excel
          </button>

          {/* Export Excel Button */}
          <button
            onClick={() => handleExportExcel(filteredData, "semua_periode")}
            disabled={filteredData.length === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filteredData.length === 0
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
          >
            <Download size={13} />
            Ekspor Semua
          </button>

          {/* Add Manual Record */}
          <button
            onClick={() => {
              setSelectedRecord(null);
              setFormData({
                no_kk: "",
                nama: "",
                nisn: "",
                nik: "",
                jurusan: "Rekayasa Perangkat Lunak",
                kelas: "X RPL 1",
                telepon_ortu: "",
                whatsapp: "",
                nominal_tunggakan: "",
                keterangan: "",
                status: "Belum Lancar",
                periode: "2026-2027"
              });
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus size={14} />
            Tambah Data
          </button>
        </div>
      </div>

      {/* Accordion Grouped By Academic Year (Dynamic - Only show periods with data) */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 font-medium">
            <RefreshCw className="animate-spin inline-block mr-2" size={16} />
            Memuat riwayat siswa tidak lancar...
          </div>
        ) : sortedPeriods.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 shadow-sm">
            <AlertCircle className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={36} />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">Belum Ada Data Riwayat Tidak Lancar</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Silakan gunakan tombol <strong className="text-emerald-600 dark:text-emerald-400">Impor Excel</strong> di atas untuk memasukkan data siswa (termasuk data angkatan 5 tahun lalu). Periode akan otomatis terbaca dan terkelompokkan secara instan!
            </p>
          </div>
        ) : (
          sortedPeriods.map((period) => {
            const students = groupedByPeriod[period] || [];
            const isExpanded = expandedPeriods[period] ?? true;

            // Calculate Period Specific Stats
            let periodTotalTunggakan = 0;
            students.forEach((s) => {
              const num = typeof s.nominal_tunggakan === "number" ? s.nominal_tunggakan : parseFloat(String(s.nominal_tunggakan || 0)) || 0;
              periodTotalTunggakan += num;
            });

            return (
              <div 
                key={period} 
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 ring-1 ring-slate-900/5 dark:ring-white/5 rounded-2xl md:rounded-3xl overflow-hidden shadow-xs transition-colors duration-300"
              >
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => togglePeriod(period)}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-950/30 border-b border-slate-200/80 dark:border-slate-800/60 hover:bg-slate-100/70 dark:hover:bg-slate-950/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 shadow-xs">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide leading-none">
                          Angkatan / Periode {period}
                        </h4>
                        <span className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                          {students.length} Siswa Kendala
                        </span>
                        {periodTotalTunggakan > 0 && (
                          <span className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono">
                            {formatRupiah(periodTotalTunggakan)}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Riwayat pembayaran siswa tidak lancar untuk tahun ajaran {period}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Separate Export Button for this specific Period */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportExcel(students, `periode_${period.replace("-", "_")}`);
                      }}
                      disabled={students.length === 0}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                        students.length === 0
                          ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
                          : "bg-white hover:bg-slate-50 dark:bg-[#0b1121] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                      }`}
                      title={`Ekspor Periode ${period}`}
                    >
                      <Download size={13} />
                      <span className="hidden sm:inline">Ekspor Periode Ini</span>
                    </button>

                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Accordion Table Body */}
                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4 w-12 text-center">No</th>
                          <th className="py-3 px-4">No. KK</th>
                          <th className="py-3 px-4">Nama Siswa</th>
                          <th className="py-3 px-4">NISN / NIK</th>
                          <th className="py-3 px-4">Jurusan & Kelas</th>
                          <th className="py-3 px-4">Kontak Ortu</th>
                          <th className="py-3 px-4 text-right">Nominal Tunggakan</th>
                          <th className="py-3 px-4">Keterangan Kendala</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-center w-24">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                        {students.map((item, idx) => {
                          const status = item.status || "Belum Lancar";
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-4 text-center font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                              <td className="py-3 px-4">
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-1 rounded border border-blue-200/60 dark:border-blue-800/50 text-[11px]">
                                  {item.no_kk || "-"}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-800 dark:text-white uppercase tracking-tight">
                                {item.nama}
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px]">
                                <div>NISN: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.nisn || "-"}</span></div>
                                {item.nik && <div className="text-[10px] text-slate-400">NIK: {item.nik}</div>}
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-800 dark:text-slate-200">{item.kelas || "-"}</div>
                                <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{item.jurusan || "-"}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                                  <Phone size={12} className="text-emerald-500" />
                                  {item.telepon_ortu || item.whatsapp || "-"}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right font-mono font-black text-rose-600 dark:text-rose-400">
                                {formatRupiah(item.nominal_tunggakan)}
                              </td>
                              <td className="py-3 px-4 max-w-[200px]">
                                <p className="truncate text-slate-600 dark:text-slate-300" title={item.keterangan || ""}>
                                  {item.keterangan || "-"}
                                </p>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                                    status === "Belum Lancar"
                                      ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                                      : status === "Dalam Cicilan"
                                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                      : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                  }`}
                                >
                                  {status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                                    title="Edit Data"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.id, item.nama)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                                    title="Hapus Data"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wide">
                {selectedRecord ? "EDIT DATA SISWA TIDAK LANCAR" : "TAMBAH DATA SISWA TIDAK LANCAR"}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Periode / Angkatan <span className="text-blue-500">*</span>
                  </label>
                  <select
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {availablePeriods.map((p) => (
                      <option key={p} value={p}>Periode {p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    No. Kartu Keluarga (No. KK) <span className="text-blue-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="3276012345670001"
                    value={formData.no_kk}
                    onChange={(e) => setFormData({ ...formData, no_kk: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Nama Lengkap Siswa <span className="text-blue-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap siswa"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">NISN</label>
                  <input
                    type="text"
                    placeholder="0081234567"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">NIK Siswa</label>
                  <input
                    type="text"
                    placeholder="3276012345670002"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">Jurusan</label>
                  <select
                    value={formData.jurusan}
                    onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak (RPL)</option>
                    <option value="Teknik Jaringan Komputer">Teknik Jaringan Komputer (TJKT)</option>
                    <option value="Desain Komunikasi Visual">Desain Komunikasi Visual (DKV)</option>
                    <option value="Animasi">Animasi</option>
                    <option value="Broadcasting & Perfilman">Broadcasting & Perfilman (BCF)</option>
                    <option value="Teknik Elektronika">Teknik Elektronika (TE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">Kelas / Rombel</label>
                  <input
                    type="text"
                    placeholder="X RPL 1"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">No. HP / WA Ortu</label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={formData.telepon_ortu}
                    onChange={(e) => setFormData({ ...formData, telepon_ortu: e.target.value, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">Nominal Tunggakan (Rp)</label>
                  <input
                    type="number"
                    placeholder="1500000"
                    value={formData.nominal_tunggakan}
                    onChange={(e) => setFormData({ ...formData, nominal_tunggakan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">Status Pembayaran</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Belum Lancar">Belum Lancar</option>
                    <option value="Dalam Cicilan">Dalam Cicilan</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">Catatan Keterangan Kendala</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Tunggakan SPP bulan Jan-Mar 2026, janji bayar tgl 15..."
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase shadow-md transition-all"
                >
                  SIMPAN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wide">
                IMPOR DATA SISWA TIDAK LANCAR (EXCEL)
              </h3>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gunakan format Excel standar untuk mengimpor daftar riwayat pembayaran siswa yang tidak lancar. Data dari periode/angkatan manapun (termasuk 5 tahun lalu) akan langsung terbaca dan dikelompokkan secara otomatis!
              </p>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition-colors"
              >
                <FileSpreadsheet size={15} />
                UNDUH TEMPLATE EXCEL (CONTOH DARI 5 TAHUN LALU)
              </button>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setImportFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImportFile(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <Upload size={22} />
                </div>

                {importFile ? (
                  <>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase">{importFile.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">({(importFile.size / 1024).toFixed(1)} KB)</p>
                  </>
                ) : (
                  <>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
                      Klik atau Seret File Excel (.xlsx) Ke Sini
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">Format didukung: Microsoft Excel (.xlsx, .xls)</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase"
              >
                BATAL
              </button>
              <button
                onClick={handleProcessImportExcel}
                disabled={!importFile}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase shadow-md transition-all flex items-center gap-1.5"
              >
                <Check size={14} />
                MULAI IMPOR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
