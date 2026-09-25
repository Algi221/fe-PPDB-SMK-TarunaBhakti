"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PieChart, Trash2, CloudLightning } from "lucide-react";

import { usePPDB } from "@/context/PPDBContext";
import KuotaTab from "@/components/KuotaTab";

import ApplicantFilters from "./components/ApplicantFilters";
import StandardTable from "./components/StandardTable";
import SpreadsheetTable from "./components/SpreadsheetTable";
import Pagination from "./components/Pagination";
import TrashTable from "./components/TrashTable";
import ApplicantDetailModal from "./components/ApplicantDetailModal";
import EditApplicantModal from "./components/EditApplicantModal";
import RejectReasonModal from "./components/RejectReasonModal";
import { exportApplicantsToExcel } from "./components/applicantExcelExport";
import { useTrashApplicants } from "./hooks/useTrashApplicants";
import { useApplicantDirectory } from "./hooks/useApplicantDirectory";

function ApplicantsDirectoryContent() {
  const {
    applicants,
    verifyApplicant,
    rejectApplicant,
    deleteApplicant,
    updateApplicant,
    fetchAdminApplicants,
  } = usePPDB();

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "active";
  const activePageTab = activeTabParam as "active" | "transfer" | "trash" | "kuota";

  const {
    trashedApplicants,
    trashLoading,
    setTrashError,
    setTrashSuccess,
    handleRestoreApplicant,
    handlePermanentDeleteApplicant,
  } = useTrashApplicants(activePageTab, fetchAdminApplicants);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    majorFilter,
    setMajorFilter,
    gelombangFilter,
    setGelombangFilter,
    genderFilter,
    setGenderFilter,
    selectedApplicant,
    setSelectedApplicant,
    rejectingApplicantId,
    setRejectingApplicantId,
    rejectionReasonInput,
    setRejectionReasonInput,
    editApplicant,
    setEditApplicant,
    isSpreadsheetMode,
    setIsSpreadsheetMode,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredApplicants,
    paginatedApplicants,
    itemsPerPage,
    handleViewDetail,
    majorsList,
  } = useApplicantDirectory(applicants, activePageTab);

  const handleTabChange = (tab: "active" | "transfer" | "trash" | "kuota") => {
    setTrashError("");
    setTrashSuccess("");
    router.push(`/dashboard/pendaftar?tab=${tab}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-slate-800 dark:text-slate-100">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-150 dark:border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-850 dark:text-white uppercase tracking-wider">
            Direktori Data Pendaftar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
            Manajemen Administrasi Verifikasi Calon Siswa Baru PPDB SMK Taruna Bhakti
          </p>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => handleTabChange("active")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activePageTab === "active"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Calon Siswa Baru (Kelas X)
        </button>
        <button
          onClick={() => handleTabChange("transfer")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activePageTab === "transfer"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Siswa Mutasi / Pindahan (XI &amp; XII)
        </button>
        <button
          onClick={() => handleTabChange("trash")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activePageTab === "trash"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Trash2 size={15} />
          Sampah / Terhapus
        </button>
        <button
          onClick={() => handleTabChange("kuota")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activePageTab === "kuota"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <PieChart size={15} />
          Monitoring Kuota Jurusan
        </button>
      </div>

      {/* Main Tab Panels */}
      {activePageTab === "kuota" ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <KuotaTab applicants={applicants} />
        </div>
      ) : activePageTab === "trash" ? (
        <TrashTable
          trashLoading={trashLoading}
          trashedApplicants={trashedApplicants}
          handleRestoreApplicant={handleRestoreApplicant}
          handlePermanentDeleteApplicant={handlePermanentDeleteApplicant}
        />
      ) : (
        <div className="space-y-4">
          <ApplicantFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            majorFilter={majorFilter}
            setMajorFilter={setMajorFilter}
            majorsList={majorsList}
            gelombangFilter={gelombangFilter}
            setGelombangFilter={setGelombangFilter}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            isSpreadsheetMode={isSpreadsheetMode}
            setIsSpreadsheetMode={setIsSpreadsheetMode}
            exportToExcel={() => exportApplicantsToExcel(filteredApplicants)}
            hasApplicants={filteredApplicants.length > 0}
          />

          {isSpreadsheetMode ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <SpreadsheetTable
                paginatedApplicants={paginatedApplicants}
                filteredApplicants={filteredApplicants}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                handleViewDetail={handleViewDetail}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredApplicants.length}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <StandardTable
                paginatedApplicants={paginatedApplicants}
                filteredApplicants={filteredApplicants}
                handleViewDetail={handleViewDetail}
                openEdit={(applicant) => setEditApplicant(applicant)}
                verifyApplicant={verifyApplicant}
                setRejectingApplicantId={setRejectingApplicantId}
                setRejectionReasonInput={setRejectionReasonInput}
                deleteApplicant={deleteApplicant}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredApplicants.length}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ApplicantDetailModal
        selectedApplicant={selectedApplicant}
        setSelectedApplicant={setSelectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        verifyApplicant={verifyApplicant}
        setRejectingApplicantId={setRejectingApplicantId}
        setRejectionReasonInput={setRejectionReasonInput}
        updateApplicant={updateApplicant}
      />

      <EditApplicantModal
        editApplicant={editApplicant}
        setEditApplicant={setEditApplicant}
        updateApplicant={updateApplicant}
        fetchAdminApplicants={fetchAdminApplicants}
      />

      <RejectReasonModal
        rejectingApplicantId={rejectingApplicantId}
        setRejectingApplicantId={setRejectingApplicantId}
        rejectionReasonInput={rejectionReasonInput}
        setRejectionReasonInput={setRejectionReasonInput}
        rejectApplicant={rejectApplicant}
        selectedApplicant={selectedApplicant}
        setSelectedApplicant={setSelectedApplicant}
      />
    </div>
  );
}

export default function ApplicantsDirectory() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm font-bold text-slate-500 flex items-center justify-center gap-2">
          <CloudLightning className="animate-spin text-blue-500" size={18} />
          Memuat Direktori Pendaftar...
        </div>
      }
    >
      <ApplicantsDirectoryContent />
    </Suspense>
  );
}
