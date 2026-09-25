"use client";

import React from "react";
import { Applicant } from "../types";

interface RejectReasonModalProps {
  rejectingApplicantId: number | null;
  setRejectingApplicantId: (id: number | null) => void;
  rejectionReasonInput: string;
  setRejectionReasonInput: (val: string) => void;
  rejectApplicant: (id: number, reason: string) => void;
  selectedApplicant: Applicant | null;
  setSelectedApplicant: React.Dispatch<React.SetStateAction<Applicant | null>>;
}

export default function RejectReasonModal({
  rejectingApplicantId,
  setRejectingApplicantId,
  rejectionReasonInput,
  setRejectionReasonInput,
  rejectApplicant,
  selectedApplicant,
  setSelectedApplicant,
}: RejectReasonModalProps) {
  if (rejectingApplicantId === null) return null;

  return (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] p-8 shadow-2xl flex flex-col gap-6 text-left max-w-md w-full backdrop-blur-xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-500 border border-rose-100 dark:border-rose-900/40 shadow-inner">
              <svg className="w-7 h-7 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Tolak Pendaftaran</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Silakan masukkan alasan mengapa pendaftaran calon siswa ini ditolak. Alasan ini akan langsung ditampilkan kepada calon siswa di halaman beranda.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="rejection-reason" className="text-[10px] font-black uppercase tracking-wider text-slate-450">Alasan Penolakan</label>
              <textarea
                id="rejection-reason"
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="Contoh: Berkas NIK tidak valid, raport semester 1-5 buram..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:focus:ring-rose-500/15 transition-all font-semibold resize-none"
              />
            </div>

            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectingApplicantId(null);
                  setRejectionReasonInput("");
                }}
                className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all border border-slate-205 dark:border-slate-700 cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!rejectionReasonInput.trim()}
                onClick={() => {
                  if (rejectionReasonInput.trim()) {
                    rejectApplicant(rejectingApplicantId, rejectionReasonInput.trim());
                    if (selectedApplicant && selectedApplicant.id === rejectingApplicantId) {
                      setSelectedApplicant(null);
                    }
                    setRejectingApplicantId(null);
                    setRejectionReasonInput("");
                  }
                }}
                className="flex-1 py-3.5 bg-gradient-to-tr from-rose-600 to-red-500 hover:brightness-110 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow shadow-rose-500/20 transition-all cursor-pointer text-center animate-pulse"
              >
                Tolak Siswa
              </button>
            </div>
          </div>
        </div>
  );
}
