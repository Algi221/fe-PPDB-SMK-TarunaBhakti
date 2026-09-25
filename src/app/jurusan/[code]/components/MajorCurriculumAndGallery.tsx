"use client";

import React from "react";
import { BookOpen, Video } from "lucide-react";
import { sanitizeSrc } from "./majorTypes";

interface MajorCurriculumAndGalleryProps {
  major: any;
}

export default function MajorCurriculumAndGallery({ major }: MajorCurriculumAndGalleryProps) {
  return (
    <>
      {/* PROFILE VIDEO SECTION - Rendered only if video exists */}
      {major.video && (
        <section className="py-12 px-6 max-w-5xl mx-auto w-full relative z-10 animate-in fade-in duration-700">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-850 p-6 md:p-10 rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col items-center text-center space-y-6">
            <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full major-gradient-bg opacity-10 dark:opacity-25 blur-3xl pointer-events-none"></div>
            
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider major-bg-accent major-text-accent">
                <Video size={12} className="animate-pulse" />
                Video Profil &amp; Pengenalan Jurusan
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
                Saksikan Video Dokumenter {major.alias}
              </h2>
              <p className="text-slate-500 dark:text-slate-450 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                Tonton video penjelasan ruang laboratorium praktikum, kompetensi dasar, hasil karya proyek lulusan, serta suasana kolaborasi siswa {major.title} di SMK Taruna Bhakti.
              </p>
            </div>

            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/30 dark:border-slate-800 shadow-2xl flex items-center justify-center p-2">
              {major.video.startsWith("data:video") || major.video.includes(".mp4") || major.video.startsWith("blob:") ? (
                <video 
                  src={sanitizeSrc(major.video)} 
                  controls 
                  className="w-full h-full object-cover rounded-[20px]"
                >
                  <track kind="captions" label="No captions" default />
                </video>
              ) : (
                <iframe
                  src={sanitizeSrc(major.video)}
                  className="w-full h-full rounded-[20px] border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* CORE SYLLABUS & CURRICULUM SECTION */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30 relative border-y border-slate-200/50 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Materi Pembelajaran
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
              Kurikulum Berbasis Kompetensi
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm mt-3 leading-relaxed">
              Materi pembelajaran terstruktur yang diintegrasikan langsung dengan standard kebutuhan industri nasional maupun global.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {major.syllabus.map((item: any, idx: number) => (
              <div 
                key={idx} 
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-500/20 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 major-gradient-bg opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-300"></div>
                
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 major-bg-accent major-text-accent">
                  <BookOpen size={20} />
                </div>
                
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-2">
                  {item.subject}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT ACTIVITY GALLERY SECTION */}
      <section className="py-20 max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Aktivitas Kelas &amp; Praktik
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
            Galeri Kegiatan Taruna Bhakti
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm mt-3 leading-relaxed">
            Melihat lebih dekat keseruan suasana praktikum, kolaborasi proyek mandiri, dan evaluasi hasil karya taruna-taruni.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {major.gallery.map((img: any, index: number) => (
            <div 
              key={index} 
              className="group bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-3 shadow-md hover:shadow-xl transition-all duration-500 relative overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                <img 
                  src={img.url} 
                  alt={img.caption}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" 
                />
                <div className="absolute inset-x-2 bottom-2 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md border border-white/10 p-3 rounded-xl transition duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] font-extrabold text-white uppercase tracking-wide">
                    Aktivitas {major.alias}
                  </p>
                  <p className="text-xs text-slate-200 font-medium leading-snug mt-0.5">
                    {img.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
