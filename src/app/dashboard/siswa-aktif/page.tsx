"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import KuotaTab from "@/components/KuotaTab";

import { handleExportExcel } from "./components/excelExport";
import { ActiveStudentStats } from "./components/ActiveStudentStats";
import { ActiveStudentFilters } from "./components/ActiveStudentFilters";
import { ActiveStudentAccordion } from "./components/ActiveStudentAccordion";
import { ActiveStudentDetailModal } from "./components/ActiveStudentDetailModal";
import { ActiveStudentEditModal } from "./components/ActiveStudentEditModal";
import { AddPeriodModal } from "./components/AddPeriodModal";
import { useActiveStudentsDirectory } from "./hooks/useActiveStudentsDirectory";

function ActiveStudentsDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePageTab = searchParams.get("tab") || "active";

  const { activeStudents, addToast, fetchActiveStudents, updateActiveStudent } = usePPDB();

  useEffect(() => {
    if (typeof fetchActiveStudents === "function") {
      fetchActiveStudents();
    }
  }, [fetchActiveStudents]);

  const {
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
  } = useActiveStudentsDirectory({
    activeStudents,
    addToast,
    fetchActiveStudents,
    updateActiveStudent,
  });

  const getNipdRecord = () => {
    const rec: Record<number, string> = {};
    nipdMap.forEach((v, k) => { rec[k] = v; });
    return rec;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left pb-16">
      {/* Tab Navigation Menu */}
      <div className="flex border-b border-slate-200 dark:border-white/10 gap-8 mb-6">
        <button
          onClick={() => router.push("/dashboard/siswa-aktif?tab=active")}
          className={`pb-4 text-xs font-black uppercase tracking-wider relative transition-all cursor-pointer ${
            activePageTab === "active"
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          Daftar Siswa Aktif
          {activePageTab === "active" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => router.push("/dashboard/siswa-aktif?tab=kuota")}
          className={`pb-4 text-xs font-black uppercase tracking-wider relative transition-all cursor-pointer ${
            activePageTab === "kuota"
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          Statistik & Kuota
          {activePageTab === "kuota" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
          )}
        </button>
      </div>

      {activePageTab === "kuota" ? (
        <KuotaTab />
      ) : (
        <>
          <ActiveStudentStats stats={stats} />

          <ActiveStudentFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            majorFilter={majorFilter}
            setMajorFilter={setMajorFilter}
            classFilter={classFilter}
            setClassFilter={setClassFilter}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            uniqueClasses={uniqueClasses}
            classStats={classStats}
            onAddPeriodClick={() => {
              setNewPeriodValue(getNextPeriod());
              setIsAddPeriodModalOpen(true);
            }}
            onExportAllClick={() =>
              handleExportExcel(filteredApplicants, "Semua_Siswa_Aktif", getNipdRecord())
            }
            filteredApplicants={filteredApplicants}
          />

          <ActiveStudentAccordion
            sortedPeriods={sortedPeriods}
            groupedByPeriod={groupedByPeriod}
            expandedPeriods={expandedPeriods}
            togglePeriod={togglePeriod}
            nipdMap={nipdMap}
            handleViewDetail={handleViewDetail}
            handleBatalVerifikasi={handleBatalVerifikasi}
            handleExportExcel={(students, suffix) =>
              handleExportExcel(students, suffix, getNipdRecord())
            }
            customPeriods={customPeriods}
            setCustomPeriods={setCustomPeriods}
            addToast={addToast}
            searchTerm={searchTerm}
            majorFilter={majorFilter}
          />
        </>
      )}

      {selectedApplicant && (
        <ActiveStudentDetailModal
          selectedApplicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          nipdMap={nipdMap}
          onEditClick={() => setEditApplicant(selectedApplicant)}
        />
      )}

      {editApplicant && (
        <ActiveStudentEditModal
          editApplicant={editApplicant}
          editForm={editForm}
          setEditForm={setEditForm}
          onClose={() => setEditApplicant(null)}
          handleSaveEdit={handleSaveEdit}
          isSaving={isSaving}
        />
      )}

      <AddPeriodModal
        isOpen={isAddPeriodModalOpen}
        onClose={() => setIsAddPeriodModalOpen(false)}
        getNextPeriod={getNextPeriod}
        newPeriodValue={newPeriodValue}
        setNewPeriodValue={setNewPeriodValue}
        customPeriods={customPeriods}
        setCustomPeriods={setCustomPeriods}
        addToast={addToast}
      />
    </div>
  );
}

export default function ActiveStudentsDirectory() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm font-bold text-slate-500">
          Memuat Direktori Siswa Aktif...
        </div>
      }
    >
      <ActiveStudentsDirectoryContent />
    </Suspense>
  );
}
