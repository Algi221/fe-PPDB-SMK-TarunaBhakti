"use client";

import React, { RefObject } from "react";
import { Camera, Trash2, User, Shield, Calendar } from "lucide-react";

interface ProfileCardProps {
  previewPhoto: string | null;
  userInitial: string;
  adminUser: any;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
}

export default function ProfileCard({
  previewPhoto,
  userInitial,
  adminUser,
  fileInputRef,
  onPhotoChange,
  onRemovePhoto,
}: ProfileCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm flex flex-col items-center gap-4 text-center">
      {/* Avatar */}
      <div className="relative group">
        <div className="w-28 h-28 rounded-3xl overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
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
          onChange={onPhotoChange}
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
            onClick={onRemovePhoto}
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
  );
}
