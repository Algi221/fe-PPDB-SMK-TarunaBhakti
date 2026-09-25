"use client";

import { useEffect, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Plus, Trash2 } from "lucide-react";
import { AdminAccountsTab } from "./components/AdminAccountsTab";
import { YsbmoStaffTab } from "./components/YsbmoStaffTab";
import { TrashAdminTab } from "./components/TrashAdminTab";
import { useAdminManagement } from "./hooks/useAdminManagement";

function AdminManagementPageContent() {
  const { adminUser, adminToken } = usePPDB();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "admin";
  const activeTab = activeTabParam as "admin" | "ysbmo" | "trash";

  const {
    admins,
    loading,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    showAddForm,
    setShowAddForm,
    editAdminId,
    formData,
    setFormData,
    formLoading,
    showPassword,
    setShowPassword,
    trashedAdmins,
    trashLoading,
    ysbmoStaff,
    ysbmoLoading,
    ysbmoError,
    ysbmoTokenInput,
    setYsbmoTokenInput,
    showYsbmoTokenForm,
    setShowYsbmoTokenForm,
    fetchYsbmoStaff,
    fetchTrashedAdmins,
    handleSaveYsbmoToken,
    handleMakeAdmin,
    handleAddAdmin,
    handleStartEdit,
    handleCancelEdit,
    handleUpdateAdmin,
    handleDeleteAdmin,
    handleRestoreAdmin,
    handlePermanentDeleteAdmin
  } = useAdminManagement(adminUser, adminToken);

  const handleTabChange = (tab: "admin" | "ysbmo" | "trash") => {
    setError("");
    setSuccessMsg("");
    router.push(`/dashboard/admin?tab=${tab}`);
  };

  useEffect(() => {
    if (activeTab === "ysbmo" && ysbmoStaff.length === 0) {
      fetchYsbmoStaff();
    } else if (activeTab === "trash") {
      fetchTrashedAdmins();
    }
  }, [activeTab, adminToken]);

  if (!adminUser || adminUser.role !== "superadmin") {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Shield className="text-emerald-500" size={28} />
            Manajemen Admin
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola hak akses, perbarui profil, hapus, dan atur peran (role) panitia PPDB.
          </p>
        </div>
        
        {!editAdminId && activeTab === "admin" && (
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setError("");
              setSuccessMsg("");
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              showAddForm 
                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" 
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 shadow-sm"
            }`}
          >
            {showAddForm ? "Batal" : <><Plus size={16} /> Tambah Admin Baru</>}
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => handleTabChange("admin")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "admin"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Manajemen Akun Admin
        </button>
        <button
          onClick={() => handleTabChange("ysbmo")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "ysbmo"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Data Staff &amp; Guru YSBMO
        </button>
        <button
          onClick={() => handleTabChange("trash")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "trash"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Trash2 size={15} />
          Sampah / Akun Dihapus
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-600 rounded-xl text-sm font-semibold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
          {successMsg}
        </div>
      )}

      {activeTab === "admin" && (
        <AdminAccountsTab
          admins={admins}
          loading={loading}
          adminUser={adminUser}
          showAddForm={showAddForm}
          editAdminId={editAdminId}
          formData={formData}
          setFormData={setFormData}
          formLoading={formLoading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleAddAdmin={handleAddAdmin}
          handleUpdateAdmin={handleUpdateAdmin}
          handleStartEdit={handleStartEdit}
          handleCancelEdit={handleCancelEdit}
          handleDeleteAdmin={handleDeleteAdmin}
        />
      )}

      {activeTab === "ysbmo" && (
        <YsbmoStaffTab
          ysbmoStaff={ysbmoStaff}
          ysbmoLoading={ysbmoLoading}
          ysbmoError={ysbmoError}
          showYsbmoTokenForm={showYsbmoTokenForm}
          setShowYsbmoTokenForm={setShowYsbmoTokenForm}
          ysbmoTokenInput={ysbmoTokenInput}
          setYsbmoTokenInput={setYsbmoTokenInput}
          handleSaveYsbmoToken={handleSaveYsbmoToken}
          handleMakeAdmin={handleMakeAdmin}
          admins={admins}
        />
      )}

      {activeTab === "trash" && (
        <TrashAdminTab
          trashedAdmins={trashedAdmins}
          trashLoading={trashLoading}
          handleRestoreAdmin={handleRestoreAdmin}
          handlePermanentDeleteAdmin={handlePermanentDeleteAdmin}
        />
      )}
    </div>
  );
}

export default function AdminManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium animate-pulse">Memuat halaman manajemen admin...</div>}>
      <AdminManagementPageContent />
    </Suspense>
  );
}
