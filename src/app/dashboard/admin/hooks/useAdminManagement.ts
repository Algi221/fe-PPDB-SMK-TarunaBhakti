import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useYsbmoStaff } from "./useYsbmoStaff";

export function useAdminManagement(adminUser: any, adminToken: string | null) {
  const router = useRouter();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editAdminId, setEditAdminId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ username: "", password: "", nama_lengkap: "", role: "admin" });
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [trashedAdmins, setTrashedAdmins] = useState<any[]>([]);
  const [trashLoading, setTrashLoading] = useState(false);

  const getBackendUrl = () => {
    if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;
    if (typeof window !== "undefined") return `http://${window.location.hostname}:5000`;
    return "http://localhost:5000";
  };

  useEffect(() => {
    if (!adminUser) return;
    if (adminUser.role !== "superadmin") {
      router.push("/dashboard");
      return;
    }
    fetchAdmins();
  }, [adminUser, adminToken, router]);

  async function fetchAdmins() {
    if (!adminToken) return;
    try {
      setLoading(true);
      setError("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data);
      } else {
        setError(data.message || "Gagal mengambil data admin");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const {
    ysbmoStaff,
    ysbmoLoading,
    ysbmoError,
    ysbmoTokenInput,
    setYsbmoTokenInput,
    showYsbmoTokenForm,
    setShowYsbmoTokenForm,
    fetchYsbmoStaff,
    handleSaveYsbmoToken,
    handleMakeAdmin,
  } = useYsbmoStaff({
    adminToken,
    getBackendUrl,
    fetchAdmins,
    setError,
    setSuccessMsg,
    setLoading,
  });

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    try {
      setFormLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Admin berhasil ditambahkan!");
        setFormData({ username: "", password: "", nama_lengkap: "", role: "admin" });
        setShowAddForm(false);
        fetchAdmins();
      } else {
        setError(data.message || "Gagal membuat admin baru");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleStartEdit = (admin: any) => {
    setEditAdminId(admin.id);
    setFormData({
      username: admin.username,
      password: "",
      nama_lengkap: admin.nama_lengkap,
      role: admin.role || "admin"
    });
    setError("");
    setSuccessMsg("");
  };

  const handleCancelEdit = () => {
    setEditAdminId(null);
    setFormData({ username: "", password: "", nama_lengkap: "", role: "admin" });
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdminId || !adminToken) return;

    try {
      setFormLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/${editAdminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Data admin berhasil diperbarui!");
        setEditAdminId(null);
        setFormData({ username: "", password: "", nama_lengkap: "", role: "admin" });
        fetchAdmins();
      } else {
        setError(data.message || "Gagal memperbarui data admin");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus admin ini secara permanen?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal"
    });
    if (!result.isConfirmed) return;
    if (!adminToken) return;
    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Admin berhasil dihapus.");
        fetchAdmins();
      } else {
        setError(data.message || "Gagal menghapus admin");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  async function fetchTrashedAdmins() {
    if (!adminToken) return;
    try {
      setTrashLoading(true);
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/trashed`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTrashedAdmins(data.data);
      }
    } catch (err: any) {
      console.error("Gagal mengambil data sampah:", err.message);
    } finally {
      setTrashLoading(false);
    }
  }

  const handleRestoreAdmin = async (id: number) => {
    if (!adminToken) return;
    try {
      setTrashLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/${id}/restore`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Admin berhasil dipulihkan!");
        fetchTrashedAdmins();
        fetchAdmins();
      } else {
        setError(data.message || "Gagal memulihkan admin.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTrashLoading(false);
    }
  };

  const handlePermanentDeleteAdmin = async (id: number) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus admin ini secara PERMANEN? Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal"
    });
    if (!result.isConfirmed) return;
    if (!adminToken) return;
    try {
      setTrashLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/${id}?permanent=true`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Admin berhasil dihapus secara permanen.");
        fetchTrashedAdmins();
      } else {
        setError(data.message || "Gagal menghapus admin secara permanen.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTrashLoading(false);
    }
  };

  return {
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
    fetchAdmins,
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
  };
}
