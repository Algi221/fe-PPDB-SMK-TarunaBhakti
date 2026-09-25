"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronRight } from "lucide-react";
import { MajorItem, sanitizeSrc } from "./types";
import { SafeImage } from "./SafeImage";

const ScrollFloat = dynamic(() => import("../ScrollFloat"), {
  ssr: false,
  loading: (props: any) => <div className={props.containerClassName}>{props.children}</div>
});

interface MajorsSectionProps {
  majors: MajorItem[];
  isMajorsVisible: boolean;
}

export const MajorsSection: React.FC<MajorsSectionProps> = ({
  majors,
  isMajorsVisible
}) => {
  return (
    <section id="majors" className="py-24 max-w-6xl mx-auto px-6 relative z-10">
      <div
        className={`text-center mb-16 transform transition-all duration-1000 ${
          isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <ScrollFloat
          containerClassName="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4"
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
        >
          Program Kompetensi Keahlian
        </ScrollFloat>
        <ScrollFloat
          containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.01}
          textMode={false}
        >
          Tersedia 6 jurusan unggulan dengan kurikulum berstandar industri nasional maupun internasional.
        </ScrollFloat>
      </div>

      <ScrollFloat containerClassName="w-full" textClassName="w-full" textMode={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {majors.map((major, index) => {
            return (
              <Link
                href={`/jurusan/${major.code.toLowerCase()}`}
                key={major.code}
                className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-700 cursor-pointer flex flex-col justify-between relative overflow-hidden group transform ${
                  isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 to-sky-400 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-500 z-10"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-white border border-slate-100 shadow-md group-hover:shadow-xl group-hover:shadow-blue-500/20">
                    <SafeImage
                      src={sanitizeSrc(major.logo) || "/logo_smktb.png"}
                      alt={`Logo ${major.code}`}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-contain drop-shadow-sm"
                      onError={(e: any) => {
                        e.target.style.display = "none";
                        const parent = e.target.parentElement;
                        if (parent) {
                          parent.classList.add("bg-blue-50");
                          parent.querySelectorAll(".fallback-code").forEach((el: any) => el.remove());
                          const fallbackDiv = document.createElement("div");
                          fallbackDiv.style.color = "#0066ff";
                          fallbackDiv.style.display = "flex";
                          fallbackDiv.style.alignItems = "center";
                          fallbackDiv.style.justifyContent = "center";
                          fallbackDiv.style.width = "100%";
                          fallbackDiv.style.height = "100%";
                          fallbackDiv.style.fontWeight = "800";
                          fallbackDiv.style.fontSize = "11px";
                          fallbackDiv.textContent = major.code;
                          fallbackDiv.classList.add("fallback-code");
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-3">
                    {major.code === "AN" ? major.title : `${major.title} (${major.code})`}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {major.desc.substring(0, 105)}...
                  </p>
                </div>
                <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors relative z-10">
                  Lihat Selengkapnya{" "}
                  <ChevronRight
                    size={14}
                    className="transform group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </ScrollFloat>
    </section>
  );
};
