"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import ProfileCard from "./components/ProfileCard";
import ProfileForm from "./components/ProfileForm";
import ProfileCropModal from "./components/ProfileCropModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePage() {
  const { adminUser, adminToken, setAdminUser } = usePPDB();

  // ── Profile form state ───────────────────────────────────────────────────
  const [namaLengkap, setNamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [fotoProfil, setFotoProfil] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // ── Crop modal state ──────────────────────────────────────────────────────
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  // ── Status ───────────────────────────────────────────────────────────────
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Init from context ─────────────────────────────────────────────────────
  useEffect(() => {
    if (adminUser) {
      setNamaLengkap(adminUser.nama || "");
      setUsername(adminUser.username || "");
      setFotoProfil(adminUser.foto_profil || null);
      setPreviewPhoto(adminUser.foto_profil || null);
    }
  }, [adminUser]);

  // ── Photo upload → open crop modal ────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileMsg({ type: "error", text: "Ukuran foto maksimal 5MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = (croppedBase64: string) => {
    setPreviewPhoto(croppedBase64);
    setFotoProfil(croppedBase64);
    setCropModalOpen(false);
    setCropImageSrc(null);
  };

  const handleRemovePhoto = () => {
    setPreviewPhoto(null);
    setFotoProfil("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Save profile ─────────────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) {
      setProfileMsg({ type: "error", text: "Nama lengkap tidak boleh kosong." });
      return;
    }
    if (!username.trim()) {
      setProfileMsg({ type: "error", text: "Username tidak boleh kosong." });
      return;
    }

    setProfileSaving(true);
    setProfileMsg(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          nama_lengkap: namaLengkap,
          username,
          foto_profil: fotoProfil,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProfileMsg({ type: "success", text: "Profil berhasil diperbarui!" });
        if (setAdminUser && data.admin) {
          const updated = {
            ...adminUser,
            nama: data.admin.nama,
            username: data.admin.username,
            foto_profil: data.admin.foto_profil,
          };
          setAdminUser(updated);
          if (typeof window !== "undefined") {
            localStorage.setItem("ppdb_admin_user", JSON.stringify(updated));
          }
        }
      } else {
        setProfileMsg({ type: "error", text: data.message || "Gagal memperbarui profil." });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Gagal terhubung ke server." });
    } finally {
      setProfileSaving(false);
    }
  };

  const userInitial = adminUser?.nama ? adminUser.nama.charAt(0).toUpperCase() : "A";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Profil Saya</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Kelola informasi akun dan keamanan Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileCard
            previewPhoto={previewPhoto}
            userInitial={userInitial}
            adminUser={adminUser}
            fileInputRef={fileInputRef}
            onPhotoChange={handlePhotoChange}
            onRemovePhoto={handleRemovePhoto}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ProfileForm
            namaLengkap={namaLengkap}
            setNamaLengkap={setNamaLengkap}
            username={username}
            setUsername={setUsername}
            profileSaving={profileSaving}
            profileMsg={profileMsg}
            onSaveProfile={handleSaveProfile}
          />
        </div>
      </div>

      {cropModalOpen && cropImageSrc && (
        <ProfileCropModal
          cropImageSrc={cropImageSrc}
          onClose={() => {
            setCropModalOpen(false);
            setCropImageSrc(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          onSaveCrop={handleCropSave}
        />
      )}
    </div>
  );
}
