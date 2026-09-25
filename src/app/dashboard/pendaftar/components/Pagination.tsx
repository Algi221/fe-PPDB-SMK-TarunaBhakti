"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  setCurrentPage,
}: PaginationProps) {
  if (totalItems === 0) return null;

  return (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/25 dark:bg-slate-950/20">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              Menampilkan <span className="text-slate-700 dark:text-slate-300">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-slate-700 dark:text-slate-300">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="text-slate-700 dark:text-slate-300">{totalItems}</span> Siswa
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-350 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Sebelumnya
              </button>
              <span className="text-xs text-slate-550 dark:text-slate-400 font-extrabold uppercase px-2">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-350 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Selanjutnya
              </button>
            </div>
          </div>
  );
}
