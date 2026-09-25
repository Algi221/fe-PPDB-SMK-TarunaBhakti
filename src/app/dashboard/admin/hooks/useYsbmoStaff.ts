"use client";

import { useState } from "react";

interface UseYsbmoStaffOptions {
  adminToken: string | null;
  getBackendUrl: () => string;
  fetchAdmins: () => void;
  setError: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
  setLoading: (loading: boolean) => void;
}

export function useYsbmoStaff({
  adminToken,
  getBackendUrl,
  fetchAdmins,
  setError,
  setSuccessMsg,
  setLoading
}: UseYsbmoStaffOptions) {
  const [ysbmoStaff, setYsbmoStaff] = useState<any[]>([]);
  const [ysbmoLoading, setYsbmoLoading] = useState(false);
  const [ysbmoError, setYsbmoError] = useState("");
  const [ysbmoTokenInput, setYsbmoTokenInput] = useState("");
  const [showYsbmoTokenForm, setShowYsbmoTokenForm] = useState(false);

  async function fetchYsbmoStaff(manualToken?: string) {
    if (!adminToken) return;
    try {
      setYsbmoLoading(true);
      setYsbmoError("");
      const backendUrl = getBackendUrl();
      const headers: Record<string, string> = {
        Authorization: `Bearer ${adminToken}`
      };
      if (manualToken) {
        headers["x-ysbmo-token"] = manualToken;
      }
      const res = await fetch(`${backendUrl}/api/admin/ysbmo/staff`, { headers });
      const data = await res.json();
      if (data.success) {
        const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        setYsbmoStaff(list);
        setShowYsbmoTokenForm(false);
        if (manualToken) {
          setSuccessMsg("Token YSBMO berhasil disimpan dan data berhasil dimuat!");
        }
      } else {
        if (data.code === "NO_TOKEN") {
          setShowYsbmoTokenForm(true);
        } else {
          setYsbmoError(data.message || "Gagal mengambil data staff YSBMO");
        }
      }
    } catch (err: any) {
      setYsbmoError(err.message);
    } finally {
      setYsbmoLoading(false);
    }
  }

  const handleSaveYsbmoToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ysbmoTokenInput.trim()) return;
    await fetchYsbmoStaff(ysbmoTokenInput);
  };

  const handleMakeAdmin = async (staff: any) => {
    if (!adminToken) return;
    const usernameVal = staff.id || staff.username || "";
    const nameVal = staff.text || staff.full_name || staff.nama_lengkap || "";
    if (!usernameVal || !nameVal) {
      setError("Data staff YSBMO tidak memiliki Username atau Nama Lengkap.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          username: usernameVal,
          nama_lengkap: nameVal,
          password: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
          role: "admin"
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Berhasil mendaftarkan ${nameVal} sebagai Admin PPDB!`);
        fetchAdmins();
      } else {
        setError(data.message || "Gagal mendaftarkan staff YSBMO sebagai admin");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    ysbmoStaff,
    ysbmoLoading,
    ysbmoError,
    ysbmoTokenInput,
    setYsbmoTokenInput,
    showYsbmoTokenForm,
    setShowYsbmoTokenForm,
    fetchYsbmoStaff,
    handleSaveYsbmoToken,
    handleMakeAdmin
  };
}
