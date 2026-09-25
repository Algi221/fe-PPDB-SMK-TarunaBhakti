"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Award, Sparkles, ArrowRight, Check } from "lucide-react";

interface MajorCareersAndPartnersProps {
  major: any;
  nextMajor: any;
  nextCode: string;
}

export default function MajorCareersAndPartners({
  major,
  nextMajor,
  nextCode,
}: MajorCareersAndPartnersProps) {
  return (
    <>
      {/* CAREERS OPPORTUNITY SECTION */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30 relative border-y border-slate-200/50 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Masa Depan Karir
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
              Peluang Kerja &amp; Prospek Profesional
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm mt-3 leading-relaxed">
              Lulusan dibekali dengan kompetensi matang sehingga siap diserap langsung oleh industri teknologi atau melanjutkan studi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {major.careers.map((career: any, idx: number) => (
              <div 
                key={idx} 
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 flex items-start gap-5 relative group"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 major-bg-accent major-text-accent">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {career.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {career.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES & PARTNERS SECTION */}
      <section className="py-20 max-w-6xl mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Facilities Column */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 major-bg-accent major-text-accent">
                Fasilitas Praktik
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
                Laboratorium Standar Industri
              </h2>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Untuk menjamin penyerapan kompetensi secara maksimal, praktikum dilakukan di ruangan laboratorium eksklusif dengan perangkat berspesifikasi tinggi.
            </p>

            <div className="space-y-3.5 pt-2">
              {major.facilities.map((fac: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3.5 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white bg-emerald-500 shadow-sm shrink-0">
                    <Check size={12} className="stroke-3" />
                  </div>
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Partners Column */}
          <div className="w-full lg:w-1/2 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 backdrop-blur-md rounded-4xl p-8 flex flex-col justify-between shadow-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
                Sertifikasi &amp; Mitra Industri
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Penyelarasan kurikulum nasional dan pemberian materi sertifikasi bertaraf internasional langsung dari principal terkemuka:
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                Key Industrial Partners
              </span>
              <p className="text-base font-extrabold text-slate-800 dark:text-white leading-relaxed">
                {major.partners}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-16 max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="relative major-gradient-bg rounded-[40px] p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-extrabold uppercase tracking-wider">
              PPDB TP. 2026/2027
            </span>
            
            <h2 className="text-2xl md:text-4xl font-black leading-tight">
              Siap Mengukir Prestasi Di Bidang Teknologi Informasi?
            </h2>
            
            <p className="text-sm md:text-base text-white/80 font-medium">
              Amankan slot pendaftaran Anda sekarang di Program Keahlian {major.title}. Dapatkan pembinaan intensif dari guru ahli dan mitra industri global.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/daftar" className="bg-[#ffffff] text-slate-900 hover:bg-[#f8fafc] text-sm font-extrabold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 w-full sm:w-auto">
                Daftar Jurusan Ini
              </Link>
              <Link href="/" className="border border-white/30 bg-white/10 hover:bg-white/20 text-sm font-semibold px-8 py-4 rounded-2xl backdrop-blur-md transition duration-300 w-full sm:w-auto">
                Kembali Ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE NEXT MAJOR CTA */}
      {nextMajor && (
        <section className="py-16 max-w-6xl mx-auto px-6 w-full relative z-10">
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full next-gradient-bg opacity-10 dark:opacity-20 blur-3xl pointer-events-none group-hover:scale-110 transition duration-700"></div>
            
            <div className="space-y-4 max-w-2xl text-left relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider next-bg-accent next-text-accent">
                <Sparkles size={12} className="animate-pulse" />
                Eksplor Jurusan Lain
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
                Tertarik Melihat Jurusan <span className="next-text-clip">{nextMajor.title} ({nextMajor.alias})</span>?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {nextMajor.desc && nextMajor.desc.length > 180 ? nextMajor.desc.slice(0, 180) + "..." : nextMajor.desc}
              </p>
            </div>

            <div className="shrink-0 relative z-10 w-full md:w-auto">
              <Link 
                href={`/jurusan/${nextCode}`}
                className="flex items-center justify-center gap-2 next-gradient-bg hover:opacity-90 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-slate-950/5 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto group/btn"
              >
                <span>Lihat Detail {nextMajor.alias}</span>
                <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
