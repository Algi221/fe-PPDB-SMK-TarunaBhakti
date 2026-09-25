"use client";

import React, { useState, useRef, useEffect } from "react";
import { Zap, RefreshCw, UserPlus, Timer, Play, Square, Users } from "lucide-react";

interface StudentSeederCardProps {
  simulateRegistration: () => Promise<any>;
  addToast?: (title: string, message: string, type: "success" | "danger" | "warning" | "info") => void;
}

export default function StudentSeederCard({ simulateRegistration, addToast }: StudentSeederCardProps) {
  const [seederInterval, setSeederInterval] = useState(5); // in seconds
  const [seederRunning, setSeederRunning] = useState(false);
  const [seederCount, setSeederCount] = useState(0);
  const [isSingleInserting, setIsSingleInserting] = useState(false);
  const seederRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (seederRef.current) clearInterval(seederRef.current);
    };
  }, []);

  const handleSingleInsert = async () => {
    try {
      setIsSingleInserting(true);
      await simulateRegistration();
      setSeederCount(prev => prev + 1);
      if (typeof addToast === "function") {
        addToast("Siswa Ditambahkan", "1 data pendaftar dummy berhasil dimasukkan.", "success");
      }
    } catch (err) {
      console.error(err);
      if (typeof addToast === "function") {
        addToast("Gagal", "Gagal memasukkan data dummy.", "danger");
      }
    } finally {
      setIsSingleInserting(false);
    }
  };

  const handleStartAutoGenerate = () => {
    if (seederRunning) return;
    setSeederRunning(true);
    setSeederCount(0);

    // Immediately insert one
    simulateRegistration().then(() => setSeederCount(1)).catch(console.error);

    seederRef.current = setInterval(async () => {
      try {
        await simulateRegistration();
        setSeederCount(prev => prev + 1);
      } catch (err) {
        console.error(err);
      }
    }, seederInterval * 1000);
  };

  const handleStopAutoGenerate = () => {
    if (seederRef.current) {
      clearInterval(seederRef.current);
      seederRef.current = null;
    }
    setSeederRunning(false);
    if (typeof addToast === "function" && seederCount > 0) {
      addToast("Auto-Generate Dihentikan", `Total ${seederCount} data pendaftar dummy telah dimasukkan.`, "success");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-62.5 h-62.5 rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/35 flex items-center justify-center text-emerald-600 dark:text-emerald-450 shrink-0">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-850 dark:text-white tracking-tight">
              Mode Pengujian Data
            </h3>
            <p className="text-xs text-slate-455 font-semibold mt-0.5">
              Masukkan data pendaftar dummy untuk simulasi dan pengujian sistem
            </p>
          </div>
        </div>
        
        <div className="hidden sm:block">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
            seederRunning 
              ? "bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-200/40 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 animate-pulse" 
              : "bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 text-slate-500 dark:text-slate-400"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${seederRunning ? "bg-emerald-500" : "bg-slate-400"}`}></div>
            {seederRunning ? "Active" : "Idle"}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Single insert */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">Masukkan Satu Siswa</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Tekan tombol untuk memasukkan 1 data pendaftar dummy secara instan.</p>
          </div>
          <button
            onClick={handleSingleInsert}
            disabled={isSingleInserting || seederRunning}
            className="px-5 py-3 bg-linear-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.25)] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer shrink-0"
          >
            {isSingleInserting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Menambahkan...
              </>
            ) : (
              <>
                <UserPlus size={14} />
                Tambah 1 Siswa
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-800/60"></div>

        {/* Auto Generate */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">Auto-Generate Siswa</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Masukkan data pendaftar secara otomatis dengan interval waktu yang bisa diatur.</p>
          </div>

          {/* Interval config */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl flex-1">
              <Timer size={14} className="text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Interval:</span>
              <input
                type="number"
                min={1}
                max={120}
                value={seederInterval}
                onChange={(e) => setSeederInterval(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
                disabled={seederRunning}
                className="w-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-1.5 text-xs font-black text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50 transition-all"
              />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">detik</span>
            </div>
          </div>

          {/* Start / Stop + counter */}
          <div className="flex items-center gap-3">
            {!seederRunning ? (
              <button
                onClick={handleStartAutoGenerate}
                className="px-5 py-3 bg-linear-to-r from-blue-600 to-indigo-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <Play size={14} />
                Mulai Auto-Generate
              </button>
            ) : (
              <button
                onClick={handleStopAutoGenerate}
                className="px-5 py-3 bg-linear-to-r from-rose-600 to-pink-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(244,63,94,0.15)] hover:shadow-[0_4px_20px_rgba(244,63,94,0.25)] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <Square size={14} />
                Stop Auto-Generate
              </button>
            )}

            {/* Live counter */}
            {(seederRunning || seederCount > 0) && (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 rounded-2xl">
                <Users size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                  {seederCount} <span className="font-bold text-emerald-500">siswa ditambahkan</span>
                </span>
                {seederRunning && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
