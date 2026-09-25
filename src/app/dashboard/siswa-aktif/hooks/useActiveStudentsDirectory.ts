"use client";

import { useState, useMemo, useEffect } from "react";
import { generateNipdMap } from "@/utils/nipd";
import { Applicant } from "../components/types";

interface UseActiveStudentsDirectoryProps {
  activeStudents: Applicant[];
  addToast: (title: string, message: string, type?: "success" | "error" | "info" | "warning") => void;
  fetchActiveStudents: () => Promise<any>;
  updateActiveStudent: (id: number, data: any) => Promise<any>;
}

export function useActiveStudentsDirectory({
  activeStudents,
  addToast,
  fetchActiveStudents,
  updateActiveStudent,
}: UseActiveStudentsDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [genderFilter, setGenderFilter] = useState<string>("ALL");
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({});

  const [customPeriods, setCustomPeriods] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb_custom_periods");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState(false);
  const [newPeriodValue, setNewPeriodValue] = useState("");

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
    const statsRecord: Record<string, { L: number; P: number; total: number }> = {};
    activeApplicants.forEach((a: Applicant) => {
      const k = a.diterima_kelas || a.diterimaKelas;
      if (k) {
        if (!statsRecord[k]) statsRecord[k] = { L: 0, P: 0, total: 0 };
        statsRecord[k].total += 1;
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (jk.startsWith("l")) statsRecord[k].L += 1;
        else if (jk.startsWith("p")) statsRecord[k].P += 1;
      }
    });
    return statsRecord;
  }, [activeApplicants]);

  const uniqueClasses = useMemo(() => {
    return Object.keys(classStats).sort();
  }, [classStats]);

  const groupedByPeriod = useMemo(() => {
    const groups: Record<string, Applicant[]> = {};

    customPeriods.forEach((p) => {
      groups[p] = [];
    });

    filteredApplicants.forEach((a: Applicant) => {
      const period = a.periode || "2026-2027";
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(a);
    });

    Object.keys(groups).forEach((p) => {
      groups[p].sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));
    });

    return groups;
  }, [customPeriods, filteredApplicants]);

  const sortedPeriods = useMemo(() => {
    return Object.keys(groupedByPeriod).sort((a, b) => b.localeCompare(a));
  }, [groupedByPeriod]);

  useEffect(() => {
    if (sortedPeriods.length > 0) {
      setExpandedPeriods((prev) => {
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
    setExpandedPeriods((prev) => ({
      ...prev,
      [period]: !prev[period]
    }));
  };

  const getNextPeriod = () => {
    const allPeriods = [...Object.keys(groupedByPeriod), ...customPeriods];
    if (allPeriods.length === 0) {
      const y = new Date().getFullYear();
      return `${y}-${y + 1}`;
    }

    const maxStartYear = Math.max(...allPeriods.map((p) => parseInt(p.split("-")[0]) || 0));
    return `${maxStartYear + 1}-${maxStartYear + 2}`;
  };

  const stats = useMemo(() => {
    const total = activeApplicants.length;
    const currentBatch = activeApplicants.filter((a) => (a.periode || "2026-2027") === "2026-2027").length;

    const majors: Record<string, number> = {};
    activeApplicants.forEach((a) => {
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
        headers: { Authorization: `Bearer ${token}` }
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

      const sanitizedForm: any = {};
      for (const key in editForm) {
        if ((editForm as any)[key] !== null) {
          sanitizedForm[key] = (editForm as any)[key];
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
    if (
      !confirm(
        `Apakah Anda yakin ingin membatalkan verifikasi untuk "${nama}"? Siswa ini akan dikembalikan ke daftar pendaftar dengan status Pending.`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`http://localhost:5000/api/siswa-aktif/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        addToast("Berhasil", `${nama} berhasil dikembalikan ke pendaftar.`, "success");
        if (typeof fetchActiveStudents === "function") fetchActiveStudents();
      } else {
        addToast("Gagal", data.message || "Terjadi kesalahan.", "error");
      }
    } catch (err) {
      addToast("Error", "Gagal terhubung ke server", "error");
    }
  };

  const handleAddPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriodValue.trim()) return;

    const periodPattern = /^\d{4}-\d{4}$/;
    if (!periodPattern.test(newPeriodValue.trim())) {
      alert("Format periode harus YYYY-YYYY (Contoh: 2027-2028)");
      return;
    }

    if (customPeriods.includes(newPeriodValue.trim())) {
      alert("Periode ini sudah ada!");
      return;
    }

    const updated = [...customPeriods, newPeriodValue.trim()];
    setCustomPeriods(updated);
    localStorage.setItem("ppdb_custom_periods", JSON.stringify(updated));
    setNewPeriodValue("");
    setIsAddPeriodModalOpen(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    majorFilter,
    setMajorFilter,
    classFilter,
    setClassFilter,
    genderFilter,
    setGenderFilter,
    expandedPeriods,
    togglePeriod,
    filteredApplicants,
    customPeriods,
    setCustomPeriods,
    isAddPeriodModalOpen,
    setIsAddPeriodModalOpen,
    newPeriodValue,
    setNewPeriodValue,
    getNextPeriod,
    handleAddPeriod,
    nipdMap,
    classStats,
    uniqueClasses,
    groupedByPeriod,
    sortedPeriods,
    stats,
    selectedApplicant,
    setSelectedApplicant,
    editApplicant,
    setEditApplicant,
    editForm,
    setEditForm,
    isSaving,
    handleViewDetail,
    handleSaveEdit,
    handleBatalVerifikasi,
  };
}
