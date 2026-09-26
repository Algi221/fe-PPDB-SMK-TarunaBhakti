"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { History, Compass, Target, Users, ArrowRight } from "lucide-react";

export default function ProfileIndexPage() {
  const sections = [
    {
      title: "Sejarah Sekolah",
      desc: "Perjalanan SMK Taruna Bhakti sejak didirikan tahun 2004 hingga ditetapkan sebagai SMK Pusat Keunggulan bertaraf nasional.",
      href: "/profile/sejarah",
      icon: History,
      color: "from-blue-600 to-indigo-600"
    },
    {
      title: "Visi & Misi",
      desc: "Landasan filosofis dan komitmen SMK Taruna Bhakti dalam mencetak generasi cerdas, berakhlak mulia, dan berwawasan global.",
      href: "/profile/visi-misi",
      icon: Compass,
      color: "from-indigo-600 to-purple-600"
    },
    {
      title: "Tujuan Sekolah",
      desc: "Sasaran strategis pendidikan vokasi dengan orientasi BMW: Bekerja, Melanjutkan studi ke perguruan tinggi, dan Berwirausaha.",
      href: "/profile/tujuan",
      icon: Target,
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Tenaga Pendidik",
      desc: "Para pimpinan, instruktur ahli bersertifikasi industri Google, AWS, Cisco, serta guru berdedikasi tinggi di SMK Taruna Bhakti.",
      href: "/profile/tenaga-pendidik",
      icon: Users,
      color: "from-sky-600 to-blue-600"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      <Navbar activePath="/profile" />

      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[350px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-[10%] right-[20%] w-[450px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-6 pt-32 pb-24 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-blue-600 dark:text-sky-400">Profile Sekolah</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 mb-14 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Profile <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              SMK Taruna Bhakti
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Kenali lebih dekat SMK Taruna Bhakti Depok, sekolah kejuruan teknologi informasi dan industri kreatif unggulan dengan kurikulum berstandar internasional.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {sections.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link
                key={idx}
                href={s.href}
                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                    {s.title}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-sky-400 group-hover:gap-3 transition-all">
                  <span>Lihat Selengkapnya</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
