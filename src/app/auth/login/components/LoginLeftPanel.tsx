"use client";

import React from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LoginLeftPanelProps {
  leftPanelRef: React.RefObject<HTMLDivElement | null>;
  lottieRef: React.RefObject<any>;
  lottieData: object | null;
  c1: number;
  c2: number;
  c3: number;
}

export default function LoginLeftPanel({
  leftPanelRef,
  lottieRef,
  lottieData,
  c1,
  c2,
  c3
}: LoginLeftPanelProps) {
  return (
    <div
      ref={leftPanelRef}
      className="relative w-full lg:w-[46%] xl:w-[48%] min-h-[50vh] lg:min-h-screen
        bg-slate-50 dark:bg-slate-900 z-10
        border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-white/5
        overflow-hidden flex flex-col justify-between p-8 md:p-12 lg:p-14 transition-colors duration-300"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]
        bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]
        dark:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]
        bg-size-[28px_28px]" />

      {/* Soft radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand header */}
      <div className="relative z-10">
        <img
          src="/assets/logo_sekolah/logo_smktb.png"
          alt="Logo SMK Taruna Bhakti"
          className="brand-element w-14 h-14 object-contain mb-6 drop-shadow-md"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/logo_smktb.png";
          }}
        />
        <h1 className="brand-element text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-[1.15] mb-3">
          Portal Admin <br />
          <span className="text-blue-600 dark:text-blue-400">SMK Taruna Bhakti</span>
        </h1>
        <p className="brand-element text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-semibold">
          Sistem Informasi Manajemen Penerimaan Peserta Didik Baru (PPDB) terintegrasi.
        </p>
      </div>

      {/* Lottie Animation */}
      <div className="lottie-container relative z-10 my-4 lg:my-0 flex items-center justify-center flex-1">
        {lottieData ? (
          <div className="w-full max-w-130 mx-auto">
            <Lottie
              lottieRef={lottieRef}
              animationData={lottieData}
              loop={true}
              autoplay={true}
              className="w-full"
            />
          </div>
        ) : (
          <div className="w-80 h-80 bg-slate-200/60 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
        )}
      </div>

      {/* Mini stats row */}
      <div className="brand-element relative z-10 grid grid-cols-3 gap-3">
        {[
          { label: "Pendaftar", value: c1, suffix: "+" },
          { label: "Akurasi Data", value: c2, suffix: "%" },
          { label: "Jurusan", value: c3, suffix: "" },
        ].map((s) => (
          <div key={s.label}
            className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200/60 dark:border-white/8
              rounded-xl p-3 text-center"
          >
            <div className="text-xl font-black text-blue-600 dark:text-blue-400">
              {s.value}{s.suffix}
            </div>
            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
