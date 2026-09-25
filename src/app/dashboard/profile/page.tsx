"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { ZoomIn, ZoomOut, RotateCw, Crop } from "lucide-react";
import ProfileAvatarCard from "@/components/dashboard/profile/ProfileAvatarCard";
import ProfileEditForm from "@/components/dashboard/profile/ProfileEditForm";
import PasswordEditForm from "@/components/dashboard/profile/PasswordEditForm";

// ── Crop helper ──────────────────────────────────────────────────────────────
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.9);
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePage() {
  const { adminUser, adminToken, setAdminUser } = usePPDB();

  // ── Profile form state ───────────────────────────────────────────────────
  const [namaLengkap, setNamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [fotoProfil, setFotoProfil] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // ── Password form state ──────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // ── Crop modal state ──────────────────────────────────────────────────────
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // ── Status ───────────────────────────────────────────────────────────────
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;
    try {
      const croppedBase64 = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      setPreviewPhoto(croppedBase64);
      setFotoProfil(croppedBase64);
      setCropModalOpen(false);
      setCropImageSrc(null);
    } catch (err) {
      console.error("Crop failed", err);
      setProfileMsg({ type: "error", text: "Gagal memotong foto." });
    }
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
        // Update context
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

  // ── Change password ───────────────────────────────────────────────────────
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: "error", text: "Semua kolom password harus diisi." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    setPasswordSaving(true);
    setPasswordMsg(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPasswordMsg({ type: "success", text: "Password berhasil diubah!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: data.message || "Gagal mengubah password." });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Gagal terhubung ke server." });
    } finally {
      setPasswordSaving(false);
    }
  };

  const userInitial = adminUser?.nama ? adminUser.nama.charAt(0).toUpperCase() : "A";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Profil Saya</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Kelola informasi akun dan keamanan Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: Photo + Info Card ─────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <ProfileAvatarCard
            adminUser={adminUser}
            previewPhoto={previewPhoto}
            fileInputRef={fileInputRef}
            handlePhotoChange={handlePhotoChange}
            handleRemovePhoto={handleRemovePhoto}
            userInitial={userInitial}
          />
        </div>

        {/* ── RIGHT: Forms ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileEditForm
            namaLengkap={namaLengkap}
            setNamaLengkap={setNamaLengkap}
            username={username}
            setUsername={setUsername}
            profileMsg={profileMsg}
            profileSaving={profileSaving}
            handleSaveProfile={handleSaveProfile}
          />
          <PasswordEditForm
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showCurrentPwd={showCurrentPwd}
            setShowCurrentPwd={setShowCurrentPwd}
            showNewPwd={showNewPwd}
            setShowNewPwd={setShowNewPwd}
            showConfirmPwd={showConfirmPwd}
            setShowConfirmPwd={setShowConfirmPwd}
            passwordMsg={passwordMsg}
            passwordSaving={passwordSaving}
            handleChangePassword={handleChangePassword}
          />
        </div>
      </div>

      {/* ── Crop Modal ─────────────────────────────────────────────────────── */}
      {cropModalOpen && cropImageSrc && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                  <Crop size={16} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Sesuaikan Foto</h2>
                  <p className="text-[10px] text-slate-400 font-semibold">Geser dan zoom untuk menyesuaikan</p>
                </div>
              </div>
              <button
                onClick={() => { setCropModalOpen(false); setCropImageSrc(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Crop Area */}
            <div className="relative w-full h-80 bg-slate-950">
              <Cropper
                image={cropImageSrc || undefined}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Controls */}
            <div className="px-6 py-4 space-y-3 border-t border-slate-100 dark:border-white/5">
              {/* Zoom slider */}
              <div className="flex items-center gap-3">
                <ZoomOut size={14} className="text-slate-400 shrink-0" />
                <input
                  type="range"
                  aria-label="Zoom"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <ZoomIn size={14} className="text-slate-400 shrink-0" />
              </div>

              {/* Rotation */}
              <div className="flex items-center gap-3">
                <RotateCw size={14} className="text-slate-400 shrink-0" />
                <input
                  type="range"
                  aria-label="Rotasi"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-[10px] font-bold text-slate-400 w-10 text-right">{rotation}°</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
              <button
                onClick={() => { setCropModalOpen(false); setCropImageSrc(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleCropSave}
                className="px-5 py-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <Crop size={14} />
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
