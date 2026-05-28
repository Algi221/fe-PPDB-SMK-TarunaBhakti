"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePPDB } from "@/context/PPDBContext";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { 
  Users, 
  Layers, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Filter, 
  Sparkles, 
  GraduationCap, 
  CheckSquare, 
  MinusSquare, 
  TrendingUp, 
  AlertCircle, 
  RefreshCw, 
  HelpCircle,
  FolderPlus,
  ArrowRight,
  ShieldAlert,
  Sliders,
  ChevronRight,
  Eye,
  Download,
  School
} from "lucide-react";

interface Applicant {
  id: number;
  nama: string;
  nisn: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  jurusan_1?: string;
  jurusan1?: string;
  diterima_kelas?: string | null;
  diterimaKelas?: string | null;
  status?: string;
  periode?: string;
  [key: string]: any;
}

interface ClassItem {
  id: string;
  name: string;
  majorCode: string;
  maxCapacity: number;
}

export default function ClassDivisionManagement() {
  const { applicants, updateApplicant, fetchAdminApplicants } = usePPDB();
  const [mounted, setMounted] = useState(false);

  const getMajorLogoUrl = (code: string) => {
    switch (code.toUpperCase()) {
      case "RPL":
        return "/jurusan/pplg.jpeg";
      case "TJKT":
        return "/jurusan/tjkt.jpeg";
      case "DKV":
        return "/jurusan/dkv.jpeg";
      case "BC":
        return "/jurusan/bc.jpeg";
      case "ANM":
        return "/jurusan/animasijpeg.jpeg";
      case "TE":
        return "/jurusan/te.jpeg";
      default:
        return "/logo_smktb.png";
    }
  };

  const getMajorLogo = (code: string, size = "w-5 h-5") => {
    const url = getMajorLogoUrl(code);
    return (
      <img
        src={url}
        alt={`Logo ${code}`}
        className={`${size} rounded-full object-cover shrink-0 border border-slate-200/80 dark:border-white/10`}
      />
    );
  };

  // Core filter states
  const [selectedMajor, setSelectedMajor] = useState<string>("RPL");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<"ALL" | "UNASSIGNED" | "ASSIGNED">("ALL");

  // Selection states
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [targetClass, setTargetClass] = useState<string>("");

  // UI state overlays
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Dynamic Class Creation states
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCapacity, setNewClassCapacity] = useState(40);
  const [isAddingClass, setIsAddingClass] = useState(false);

  // Class Detail Modal states
  const [selectedClassDetail, setSelectedClassDetail] = useState<ClassItem | null>(null);
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const [activeDropClass, setActiveDropClass] = useState<string | null>(null);

  // Predefined/Suggested Majors
  const majors = [
    { code: "RPL", name: "Rekayasa Perangkat Lunak" },
    { code: "TJKT", name: "Teknik Jaringan Komputer & Telekomunikasi" },
    { code: "DKV", name: "Desain Komunikasi Visual" },
    { code: "BC", name: "Broadcasting & Perfilman" },
    { code: "ANM", name: "Animasi" },
    { code: "TE", name: "Teknik Elektronika" }
  ];

  // Dynamic state for majors config loaded from localStorage (to align with Customizer)
  const activeMajors = useMemo(() => {
    if (!mounted) return majors;
    const saved = localStorage.getItem("ppdb_majors_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: any) => ({ code: m.code, name: m.title }));
        }
      } catch (e) {
        return majors;
      }
    }
    return majors;
  }, [mounted]);

  // Sync selected major on mount to whatever is the first active major code
  useEffect(() => {
    if (activeMajors.length > 0) {
      setSelectedMajor(activeMajors[0].code);
    }
  }, [activeMajors]);

  // Load and save classes in localStorage
  useEffect(() => {
    setMounted(true);
    const savedClasses = localStorage.getItem("ppdb_classes_config");
    if (savedClasses) {
      try {
        setClasses(JSON.parse(savedClasses));
      } catch (e) {
        setClasses(generateDefaultClasses());
      }
    } else {
      const defaults = generateDefaultClasses();
      setClasses(defaults);
      localStorage.setItem("ppdb_classes_config", JSON.stringify(defaults));
    }
  }, []);

  const generateDefaultClasses = (): ClassItem[] => {
    const defaultList: ClassItem[] = [];
    majors.forEach(m => {
      // e.g. X RPL 1, X RPL 2
      defaultList.push({
        id: `${m.code}-1`,
        name: `X ${m.code} 1`,
        majorCode: m.code,
        maxCapacity: 100 // Set high, practically unlimited
      });
      defaultList.push({
        id: `${m.code}-2`,
        name: `X ${m.code} 2`,
        majorCode: m.code,
        maxCapacity: 100
      });
    });
    return defaultList;
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const saveClassesToStorage = (updatedClasses: ClassItem[]) => {
    setClasses(updatedClasses);
    localStorage.setItem("ppdb_classes_config", JSON.stringify(updatedClasses));
  };

  // Filter approved/active applicants of the selected major
  const approvedApplicantsOfMajor = useMemo(() => {
    return applicants.filter((a: Applicant) => {
      const isApproved = a.status === "Approved";
      if (!isApproved) return false;

      const maj1 = (a.jurusan_1 || a.jurusan1 || "").toUpperCase();
      
      const majorNameMap: Record<string, string> = {
        RPL: "REKAYASA PERANGKAT LUNAK",
        TJKT: "TEKNIK JARINGAN KOMPUTER & TELEKOMUNIKASI",
        DKV: "DESAIN KOMUNIKASI VISUAL",
        BC: "BROADCASTING & PERFILMAN",
        ANM: "ANIMASI",
        TE: "TEKNIK ELEKTRONIKA"
      };

      const selectedMajorName = majorNameMap[selectedMajor] || selectedMajor;
      
      const isMajorMatch = 
        maj1.includes(selectedMajor) || 
        maj1.includes(selectedMajorName) ||
        (selectedMajor === "BC" && (maj1.includes("BROADCASTING") || maj1.includes("PERFILMAN"))) ||
        (selectedMajor === "TJKT" && (maj1.includes("JARINGAN") || maj1.includes("TELEKOMUNIKASI")));

      return isMajorMatch;
    });
  }, [applicants, selectedMajor]);

  // Apply Search and Class Assignment Filters
  const filteredStudents = useMemo(() => {
    return approvedApplicantsOfMajor.filter((a: Applicant) => {
      const nameMatch = (a.nama || "").toLowerCase().includes(searchTerm.toLowerCase());
      const nisnMatch = (a.nisn || "").includes(searchTerm);
      const searchMatch = nameMatch || nisnMatch;

      const currentClass = a.diterima_kelas || a.diterimaKelas;

      if (assignmentFilter === "UNASSIGNED") {
        return searchMatch && !currentClass;
      }
      if (assignmentFilter === "ASSIGNED") {
        return searchMatch && !!currentClass;
      }
      return searchMatch;
    });
  }, [approvedApplicantsOfMajor, searchTerm, assignmentFilter]);

  // Group classes by the currently selected major
  const classesOfSelectedMajor = useMemo(() => {
    return classes.filter(c => c.majorCode === selectedMajor);
  }, [classes, selectedMajor]);

  // Compute student count in each class dynamically
  const classEnrollments = useMemo(() => {
    const enrollmentCounts: Record<string, number> = {};
    
    // Initialize
    classesOfSelectedMajor.forEach(c => {
      enrollmentCounts[c.name] = 0;
    });

    // Populate
    applicants.forEach((a: Applicant) => {
      const cls = a.diterima_kelas || a.diterimaKelas;
      if (cls && enrollmentCounts[cls] !== undefined) {
        enrollmentCounts[cls]++;
      }
    });

    return enrollmentCounts;
  }, [applicants, classesOfSelectedMajor]);

  // Total summary of assigned classes in selected major
  const totalClassesFilled = useMemo(() => {
    return classesOfSelectedMajor.filter(c => (classEnrollments[c.name] || 0) > 0).length;
  }, [classesOfSelectedMajor, classEnrollments]);

  // Students in selected class detail
  const enrolledStudentsInDetail = useMemo(() => {
    if (!selectedClassDetail) return [];
    return applicants.filter((a: Applicant) => {
      const cls = a.diterima_kelas || a.diterimaKelas;
      const isClassMatch = cls === selectedClassDetail.name;
      if (!isClassMatch) return false;

      const matchesSearch = (a.nama || "").toLowerCase().includes(classSearchTerm.toLowerCase()) || 
                            (a.nisn || "").includes(classSearchTerm);
      return matchesSearch;
    });
  }, [applicants, selectedClassDetail, classSearchTerm]);

  // Selection helpers
  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Mass action: Move selected students to class
  const handleAssignSelectedToClass = async (className: string) => {
    if (selectedStudentIds.length === 0) return;
    
    setIsLoading(true);
    setLoadingProgress(0);
    
    const total = selectedStudentIds.length;
    let successCount = 0;

    showToast(`Memindahkan ${total} siswa ke kelas ${className || "Belum Ditentukan"}...`, "info");

    for (let i = 0; i < total; i++) {
      const id = selectedStudentIds[i];
      const student = applicants.find((a: Applicant) => a.id === id);
      
      const payload = {
        diterima_kelas: className || null,
        diterima_tanggal: className ? new Date().toISOString().split("T")[0] : null
      };

      const result = await updateApplicant(id, payload);
      
      if (result?.success) {
        successCount++;
      }
      
      setLoadingProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsLoading(false);
    setSelectedStudentIds([]);
    await fetchAdminApplicants();
    
    if (successCount === total) {
      showToast(`Sukses memindahkan ${successCount} siswa ke kelas ${className || "Belum Ditentukan"}!`);
    } else {
      showToast(`Berhasil memindahkan ${successCount} dari ${total} siswa ke kelas ${className || "Belum Ditentukan"}.`, "info");
    }
  };

  // Drag and Drop Event Handlers for Student Assignments
  const handleDragStart = (e: React.DragEvent, studentId: number) => {
    // If the student being dragged is part of checked students, drag all of them!
    const dragIds = selectedStudentIds.includes(studentId)
      ? selectedStudentIds
      : [studentId];
    e.dataTransfer.setData("application/json", JSON.stringify(dragIds));
    e.dataTransfer.effectAllowed = "move";
    
    // Create rich visual drag ghost showing count
    const dragGhost = document.createElement("div");
    dragGhost.style.padding = "10px 20px";
    dragGhost.style.background = "linear-gradient(135deg, #3b82f6, #4f46e5)";
    dragGhost.style.color = "white";
    dragGhost.style.fontSize = "11px";
    dragGhost.style.fontWeight = "900";
    dragGhost.style.textTransform = "uppercase";
    dragGhost.style.letterSpacing = "0.05em";
    dragGhost.style.borderRadius = "14px";
    dragGhost.style.position = "absolute";
    dragGhost.style.top = "-1000px";
    dragGhost.style.boxShadow = "0 8px 30px rgba(59, 130, 246, 0.4)";
    dragGhost.innerText = `📦 Memindahkan ${dragIds.length} Siswa TB`;
    document.body.appendChild(dragGhost);
    e.dataTransfer.setDragImage(dragGhost, 0, 0);
    setTimeout(() => {
      document.body.removeChild(dragGhost);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, classId: string) => {
    e.preventDefault();
    setActiveDropClass(classId);
  };

  const handleDragLeave = () => {
    setActiveDropClass(null);
  };

  const handleDrop = async (e: React.DragEvent, className: string) => {
    e.preventDefault();
    setActiveDropClass(null);
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const ids: number[] = JSON.parse(dataStr);
      if (!Array.isArray(ids) || ids.length === 0) return;

      setIsLoading(true);
      setLoadingProgress(0);

      const total = ids.length;
      let successCount = 0;

      showToast(`Memindahkan ${total} siswa ke kelas ${className}...`, "info");

      for (let i = 0; i < total; i++) {
        const id = ids[i];
        const payload = {
          diterima_kelas: className,
          diterima_tanggal: new Date().toISOString().split("T")[0]
        };
        const result = await updateApplicant(id, payload);
        if (result?.success) {
          successCount++;
        }
        setLoadingProgress(Math.round(((i + 1) / total) * 100));
      }

      setIsLoading(false);
      setSelectedStudentIds([]);
      await fetchAdminApplicants();

      if (successCount === total) {
        showToast(`Sukses memindahkan ${successCount} siswa ke kelas ${className}!`);
      } else {
        showToast(`Berhasil memindahkan ${successCount} dari ${total} siswa ke kelas ${className}.`, "info");
      }
    } catch (err) {
      console.error("Drop error:", err);
      setIsLoading(false);
    }
  };

  // Class Management CRUD
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      showToast("Nama kelas tidak boleh kosong!", "error");
      return;
    }

    const cleanName = newClassName.trim().toUpperCase();

    // Check duplicate class name
    if (classes.some(c => c.name === cleanName)) {
      showToast(`Kelas "${cleanName}" sudah terdaftar!`, "error");
      return;
    }

    const newClass: ClassItem = {
      id: `${selectedMajor}-${Date.now()}`,
      name: cleanName,
      majorCode: selectedMajor,
      maxCapacity: Number(newClassCapacity) || 100
    };

    const updated = [...classes, newClass];
    saveClassesToStorage(updated);
    
    setNewClassName("");
    setIsAddingClass(false);
    showToast(`Kelas ${cleanName} berhasil dibuat!`);
  };

  const handleDeleteClass = (id: string, name: string) => {
    const count = classEnrollments[name] || 0;
    if (count > 0) {
      showToast(`Gagal menghapus: Masih ada ${count} siswa terdaftar di dalam kelas ${name}.`, "error");
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus kelas ${name}?`)) {
      const updated = classes.filter(c => c.id !== id);
      saveClassesToStorage(updated);
      showToast(`Kelas ${name} berhasil dihapus.`);
    }
  };

  // Remove individual student from class detail modal
  const handleRemoveStudentFromClassDetail = async (studentId: number, studentNama: string) => {
    if (confirm(`Keluarkan ${studentNama} dari kelas ${selectedClassDetail?.name}?`)) {
      const result = await updateApplicant(studentId, {
        diterima_kelas: null,
        diterima_tanggal: null
      });

      if (result?.success) {
        showToast(`${studentNama} berhasil dikeluarkan dari kelas.`);
      } else {
        showToast("Gagal mengeluarkan siswa.", "error");
      }
    }
  };

  // Export Class Roster Excel (ExcelJS)
  const handleExportClassCSV = async (className: string) => {
    const classStudents = applicants.filter((a: Applicant) => {
      const cls = a.diterima_kelas || a.diterimaKelas;
      return cls === className;
    });

    if (classStudents.length === 0) {
      showToast("Kelas kosong, tidak ada data untuk diekspor.", "error");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Roster_${className}`);

    worksheet.columns = [
      { header: 'No.', key: 'no', width: 10 },
      { header: 'Nama Siswa', key: 'nama', width: 35 },
      { header: 'NISN', key: 'nisn', width: 25 },
      { header: 'Asal Sekolah', key: 'sekolah', width: 35 },
      { header: 'No. WhatsApp', key: 'whatsapp', width: 25 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Tanggal Diterima', key: 'tanggal', width: 25 }
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.height = 35;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FF000000' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF9BC2E6' } // Light Blue
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    classStudents.forEach((s: Applicant, index: number) => {
      worksheet.addRow({
        no: index + 1,
        nama: s.nama || "",
        nisn: s.nisn || "",
        sekolah: s.sekolah_asal || s.sekolahAsal || "",
        whatsapp: s.whatsapp || "",
        email: s.email || "",
        tanggal: s.diterima_tanggal || s.diterimaTanggal || ""
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.height = 25;
      }
      row.eachCell((cell, colNumber) => {
        if (rowNumber > 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' }
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          if ([1, 3, 5, 7].includes(colNumber)) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
            cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
          }
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Roster_Kelas_${className.replace(/\s+/g, "_")}_${Date.now()}.xlsx`);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500 relative">
      
      {/* Toast Notification Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.2)] border text-xs font-bold animate-in slide-in-from-bottom duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-300 border-emerald-250 dark:border-emerald-900" 
            : toast.type === "error"
            ? "bg-rose-50 dark:bg-rose-950/90 text-rose-600 dark:text-rose-300 border-rose-250 dark:border-rose-900"
            : "bg-indigo-50 dark:bg-indigo-950/90 text-indigo-600 dark:text-indigo-300 border-indigo-250 dark:border-indigo-900"
        }`}>
          {toast.type === "success" ? <Check size={16} /> : toast.type === "error" ? <ShieldAlert size={16} /> : <Sparkles size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm w-full mx-4">
            <svg className="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Memproses Kelas...</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Mengupdate Data Calon Siswa ({loadingProgress}%)</p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Header Info & Metrics Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        
        {/* Info Box */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-colors duration-300">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100 dark:border-indigo-900/40 shrink-0 shadow-sm">
            <GraduationCap size={22} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase text-slate-800 dark:text-white tracking-wider">Manajemen Pembagian Rombel Kelas</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-0.5">SMK Taruna Bhakti · PPDB Portal Kelas</p>
          </div>
        </div>

        {/* Metric 1: Total Classes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-colors duration-300 text-left">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Rombel Terbentuk (X {selectedMajor})</span>
          <span className="text-2xl font-black text-slate-800 dark:text-white mt-1">{classesOfSelectedMajor.length} <span className="text-xs text-slate-450 font-bold">Kelas</span></span>
        </div>

        {/* Metric 2: Filled Classes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-colors duration-300 text-left">
          <span className="text-[9px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-widest">Jumlah Kelas Terisi Siswa</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{totalClassesFilled} <span className="text-xs text-slate-450 font-bold">Terisi</span></span>
        </div>

      </div>

      {/* Selected Major Selector Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 border-b border-slate-200/80 dark:border-slate-800/40 pb-6">
        {activeMajors.map((m) => (
          <button
            key={m.code}
            onClick={() => {
              setSelectedMajor(m.code);
              setSelectedStudentIds([]);
              setAssignmentFilter("ALL");
            }}
            className={`flex flex-col items-center justify-center text-center p-6 rounded-3xl transition-all border duration-300 hover:scale-[1.03] group ${
              selectedMajor === m.code
                ? "bg-blue-500 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white border-slate-200 hover:border-blue-500/40 hover:bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white shadow-sm"
            }`}
          >
            {getMajorLogo(m.code, "w-12 h-12 shadow-md")}
            <span className={`mt-3 text-[9px] font-black uppercase tracking-widest leading-normal ${
              selectedMajor === m.code ? "text-white" : "text-slate-700 dark:text-slate-350"
            }`}>
              {m.name}
            </span>
            <span className={`text-[8px] font-bold uppercase tracking-wider mt-1 ${
              selectedMajor === m.code ? "text-blue-100" : "text-slate-400"
            }`}>
              ({m.code})
            </span>
          </button>
        ))}
      </div>

      {/* Classes capacity indicators and list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-slate-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Daftar Kelas Aktif (Jurusan {selectedMajor})</h3>
          </div>

          <button
            onClick={() => setIsAddingClass(!isAddingClass)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/30 border border-slate-250 dark:border-white/5 text-[10px] uppercase font-bold text-slate-655 dark:text-slate-350 dark:hover:text-white transition-all shadow-sm"
          >
            {isAddingClass ? <X size={12} /> : <Plus size={12} />}
            <span>{isAddingClass ? "Tutup Form" : "Buat Kelas Baru"}</span>
          </button>
        </div>

        {/* Create Class Inline Form */}
        {isAddingClass && (
          <form onSubmit={handleCreateClass} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 mb-6 flex flex-wrap gap-4 items-end animate-in zoom-in-95 duration-200">
            <div className="space-y-1.5 shrink-0 w-full sm:w-auto sm:flex-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Rombel / Kelas Baru</label>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder={`Contoh: X ${selectedMajor} 3`}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm w-full sm:w-auto"
            >
              Simpan Rombel
            </button>
          </form>
        )}

        {/* Classes Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {classesOfSelectedMajor.map((c) => {
            const count = classEnrollments[c.name] || 0;
            
            return (
              <div 
                key={c.id}
                onClick={() => setSelectedClassDetail(c)}
                onDragOver={(e) => handleDragOver(e, c.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, c.name)}
                className={`p-5 border rounded-3xl flex flex-col justify-between hover:shadow-md cursor-pointer transition-all relative group overflow-hidden ${
                  activeDropClass === c.id
                    ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 ring-2 ring-blue-500 scale-[1.02] shadow-lg shadow-blue-500/10"
                    : "bg-slate-50 dark:bg-slate-950/40 border-slate-200/60 dark:border-white/5 hover:border-blue-500/40"
                }`}
              >
                {/* Decorative border line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div>
                    <h4 className="font-extrabold text-slate-850 dark:text-white text-sm group-hover:text-blue-500 transition-colors">{c.name}</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Terdaftar: {count} Siswa</span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedClassDetail(c)}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg transition-all"
                      title="Lihat Detail Roster"
                    >
                      <Eye size={13} />
                    </button>
                    {count === 0 && (
                      <button
                        onClick={() => handleDeleteClass(c.id, c.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Hapus Kelas Kosong"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-blue-500">
                  <span>Lihat Roster</span>
                  <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

          {classesOfSelectedMajor.length === 0 && (
            <div className="sm:col-span-2 md:col-span-3 xl:col-span-4 text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Belum ada rombel kelas yang terdaftar untuk jurusan {selectedMajor}. Klik "+ Buat Kelas Baru" untuk mendaftar.
            </div>
          )}
        </div>
      </div>

      {/* Main Student Directory Grid & Checklist Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300 space-y-6">
        
        {/* Filtering Toolbar */}
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between border-b border-slate-100 dark:border-white/5 pb-5">
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search size={13} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama / NISN..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            {/* Assignment Status Filter */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-500">
              <Filter size={11} />
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider font-extrabold text-[9px]"
              >
                <option value="ALL">Semua Calon Kelas</option>
                <option value="UNASSIGNED">Belum Dapat Kelas</option>
                <option value="ASSIGNED">Sudah Ada Kelas</option>
              </select>
            </div>
          </div>

        </div>

        {/* Student Table Checklist */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-slate-655 dark:text-slate-350">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/15">
                <th className="py-3.5 px-4 text-center w-12 pl-6">
                  <button 
                    onClick={handleSelectAll}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-all text-slate-500 flex items-center justify-center"
                    title={selectedStudentIds.length === filteredStudents.length ? "Clear Selection" : "Select All"}
                  >
                    {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                      <CheckSquare size={14} className="text-blue-500" />
                    ) : (
                      <MinusSquare size={14} />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Nama Lengkap Siswa</th>
                <th className="py-3.5 px-4 text-center">NISN</th>
                <th className="py-3.5 px-4">Asal Sekolah SMP</th>
                <th className="py-3.5 px-4 text-center">Pilihan Keahlian</th>
                <th className="py-3.5 px-4 text-center">Rombel Sekarang</th>
                <th className="py-3.5 px-4 text-right pr-6">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                const assignedClass = student.diterima_kelas || student.diterimaKelas;

                return (
                  <tr
                    key={student.id}
                    onClick={() => handleSelectStudent(student.id)}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, student.id)}
                    className={`hover:bg-slate-50/70 dark:hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing select-none ${
                      isSelected ? "bg-blue-500/10 dark:bg-blue-500/15 border-l-2 border-blue-500" : ""
                    }`}
                  >
                    <td className="py-3 px-4 pl-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded border-slate-350 dark:border-white/10 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-850 dark:text-white text-sm">{student.nama}</div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                        Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tgl_lahir || student.tglLahir || "-"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {student.nisn}
                    </td>

                    <td className="py-3 px-4 text-slate-550 dark:text-slate-450 font-semibold uppercase">
                      {student.sekolah_asal || student.sekolahAsal}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 text-[9px] uppercase tracking-wide">
                        {student.jurusan_1 || student.jurusan1}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {assignedClass ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                          {assignedClass}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 text-slate-450 dark:text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                          Belum Diatur
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      {assignedClass ? (
                        <button
                          onClick={() => {
                            if (confirm(`Keluarkan ${student.nama} dari kelas ${assignedClass}?`)) {
                              setSelectedStudentIds([student.id]);
                              handleAssignSelectedToClass("");
                            }
                          }}
                          className="px-2.5 py-1 text-[9px] uppercase font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-500/20 transition-all shadow-sm"
                        >
                          Keluarkan
                        </button>
                      ) : (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              setSelectedStudentIds([student.id]);
                              handleAssignSelectedToClass(e.target.value);
                            }
                          }}
                          className="px-2 py-1 text-[9px] uppercase font-black bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/40 dark:text-white border border-slate-250 dark:border-white/5 rounded-lg focus:outline-none cursor-pointer"
                          defaultValue=""
                        >
                          <option value="" disabled>Pilih Kelas</option>
                          {classesOfSelectedMajor.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                    Tidak ditemukan data siswa aktif untuk kriteria filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Class Detail Modal Overlay */}
      {selectedClassDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-colors duration-300">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/15">
              <div>
                <h3 className="text-base font-black text-slate-850 dark:text-white flex items-center gap-3 uppercase tracking-wide">
                  <span>Roster Kelas: {selectedClassDetail.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    {enrolledStudentsInDetail.length} Siswa Terdaftar
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">Daftar nama siswa resmi yang telah dimasukkan ke kelas ini</p>
              </div>
              <button
                onClick={() => { setSelectedClassDetail(null); setClassSearchTerm(""); }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white flex items-center justify-center transition-all font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Actions & Filter */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-slate-950/5 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
              <div className="relative w-full sm:max-w-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search size={13} />
                </span>
                <input
                  type="text"
                  value={classSearchTerm}
                  onChange={(e) => setClassSearchTerm(e.target.value)}
                  placeholder="Cari siswa di kelas..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <button
                onClick={() => handleExportClassCSV(selectedClassDetail.name)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-900/40 hover:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Download size={14} />
                <span>Cetak Roster (XLS)</span>
              </button>
            </div>

            {/* Modal Student Table */}
            <div className="flex-1 overflow-y-auto p-6 max-h-[45vh]">
              <table className="w-full text-left text-xs font-bold text-slate-655 dark:text-slate-350">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-widest">
                    <th className="py-2.5 px-3 text-left w-12">No</th>
                    <th className="py-2.5 px-4">Nama Lengkap</th>
                    <th className="py-2.5 px-4 text-center">NISN</th>
                    <th className="py-2.5 px-4">Asal Sekolah</th>
                    <th className="py-2.5 px-3 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {enrolledStudentsInDetail.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                      <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">{student.nama}</div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                          Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tgl_lahir || student.tglLahir || "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[11px]">{student.nisn}</td>
                      <td className="py-3 px-4 uppercase">{student.sekolah_asal || student.sekolahAsal || "-"}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleRemoveStudentFromClassDetail(student.id, student.nama)}
                          className="px-2.5 py-1 text-[9px] uppercase font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-500/20 transition-all"
                        >
                          Keluarkan
                        </button>
                      </td>
                    </tr>
                  ))}

                  {enrolledStudentsInDetail.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        Tidak ada data siswa yang cocok di kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/40 dark:bg-slate-950/15 flex justify-end shrink-0">
              <button
                onClick={() => { setSelectedClassDetail(null); setClassSearchTerm(""); }}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-350 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
              >
                Tutup Jendela
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Sticky Mass Action Floating Bar (shown only when 1 or more students are checked) */}
      {selectedStudentIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-slate-800 text-white rounded-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] w-full max-w-3xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">
              {selectedStudentIds.length}
            </span>
            <div className="text-left">
              <h5 className="text-[11px] font-black uppercase tracking-wider">Siswa Terpilih</h5>
              <p className="text-[9px] text-slate-400 font-semibold leading-none mt-0.5">Tentukan kelas secara massal untuk pendaftar aktif.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Tentukan Kelas:</span>
            {classesOfSelectedMajor.map((c) => (
              <button
                key={c.id}
                onClick={() => handleAssignSelectedToClass(c.name)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border border-blue-500 shadow-sm"
              >
                {c.name}
              </button>
            ))}
            <button
              onClick={() => handleAssignSelectedToClass("")}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
              title="Keluarkan Siswa dari Kelas"
            >
              Keluarkan
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
