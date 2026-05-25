"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePPDB } from "@/context/PPDBContext";
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
  ChevronRight
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
}

interface ClassItem {
  id: string;
  name: string;
  majorCode: string;
  maxCapacity: number;
}

export default function ClassDivisionManagement() {
  const { applicants, updateApplicant } = usePPDB();
  const [mounted, setMounted] = useState(false);

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
        maxCapacity: 40
      });
      defaultList.push({
        id: `${m.code}-2`,
        name: `X ${m.code} 2`,
        majorCode: m.code,
        maxCapacity: 40
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

      // Match major code
      const maj1 = (a.jurusan_1 || a.jurusan1 || "").toUpperCase();
      
      // Look up major name mapping or check exact code matching
      // e.g. RPL -> matches Rekayasa Perangkat Lunak
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
    
    if (successCount === total) {
      showToast(`Sukses memindahkan ${successCount} siswa ke kelas ${className || "Belum Ditentukan"}!`);
    } else {
      showToast(`Berhasil memindahkan ${successCount} dari ${total} siswa ke kelas ${className || "Belum Ditentukan"}.`, "info");
    }
  };

  // Smart Engine: Auto distribute unassigned students across major classes
  const handleAutoDistribute = async () => {
    const unassigned = approvedApplicantsOfMajor.filter((a: Applicant) => !(a.diterima_kelas || a.diterimaKelas));
    
    if (unassigned.length === 0) {
      showToast("Semua siswa aktif di jurusan ini sudah terbagi ke dalam kelas!", "info");
      return;
    }

    if (classesOfSelectedMajor.length === 0) {
      showToast("Gagal: Belum ada kelas yang terdaftar untuk jurusan ini. Buat kelas terlebih dahulu!", "error");
      return;
    }

    const message = `Sistem akan membagi ${unassigned.length} siswa secara merata ke dalam ${classesOfSelectedMajor.length} kelas aktif (${classesOfSelectedMajor.map(c=>c.name).join(", ")}). Batas maksimal per kelas diatur otomatis. Lanjutkan?`;
    
    if (!confirm(message)) return;

    setIsLoading(true);
    setLoadingProgress(0);

    const totalStudents = unassigned.length;
    let distributedCount = 0;

    // Distribute evenly
    // For each student, assign them to the class that currently has the lowest enrollment relative to its max limit
    // We update local tracker dynamically during loop
    const tempEnrollments = { ...classEnrollments };

    for (let i = 0; i < totalStudents; i++) {
      const student = unassigned[i];
      
      // Find class of selected major with lowest current enrollment and below capacity
      let bestClass: ClassItem | null = null;
      let lowestCount = Infinity;

      classesOfSelectedMajor.forEach(c => {
        const count = tempEnrollments[c.name] || 0;
        if (count < c.maxCapacity && count < lowestCount) {
          lowestCount = count;
          bestClass = c;
        }
      });

      if (!bestClass) {
        // Classes are full!
        break;
      }

      // Record locally
      tempEnrollments[(bestClass as ClassItem).name]++;

      const payload = {
        diterima_kelas: (bestClass as ClassItem).name,
        diterima_tanggal: new Date().toISOString().split("T")[0]
      };

      const result = await updateApplicant(student.id, payload);
      if (result?.success) {
        distributedCount++;
      }

      setLoadingProgress(Math.round(((i + 1) / totalStudents) * 100));
    }

    setIsLoading(false);
    
    if (distributedCount === totalStudents) {
      showToast(`Sukses! Pembagian kelas otomatis berhasil mendistribusikan ${distributedCount} siswa secara merata.`);
    } else if (distributedCount > 0) {
      showToast(`Pembagian kelas otomatis berhasil mendistribusikan ${distributedCount} dari ${totalStudents} siswa. Sisa siswa tidak termuat karena kapasitas kelas penuh.`, "info");
    } else {
      showToast("Kapasitas seluruh kelas sudah penuh! Harap tambahkan kelas baru atau naikkan batas kapasitas.", "error");
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
      maxCapacity: Number(newClassCapacity) || 40
    };

    const updated = [...classes, newClass];
    saveClassesToStorage(updated);
    
    setNewClassName("");
    setIsAddingClass(false);
    showToast(`Kelas ${cleanName} berhasil dibuat!`);
  };

  const handleDeleteClass = (id: string, name: string) => {
    // Check if class has students enrolled
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

      {/* Header Info Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100 dark:border-indigo-900/40 shrink-0 shadow-sm">
            <GraduationCap size={22} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase text-slate-800 dark:text-white tracking-wider">Manajemen Pembagian Rombel Kelas</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-0.5">SMK Taruna Bhakti · PPDB Portal Kelas</p>
          </div>
        </div>

        {/* Selected Major Selector Badges */}
        <div className="flex flex-wrap gap-1.5 justify-center md:justify-end">
          {activeMajors.map((m) => (
            <button
              key={m.code}
              onClick={() => {
                setSelectedMajor(m.code);
                setSelectedStudentIds([]);
                setAssignmentFilter("ALL");
              }}
              className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                selectedMajor === m.code
                  ? "bg-blue-500 border-blue-600 text-white shadow-sm shadow-blue-500/10"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-950/30 dark:border-white/5 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {m.code}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Capacity Indicators Grid Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-slate-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Rombongan Belajar Aktif: Kelas X {selectedMajor}</h3>
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
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Kelas Baru</label>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder={`Misal: X ${selectedMajor} 3`}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>

            <div className="space-y-1.5 shrink-0 w-full sm:w-32">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Max Kapasitas</label>
              <input
                type="number"
                value={newClassCapacity}
                onChange={(e) => setNewClassCapacity(Number(e.target.value))}
                min={1}
                max={100}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500"
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
            const percentage = Math.min((count / c.maxCapacity) * 100, 100);
            
            // color mapping
            const colorClass = percentage >= 100 
              ? "bg-rose-500" 
              : percentage >= 85 
              ? "bg-amber-500" 
              : "bg-blue-500";
            
            const borderAccent = percentage >= 100 
              ? "border-rose-500/20 shadow-rose-500/5 dark:bg-rose-950/5" 
              : percentage >= 85 
              ? "border-amber-500/20 shadow-amber-500/5 dark:bg-amber-950/5" 
              : "border-slate-200/60 dark:border-white/5";

            return (
              <div 
                key={c.id}
                className={`bg-slate-50 dark:bg-slate-950/40 p-4 border rounded-2xl flex flex-col justify-between transition-all ${borderAccent}`}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <h4 className="font-extrabold text-slate-850 dark:text-white text-xs">{c.name}</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Kapasitas: {c.maxCapacity}</span>
                  </div>

                  {count === 0 && (
                    <button
                      onClick={() => handleDeleteClass(c.id, c.name)}
                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      title="Hapus Kelas Kosong"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 mt-2">
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                    <span className="uppercase">Keterisian</span>
                    <span className={percentage >= 100 ? "text-rose-500" : percentage >= 85 ? "text-amber-500" : "text-blue-500"}>
                      {count} / {c.maxCapacity} Siswa ({Math.round(percentage)}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}

          {classesOfSelectedMajor.length === 0 && (
            <div className="sm:col-span-2 md:col-span-3 xl:col-span-4 text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Tidak ada kelas terdaftar untuk jurusan {selectedMajor}. Silakan buat kelas baru.
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
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 font-semibold"
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
                <option value="ALL">Semua Kelas</option>
                <option value="UNASSIGNED">Belum Dapat Kelas</option>
                <option value="ASSIGNED">Sudah Ada Kelas</option>
              </select>
            </div>
          </div>

          {/* Dynamic Auto-Distribute Panel */}
          <button
            onClick={handleAutoDistribute}
            className="w-full xl:w-auto px-4 py-2.5 bg-gradient-to-tr from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/10"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>Pembagian Kelas Otomatis</span>
          </button>
        </div>

        {/* Student Table Checklist */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-slate-650 dark:text-slate-350">
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
                <th className="py-3.5 px-4">Nama Pendaftar</th>
                <th className="py-3.5 px-4 text-center">NISN</th>
                <th className="py-3.5 px-4">Asal Sekolah</th>
                <th className="py-3.5 px-4 text-center">Rekomendasi Jurusan</th>
                <th className="py-3.5 px-4 text-center">Status Rombel</th>
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
                    className={`hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all cursor-pointer ${
                      isSelected ? "bg-blue-500/5 dark:bg-blue-500/10" : ""
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
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Status: Terverifikasi</span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {student.nisn}
                    </td>

                    <td className="py-3 px-4 text-slate-550 dark:text-slate-400 font-semibold">
                      {student.sekolah_asal || student.sekolahAsal}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 text-[9px] uppercase tracking-wide">
                        {student.jurusan_1 || student.jurusan1}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {assignedClass ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">
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
                          <option value="" disabled>Pilih Rombel</option>
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

      {/* Sticky Mass Action Floating Bar (shown only when 1 or more students are checked) */}
      {selectedStudentIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-slate-800 text-white rounded-2xl px-6 py-4 flex items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] w-full max-w-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">
              {selectedStudentIds.length}
            </span>
            <div className="text-left">
              <h5 className="text-[11px] font-black uppercase tracking-wider">Siswa Terpilih</h5>
              <p className="text-[9px] text-slate-400 font-semibold leading-none mt-0.5">Terapkan tindakan massal untuk pendaftar aktif.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Class Dropdown */}
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none cursor-pointer font-bold uppercase"
            >
              <option value="" disabled>-- Pilih Rombel --</option>
              <option value="UNASSIGN">-- Hapus Dari Kelas --</option>
              {classesOfSelectedMajor.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <button
              onClick={() => {
                if (targetClass === "UNASSIGN") {
                  handleAssignSelectedToClass("");
                } else if (targetClass) {
                  handleAssignSelectedToClass(targetClass);
                } else {
                  showToast("Silakan pilih kelas terlebih dahulu!", "error");
                }
              }}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <span>Terapkan</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
