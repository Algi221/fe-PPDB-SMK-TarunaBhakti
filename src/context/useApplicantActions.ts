"use client";

import { useCallback } from "react";

interface UseApplicantActionsParams {
  adminToken: string | null;
  wsStatus: string;
  setApplicants: React.Dispatch<React.SetStateAction<any[]>>;
  setPublicApplicants: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveStudents: React.Dispatch<React.SetStateAction<any[]>>;
  addToast: (title: string, message: string, type?: string) => void;
  fetchPublicApplicants: () => Promise<void>;
  fetchAdminApplicants: () => Promise<void>;
  fetchActiveStudents: () => Promise<void>;
  BACKEND_URL: string;
}

export function useApplicantActions({
  adminToken,
  wsStatus,
  setApplicants,
  setPublicApplicants,
  setActiveStudents,
  addToast,
  fetchPublicApplicants,
  fetchAdminApplicants,
  fetchActiveStudents,
  BACKEND_URL
}: UseApplicantActionsParams) {

  const registerApplicant = useCallback(async (formData: any) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchPublicApplicants();
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err: any) {
      console.error("API registration error, adding to memory fallback:", err.message);
      const newId = Date.now();
      const mockSaved = {
        id: newId,
        nama: formData.nama || "Pendaftar Baru",
        nisn: formData.nisn || "0000000000",
        sekolah_asal: formData.sekolahAsal || "SMP Asal",
        jurusan_1: formData.jurusan1 || "PPLG",
        status: "Pending",
        tgl_daftar: new Date().toISOString()
      };
      setPublicApplicants(prev => [mockSaved, ...prev]);
      setApplicants(prev => [mockSaved, ...prev]);
      addToast("Pendaftaran Baru (Offline)", `Nama: ${mockSaved.nama} - Jurusan: ${mockSaved.jurusan_1}`, "success");
      return { success: true, data: mockSaved };
    }
  }, [fetchPublicApplicants, addToast, setPublicApplicants, setApplicants, BACKEND_URL]);

  const verifyApplicant = useCallback(async (id: number) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: "Approved" })
      });
      const data = await res.json();
      if (data.success) {
        if (wsStatus !== "CONNECTED") {
          addToast("Applicant Approved", `Pendaftar #${id} telah berhasil diverifikasi!`, "success");
        }
        await fetchAdminApplicants();
        await fetchPublicApplicants();
        await fetchActiveStudents();
      } else {
        addToast("Gagal Memverifikasi", data.message || "Gagal memperbarui status pendaftar.", "danger");
      }
    } catch (err: any) {
      console.error("API status update error:", err.message);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
      setPublicApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
      addToast("Applicant Approved (Offline)", `Pendaftar #${id} disetujui.`, "success");
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus, setApplicants, setPublicApplicants, BACKEND_URL]);

  const rejectApplicant = useCallback(async (id: number, alasan_ditolak?: string) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: "Rejected", alasan_ditolak })
      });
      const data = await res.json();
      if (data.success) {
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');
        if (wsStatus !== "CONNECTED" && isAdminPath) {
          addToast("Applicant Rejected", `Calon siswa #${id} telah ditolak.`, "warning");
        }
        await fetchAdminApplicants();
        await fetchPublicApplicants();
        await fetchActiveStudents();
      } else {
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');
        if (isAdminPath) {
          addToast("Gagal Menolak", data.message || "Gagal memperbarui status pendaftar.", "danger");
        }
      }
    } catch (err: any) {
      console.error("API status update error:", err.message);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Rejected", alasan_ditolak } : a));
      setPublicApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Rejected", alasan_ditolak } : a));
      const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');
      if (isAdminPath) {
        addToast("Applicant Rejected (Offline)", `Calon siswa #${id} ditolak.`, "warning");
      }
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus, setApplicants, setPublicApplicants, BACKEND_URL]);

  const deleteApplicant = useCallback(async (id: number) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        if (wsStatus !== "CONNECTED") {
          addToast("Applicant Deleted", `Data pendaftar #${id} telah dihapus permanen.`, "danger");
        }
        await fetchAdminApplicants();
        await fetchPublicApplicants();
        await fetchActiveStudents();
      } else {
        addToast("Gagal Menghapus", data.message || "Gagal menghapus data pendaftar.", "danger");
      }
    } catch (err: any) {
      console.error("API delete error:", err.message);
      setApplicants(prev => prev.filter(a => a.id !== id));
      setPublicApplicants(prev => prev.filter(a => a.id !== id));
      addToast("Applicant Deleted (Offline)", `Pendaftar #${id} dihapus.`, "danger");
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus, setApplicants, setPublicApplicants, BACKEND_URL]);

  const updateApplicant = useCallback(async (id: number, updatedData: any) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return { success: false, message: "Tidak terautentikasi." };
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success) {
        addToast("Data Diperbarui", `Data pendaftar ${updatedData.nama || '#' + id} berhasil disimpan.`, "success");
        await fetchAdminApplicants();
        await fetchPublicApplicants();
        await fetchActiveStudents();
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err: any) {
      console.error("API update error:", err.message);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
      setPublicApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
      addToast("Data Diperbarui (Offline)", `Perubahan data tersimpan lokal.`, "success");
      return { success: true, data: { id, ...updatedData } };
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, setApplicants, setPublicApplicants, BACKEND_URL]);

  const updateActiveStudent = useCallback(async (id: number, updatedData: any) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return { success: false, message: "Tidak terautentikasi." };
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success) { 
        addToast("Data Diperbarui", `Data siswa aktif ${updatedData.nama || '#' + id} berhasil disimpan.`, "success");
        await fetchActiveStudents();
        await fetchAdminApplicants();
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err: any) {
      console.error("API active student update error:", err.message);
      setActiveStudents(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
      addToast("Data Diperbarui (Offline)", `Perubahan data tersimpan lokal.`, "success");
      return { success: true, data: { id, ...updatedData } };
    }
  }, [adminToken, fetchActiveStudents, fetchAdminApplicants, addToast, setActiveStudents, BACKEND_URL]);

  const deleteActiveStudent = useCallback(async (id: number) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        addToast("Siswa Dihapus", `Siswa aktif #${id} telah dihapus.`, "danger");
        await fetchActiveStudents();
        await fetchAdminApplicants();
      } else {
        addToast("Gagal Menghapus", data.message || "Gagal menghapus siswa aktif.", "danger");
      }
    } catch (err: any) {
      console.error("API active student delete error:", err.message);
      setActiveStudents(prev => prev.filter(a => a.id !== id));
      addToast("Siswa Dihapus (Offline)", `Siswa aktif #${id} dihapus.`, "danger");
    }
  }, [adminToken, fetchActiveStudents, fetchAdminApplicants, addToast, setActiveStudents, BACKEND_URL]);

  const checkPaymentStatus = useCallback(async (nisn: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/check-payment/${nisn}`);
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error("Check payment status failed:", err.message);
      return { success: false, message: err.message };
    }
  }, [BACKEND_URL]);

  const simulateRegistration = useCallback(async () => {
    const firstNames = ["Ahmad", "Dian", "Budi", "Siti", "Kevin", "Rina", "Fajar", "Ayu", "Giri", "Reza", "Lutfi", "Indah"];
    const lastNames = ["Saputra", "Pratama", "Lestari", "Maharani", "Wijaya", "Siddiq", "Santoso", "Hidayat", "Kusuma", "Utami"];
    const schools = ["SMPN 1 Depok", "SMPN 2 Depok", "SMPN 3 Depok", "SMP IT Al-Hikmah", "SMP Mardi Yuana", "MTsN 1 Depok", "SMP Budi Kharisma", "SMPN 4 Depok"];
    const majorsCodes = ["Rekayasa Perangkat Lunak", "Teknik Jaringan Komputer & Telekomunikasi", "Desain Komunikasi Visual", "Broadcasting & Perfilman", "Teknik Elektronika", "Animasi"];

    const randomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const randomNama = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
    const randomMajor = randomItem(majorsCodes);
    const randomMajorAlt = majorsCodes.find(m => m !== randomMajor);

    const mockCandidate = {
      nama: randomNama,
      nisn: "008" + Math.floor(1000000 + Math.random() * 9000000).toString(),
      nik: "3276" + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      tempatLahir: "Depok",
      tglLahir: "2010-06-15",
      jenisKelamin: Math.random() > 0.5 ? "Laki-laki" : "Perempuan",
      agama: "Islam",
      alamat: "Jl. Pekapuran No. " + Math.floor(Math.random() * 100),
      rtRw: "03/05",
      kelurahan: "Curug",
      kecamatan: "Cimanggis",
      kodePos: "16453",
      whatsapp: "0812" + Math.floor(10000000 + Math.random() * 90000000).toString(),
      email: randomNama.toLowerCase().replace(" ", "") + "@email.com",
      sekolahAsal: randomItem(schools),
      tglLulus: "2026-06-10",
      jurusan1: randomMajor,
      jurusan2: randomMajorAlt,
      teleponOrtu: "0812" + Math.floor(10000000 + Math.random() * 90000000).toString(),
      janjiTaat: true,
      janjiSanksi: true,
      janjiAkrab: true,
      janjiBelajar: true,
      janjiNamaBaik: true
    };
    await registerApplicant(mockCandidate);
  }, [registerApplicant]);

  return {
    registerApplicant,
    verifyApplicant,
    rejectApplicant,
    deleteApplicant,
    updateApplicant,
    updateActiveStudent,
    deleteActiveStudent,
    checkPaymentStatus,
    simulateRegistration
  };
}
