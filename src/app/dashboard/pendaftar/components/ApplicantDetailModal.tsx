"use client";

import React, { useState } from "react";
import { sanitizeSrc } from "@/app/daftar/daftarUtils";
import { Applicant, formatNoPendaftaran } from "../types";
import ApplicantDetailTabs from "./ApplicantDetailTabs";

interface ApplicantDetailModalProps {
  selectedApplicant: Applicant | null;
  setSelectedApplicant: React.Dispatch<React.SetStateAction<Applicant | null>>;
  onClose: () => void;
  verifyApplicant: (id: number) => void;
  setRejectingApplicantId: (id: number) => void;
  setRejectionReasonInput: (val: string) => void;
  updateApplicant: (id: number, data: any) => Promise<any>;
}

export default function ApplicantDetailModal({
  selectedApplicant,
  setSelectedApplicant,
  onClose,
  verifyApplicant,
  setRejectingApplicantId,
  setRejectionReasonInput,
  updateApplicant,
}: ApplicantDetailModalProps) {
  const [activeTab, setActiveTab] = useState<string>("biodata");
  const [isFullscreenImageOpen, setIsFullscreenImageOpen] = useState(false);

  if (!selectedApplicant) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 transition-colors duration-300">

          {/* Modal Header */}
          <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between shrink-0 bg-white dark:bg-slate-900 relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 text-2xl font-black shrink-0">
                {selectedApplicant.nama.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-850 dark:text-white flex items-center gap-3 uppercase tracking-wide">
                  <span>{selectedApplicant.nama}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-widest ${selectedApplicant.status === "Approved"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                        : selectedApplicant.status === "Rejected"
                          ? "bg-rose-50 dark:bg-rose-950/60 border-rose-250 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                          : "bg-amber-50 dark:bg-amber-950/60 border-amber-250 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                      }`}
                  >
                    {selectedApplicant.status === "Approved" ? "Terverifikasi" : selectedApplicant.status === "Rejected" ? "Ditolak" : "Pending"}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-555 font-bold uppercase tracking-wider mt-1.5 flex items-center flex-wrap gap-2">
                  <span className="text-blue-500">No. Pendaftaran:</span> <span className="font-mono text-blue-600 dark:text-blue-400">{formatNoPendaftaran(selectedApplicant.periode, selectedApplicant.id)}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span> 
                  <span className="text-blue-500">NISN:</span> {selectedApplicant.nisn} 
                  <span className="text-slate-300 dark:text-slate-700">•</span> 
                  <span className="text-blue-500">Asal:</span> {selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}
                </p>
                {selectedApplicant.status === "Approved" && selectedApplicant.verified_by && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wide mt-1">
                    ✓ Diverifikasi oleh: {selectedApplicant.verified_by}
                  </p>
                )}
                {selectedApplicant.status === "Rejected" && selectedApplicant.rejected_by && (
                  <div className="mt-1.5 flex flex-col gap-1.5 align-start text-left">
                    <p className="text-[10px] text-rose-650 dark:text-rose-400 font-extrabold uppercase tracking-wide">
                      ✗ Digugurkan oleh: {selectedApplicant.rejected_by}
                    </p>
                    <div className="text-[10px] p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-800 dark:text-rose-350 max-w-md">
                      <span className="font-extrabold uppercase tracking-wider block mb-0.5">Alasan Penolakan:</span>
                      <span className="font-bold">{selectedApplicant.alasan_ditolak || "Tidak ada alasan spesifik yang diberikan."}</span>
                    </div>
                  </div>
                )}
                {selectedApplicant.deleted_at && selectedApplicant.deleted_by && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wide mt-1">
                    🗑️ Dihapus oleh: {selectedApplicant.deleted_by}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedApplicant(null);
                setIsFullscreenImageOpen(false);
              }}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-455 hover:text-rose-500 dark:hover:text-rose-400 flex items-center justify-center transition-all font-bold relative z-10 shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Modal Tabs Navigation */}
          <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-100 dark:border-white/5 shrink-0">
            <div className="flex flex-wrap bg-slate-200/50 dark:bg-slate-900/50 p-1.5 rounded-2xl gap-1 w-full border border-slate-200/50 dark:border-white/5">
              {[
                { id: "biodata", label: "Biodata" },
                { id: "periodik", label: "Periodik" },
                { id: "bantuan", label: "Bantuan" },
                { id: "orangtua", label: "Orang Tua" },
                { id: "akademik", label: "Akademik" },
                { id: "pembayaran", label: "Pembayaran" },
                { id: "pernyataan", label: "Pernyataan" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-2.5 text-[10px] md:text-xs font-black transition-all rounded-xl uppercase tracking-wider flex-1 text-center min-w-22.5 whitespace-nowrap ${activeTab === t.id
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/10"
                      : "text-slate-500 dark:text-slate-455 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Tab Content Viewport */}
          <ApplicantDetailTabs
            activeTab={activeTab}
            selectedApplicant={selectedApplicant}
            setSelectedApplicant={setSelectedApplicant}
            setIsFullscreenImageOpen={setIsFullscreenImageOpen}
            updateApplicant={updateApplicant}
          />

          {/* Modal Action Controls Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/15 flex items-center justify-end shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-355 hover:text-slate-850 dark:hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200/50 dark:border-white/5"
              >
                Tutup
              </button>

              {selectedApplicant.status !== "Approved" && (
                <button
                  onClick={() => {
                    verifyApplicant(selectedApplicant.id);
                    setSelectedApplicant(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] flex items-center gap-1.5"
                >
                  Verifikasi Lolos
                </button>
              )}

              {selectedApplicant.status !== "Rejected" && (
                <button
                  onClick={() => {
                    setRejectingApplicantId(selectedApplicant.id);
                    setRejectionReasonInput("");
                  }}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)] flex items-center gap-1.5"
                >
                  Tolak / Gugurkan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFullscreenImageOpen && (
        <div 
          className="fixed inset-0 z-110 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setIsFullscreenImageOpen(false)}
        >
          <button
            onClick={() => setIsFullscreenImageOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center text-xl transition-all shadow font-bold cursor-pointer hover:scale-110"
          >
            ✕
          </button>
          <img
            src={sanitizeSrc(selectedApplicant?.bukti_bayar || "")}
            alt="Bukti Transfer Manual Fullscreen"
            className="max-w-full max-h-[90vh] object-contain rounded-xl select-none cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
