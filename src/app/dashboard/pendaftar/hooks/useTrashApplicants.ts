import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Applicant } from "../types";

export function useTrashApplicants(activePageTab: string, fetchAdminApplicants: () => Promise<void>) {
  const [trashedApplicants, setTrashedApplicants] = useState<Applicant[]>([]);
  const [trashLoading, setTrashLoading] = useState<boolean>(false);
  const [trashError, setTrashError] = useState<string>("");
  const [trashSuccess, setTrashSuccess] = useState<string>("");

  const fetchTrashedApplicants = async () => {
    try {
      setTrashLoading(true);
      setTrashError("");
      const token = localStorage.getItem("ppdb_admin_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/applicants/trashed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTrashedApplicants(data.data);
      } else {
        setTrashError(data.message || "Gagal mengambil data pendaftar terhapus");
      }
    } catch (err: any) {
      setTrashError(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setTrashLoading(false);
    }
  };

  const handleRestoreApplicant = async (id: number) => {
    try {
      setTrashLoading(true);
      setTrashError("");
      setTrashSuccess("");
      const token = localStorage.getItem("ppdb_admin_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/applicants/${id}/restore`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTrashSuccess("Data calon siswa berhasil dipulihkan!");
        fetchTrashedApplicants();
        await fetchAdminApplicants();
      } else {
        setTrashError(data.message || "Gagal memulihkan data");
      }
    } catch (err: any) {
      setTrashError(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setTrashLoading(false);
    }
  };

  const handlePermanentDeleteApplicant = async (id: number) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus data calon siswa ini secara PERMANEN? Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    try {
      setTrashLoading(true);
      setTrashError("");
      setTrashSuccess("");
      const token = localStorage.getItem("ppdb_admin_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/applicants/${id}?permanent=true`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTrashSuccess("Data calon siswa berhasil dihapus secara permanen.");
        fetchTrashedApplicants();
      } else {
        setTrashError(data.message || "Gagal menghapus data");
      }
    } catch (err: any) {
      setTrashError(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setTrashLoading(false);
    }
  };

  useEffect(() => {
    if (activePageTab === "trash") {
      fetchTrashedApplicants();
    }
  }, [activePageTab]);

  return {
    trashedApplicants,
    trashLoading,
    trashError,
    setTrashError,
    trashSuccess,
    setTrashSuccess,
    fetchTrashedApplicants,
    handleRestoreApplicant,
    handlePermanentDeleteApplicant,
  };
}
