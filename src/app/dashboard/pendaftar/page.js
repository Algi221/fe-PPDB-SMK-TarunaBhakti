"use client";

import React, { useState } from "react";
import { usePPDB } from "@/context/PPDBContext";

export default function ApplicantsDirectory() {
  const { applicants, verifyApplicant, rejectApplicant, deleteApplicant } = usePPDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [majorFilter, setMajorFilter] = useState("ALL");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [activeTab, setActiveTab] = useState("biodata");

  const majorsList = [
    "Rekayasa Perangkat Lunak",
    "Teknik Jaringan Komputer & Telekomunikasi",
    "Desain Komunikasi Visual",
    "Broadcasting & Perfilman",
    "Teknik Elektronika",
    "Animasi"
  ];

  // Filtering Logic
  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nisn?.includes(searchTerm) ||
      (a.sekolah_asal || a.sekolahAsal)?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      a.status === statusFilter ||
      (statusFilter === "Pending" && (!a.status || a.status === "Pending"));

    const matchesMajor =
      majorFilter === "ALL" ||
      a.jurusan_1 === majorFilter ||
      a.jurusan1 === majorFilter;

    return matchesSearch && matchesStatus && matchesMajor;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredApplicants.length === 0) return;

    // Headers
    const headers = [
      "Nama Lengkap",
      "NISN",
      "NIK",
      "Asal Sekolah",
      "Program Studi Pilihan 1",
      "Program Studi Pilihan 2",
      "No. WhatsApp",
      "Email",
      "Status Verifikasi",
      "Tanggal Mendaftar"
    ];

    const rows = filteredApplicants.map((a) => [
      `"${a.nama || ''}"`,
      `"${a.nisn || ''}"`,
      `"${a.nik || ''}"`,
      `"${a.sekolah_asal || a.sekolahAsal || ''}"`,
      `"${a.jurusan_1 || a.jurusan1 || ''}"`,
      `"${a.jurusan_2 || a.jurusan2 || ''}"`,
      `"${a.whatsapp || ''}"`,
      `"${a.email || ''}"`,
      `"${a.status || 'Pending'}"`,
      `"${a.tgl_daftar || a.createdAt || ''}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ppdb_siswa_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Search & Filter Toolbar */}
      <div className="bg-[#161f2e]/70 border border-white/5 rounded-3xl p-6 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, NISN, atau sekolah asal..."
            className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/40 border border-white/5 rounded-2xl text-slate-300 text-xs px-4 py-3.5 focus:outline-none focus:border-blue-500 transition-all font-semibold"
          >
            <option value="ALL">Semua Status</option>
            <option value="Pending">Menunggu Verifikasi</option>
            <option value="Approved">Terverifikasi</option>
            <option value="Rejected">Ditolak / Gugur</option>
          </select>

          {/* Major Filter */}
          <select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            className="bg-slate-950/40 border border-white/5 rounded-2xl text-slate-300 text-xs px-4 py-3.5 focus:outline-none focus:border-blue-500 transition-all font-semibold max-w-[200px]"
          >
            <option value="ALL">Semua Jurusan</option>
            {majorsList.map((m, idx) => (
              <option key={idx} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            disabled={filteredApplicants.length === 0}
            className="px-4 py-3.5 bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 text-emerald-400 disabled:opacity-40 disabled:pointer-events-none rounded-2xl text-xs font-extrabold tracking-wide uppercase transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Ekspor CSV
          </button>
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="bg-[#161f2e]/70 border border-white/5 rounded-3xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-slate-300">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider bg-slate-950/15">
                <th className="py-4 px-6 pl-8">Nama Calon Siswa</th>
                <th className="py-4 px-6">NISN / NIK</th>
                <th className="py-4 px-6">Asal Sekolah</th>
                <th className="py-4 px-6">Pilihan Jurusan 1</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right pr-8">Aksi Administrasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredApplicants.map((a, idx) => (
                <tr
                  key={a.id || idx}
                  className="hover:bg-white/5 transition-all group cursor-pointer"
                  onDoubleClick={() => setSelectedApplicant(a)}
                >
                  <td className="py-4 px-6 pl-8">
                    <div className="font-bold text-white text-sm">{a.nama}</div>
                    <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5 block">
                      Daftar: {new Date(a.tgl_daftar || a.createdAt || Date.now()).toLocaleDateString("id-ID")}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-300 font-mono text-[11px]">{a.nisn}</div>
                    <span className="text-[10px] text-slate-500 font-mono tracking-wide">{a.nik || "NIK Kosong"}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-300">{a.sekolah_asal || a.sekolahAsal}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/15 font-semibold text-[10px]">
                      {a.jurusan_1 || a.jurusan1}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold border ${
                        a.status === "Approved"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : a.status === "Rejected"
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {a.status === "Approved" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right pr-8 shrink-0">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedApplicant(a)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-all border border-white/5"
                        title="Lihat Detail Form"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {a.status !== "Approved" && (
                        <button
                          onClick={() => verifyApplicant(a.id)}
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-xl transition-all border border-emerald-500/20"
                          title="Setujui & Verifikasi"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}

                      {a.status !== "Rejected" && (
                        <button
                          onClick={() => rejectApplicant(a.id)}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl transition-all border border-rose-500/20"
                          title="Tolak Pendaftaran"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm("Apakah Anda yakin ingin menghapus data pendaftar ini secara permanen?")) {
                            deleteApplicant(a.id);
                          }
                        }}
                        className="p-2 bg-slate-950/20 hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 rounded-xl transition-all border border-white/5"
                        title="Hapus Permanen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApplicants.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500 font-bold">
                    Tidak ditemukan data calon siswa yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Beautiful Rich Detail Modal (13 Wizard Steps tabs overlay) */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-[#161f2e] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-slate-950/15">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <span>{selectedApplicant.nama}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                      selectedApplicant.status === "Approved"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : selectedApplicant.status === "Rejected"
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}
                  >
                    {selectedApplicant.status === "Approved" ? "Terverifikasi" : selectedApplicant.status === "Rejected" ? "Ditolak" : "Pending"}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-semibold tracking-wider mt-0.5">NISN: {selectedApplicant.nisn} · Asal: {selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}</p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex border-b border-white/5 bg-slate-950/10 px-6 overflow-x-auto shrink-0 scrollbar-none">
              {[
                { id: "biodata", label: "Bio Diri & Kontak" },
                { id: "periodik", label: "Periodik & Kesehatan" },
                { id: "bantuan", label: "Bantuan & Prestasi" },
                { id: "orangtua", label: "Orang Tua / Wali" },
                { id: "akademik", label: "Akademik & Jurusan" },
                { id: "pernyataan", label: "Komitmen & Janji" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 uppercase tracking-wide ${
                    activeTab === t.id
                      ? "border-blue-500 text-white"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Tab Content Viewport */}
            <div className="flex-1 overflow-y-auto p-8 text-xs leading-relaxed text-slate-300 font-semibold max-h-[50vh]">
              {activeTab === "biodata" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Identitas Diri</h4>
                    <div className="space-y-3">
                      <div><span className="text-slate-400 block mb-0.5">Nama Lengkap</span> <span className="text-white text-sm font-bold">{selectedApplicant.nama}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">NISN / NIK</span> <span className="text-white text-sm font-bold">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Tempat, Tanggal Lahir</span> <span className="text-white font-bold">{selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Jenis Kelamin / Agama</span> <span className="text-white font-bold">{selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin} / {selectedApplicant.agama}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Alamat & Kontak</h4>
                    <div className="space-y-3">
                      <div><span className="text-slate-400 block mb-0.5">WhatsApp / Email</span> <span className="text-blue-400 text-sm font-mono font-bold">{selectedApplicant.whatsapp} / {selectedApplicant.email}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Alamat Tempat Tinggal</span> <span className="text-white font-bold">{selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Kelurahan / Kecamatan</span> <span className="text-white font-bold">{selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Tinggal Dengan / Transportasi</span> <span className="text-white font-bold">{selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan} / {selectedApplicant.transportasi}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "periodik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Data Fisik & Periodik</h4>
                    <div className="space-y-3">
                      <div><span className="text-slate-400 block mb-0.5">Tinggi / Berat Badan</span> <span className="text-white font-bold">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Jarak ke Sekolah</span> <span className="text-white font-bold">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Waktu Tempuh Perjalanan</span> <span className="text-white font-bold">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Jumlah Saudara Kandung</span> <span className="text-white font-bold">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Kondisi Kesehatan</h4>
                    <div className="space-y-3">
                      <div><span className="text-slate-400 block mb-0.5">Golongan Darah</span> <span className="text-white font-bold text-sm uppercase">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Riwayat Penyakit</span> <span className="text-white font-bold">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}</span></div>
                      <div>
                        <span className="text-slate-400 block mb-1">Kebutuhan Khusus</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedApplicant.kebutuhan_khusus) ? selectedApplicant.kebutuhan_khusus.map((k, idx) => (
                            <span key={idx} className="bg-slate-800 text-slate-300 border border-white/5 px-2 py-0.5 rounded-md font-bold">{k}</span>
                          )) : <span className="text-slate-500 italic">Tidak Ada</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bantuan" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Kartu Jaminan Sosial / Bantuan</h4>
                    <div className="space-y-3">
                      <div><span className="text-slate-400 block mb-0.5">Penerima KPS</span> <span className="text-white font-bold">{selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} {selectedApplicant.no_kps || selectedApplicant.noKps ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})` : ""}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Penerima KIP</span> <span className="text-white font-bold">{selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} {selectedApplicant.no_kip || selectedApplicant.noKip ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})` : ""}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Uraian Prestasi & Beasiswa</h4>
                    <div className="space-y-3">
                      <div><span className="text-slate-400 block mb-0.5">Prestasi</span> <span className="text-white font-bold">{selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Beasiswa</span> <span className="text-white font-bold">{selectedApplicant.uraian_beasiswa || selectedApplicant.uraianBeasiswa || "Tidak Ada"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orangtua" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Ayah Kandung</h4>
                    <div className="space-y-2.5">
                      <div><span className="text-slate-400 block mb-0.5">Nama Lengkap</span> <span className="text-white font-bold">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Pendidikan / Pekerjaan</span> <span className="text-white font-bold">{selectedApplicant.pendidikan_ayah || selectedApplicant.pendidikanAyah || "-"} / {selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Penghasilan Bulanan</span> <span className="text-white font-bold">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Ibu Kandung</h4>
                    <div className="space-y-2.5">
                      <div><span className="text-slate-400 block mb-0.5">Nama Lengkap</span> <span className="text-white font-bold">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Pendidikan / Pekerjaan</span> <span className="text-white font-bold">{selectedApplicant.pendidikan_ibu || selectedApplicant.pendidikanIbu || "-"} / {selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Penghasilan Bulanan</span> <span className="text-white font-bold">{selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Wali / Kontak Darurat</h4>
                    <div className="space-y-2.5">
                      <div><span className="text-slate-400 block mb-0.5">Nama Wali</span> <span className="text-white font-bold">{selectedApplicant.nama_wali || selectedApplicant.namaWali || "Tidak Ada"}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">No. Telepon Orang Tua</span> <span className="text-blue-400 font-mono text-sm font-bold">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "akademik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Pendidikan Asal</h4>
                    <div className="space-y-3">
                      <div><span className="text-slate-400 block mb-0.5">Nama Sekolah Asal</span> <span className="text-white font-bold">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">No. Ijazah / SKHUN</span> <span className="text-white font-mono font-bold">{selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"} / {selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Tgl Lulus / Lama Belajar</span> <span className="text-white font-bold">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"} ({selectedApplicant.lama_belajar || selectedApplicant.lamaBelajar || 3} Tahun)</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold uppercase tracking-wider mb-4 border-b border-white/5 pb-2 text-[10px]">Pilihan Minat Studi</h4>
                    <div className="space-y-3">
                      <div><span className="text-slate-400 block mb-0.5">Program Studi Pilihan Utama</span> <span className="text-blue-400 font-bold">{selectedApplicant.jurusan_1 || selectedApplicant.jurusan1}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Program Studi Pilihan Cadangan</span> <span className="text-slate-300 font-bold">{selectedApplicant.jurusan_2 || selectedApplicant.jurusan2}</span></div>
                      <div><span className="text-slate-400 block mb-0.5">Alasan Memilih Jurusan</span> <span className="text-white font-bold">{selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pernyataan" && (
                <div className="space-y-5">
                  <h4 className="text-white font-extrabold uppercase tracking-wider border-b border-white/5 pb-2 text-[10px]">Pernyataan Kepatuhan & Kedisiplinan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-900 border border-white/5 rounded-2xl">
                      <span className="text-slate-400 block mb-1">Riwayat Perkelahian/Tawuran</span>
                      <span className={`font-bold px-2 py-0.5 rounded-lg text-[10px] ${selectedApplicant.perkelahian === "Ya" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>{selectedApplicant.perkelahian || "Tidak"}</span>
                    </div>
                    <div className="p-3 bg-slate-900 border border-white/5 rounded-2xl">
                      <span className="text-slate-400 block mb-1">Riwayat Penyalahgunaan Narkoba</span>
                      <span className={`font-bold px-2 py-0.5 rounded-lg text-[10px] ${selectedApplicant.narkoba === "Ya" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>{selectedApplicant.narkoba || "Tidak"}</span>
                    </div>
                    <div className="p-3 bg-slate-900 border border-white/5 rounded-2xl">
                      <span className="text-slate-400 block mb-1">Riwayat Pelanggaran Lainnya</span>
                      <span className={`font-bold px-2 py-0.5 rounded-lg text-[10px] ${selectedApplicant.pelanggaran_lain === "Ya" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>{selectedApplicant.pelanggaran_lain || "Tidak"}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-900/10 border border-blue-500/10 rounded-2xl space-y-2">
                    <span className="text-blue-400 font-extrabold uppercase tracking-wider text-[9px] block">Pernyataan Kesanggupan Taruna Baru:</span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-[10px]">
                      <div className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Taat Tata Tertib Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Menerima Sanksi Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Hubungan Akrab Taruna</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Belajar Dengan Tekun</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Menjaga Nama Baik Sekolah</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Controls Footer */}
            <div className="p-6 border-t border-white/5 bg-slate-950/15 flex items-center justify-between shrink-0">
              <span className="text-slate-500 text-[10px] font-mono">DB_ROW_ID: {selectedApplicant.id}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-white/5"
                >
                  Tutup
                </button>

                {selectedApplicant.status !== "Approved" && (
                  <button
                    onClick={() => {
                      verifyApplicant(selectedApplicant.id);
                      setSelectedApplicant(null);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] flex items-center gap-1.5"
                  >
                    Setujui & Verifikasi
                  </button>
                )}

                {selectedApplicant.status !== "Rejected" && (
                  <button
                    onClick={() => {
                      rejectApplicant(selectedApplicant.id);
                      setSelectedApplicant(null);
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)] flex items-center gap-1.5"
                  >
                    Tolak Pendaftaran
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
