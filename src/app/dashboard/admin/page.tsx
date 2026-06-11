"use client";

import { useEffect, useState } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter } from "next/navigation";
import { Shield, User } from "lucide-react";

export default function AdminManagementPage() {
  const { adminUser, adminToken } = usePPDB();
  const router = useRouter();
  
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Hanya superadmin yang boleh masuk halaman ini
    if (adminUser && adminUser.role !== 'superadmin') {
      router.push('/dashboard');
      return;
    }
    fetchAdmins();
  }, [adminUser, router]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data);
      } else {
        setError(data.message || 'Gagal mengambil data admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!adminUser || adminUser.role !== 'superadmin') {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Shield className="text-emerald-500" size={28} />
            Manajemen Admin
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Akun admin dikelola terpusat melalui sistem sekolah (YSBMO) dan tersinkronisasi otomatis saat pertama kali login.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Nama / Username</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">{admin.nama_lengkap}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-mono">@{admin.username}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        admin.role === 'superadmin' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {admins.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                      Belum ada data admin terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
