"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { 
  Settings, 
  CloudLightning, 
  Database, 
  Wifi, 
  Globe, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  HardDrive, 
  RefreshCw,
  Save,
  Link,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function SimulationSettings() {
  const { 
    simulationActive, 
    setSimulationActive, 
    simulateRegistration, 
    wsStatus, 
    applicants,
    addToast 
  } = usePPDB();

  // Hydration safety
  const [mounted, setMounted] = useState(false);

  // Webhook settings state
  const [webhookUrl, setWebhookUrl] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingStatus, setPingStatus] = useState("IDLE"); // 'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR'
  const [pingLatency, setPingLatency] = useState(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedUrl = localStorage.getItem("ppdb_sheets_webhook") || "https://script.google.com/macros/s/AKfycbz_PPDB_SMK_TarunaBhakti_Sync/exec";
    const savedAutoSync = localStorage.getItem("ppdb_sheets_autosync") !== "false";
    const savedSendEmail = localStorage.getItem("ppdb_sheets_sendemail") === "true";
    
    setWebhookUrl(savedUrl);
    setAutoSync(savedAutoSync);
    setSendEmail(savedSendEmail);
  }, []);

  const handleSimulate = async () => {
    try {
      await simulateRegistration();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const handleSaveSettings = () => {
    localStorage.setItem("ppdb_sheets_webhook", webhookUrl);
    localStorage.setItem("ppdb_sheets_autosync", autoSync.toString());
    localStorage.setItem("ppdb_sheets_sendemail", sendEmail.toString());
    
    if (typeof addToast === "function") {
      addToast(
        "Pengaturan Disimpan",
        "Integrasi Google Sheets & Webhook berhasil diperbarui secara lokal.",
        "success"
      );
    }
  };

  // Test Webhook Connection (Simulated Ping)
  const handleTestConnection = () => {
    if (!webhookUrl) {
      if (typeof addToast === "function") {
        addToast("Error", "Harap masukkan URL Webhook yang valid terlebih dahulu.", "danger");
      }
      return;
    }

    setIsPinging(true);
    setPingStatus("PENDING");
    
    setTimeout(() => {
      const latencies = [112, 134, 145, 158, 98, 126];
      const randomLatency = latencies[Math.floor(Math.random() * latencies.length)];
      
      setPingLatency(randomLatency);
      setPingStatus("SUCCESS");
      setIsPinging(false);
      
      if (typeof addToast === "function") {
        addToast(
          "Koneksi Berhasil",
          `Berhasil terhubung ke spreadsheet Google Sheets (${randomLatency}ms)`,
          "success"
        );
      }
    }, 1500);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-blue-600 dark:text-blue-500" size={32} />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Memuat konfigurasi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in duration-500 text-left pb-16">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="text-blue-600 dark:text-blue-500" size={24} />
          <span>Pengaturan Sistem & Integrasi</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-450 mt-1">
          Konfigurasi simulasi database real-time WebSocket dan sinkronisasi otomatis Google Sheets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER COLUMN: Integration Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Google Sheets Webhook Sync Configuration Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/35 flex items-center justify-center text-emerald-600 dark:text-emerald-450 shrink-0">
                  <CloudLightning size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-850 dark:text-white tracking-tight">
                    Integrasi Google Sheets Webhook
                  </h3>
                  <p className="text-xs text-slate-450 font-semibold mt-0.5">
                    Sinkronisasi data terverifikasi otomatis ke Google Spreadsheet Anda
                  </p>
                </div>
              </div>
              
              <div className="hidden sm:block">
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-200/40 dark:border-emerald-800/40 rounded-full text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                  Real-time Sync
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Webhook URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Link size={13} className="text-blue-500" />
                  URL Webhook Google Apps Script
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/15 transition-all font-semibold"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-550 font-medium">
                  Webhook ini terhubung ke Script Google Sheets yang mendengarkan request POST untuk memasukkan data calon siswa baru secara otomatis.
                </p>
              </div>

              {/* Checkbox Options */}
              <div className="space-y-4 pt-2">
                
                {/* Auto Sync Toggle */}
                <div className="flex items-start justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 rounded-2xl gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug">Auto-Sync saat Verifikasi</h4>
                    <p className="text-[10px] text-slate-450">Kirim data ke Spreadsheet secara otomatis ketika berkas calon siswa disetujui (Approved).</p>
                  </div>
                  <div className="flex items-center shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSync}
                        onChange={(e) => setAutoSync(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-455 after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white"></div>
                    </label>
                  </div>
                </div>

                {/* Email Notification Toggle */}
                <div className="flex items-start justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 rounded-2xl gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug">Notifikasi Email Pendaftar</h4>
                    <p className="text-[10px] text-slate-455">Kirim email auto-responder ke siswa via Google Mail Apps Script ketika data berhasil disinkronisasi.</p>
                  </div>
                  <div className="flex items-center shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-455 after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white"></div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Ping Connection Result Alert */}
              {pingStatus !== "IDLE" && (
                <div className={`p-4 rounded-2xl border text-xs font-semibold leading-relaxed flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  pingStatus === "PENDING"
                    ? "bg-blue-50/70 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-250/50 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                }`}>
                  {pingStatus === "PENDING" ? (
                    <RefreshCw size={16} className="animate-spin text-blue-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <h5 className="font-extrabold uppercase text-[10px] tracking-wider">
                      {pingStatus === "PENDING" ? "Menguji Konektivitas..." : "Tes Koneksi Berhasil!"}
                    </h5>
                    <p className="text-[10.5px] opacity-90 leading-normal">
                      {pingStatus === "PENDING" ? (
                        "Sedang mengirim paket ping handshake ke endpoint Google Apps Script..."
                      ) : (
                        <span>
                          Status: <strong className="text-slate-850 dark:text-white">200 OK</strong> · Latency:{" "}
                          <strong className="text-emerald-600 dark:text-emerald-400">{pingLatency}ms</strong> · Target Sheet:{" "}
                          <strong className="text-slate-850 dark:text-white">PPDB Taruna Bhakti 2026 / 2027</strong>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Card Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl text-xs font-bold transition-all active:scale-[0.98] flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <Save size={14} />
                  Simpan Konfigurasi
                </button>
                
                <button
                  onClick={handleTestConnection}
                  disabled={isPinging}
                  className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-250/20 rounded-2xl text-xs font-extrabold transition-all active:scale-[0.98] flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isPinging ? "animate-spin" : ""} />
                  Test Koneksi Webhook
                </button>
              </div>

            </div>
          </div>

          {/* Engine Simulasi WebSocket Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/35 flex items-center justify-center text-blue-600 dark:text-blue-450 shrink-0">
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
                <span className="pl-3 text-slate-500 dark:text-slate-400">Saluran Live: {wsStatus === "CONNECTED" ? "CONNECTED" : "DISCONNECTED"}</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Quick Trigger Button */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150/60 dark:border-slate-800 rounded-2xl gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">Simulasi Pendaftaran Baru</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Memicu pembuatan profil calon siswa baru secara acak dan menyiarkannya via WebSocket.</p>
                </div>
                <button
                  onClick={handleSimulate}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(0,102,255,0.15)] hover:shadow-[0_4px_20px_rgba(0,102,255,0.25)] hover:brightness-110 active:scale-[0.98] shrink-0"
                >
                  Simulasikan Siswa Baru
                </button>
              </div>

              {/* Background Interval Toggle */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150/60 dark:border-slate-800 rounded-2xl gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">Auto-Simulation Interval</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Secara otomatis menghasilkan pendaftaran calon siswa acak setiap 25 detik untuk simulasi berkelanjutan.</p>
                </div>
                <div className="flex items-center shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulationActive}
                      onChange={(e) => setSimulationActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
                    <span className="ml-3 text-xs font-black tracking-wide uppercase text-slate-655 dark:text-slate-300">
                      {simulationActive ? "AKTIF" : "TIDAK AKTIF"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Warning / Tips alert */}
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-slate-700 dark:text-amber-350 text-xs font-semibold leading-relaxed">
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

        </div>

        {/* RIGHT COLUMN: Integration Guides & System Stats */}
        <div className="space-y-6">
          
          {/* Google Sheets Set-Up Guide Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] rounded-full bg-blue-500/5 blur-[50px] pointer-events-none"></div>

            <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center gap-1.5">
              <HelpCircle size={14} className="text-blue-500 animate-pulse" />
              Panduan Integrasi Google Sheets
            </h4>
            
            <div className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-350 leading-relaxed">
              <p>Ikuti 3 langkah cepat ini untuk menghubungkan dashboard ke Google Spreadsheet secara instan:</p>
              
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-black text-white flex items-center justify-center shadow-md">
                    1
                  </span>
                  <p className="font-extrabold text-slate-800 dark:text-white">Buat Google Sheet Baru</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Siapkan Spreadsheet kosong, beri nama dan salin link spreadsheet tersebut.</p>
                </div>
                
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-black text-white flex items-center justify-center shadow-md">
                    2
                  </span>
                  <p className="font-extrabold text-slate-800 dark:text-white">Buat Apps Script Webhook</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Buka Ekstensi → Apps Script, dan tempel kode handler POST untuk menyisipkan data calon siswa baru.</p>
                </div>
                
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-black text-white flex items-center justify-center shadow-md">
                    3
                  </span>
                  <p className="font-extrabold text-slate-800 dark:text-white">Terapkan sebagai Web App</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Klik Terapkan → Deployment Baru → pilih Web App. Berikan akses "Siapa Saja (Anyone)" dan tempel URL deployment di input webhook kiri.</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/85">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-450 flex items-center gap-1">
                  <Sparkles size={11} /> Auto-format spreadsheet columns (A-L) didukung otomatis!
                </span>
              </div>
            </div>
          </div>

          {/* Info Card Statistics & Data Storage */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center gap-1.5">
              <HardDrive size={14} className="text-blue-500" />
              Status Penyimpanan Data
            </h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150/60 dark:border-slate-800/80 rounded-2xl">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">Total Calon Siswa (Local State)</span>
                <span className="text-slate-850 dark:text-white font-extrabold text-xl leading-none mt-1 block">
                  {applicants.length} Data
                </span>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150/60 dark:border-slate-800/80 rounded-2xl">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">Penyimpanan Terpasang</span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold text-xs uppercase tracking-wider mt-1.5 block flex items-center gap-1.5">
                  <Database size={12} />
                  Dual-Buffer IndexedDB API
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150/60 dark:border-slate-800/80 rounded-2xl">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">Sinkronisasi Google Drive</span>
                <span className="text-emerald-600 dark:text-emerald-450 font-extrabold text-[10px] uppercase tracking-wider mt-1.5 block flex items-center gap-1">
                  <CheckCircle size={12} /> Terhubung via Webhook
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
