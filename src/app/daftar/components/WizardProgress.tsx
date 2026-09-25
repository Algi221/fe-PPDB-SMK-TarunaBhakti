"use client";

import React from "react";

interface WizardProgressProps {
  wizardStep: number;
  goToStep: (step: number) => void;
  getStepLabel: (step: number) => string;
}

export default function WizardProgress({
  wizardStep,
  goToStep,
  getStepLabel,
}: WizardProgressProps) {
  return (
    <>
      <div className="mb-10 text-center mt-12 relative z-10 flex flex-col items-center">
        <div className="mb-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100/50 dark:border-blue-900/50 text-blue-600 dark:text-sky-400 text-xs font-bold shadow-sm shadow-blue-500/5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-sky-400 animate-pulse"></span>
          Tahap {wizardStep} dari 14
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-2 drop-shadow-sm">Formulir Pendaftaran PPDB</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium bg-white/60 dark:bg-slate-900/60 backdrop-blur-md inline-block px-4 py-1.5 rounded-full border border-white/60 dark:border-slate-800/60 shadow-sm mt-2">SMK Taruna Bhakti Tahun Ajaran 2026/2027</p>
      </div>
    </>
  );
}
