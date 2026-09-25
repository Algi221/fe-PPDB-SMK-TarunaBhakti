"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, MapPin } from "lucide-react";
import ShinyText from "../ShinyText";
import { SafeImage } from "./SafeImage";
import { MajorItem, sanitizeSrc } from "./types";

const DataPendaftarTable = dynamic(() => import("../DataPendaftarTable"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-xs font-semibold">Memuat data pendaftar...</p>
    </div>
  )
});

interface HeroSectionProps {
  heroTitle: string;
  heroTitleSub: string;
  heroSubtitle: string;
  address: string;
  majors: MajorItem[];
  loadVideo: boolean;
  currentVideo: number;
  videos: string[];
  handleVideoEnded: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroTitle,
  heroTitleSub,
  heroSubtitle,
  address,
  majors,
  loadVideo,
  currentVideo,
  videos,
  handleVideoEnded
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log(e));
    }
  }, [currentVideo, loadVideo]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Video Background - Full Width */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-linear-to-br from-indigo-50/50 via-white to-sky-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {loadVideo && (
          <video
            ref={videoRef}
            src={videos[currentVideo]}
            autoPlay
            muted
            playsInline
            preload="none"
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover transition-opacity duration-1000"
            aria-hidden="true"
          >
            <track kind="captions" label="No captions" default />
          </video>
        )}
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/60 backdrop-blur-sm"></div>
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        {/* Floating elements representing major names dynamically */}
        {majors.map((m, index) => {
          const isEven = index % 2 === 0;
          const sideIndex = Math.floor(index / 2);
          const topPos = isEven ? 130 + sideIndex * 120 : 130 + sideIndex * 160;
          const horizPos = isEven ? 5 + (sideIndex % 3) * 3 : 2 + (sideIndex % 3) * 2;
          const animName = `float${(index % 4) + 1}`;
          const animDuration = `${6 + (index % 3) * 1.5}s`;
          const animDelay = `-${(index % 5) * 1}s`;

          const routeCode = m.code.toLowerCase() === "anm" ? "an" : m.code.toLowerCase();
          const routeLink = `/jurusan/${routeCode}`;
          const displayAlias =
            m.code === "RPL" ? "PPLG" : m.code === "ANM" ? "Animasi" : m.code === "BC" ? "Broadcasting" : m.code;

          return (
            <Link
              key={m.code}
              href={routeLink}
              className="floating-badge animate-[fadeIn_0.5s_ease-out]"
              style={{
                top: `${topPos}px`,
                [isEven ? "left" : "right"]: `${horizPos}%`,
                animation: `${animName} ${animDuration} infinite alternate ease-in-out ${animDelay}`
              }}
            >
              <div className="badge-icon overflow-hidden" style={{ background: "transparent" }}>
                {m.logo ? (
                  <SafeImage
                    src={sanitizeSrc(m.logo) || "/logo_smktb.png"}
                    alt=""
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-[10px] rounded-full">
                    {displayAlias.substring(0, 3).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="badge-info">
                <span>{displayAlias}</span>
              </div>
            </Link>
          );
        })}

        {/* Hero Copy */}
        <div className="badge-wrapper relative z-10 flex flex-col items-center gap-3">
          <span className="badge-pill">SMK TARUNA BHAKTI DEPOK</span>
          <div className="flex items-center gap-2 text-[11px] md:text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm animate-[fadeIn_0.8s_ease-out_0.2s_both]">
            <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="max-w-70 md:max-w-none truncate md:whitespace-normal">{address}</span>
          </div>
        </div>

        <h1 className="hero-title relative z-10">
          {heroTitle} <br />
          <ShinyText
            text={heroTitleSub}
            speed={3}
            delay={1}
            color="var(--primary)"
            shineColor="#0ea5e9"
            spread={135}
          />
        </h1>

        <p className="hero-subtitle relative z-10">{heroSubtitle}</p>

        <div className="hero-action">
          <Link href="/daftar" className="btn-hero-action">
            Daftar Sekarang <ArrowRight size={18} />
          </Link>
        </div>

        {/* APP MOCKUP WRAPPER */}
        <div className="mockup-container relative z-10">
          <div className="app-mockup">
            {/* Mockup Browser Top bar */}
            <div className="mockup-browser-bar">
              <div className="browser-dots">
                <span className="dot-red"></span>
                <span className="dot-yellow"></span>
                <span className="dot-green"></span>
              </div>
              <div className="browser-address">ppdb.smktarunabhakti.sch.id/dashboard</div>
              <div className="w-4"></div>
            </div>

            {/* Data Pendaftar Table View */}
            <div className="dashboard-view block w-full p-6 h-150 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative z-10 rounded-2xl transition-colors duration-300">
              <DataPendaftarTable />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
