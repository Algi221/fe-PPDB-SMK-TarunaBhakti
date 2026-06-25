"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import {
  Camera, User, Lock, Save, Eye, EyeOff, CheckCircle2,
  AlertCircle, Shield, Calendar, Trash2
} from "lucide-react";

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

  // ── Photo upload ─────────────────────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setProfileMsg({ type: "error", text: "Ukuran foto maksimal 2MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewPhoto(base64);
      setFotoProfil(base64);
    };
    reader.readAsDataURL(file);
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
          setAdminUser({
            ...adminUser,
            nama: data.admin.nama,
            username: data.admin.username,
            foto_profil: data.admin.foto_profil,
          });
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm flex flex-col items-center gap-4 text-center">

            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                {previewPhoto ? (
                  <img src={previewPhoto} alt="Foto Profil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-white">{userInitial}</span>
                )}
              </div>

              {/* Camera overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Photo actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40 rounded-xl text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-all flex items-center gap-1.5"
              >
                <Camera size={12} />
                Ganti Foto
              </button>
              {previewPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={12} />
                  Hapus
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium">
              JPG, PNG atau WebP. Maks. 2MB.
            </p>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

            {/* Info */}
            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                  <User size={14} className="text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{adminUser?.nama || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                  <Shield size={14} className="text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Role</p>
                  <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    adminUser?.role === "superadmin"
                      ? "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400"
                      : "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                  }`}>
                    {adminUser?.role || "admin"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Username</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">@{adminUser?.username || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Forms ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Edit Profile Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                <User size={16} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Informasi Profil</h2>
                <p className="text-[10px] text-slate-400 font-semibold">Perbarui nama dan username akun Anda</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Hanya huruf, angka, dan underscore.</p>
              </div>

              {/* Status Message */}
              {profileMsg && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold ${
                  profileMsg.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40"
                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
                }`}>
                  {profileMsg.type === "success"
                    ? <CheckCircle2 size={14} className="shrink-0" />
                    : <AlertCircle size={14} className="shrink-0" />}
                  {profileMsg.text}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                >
                  {profileSaving ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
                <Lock size={16} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Ubah Password</h2>
                <p className="text-[10px] text-slate-400 font-semibold">Pastikan akun Anda menggunakan password yang kuat</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Password Saat Ini
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPwd ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPwd((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showCurrentPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPwd ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Password strength bar */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => {
                        const strength = Math.min(
                          Math.floor(newPassword.length / 3) +
                          (newPassword.length >= 8 ? 1 : 0) +
                          (/[A-Z]/.test(newPassword) ? 0.5 : 0) +
                          (/[0-9]/.test(newPassword) ? 0.5 : 0) +
                          (/[^a-zA-Z0-9]/.test(newPassword) ? 1 : 0),
                          4
                        );
                        return (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i < strength
                                ? strength <= 1 ? "bg-rose-400" : strength <= 2 ? "bg-amber-400" : strength <= 3 ? "bg-blue-400" : "bg-emerald-400"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <p className={`text-[9px] font-bold ${
                      newPassword.length < 6 ? "text-rose-400" : newPassword.length < 10 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {newPassword.length < 6 ? "Terlalu pendek" : newPassword.length < 10 ? "Password cukup" : "Password kuat"}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className={`w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      confirmPassword && newPassword !== confirmPassword
                        ? "border-rose-400 focus:ring-rose-500/30 focus:border-rose-500"
                        : confirmPassword && newPassword === confirmPassword
                        ? "border-emerald-400 focus:ring-emerald-500/30 focus:border-emerald-500"
                        : "border-slate-200/80 dark:border-slate-700/60 focus:ring-amber-500/30 focus:border-amber-500/60"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  {confirmPassword && newPassword === confirmPassword && (
                    <CheckCircle2 size={14} className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500" />
                  )}
                </div>
              </div>

              {/* Status Message */}
              {passwordMsg && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold ${
                  passwordMsg.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40"
                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
                }`}>
                  {passwordMsg.type === "success"
                    ? <CheckCircle2 size={14} className="shrink-0" />
                    : <AlertCircle size={14} className="shrink-0" />}
                  {passwordMsg.text}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-tr from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                >
                  {passwordSaving ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      Ubah Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
