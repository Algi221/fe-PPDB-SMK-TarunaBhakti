"use client";

import React from "react";
import { RotateCcw, Trash2 } from "lucide-react";

interface TrashAdminTabProps {
  trashedAdmins: any[];
  trashLoading: boolean;
  handleRestoreAdmin: (id: number) => void;
  handlePermanentDeleteAdmin: (id: number) => void;
}

export const TrashAdminTab: React.FC<TrashAdminTabProps> = ({
  trashedAdmins,
  trashLoading,
  handleRestoreAdmin,
  handlePermanentDeleteAdmin,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {trashLoading ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Memuat data sampah...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Nama / Username</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {trashedAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-white">{admin.nama_lengkap}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-mono">@{admin.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        admin.role === "superadmin"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleRestoreAdmin(admin.id)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                      title="Pulihkan Admin"
                    >
                      <RotateCcw size={14} />
                      Pulihkan
                    </button>

                    <button
                      onClick={() => handlePermanentDeleteAdmin(admin.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-650 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:text-rose-450 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                      title="Hapus Permanen"
                    >
                      <Trash2 size={14} />
                      Hapus Permanen
                    </button>
                  </td>
                </tr>
              ))}

              {trashedAdmins.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    Tempat sampah kosong.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
