"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { 
  Settings, 
  Database, 
  Wifi, 
  CheckCircle, 
  HardDrive, 
  RefreshCw,
  Sparkles,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  ShieldAlert,
  Calendar
} from "lucide-react";
import DateRangeCalendar from "@/components/DateRangeCalendar";

export default function SimulationSettings() {
  const { 
    simulationActive, 
    setSimulationActive, 
    simulateRegistration, 
    wsStatus, 
    applicants,
    adminToken,
    addToast 
  } = usePPDB();

  // Keamanan hidrasi
  const [mounted, setMounted] = useState<boolean>(false);

  // State ubah password admin
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // State konfigurasi gelombang PPDB
  const [gelombangConfig, setGelombangConfig] = useState<{
    gelombang1: { start: string; end: string };
    gelombang2: { start: string; end: string };
  }>({
    gelombang1: { start: "", end: "" },
    gelombang2: { start: "", end: "" }
  });
  const [g1Error, setG1Error] = useState<string | null>(null);
  const [g2Error, setG2Error] = useState<string | null>(null);
  const [isSavingGelombang, setIsSavingGelombang] = useState(false);

  // State konfigurasi rekening bank
  const [bankConfig, setBankConfig] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: ""
  });
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Ambil konfigurasi saat render awal
  useEffect(() => {
    setMounted(true);
    fetchGelombangConfig();
    fetchBankConfig();
  }, []);

  const fetchGelombangConfig = async () => {
    try {
      const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
      const res = await fetch(`${BACKEND_URL}/api/config`);
      const json = await res.json();
      if (json.success && json.data && json.data.ppdb_gelombang_config) {
        const conf = json.data.ppdb_gelombang_config;
        setGelombangConfig({
          gelombang1: conf.gelombang1 || { start: "", end: "" },
          gelombang2: conf.gelombang2 || { start: "", end: "" }
        });
      }
    } catch (e) {
      console.error("Gagal mengambil konfigurasi gelombang:", e);
    }
  };

  const fetchBankConfig = async () => {
    try {
      const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
      const res = await fetch(`${BACKEND_URL}/api/config`);
      const json = await res.json();
      if (json.success && json.data && json.data.ppdb_bank_config) {
        setBankConfig(json.data.ppdb_bank_config);
      }
    } catch (e) {
      console.error("Gagal mengambil konfigurasi bank:", e);
    }
  };

  const handleSaveBank = async () => {
    setIsSavingBank(true);
    try {
      const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      
      const res = await fetch(`${BACKEND_URL}/api/config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          key: "ppdb_bank_config",
          value: bankConfig
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof addToast === "function") {
          addToast("Konfigurasi Disimpan", "Pengaturan rekening bank berhasil disimpan.", "success");
        }
        localStorage.setItem("ppdb_bank_config", JSON.stringify(bankConfig));
      } else {
        if (typeof addToast === "function") {
          addToast("Gagal", data.message || "Gagal menyimpan konfigurasi bank.", "warning");
        }
      }
    } catch (err) {
      console.error(err);
      if (typeof addToast === "function") {
        addToast("Error", "Gagal menghubungi server backend.", "danger");
      }
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleSaveGelombang = async () => {
    setIsSavingGelombang(true);
    try {
      const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      
      const res = await fetch(`${BACKEND_URL}/api/config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          key: "ppdb_gelombang_config",
          value: gelombangConfig
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof addToast === "function") {
          addToast(
            "Konfigurasi Disimpan",
            "Pengaturan rentang tanggal gelombang berhasil disimpan.",
            "success"
          );
        }
      } else {
        if (typeof addToast === "function") {
          addToast("Gagal", data.message || "Gagal menyimpan konfigurasi gelombang.", "warning");
        }
      }
    } catch (err) {
      console.error(err);
      if (typeof addToast === "function") {
        addToast("Error", "Gagal menghubungi server backend.", "danger");
      }
    } finally {
      setIsSavingGelombang(false);
    }
  };

  const handleSimulate = async () => {
    try {
      await simulateRegistration();
    } catch (err) {
      console.error(err);
    }
  };

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
        // Reset form
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

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-blue-500 dark:text-blue-400" size={32} />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-455">Memuat konfigurasi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in duration-500 text-left pb-16">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="text-blue-500 dark:text-blue-400" size={24} />
          <span>Pengaturan Sistem & Keamanan</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-455 mt-1">
          Perbarui keamanan akun administrator dan kendalikan engine simulasi portal PPDB real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER COLUMN: Integration Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Keamanan & Ganti Password Admin Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none"></div>

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

              {/* Tombol submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_4px_15_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20_rgba(59,130,246,0.25)] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer font-black"
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

          {/* Kartu engine simulasi WebSocket */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/35 flex items-center justify-center text-blue-500 dark:text-blue-455 shrink-0">
                  <Wifi size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-850 dark:text-white tracking-tight">
                    Engine Simulasi WebSocket
                  </h3>
                  <p className="text-xs text-slate-450 font-semibold mt-0.5">
                    Lakukan pengetesan respon real-time portal PPDB secara langsung
                  </p>
                </div>
              </div>

              <div className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 relative self-start sm:self-auto">
                <span className={`w-2 h-2 rounded-full ${wsStatus === "CONNECTED" ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
                <span className={`w-2 h-2 rounded-full absolute ${wsStatus === "CONNECTED" ? "bg-emerald-500" : "bg-rose-500"}`} />
                <span className="pl-3 text-slate-500 dark:text-slate-450">Saluran Live: {wsStatus === "CONNECTED" ? "CONNECTED" : "DISCONNECTED"}</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Tombol pemicu cepat */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150/60 dark:border-slate-800 rounded-2xl gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">Simulasi Pendaftaran Baru</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-550 mt-0.5">Memicu pembuatan profil calon siswa baru secara acak dan menyiarkannya via WebSocket.</p>
                </div>
                <button
                  onClick={handleSimulate}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_4px_15_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20_rgba(59,130,246,0.25)] hover:brightness-110 active:scale-[0.98] shrink-0"
                >
                  Simulasikan Siswa Baru
                </button>
              </div>

              {/* Saklar interval simulasi otomatis */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150/60 dark:border-slate-800 rounded-2xl gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">Auto-Simulation Interval</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-550 mt-0.5">Secara otomatis menghasilkan pendaftaran calon siswa acak setiap 25 detik untuk simulasi berkelanjutan.</p>
                </div>
                <div className="flex items-center shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulationActive}
                      onChange={(e) => setSimulationActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 peer-checked:after:bg-white"></div>
                    <span className="ml-3 text-xs font-black tracking-wide uppercase text-slate-655 dark:text-slate-300">
                      {simulationActive ? "AKTIF" : "TIDAK AKTIF"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Peringatan / Tips simulasi */}
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-slate-700 dark:text-amber-355 text-xs font-semibold leading-relaxed">
                <h5 className="font-extrabold text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  💡 Informasi Tips Pengujian
                </h5>
                Untuk melihat efek visual yang menakjubkan (real-time synchronized updates):
                <ul className="list-disc list-inside mt-2 space-y-1.5 pl-1 font-medium text-slate-600 dark:text-slate-350 text-[11px]">
                  <li>Buka Tab halaman portal beranda PPDB di jendela baru di sebelah dashboard ini.</li>
                  <li>Klik tombol <strong className="text-blue-600 dark:text-white">"Simulasikan Siswa Baru"</strong> di atas.</li>
                  <li>Perhatikan bahwa calon siswa baru yang disimulasikan akan langsung muncul di baris tabel beranda utama tanpa memuat ulang halaman!</li>
                  <li>Cobalah tolak berkas pendaftar tersebut di dashboard admin, dan Anda akan melihat baris nama siswa tersebut di beranda utama <strong className="text-rose-500 dark:text-white font-bold">seketika memudar dan menghilang (fade-out) secara halus!</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Kartu pengaturan gelombang pendaftaran */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/35 flex items-center justify-center text-blue-600 dark:text-blue-450 shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-850 dark:text-white tracking-tight">
                    Pengaturan Gelombang Pendaftaran
                  </h3>
                  <p className="text-xs text-slate-455 font-semibold mt-0.5">
                    Atur rentang tanggal pendaftaran untuk Gelombang 1 dan Gelombang 2
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data Gelombang 1 */}
              <DateRangeCalendar
                label="Gelombang 1"
                startValue={gelombangConfig.gelombang1.start}
                endValue={gelombangConfig.gelombang1.end}
                onSelectRange={(start, end) => {
                  setGelombangConfig(prev => ({
                    ...prev,
                    gelombang1: { start, end }
                  }));
                }}
                excludeRange={gelombangConfig.gelombang2.start && gelombangConfig.gelombang2.end ? gelombangConfig.gelombang2 : null}
                error={g1Error}
                setError={setG1Error}
              />

              {/* Data Gelombang 2 */}
              <DateRangeCalendar
                label="Gelombang 2"
                startValue={gelombangConfig.gelombang2.start}
                endValue={gelombangConfig.gelombang2.end}
                onSelectRange={(start, end) => {
                  setGelombangConfig(prev => ({
                    ...prev,
                    gelombang2: { start, end }
                  }));
                }}
                excludeRange={gelombangConfig.gelombang1.start && gelombangConfig.gelombang1.end ? gelombangConfig.gelombang1 : null}
                error={g2Error}
                setError={setG2Error}
              />
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveGelombang}
                disabled={isSavingGelombang || !!g1Error || !!g2Error}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_4px_15_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20_rgba(59,130,246,0.25)] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer font-black"
              >
                {isSavingGelombang ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Calendar size={14} />
                    Simpan Rentang Gelombang
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Kartu pengaturan rekening bank sekolah */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/35 flex items-center justify-center text-emerald-600 dark:text-emerald-450 shrink-0">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-850 dark:text-white tracking-tight">
                    Pengaturan Rekening Bank Sekolah
                  </h3>
                  <p className="text-xs text-slate-455 font-semibold mt-0.5">
                    Konfigurasikan informasi rekening bank sekolah untuk transfer manual pendaftaran
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-455">
                  Nama Bank
                </label>
                <input
                  type="text"
                  value={bankConfig.bankName}
                  onChange={(e) => setBankConfig(prev => ({ ...prev, bankName: e.target.value }))}
                  placeholder="Contoh: Bank Mandiri, BCA, BJB..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500 transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-455">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={bankConfig.accountNumber}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Contoh: 157-00-0174092-2"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-455">
                    Nama Pemilik Rekening (A.N.)
                  </label>
                  <input
                    type="text"
                    value={bankConfig.accountHolder}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, accountHolder: e.target.value }))}
                    placeholder="Contoh: SMK Taruna Bhakti"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500 transition-all font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveBank}
                disabled={isSavingBank || !bankConfig.bankName || !bankConfig.accountNumber || !bankConfig.accountHolder}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:brightness-110 text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_4px_15_rgba(16,185,129,0.15)] hover:shadow-[0_4px_20_rgba(16,185,129,0.25)] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer font-black"
              >
                {isSavingBank ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    Simpan Rekening Bank
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* KOLOM KANAN: Panduan & Status Sistem */}
        <div className="space-y-6">
          
          {/* Kartu tips keamanan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] rounded-full bg-blue-500/5 blur-[50px] pointer-events-none"></div>

            <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-blue-500 animate-pulse" />
              Keamanan Akun & Tips
            </h4>
            
            <div className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-355 leading-relaxed">
              <p>Jaga keamanan dashboard administrator PPDB dengan mengikuti panduan dasar berikut:</p>
              
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center shadow-md">
                    1
                  </span>
                  <p className="font-extrabold text-slate-800 dark:text-white">Ganti Sandi Berkala</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Lakukan penggantian kata sandi secara rutin setiap 3-6 bulan untuk mencegah akses yang tidak sah.</p>
                </div>
                
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center shadow-md">
                    2
                  </span>
                  <p className="font-extrabold text-slate-800 dark:text-white">Kombinasi Karakter</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Gunakan kombinasi huruf besar, huruf kecil, angka, dan karakter spesial untuk kekuatan sandi maksimal.</p>
                </div>
                
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center shadow-md">
                    3
                  </span>
                  <p className="font-extrabold text-slate-800 dark:text-white">Hindari Berbagi Akun</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pastikan kredensial login disimpan secara aman dan tidak dibagikan ke pihak luar demi menjaga integritas data pendaftar.</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-455 flex items-center gap-1">
                  <Sparkles size={11} /> Menggunakan enkripsi satu arah BCrypt di level database.
                </span>
              </div>
            </div>
          </div>

          {/* Kartu statistik data & penyimpanan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-455 border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4 flex items-center gap-1.5">
              <HardDrive size={14} className="text-blue-500" />
              Status Penyimpanan Data
            </h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150/60 dark:border-slate-800 rounded-2xl">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">Total Calon Siswa (Local State)</span>
                <span className="text-slate-850 dark:text-white font-extrabold text-xl leading-none mt-1 block">
                  {applicants.length} Data
                </span>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150/60 dark:border-slate-800 rounded-2xl">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">Penyimpanan Terpasang</span>
                <div className="text-blue-600 dark:text-blue-400 font-extrabold text-xs uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                  <Database size={12} />
                  Dual-Buffer IndexedDB API
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150/60 dark:border-slate-800 rounded-2xl">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">Autentikasi Sesi</span>
                <div className="text-emerald-600 dark:text-emerald-455 font-extrabold text-[10px] uppercase tracking-wider mt-1.5 flex items-center gap-1">
                  <CheckCircle size={12} /> JSON Web Token (JWT)
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
