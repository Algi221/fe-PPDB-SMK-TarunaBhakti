import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, Download, Trash2, ChevronUp, ChevronDown, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { Applicant } from "./types";

interface ActiveStudentAccordionProps {
  sortedPeriods: string[];
  groupedByPeriod: Record<string, Applicant[]>;
  expandedPeriods: Record<string, boolean>;
  togglePeriod: (period: string) => void;
  nipdMap: Map<number, string>;
  handleViewDetail: (student: Applicant) => void;
  handleBatalVerifikasi: (id: number, nama: string) => void;
  handleExportExcel: (students: Applicant[], suffix: string) => void;
  customPeriods: string[];
  setCustomPeriods: React.Dispatch<React.SetStateAction<string[]>>;
  addToast: (title: string, message: string, type: "success" | "error" | "info" | "warning") => void;
  searchTerm: string;
  majorFilter: string;
}

export const ActiveStudentAccordion: React.FC<ActiveStudentAccordionProps> = ({
  sortedPeriods,
  groupedByPeriod,
  expandedPeriods,
  togglePeriod,
  nipdMap,
  handleViewDetail,
  handleBatalVerifikasi,
  handleExportExcel,
  customPeriods,
  setCustomPeriods,
  addToast,
  searchTerm,
  majorFilter
}) => {
  if (sortedPeriods.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-16 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-600">
          <Users size={28} />
        </div>
        <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">Tidak Ada Siswa Aktif</h4>
        <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold max-w-sm mx-auto mt-1 uppercase tracking-wider">
          {searchTerm || majorFilter !== "ALL"
            ? "Tidak ada data siswa aktif yang cocok dengan kriteria filter pencarian Anda."
            : "Belum ada calon siswa yang berstatus 'Approved' (Terverifikasi) dari sistem PPDB."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedPeriods.map((period) => {
        const students = groupedByPeriod[period] || [];
        const isExpanded = expandedPeriods[period] ?? false;

        return (
          <div
            key={period}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-colors duration-300"
          >
            {/* Accordion Trigger Header */}
            <div
              onClick={() => togglePeriod(period)}
              className="px-6 py-5 flex items-center justify-between cursor-pointer select-none bg-slate-50/40 dark:bg-slate-950/15 border-b border-slate-100 dark:border-white/5 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-950/25"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 leading-none">
                    Angkatan Periode {period}
                    {period === "2026-2027" && (
                      <span className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest">
                        Terbaru
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">
                    Kelompok siswa aktif periode pendidikan {period}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-blue-100/80 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase">
                  {students.length} Siswa
                </span>

                {/* Separate Export Button for this specific Period */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportExcel(students, `angkatan_${period.replace("-", "_")}`);
                  }}
                  className="p-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-white/5 dark:hover:bg-blue-950/40 border border-slate-200/50 dark:border-white/5 text-slate-500 dark:text-slate-400 rounded-xl transition-all shadow-sm cursor-pointer"
                  title={`Ekspor Daftar Siswa Excel Periode ${period}`}
                >
                  <Download size={14} />
                </button>

                {/* Delete button - only for custom-added periods */}
                {customPeriods.includes(period) && students.length === 0 && (
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const result = await Swal.fire({
                        title: "Konfirmasi",
                        text: `Hapus periode angkatan "${period}"? Tindakan ini tidak dapat dibatalkan.`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Ya",
                        cancelButtonText: "Batal"
                      });
                      if (result.isConfirmed) {
                        const updated = customPeriods.filter((p) => p !== period);
                        setCustomPeriods(updated);
                        if (typeof window !== "undefined") {
                          localStorage.setItem("ppdb_custom_periods", JSON.stringify(updated));
                        }
                        addToast("Periode Dihapus", `Angkatan ${period} telah dihapus.`, "warning");
                      }
                    }}
                    className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 border border-rose-200/50 dark:border-rose-900/30 text-rose-500 dark:text-rose-400 rounded-xl transition-all shadow-sm cursor-pointer"
                    title={`Hapus Periode ${period}`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                {/* Delete button - warn if has students */}
                {customPeriods.includes(period) && students.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToast(
                        "Tidak Bisa Dihapus",
                        `Periode ${period} masih memiliki ${students.length} siswa aktif.`,
                        "warning"
                      );
                    }}
                    className="p-2 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-slate-400 dark:text-slate-600 rounded-xl transition-all shadow-sm cursor-not-allowed"
                    title="Tidak bisa hapus periode yang masih ada siswanya"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="p-1 rounded-lg text-slate-400 dark:text-slate-600">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </div>

            {/* Collapsible Accordion Table Body */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 overflow-x-auto">
                    <table className="w-full text-xs font-bold text-slate-655 dark:text-slate-400 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-550 uppercase tracking-widest text-[9px]">
                          <th className="py-3 px-3 text-left w-12">No</th>
                          <th className="py-3 px-4 text-left">NIPD</th>
                          <th className="py-3 px-4 text-left">Kelas</th>
                          <th className="py-3 px-4 text-left">Nama Siswa</th>
                          <th className="py-3 px-4 text-center w-20">L/P</th>
                          <th className="py-3 px-4 text-left">NISN</th>
                          <th className="py-3 px-4 text-left">Asal Sekolah</th>
                          <th className="py-3 px-4 text-left">Jurusan</th>
                          <th className="py-3 px-3 text-center w-32">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, idx) => (
                          <tr
                            key={student.id}
                            className="border-b border-slate-100/50 dark:border-white/5 hover:bg-slate-50/30 dark:hover:bg-slate-950/10 transition-colors"
                          >
                            <td className="py-3.5 px-3 text-slate-400 dark:text-slate-600 font-mono">
                              {idx + 1}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                              {nipdMap.get(student.id) || student.nipd || "-"}
                            </td>
                            <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-xs">
                              {student.diterima_kelas || student.diterimaKelas ? (
                                student.diterima_kelas || student.diterimaKelas
                              ) : (
                                <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                                  BELUM ADA
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                {student.nama}
                              </div>
                              <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider block mt-0.5">
                                Lahir: {student.tempat_lahir || student.tempatLahir || "-"},{" "}
                                {student.tgl_lahir || student.tglLahir || "-"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {student.jenis_kelamin || student.jenisKelamin ? (
                                <span
                                  className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-sm ${
                                    (student.jenis_kelamin || student.jenisKelamin || "")
                                      .toLowerCase()
                                      .startsWith("l")
                                      ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                                      : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                                  }`}
                                >
                                  {(student.jenis_kelamin || student.jenisKelamin || "")
                                    .toLowerCase()
                                    .startsWith("l")
                                    ? "L"
                                    : "P"}
                                </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono">{student.nisn}</td>
                            <td className="py-3.5 px-4 uppercase">
                              {student.sekolah_asal || student.sekolahAsal || "-"}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-0.5 text-left">
                                <span className="text-blue-600 dark:text-blue-400 font-extrabold uppercase">
                                  {student.jurusan || student.jurusan_1 || student.jurusan1}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3">
                              <div
                                className="flex items-center justify-center gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleViewDetail(student)}
                                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-355 hover:text-slate-850 dark:hover:text-white rounded-xl transition-all border border-slate-200/50 dark:border-white/5 cursor-pointer"
                                  title="Detail Siswa"
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  onClick={() => handleBatalVerifikasi(student.id, student.nama)}
                                  className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all border border-rose-200/50 dark:border-rose-500/20 cursor-pointer"
                                  title="Batal Verifikasi (Kembalikan ke Pendaftar)"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
