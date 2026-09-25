import Swal from "sweetalert2";
import { ClassItem } from "../types";
import { initiateStudentDrag, saveClassesConfig } from "./classDivisionHelpers";

interface ClassActionsProps {
  selectedStudentIds: number[];
  setSelectedStudentIds: React.Dispatch<React.SetStateAction<number[]>>;
  setIsLoading: (val: boolean) => void;
  setLoadingProgress: (val: number) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
  updateActiveStudent: (id: number, data: any) => Promise<any>;
  fetchActiveStudents: () => Promise<any>;
  setActiveDropClass: (val: string | null) => void;
  selectedMajor: string;
  selectedGrade: 10 | 11 | 12;
  newClassName: string;
  setNewClassName: (val: string) => void;
  newClassCapacity: number;
  setIsAddingClass: (val: boolean) => void;
  classes: ClassItem[];
  setClasses: (val: ClassItem[]) => void;
  classEnrollments: Record<string, { total: number; L: number; P: number }>;
}

export function createClassDivisionActions({
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
}: ClassActionsProps) {
  const handleAssignSelectedToClass = async (className: string) => {
    if (selectedStudentIds.length === 0) return;
    
    setIsLoading(true);
    setLoadingProgress(0);
    
    const total = selectedStudentIds.length;
    let successCount = 0;

    showToast(`Memindahkan ${total} siswa ke kelas ${className || "Belum Ditentukan"}...`, "info");

    for (let i = 0; i < total; i++) {
      const id = selectedStudentIds[i];
      const payload = {
        diterima_kelas: className || null,
        diterima_tanggal: className ? new Date().toISOString().split("T")[0] : null
      };

      const result = await updateActiveStudent(id, payload);
      if (result?.success) {
        successCount++;
      }
      setLoadingProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsLoading(false);
    setSelectedStudentIds([]);
    await fetchActiveStudents();
    
    if (successCount === total) {
      showToast(`Sukses memindahkan ${successCount} siswa ke kelas ${className || "Belum Ditentukan"}!`);
    } else {
      showToast(`Berhasil memindahkan ${successCount} dari ${total} siswa ke kelas ${className || "Belum Ditentukan"}.`, "info");
    }
  };

  const handleDragStart = (e: React.DragEvent, studentId: number) => {
    initiateStudentDrag(e, studentId, selectedStudentIds);
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
        const result = await updateActiveStudent(id, payload);
        if (result?.success) {
          successCount++;
        }
        setLoadingProgress(Math.round(((i + 1) / total) * 100));
      }

      setIsLoading(false);
      setSelectedStudentIds([]);
      await fetchActiveStudents();

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

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      showToast("Nama kelas tidak boleh kosong!", "error");
      return;
    }

    let prefix = "X";
    if (selectedGrade === 11) prefix = "XI";
    if (selectedGrade === 12) prefix = "XII";

    let cleanName = newClassName.trim().toUpperCase();
    if (!cleanName.startsWith(prefix + " ")) {
      cleanName = `${prefix} ${cleanName}`;
    }

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
    saveClassesConfig(updated, setClasses);
    
    setNewClassName("");
    setIsAddingClass(false);
    showToast(`Kelas ${cleanName} berhasil dibuat!`);
  };

  const handleDeleteClass = async (id: string, name: string) => {
    const count = classEnrollments[name]?.total || 0;
    if (count > 0) {
      showToast(`Gagal menghapus: Masih ada ${count} siswa terdaftar di dalam kelas ${name}.`, "error");
      return;
    }

    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menghapus kelas ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    });
    if (result.isConfirmed) {
      const updated = classes.filter(c => c.id !== id);
      saveClassesConfig(updated, setClasses);
      showToast(`Kelas ${name} berhasil dihapus.`);
    }
  };

  return {
    handleAssignSelectedToClass,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCreateClass,
    handleDeleteClass,
  };
}
