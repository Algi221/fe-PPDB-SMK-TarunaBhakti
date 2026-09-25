"use client";

import React from "react";
import { Check, ShieldAlert, Sparkles } from "lucide-react";

import StatsHeader from "./components/StatsHeader";
import GradeMajorSelector from "./components/GradeMajorSelector";
import ClassCardList from "./components/ClassCardList";
import StudentTable from "./components/StudentTable";
import ClassDetailModal from "./components/ClassDetailModal";
import BulkActionFloatingBar from "./components/BulkActionFloatingBar";
import { useClassDivisionManagement } from "./hooks/useClassDivisionManagement";

export default function ClassDivisionManagement() {
  const {
    mounted,
    toast,
    isLoading,
    loadingProgress,
    selectedMajor,
    setSelectedMajor,
    selectedGrade,
    setSelectedGrade,
    searchTerm,
    setSearchTerm,
    assignmentFilter,
    setAssignmentFilter,
    genderFilter,
    setGenderFilter,
    selectedStudentIds,
    setSelectedStudentIds,
    newClassName,
    setNewClassName,
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
  } = useClassDivisionManagement();

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
            <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Memproses Kelas...</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Mengupdate Data Calon Siswa ({loadingProgress}%)</p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-linear-to-r from-indigo-600 to-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      <StatsHeader
        selectedGrade={selectedGrade}
        selectedMajor={selectedMajor}
        totalClasses={classesOfSelectedMajor.length}
        totalClassesFilled={totalClassesFilled}
      />

      <GradeMajorSelector
        activeMajors={activeMajors}
        selectedMajor={selectedMajor}
        setSelectedMajor={(m) => {
          setSelectedMajor(m);
          setSelectedStudentIds([]);
          setAssignmentFilter("ALL");
        }}
        setSelectedStudentIds={setSelectedStudentIds}
        setAssignmentFilter={setAssignmentFilter}
        selectedGrade={selectedGrade}
        setSelectedGrade={(g) => {
          setSelectedGrade(g);
          setSelectedStudentIds([]);
        }}
      />

      <ClassCardList
        selectedGrade={selectedGrade}
        selectedMajor={selectedMajor}
        handleExportAllClasses={handleExportAllClasses}
        handleExportAllMajors={handleExportAllMajors}
        isAddingClass={isAddingClass}
        setIsAddingClass={setIsAddingClass}
        newClassName={newClassName}
        setNewClassName={setNewClassName}
        handleCreateClass={handleCreateClass}
        classesOfSelectedMajor={classesOfSelectedMajor}
        classEnrollments={classEnrollments}
        setSelectedClassDetail={setSelectedClassDetail}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        activeDropClass={activeDropClass}
        handleDeleteClass={handleDeleteClass}
      />

      <StudentTable
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        assignmentFilter={assignmentFilter}
        setAssignmentFilter={setAssignmentFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        handleSelectAll={handleSelectAll}
        selectedStudentIds={selectedStudentIds}
        setSelectedStudentIds={setSelectedStudentIds}
        handleAssignSelectedToClass={handleAssignSelectedToClass}
        filteredStudents={filteredStudents}
        nipdMap={nipdMap}
        handleSelectStudent={handleSelectStudent}
        handleDragStart={handleDragStart}
        getStudentCurrentClass={getStudentCurrentClass}
        classesOfSelectedMajor={classesOfSelectedMajor}
      />

      <ClassDetailModal
        selectedClassDetail={selectedClassDetail}
        onClose={() => {
          setSelectedClassDetail(null);
          setClassSearchTerm("");
        }}
        enrolledStudentsInDetail={enrolledStudentsInDetail}
        classSearchTerm={classSearchTerm}
        setClassSearchTerm={setClassSearchTerm}
        handleExportClassCSV={handleExportClassCSV}
        nipdMap={nipdMap}
        handleRemoveStudentFromClassDetail={handleRemoveStudentFromClassDetail}
      />

      <BulkActionFloatingBar
        selectedStudentIds={selectedStudentIds}
        classesOfSelectedMajor={classesOfSelectedMajor}
        handleAssignSelectedToClass={handleAssignSelectedToClass}
      />
    </div>
  );
}
