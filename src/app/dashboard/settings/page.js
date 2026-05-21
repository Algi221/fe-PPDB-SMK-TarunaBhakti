"use client";

import React from "react";
import { usePPDB } from "@/context/PPDBContext";

export default function SimulationSettings() {
  const { simulationActive, setSimulationActive, simulateRegistration, wsStatus, applicants } = usePPDB();

  const handleSimulate = async () => {
    try {
      await simulateRegistration();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500 text-left">
      
      {/* Simulation Engine Glass Card */}
      <div className="bg-[#161f2e]/70 border border-white/5 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 mb-6">
          <div>
            <h3 className="text-base font-extrabold text-white tracking-wide uppercase">Engine Simulasi WebSocket</h3>
            <p className="text-xs text-slate-400 font-semibold tracking-wider mt-1">Lakukan pengetesan respon real-time portal PPDB secara langsung</p>
          </div>
          <div className="mt-4 md:mt-0 px-3.5 py-1.5 bg-slate-950/40 border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${wsStatus === "CONNECTED" ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
            <span className={`w-2 h-2 rounded-full absolute ${wsStatus === "CONNECTED" ? "bg-emerald-500" : "bg-rose-500"}`} />
            <span className="pl-1.5">Saluran Live: {wsStatus === "CONNECTED" ? "CONNECTED" : "DISCONNECTED"}</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Trigger Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-950/30 border border-white/5 rounded-2xl gap-4">
            <div>
              <h4 className="text-sm font-bold text-white leading-snug">Simulasi Pendaftaran Baru</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Memicu pembuatan profil calon siswa baru secara acak dan menyiarkannya via WebSocket.</p>
            </div>
            <button
              onClick={handleSimulate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(0,102,255,0.25)] hover:shadow-[0_4px_20px_rgba(0,102,255,0.35)] hover:brightness-110 active:scale-[0.98] shrink-0"
            >
              Simulasikan Siswa Baru
            </button>
          </div>

          {/* Background Interval Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-950/30 border border-white/5 rounded-2xl gap-4">
            <div>
              <h4 className="text-sm font-bold text-white leading-snug">Auto-Simulation Interval</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Secara otomatis menghasilkan pendaftaran calon siswa acak setiap 25 detik untuk simulasi berkelanjutan.</p>
            </div>
            <div className="flex items-center shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulationActive}
                  onChange={(e) => setSimulationActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
                <span className="ml-3 text-xs font-extrabold tracking-wide uppercase text-slate-300">
                  {simulationActive ? "AKTIF" : "TIDAK AKTIF"}
                </span>
              </label>
            </div>
          </div>

          {/* Warning / Tips alert */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold leading-relaxed">
            <h5 className="font-extrabold text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              💡 Informasi Tips Pengujian
            </h5>
            Untuk melihat efek visual yang menakjubkan (real-time synchronized updates):
            <ul className="list-disc list-inside mt-2 space-y-1 pl-1 font-medium">
              <li>Buka Tab halaman portal beranda PPDB di jendela baru di sebelah dashboard ini.</li>
              <li>Klik tombol <strong className="text-white">"Simulasikan Siswa Baru"</strong> di atas.</li>
              <li>Perhatikan bahwa calon siswa baru yang disimulasikan akan langsung muncul di baris tabel beranda utama tanpa memuat ulang halaman!</li>
              <li>Cobalah tolak berkas pendaftar tersebut di dashboard admin, dan Anda akan melihat baris nama siswa tersebut di beranda utama <strong className="text-white">seketika memudar dan menghilang (fade-out) secara halus!</strong></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Info Card Statistics */}
      <div className="bg-[#161f2e]/70 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 border-b border-white/5 pb-2">Status Penyimpanan Data</h4>
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
          <div className="p-3.5 bg-slate-950/20 border border-white/5 rounded-2xl">
            <span className="text-slate-400 block mb-0.5">Total Calon Siswa (Local State)</span>
            <span className="text-white font-extrabold text-lg leading-none">{applicants.length} Data</span>
          </div>
          <div className="p-3.5 bg-slate-950/20 border border-white/5 rounded-2xl">
            <span className="text-slate-400 block mb-0.5">Mode Penyimpanan</span>
            <span className="text-blue-400 font-extrabold text-sm uppercase tracking-wide">Dynamic Dual-Buffer API</span>
          </div>
        </div>
      </div>

    </div>
  );
}
