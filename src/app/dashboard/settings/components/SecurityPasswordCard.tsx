"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, KeyRound, Eye, EyeOff, RefreshCw } from "lucide-react";

interface SecurityPasswordCardProps {
  adminToken: string | null;
  addToast?: (title: string, message: string, type: "success" | "danger" | "warning" | "info") => void;
}

export default function SecurityPasswordCard({ adminToken, addToast }: SecurityPasswordCardProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Password saat ini wajib diisi.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password baru harus minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      
      const res = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof addToast === "function") {
          addToast(
            "Password Diubah",
            data.message || "Password admin berhasil diperbarui.",
            "success"
          );
        }
        
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.message || "Gagal mengubah password.");
        if (typeof addToast === "function") {
          addToast("Gagal", data.message || "Gagal mengubah password.", "warning");
        }
      }
    } catch (err: any) {
      setPasswordError("Gagal menghubungi server backend.");
      if (typeof addToast === "function") {
        addToast("Error", "Koneksi ke server terputus.", "danger");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-62.5 h-62.5 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/35 flex items-center justify-center text-blue-600 dark:text-blue-450 shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-850 dark:text-white tracking-tight">
              Keamanan & Ganti Password
            </h3>
            <p className="text-xs text-slate-455 font-semibold mt-0.5">
              Perbarui kata sandi akun administrator secara berkala untuk perlindungan data
            </p>
          </div>
        </div>
        
        <div className="hidden sm:block">
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/45 border border-blue-200/40 dark:border-blue-800/40 rounded-full text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 tracking-wider flex items-center gap-1">
            <ShieldCheck size={10} /> Secure Hash
          </span>
        </div>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-5">
        {passwordError && (
          <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold leading-relaxed flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500"></div>
            <span>{passwordError}</span>
          </div>
        )}

        {/* Password saat ini */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-455 flex items-center gap-1.5">
            <KeyRound size={13} className="text-slate-455" />
            Password Saat Ini
          </label>
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan password saat ini..."
              className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all font-semibold"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 dark:hover:text-white transition-colors"
            >
              {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password baru */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-455 flex items-center gap-1.5">
              <Lock size={13} className="text-slate-455" />
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter..."
                className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Konfirmasi password baru */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-455 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-slate-455" />
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru..."
                className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Tombol submit - Fixed duplicate font-black and font-bold */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isChangingPassword}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-500 hover:brightness-110 text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_4px_15_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20_rgba(59,130,246,0.25)] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isChangingPassword ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Lock size={14} />
                Simpan Password Baru
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
