"use client";

import React from "react";
import { motion } from "framer-motion";

interface YsbmoStaffTabProps {
  ysbmoStaff: any[];
  ysbmoLoading: boolean;
  ysbmoError: string;
  showYsbmoTokenForm: boolean;
  setShowYsbmoTokenForm: (val: boolean) => void;
  ysbmoTokenInput: string;
  setYsbmoTokenInput: (val: string) => void;
  handleSaveYsbmoToken: (e: React.FormEvent) => void;
  handleMakeAdmin: (staff: any) => void;
  admins: any[];
}

export const YsbmoStaffTab: React.FC<YsbmoStaffTabProps> = ({
  ysbmoStaff,
  ysbmoLoading,
  ysbmoError,
  showYsbmoTokenForm,
  setShowYsbmoTokenForm,
  ysbmoTokenInput,
  setYsbmoTokenInput,
  handleSaveYsbmoToken,
  handleMakeAdmin,
  admins,
}) => {
  return (
    <>
      {/* Form Input Token YSBMO Manual */}
      {showYsbmoTokenForm && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveYsbmoToken}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Otentikasi API YSBMO Diperlukan</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Token YSBMO tidak ditemukan atau telah kedaluwarsa. Silakan masukkan token Authorization (Basic Auth) Anda untuk melanjutkan sinkronisasi data staff.
          </p>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Token Authorization / Basic Auth Value</label>
            <input
              type="text"
              required
              value={ysbmoTokenInput}
              onChange={(e) => setYsbmoTokenInput(e.target.value)}
              placeholder="Basic To/WbnZk0DNtT1PJAOOaz+HdrU5eQQjBZbQHy..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={ysbmoLoading}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            {ysbmoLoading ? "Menyimpan..." : "Simpan Token & Hubungkan"}
          </button>
        </motion.form>
      )}

      {ysbmoError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400">
          {ysbmoError}
        </div>
      )}

      {!showYsbmoTokenForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {ysbmoLoading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Memuat data staff YSBMO...</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Staff/Guru YSBMO: {ysbmoStaff.length}</span>
                <button
                  onClick={() => {
                    setShowYsbmoTokenForm(true);
                    setYsbmoTokenInput("");
                  }}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Update Token Manual
                </button>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Nama / ID Guru</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Sekolah / Unit</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ysbmoStaff.map((staff, idx) => {
                    const name = staff.text || staff.full_name || staff.nama_lengkap || staff.name || staff.nama || "-";
                    const username = staff.id || staff.username || staff.user_name || staff.nip || "-";
                    const schoolName = staff.nama_sekolah || staff.school_name || "-";
                    const schoolId = staff.id_school || staff.school_id || "-";
                    
                    const isLocalAdmin = admins.some((a) => a.username === username);

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 dark:text-white">{name}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-mono">@{username}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-700 dark:text-slate-300 font-semibold">{schoolName}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">ID Unit: {schoolId}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isLocalAdmin ? (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200/40 dark:border-emerald-800/40 font-bold">
                              Terdaftar Admin
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMakeAdmin(staff)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                              Jadikan Admin
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {ysbmoStaff.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                        Tidak ada data staff YSBMO ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};
