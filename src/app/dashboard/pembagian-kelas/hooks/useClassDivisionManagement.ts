"use client";

import { useState, useEffect, useMemo } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { generateNipdMap } from "@/utils/nipd";
import Swal from "sweetalert2";
import {
  Applicant,
  ClassItem,
} from "../types";
import { exportClassCSV, exportAllClasses, exportAllMajors } from "../components/classExcelExport";
import {
  majors,
  generateDefaultClasses,
  getClassGrade,
  getStudentGrade,
  getStudentCurrentClass,
  isApplicantMajorMatch,
} from "./classDivisionHelpers";
import { createClassDivisionActions } from "./classDivisionActions";

export function useClassDivisionManagement() {
  const { applicants, activeStudents, updateActiveStudent, fetchActiveStudents, fetchAdminApplicants } = usePPDB();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof fetchActiveStudents === "function") {
      fetchActiveStudents();
    }
    if (typeof fetchAdminApplicants === "function") {
      fetchAdminApplicants();
    }
  }, [fetchActiveStudents, fetchAdminApplicants]);

  const [selectedMajor, setSelectedMajor] = useState<string>("RPL");
  const [selectedGrade, setSelectedGrade] = useState<10 | 11 | 12>(10);
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<"ALL" | "UNASSIGNED" | "ASSIGNED">("ALL");
  const [genderFilter, setGenderFilter] = useState<"ALL" | "L" | "P">("ALL");

  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [targetClass, setTargetClass] = useState<string>("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/config");
        const json = await res.json();
        if (json.success && json.data && json.data.ppdb_school_period) {
          setSchoolPeriod(json.data.ppdb_school_period);
        }
      } catch (e) {
        console.error("Gagal mengambil periode akademik:", e);
      }
    };
    fetchConfig();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCapacity, setNewClassCapacity] = useState(40);
  const [isAddingClass, setIsAddingClass] = useState(false);

  const [selectedClassDetail, setSelectedClassDetail] = useState<ClassItem | null>(null);
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const [activeDropClass, setActiveDropClass] = useState<string | null>(null);

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

  useEffect(() => {
    if (activeMajors.length > 0) {
      setSelectedMajor(activeMajors[0].code);
    }
  }, [activeMajors]);

  useEffect(() => {
    setMounted(true);
    const fetchClassesConfig = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/config");
        const json = await res.json();
        if (json.success && json.data && json.data.ppdb_classes_config) {
          setClasses(json.data.ppdb_classes_config);
          localStorage.setItem("ppdb_classes_config", JSON.stringify(json.data.ppdb_classes_config));
          return;
        }
      } catch (e) {
        console.error("Gagal mengambil konfigurasi kelas dari API:", e);
      }

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
    };
    fetchClassesConfig();
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const approvedApplicantsOfMajor = useMemo(() => {
    return applicants.filter((a: Applicant) => isApplicantMajorMatch(a, selectedMajor));
  }, [applicants, selectedMajor]);

  const filteredStudents = useMemo(() => {
    return approvedApplicantsOfMajor.filter((a: Applicant) => {
      const grade = getStudentGrade(a, schoolPeriod);
      if (grade !== selectedGrade) return false;

      const nameMatch = (a.nama || "").toLowerCase().includes(searchTerm.toLowerCase());
      const nisnMatch = (a.nisn || "").includes(searchTerm);
      const searchMatch = nameMatch || nisnMatch;

      const currentClass = getStudentCurrentClass(a);

      if (genderFilter !== "ALL") {
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (genderFilter === "L" && !jk.startsWith("l")) return false;
        if (genderFilter === "P" && !jk.startsWith("p")) return false;
      }

      if (assignmentFilter === "UNASSIGNED") {
        return searchMatch && !currentClass;
      }
      if (assignmentFilter === "ASSIGNED") {
        return searchMatch && !!currentClass;
      }
      return searchMatch;
    });
  }, [approvedApplicantsOfMajor, searchTerm, assignmentFilter, genderFilter, selectedGrade, schoolPeriod]);

  const classesOfSelectedMajor = useMemo(() => {
    return classes.filter(c => c.majorCode === selectedMajor && getClassGrade(c.name) === selectedGrade);
  }, [classes, selectedMajor, selectedGrade]);

  const classEnrollments = useMemo(() => {
    const enrollmentCounts: Record<string, { total: number, L: number, P: number }> = {};

    classesOfSelectedMajor.forEach(c => {
      enrollmentCounts[c.name] = { total: 0, L: 0, P: 0 };
    });

    applicants.forEach((a: Applicant) => {
      if (a.status === 'Rejected') return;
      const cls = getStudentCurrentClass(a);
      if (cls && enrollmentCounts[cls] !== undefined) {
        enrollmentCounts[cls].total++;
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (jk.startsWith("l")) enrollmentCounts[cls].L++;
        else if (jk.startsWith("p")) enrollmentCounts[cls].P++;
      }
    });

    return enrollmentCounts;
  }, [applicants, classesOfSelectedMajor]);

  const nipdMap = useMemo(() => generateNipdMap(applicants), [applicants]);

  const totalClassesFilled = useMemo(() => {
    return classesOfSelectedMajor.filter(c => (classEnrollments[c.name]?.total || 0) > 0).length;
  }, [classesOfSelectedMajor, classEnrollments]);

  const enrolledStudentsInDetail = useMemo(() => {
    if (!selectedClassDetail) return [];
    const filtered = applicants.filter((a: Applicant) => {
      if (a.status === 'Rejected') return false;
      const cls = getStudentCurrentClass(a);
      const isClassMatch = cls === selectedClassDetail.name;
      if (!isClassMatch) return false;

      const matchesSearch = (a.nama || "").toLowerCase().includes(classSearchTerm.toLowerCase()) || 
                            (a.nisn || "").includes(classSearchTerm);
      return matchesSearch;
    });

    return filtered.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));
  }, [applicants, selectedClassDetail, classSearchTerm]);

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

  const {
    handleAssignSelectedToClass,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCreateClass,
    handleDeleteClass,
  } = createClassDivisionActions({
    selectedStudentIds,
    setSelectedStudentIds,
    setIsLoading,
    setLoadingProgress,
    showToast,
    updateActiveStudent,
    fetchActiveStudents,
    setActiveDropClass,
    selectedMajor,
    selectedGrade,
    newClassName,
    setNewClassName,
    newClassCapacity,
    setIsAddingClass,
    classes,
    setClasses,
    classEnrollments,
  });

  const handleRemoveStudentFromClassDetail = async (studentId: number, studentNama: string) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: `Keluarkan ${studentNama} dari kelas ${selectedClassDetail?.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    });
    if (result.isConfirmed) {
      const result = await updateActiveStudent(studentId, {
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

  const handleExportClassCSV = async (className: string) => {
    await exportClassCSV({
      className,
      applicants,
      nipdMap,
      getStudentCurrentClass,
      showToast
    });
  };

  const handleExportAllClasses = async () => {
    await exportAllClasses({
      classesToExport: classesOfSelectedMajor,
      applicants,
      selectedMajor,
      schoolPeriod,
      activeMajors,
      nipdMap,
      getStudentCurrentClass,
      showToast
    });
  };

  const handleExportAllMajors = async () => {
    await exportAllMajors({
      classes,
      applicants,
      activeMajors,
      schoolPeriod,
      nipdMap,
      getStudentCurrentClass,
      showToast
    });
  };

  return {
    mounted,
    toast,
    isLoading,
    loadingProgress,
    selectedMajor,
    setSelectedMajor,
    selectedGrade,
    setSelectedGrade,
    schoolPeriod,
    searchTerm,
    setSearchTerm,
    assignmentFilter,
    setAssignmentFilter,
    genderFilter,
    setGenderFilter,
    selectedStudentIds,
    setSelectedStudentIds,
    targetClass,
    setTargetClass,
    classes,
    newClassName,
    setNewClassName,
    newClassCapacity,
    setNewClassCapacity,
    isAddingClass,
    setIsAddingClass,
    selectedClassDetail,
    setSelectedClassDetail,
    classSearchTerm,
    setClassSearchTerm,
    activeDropClass,
    activeMajors,
    classesOfSelectedMajor,
    classEnrollments,
    nipdMap,
    totalClassesFilled,
    enrolledStudentsInDetail,
    filteredStudents,
    handleSelectAll,
    handleSelectStudent,
    handleAssignSelectedToClass,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCreateClass,
    handleDeleteClass,
    handleRemoveStudentFromClassDetail,
    handleExportClassCSV,
    handleExportAllClasses,
    handleExportAllMajors,
    getStudentCurrentClass,
  };
}
