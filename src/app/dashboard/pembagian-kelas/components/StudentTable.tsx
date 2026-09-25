"use client";

import React from "react";
import { Search, Filter, CheckSquare, MinusSquare } from "lucide-react";
import { Applicant, ClassItem } from "../types";

interface StudentTableProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  assignmentFilter: "ALL" | "UNASSIGNED" | "ASSIGNED";
  setAssignmentFilter: (val: "ALL" | "UNASSIGNED" | "ASSIGNED") => void;
  genderFilter: "ALL" | "L" | "P";
  setGenderFilter: (val: "ALL" | "L" | "P") => void;
  handleSelectAll: () => void;
  selectedStudentIds: number[];
  setSelectedStudentIds: (ids: number[]) => void;
  handleAssignSelectedToClass: (targetClass: string) => void;
  filteredStudents: Applicant[];
  nipdMap: Map<number, string>;
  handleSelectStudent: (id: number) => void;
  handleDragStart: (e: React.DragEvent, id: number) => void;
  getStudentCurrentClass: (student: Applicant) => string;
  classesOfSelectedMajor: ClassItem[];
}

export default function StudentTable({
  searchTerm,
  setSearchTerm,
  assignmentFilter,
  setAssignmentFilter,
  genderFilter,
  setGenderFilter,
  handleSelectAll,
  selectedStudentIds,
  setSelectedStudentIds,
  handleAssignSelectedToClass,
  filteredStudents,
  nipdMap,
  handleSelectStudent,
  handleDragStart,
  getStudentCurrentClass,
  classesOfSelectedMajor,
}: StudentTableProps) {
  return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300 space-y-6">
        
        {/* Filtering Toolbar */}
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between border-b border-slate-100 dark:border-white/5 pb-5">
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search size={13} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama / NISN..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            {/* Assignment Status Filter */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-500">
              <Filter size={11} />
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider font-extrabold text-[9px]"
              >
                <option value="ALL">Semua Calon Kelas</option>
                <option value="UNASSIGNED">Belum Dapat Kelas</option>
                <option value="ASSIGNED">Sudah Ada Kelas</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-500">
              <Filter size={11} />
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider font-extrabold text-[9px]"
              >
                <option value="ALL">Semua Gender</option>
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Student Table Checklist */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-slate-655 dark:text-slate-350">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/15">
                <th className="py-3.5 px-4 text-center w-12 pl-6">
                  <button 
                    onClick={handleSelectAll}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-all text-slate-500 flex items-center justify-center"
                    title={selectedStudentIds.length === filteredStudents.length ? "Clear Selection" : "Select All"}
                  >
                    {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                      <CheckSquare size={14} className="text-blue-500" />
                    ) : (
                      <MinusSquare size={14} />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4 text-center">NIPD</th>
                <th className="py-3.5 px-4">Nama Lengkap Siswa</th>
                <th className="py-3.5 px-4 text-center w-16">L/P</th>
                <th className="py-3.5 px-4 text-center">NISN</th>
                <th className="py-3.5 px-4">Asal Sekolah SMP</th>
                <th className="py-3.5 px-4 text-center">Pilihan Keahlian</th>
                <th className="py-3.5 px-4 text-center">Kelas Sekarang</th>
                <th className="py-3.5 px-4 text-right pr-6">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                const assignedClass = getStudentCurrentClass(student);

                return (
                  <tr
                    key={student.id}
                    onClick={() => handleSelectStudent(student.id)}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, student.id)}
                    className={`hover:bg-slate-50/70 dark:hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing select-none ${
                      isSelected ? "bg-blue-500/10 dark:bg-blue-500/15 border-l-2 border-blue-500" : ""
                    }`}
                  >
                    <td className="py-3 px-4 pl-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded border-slate-350 dark:border-white/10 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                      {nipdMap.get(student.id) || "-"}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-850 dark:text-white text-sm">{student.nama}</div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                        Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tgl_lahir || student.tglLahir || "-"} · Periode Daftar: {student.periode || "2026-2027"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {(student.jenis_kelamin || student.jenisKelamin) ? (
                        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-sm ${
                          (student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l")
                            ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                            : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                        }`}>
                          {(student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {student.nisn}
                    </td>

                    <td className="py-3 px-4 text-slate-550 dark:text-slate-450 font-semibold uppercase">
                      {student.sekolah_asal || student.sekolahAsal}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 text-[9px] uppercase tracking-wide">
                        {student.jurusan_1 || student.jurusan1}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {assignedClass ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                          {assignedClass}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 text-slate-450 dark:text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                          Belum Diatur
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={assignedClass || ""}
                          onChange={(e) => {
                            setSelectedStudentIds([student.id]);
                            handleAssignSelectedToClass(e.target.value);
                          }}
                          className="px-2.5 py-1 text-[9px] uppercase font-black bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/40 dark:text-white border border-slate-250 dark:border-white/5 rounded-lg focus:outline-none cursor-pointer"
                        >
                          <option value="">Belum Diatur</option>
                          {classesOfSelectedMajor.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                    Tidak ditemukan data siswa aktif untuk kriteria filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
  );
}
