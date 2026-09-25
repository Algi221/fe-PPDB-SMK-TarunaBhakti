"use client";

import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { InformasiItem, formatDateShort, timeAgo } from "./types";

interface ForumSidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  recentPosts: InformasiItem[];
  loadingDetailId: number | null;
  handleViewDetail: (id: number) => void;
  schoolPeriod: string;
}

export default function ForumSidebar({
  searchQuery,
  setSearchQuery,
  recentPosts,
  loadingDetailId,
  handleViewDetail,
  schoolPeriod
}: ForumSidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari pengumuman..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder-slate-400 text-slate-800 dark:text-white shadow-sm"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#F0F4F8] dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/50 dark:border-slate-800 shadow-sm"
      >
        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-5">Pengumuman Terbaru</h3>
        {recentPosts.length === 0 ? (
          <div className="py-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Belum ada pengumuman</p>
          </div>
        ) : (
          <div className="space-y-5">
            {recentPosts.map((item, index) => {
              const { day, month } = formatDateShort(item.tanggal);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                  onClick={() => {
                    if (loadingDetailId === null) {
                      handleViewDetail(item.id);
                    }
                  }}
                  className={`flex gap-4 items-start cursor-pointer group ${loadingDetailId === item.id ? 'opacity-80 pointer-events-none' : ''}`}
                >
                  <div className="flex flex-col items-center justify-center w-10 h-11 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700 shadow-sm shrink-0">
                    <span className="text-[9px] font-bold text-blue-600 uppercase">{month}</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white leading-none mt-0.5">{day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 break-all hyphens-auto">
                      {item.judul}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">{timeAgo(item.tanggal)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/20"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-200">PPDB {schoolPeriod.includes("-") ? schoolPeriod.split("-")[0] : schoolPeriod}</span>
          <h3 className="text-lg font-bold leading-snug mt-1 mb-4">Pendaftaran Siswa Baru Telah Dibuka</h3>
          <Link href="/daftar" className="inline-block bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
            Daftar Sekarang
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
