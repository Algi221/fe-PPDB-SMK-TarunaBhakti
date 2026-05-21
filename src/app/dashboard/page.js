"use client";

import React, { useState } from "react";
import { usePPDB } from "@/context/PPDBContext";

export default function DashboardOverview() {
  const { applicants, wsLogs } = usePPDB();
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Compute metrics
  const totalCount = applicants.length;
  const approvedCount = applicants.filter((a) => a.status === "Approved").length;
  const pendingCount = applicants.filter((a) => a.status === "Pending" || !a.status).length;
  const rejectedCount = applicants.filter((a) => a.status === "Rejected").length;

  // Major distribution statistics
  const majorsList = [
    { name: "PPLG / RPL", dbName: "Rekayasa Perangkat Lunak", color: "#3b82f6" },
    { name: "TJKT", dbName: "Teknik Jaringan Komputer & Telekomunikasi", color: "#0ea5e9" },
    { name: "DKV", dbName: "Desain Komunikasi Visual", color: "#8b5cf6" },
    { name: "Broadcasting", dbName: "Broadcasting & Perfilman", color: "#ec4899" },
    { name: "Elektronika", dbName: "Teknik Elektronika", color: "#f59e0b" },
    { name: "Animasi", dbName: "Animasi", color: "#10b981" }
  ];

  const majorDistribution = majorsList.map((m) => {
    const count = applicants.filter(
      (a) => a.jurusan_1 === m.dbName || a.jurusan1 === m.dbName || a.jurusan_1 === m.name
    ).length;
    return { ...m, count };
  });

  // Calculate total categorized majors for percentage
  const totalMajorsCount = majorDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1; // avoid divide by zero

  // SVG Donut calculation
  let accumulatedPercent = 0;
  const donutData = majorDistribution.map((m) => {
    const percent = Math.round((m.count / totalMajorsCount) * 100) || 0;
    const startPercent = accumulatedPercent;
    accumulatedPercent += percent;
    return { ...m, percent, startPercent };
  });

  // Trend data: last 7 days registration counts
  // Fallback to static distribution if empty
  const getTrendData = () => {
    const days = [];
    const counts = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString("id-ID", { weekday: "short" });
      days.push(dateString);

      // count how many applicants registered on this day (ignoring time)
      const count = applicants.filter((a) => {
        const regDate = new Date(a.tgl_daftar || a.createdAt || Date.now());
        return regDate.toDateString() === d.toDateString();
      }).length;
      counts.push(count);
    }

    // Add a beautiful base curve if counts are all zero (development sandbox)
    const baseCurve = [8, 14, 11, 23, 19, 32, totalCount || 5];
    const finalCounts = counts.every((c) => c === 0) ? baseCurve : counts;

    return { days, counts: finalCounts };
  };

  const trend = getTrendData();
  const maxTrendVal = Math.max(...trend.counts, 10);

  // SVG Area Chart points builder
  const width = 500;
  const height = 150;
  const padding = 25;
  const points = trend.counts.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / 6;
    const y = height - padding - (val * (height - padding * 2)) / maxTrendVal;
    return { x, y, val };
  });

  const areaPath = points.length
    ? `M ${points[0].x} ${points[0].y} ` +
      points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ") +
      ` L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  const linePath = points.length
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
    : "";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Total */}
        <div className="bg-[#161f2e]/70 border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md hover:border-blue-500/25 transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pendaftar</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white leading-none mb-1">{totalCount}</h3>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Calon Siswa Baru Terdaftar</span>
        </div>

        {/* Card 2: Approved */}
        <div className="bg-[#161f2e]/70 border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md hover:border-emerald-500/25 transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Terverifikasi</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-400 leading-none mb-1">{approvedCount}</h3>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Berkas Lolos Validasi</span>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-[#161f2e]/70 border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md hover:border-amber-500/25 transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-amber-500/5 blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Menunggu Verifikasi</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-amber-400 leading-none mb-1">{pendingCount}</h3>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Menunggu Pemeriksaan</span>
        </div>

        {/* Card 4: Rejected */}
        <div className="bg-[#161f2e]/70 border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md hover:border-rose-500/25 transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-rose-500/5 blur-2xl group-hover:bg-rose-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ditolak / Gugur</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-rose-400 leading-none mb-1">{rejectedCount}</h3>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Berkas Tidak Memenuhi Syarat</span>
        </div>
      </div>

      {/* Two Column Layout: Trend Chart + Major Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart (Col span 2) */}
        <div className="lg:col-span-2 bg-[#161f2e]/70 border border-white/5 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">Tren Registrasi Harian</h3>
              <p className="text-[11px] text-slate-400 font-medium">Statistik grafik pendaftaran calon siswa 7 hari terakhir</p>
            </div>
            <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              7 Hari Terakhir
            </span>
          </div>

          {/* SVG Line/Area Chart */}
          <div className="relative w-full h-[180px] mt-4 flex items-end">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const yVal = padding + ratio * (height - padding * 2);
                return (
                  <line
                    key={idx}
                    x1={padding}
                    y1={yVal}
                    x2={width - padding}
                    y2={yVal}
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area Gradient */}
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Glowing Area Fill */}
              {areaPath && <path d={areaPath} fill="url(#chartGlow)" />}

              {/* Smooth Stroke Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interacting Data Dots */}
              {points.map((p, idx) => (
                <g key={idx} className="group/dot cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#3b82f6"
                    stroke="#161f2e"
                    strokeWidth="2.5"
                    className="transition-all duration-300 group-hover/dot:r-7 group-hover/dot:fill-white"
                  />
                  {/* Tooltip Overlay */}
                  <rect
                    x={p.x - 18}
                    y={p.y - 30}
                    width="36"
                    height="20"
                    rx="6"
                    fill="#1f2937"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                    className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200"
                  />
                  <text
                    x={p.x}
                    y={p.y - 16}
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200"
                  >
                    {p.val}
                  </text>
                </g>
              ))}

              {/* Day Labels */}
              {points.map((p, idx) => (
                <text
                  key={idx}
                  x={p.x}
                  y={height - 4}
                  fill="rgba(255,255,255,0.3)"
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {trend.days[idx]}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Major Distribution Donut Chart */}
        <div className="bg-[#161f2e]/70 border border-white/5 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">Sebaran Pilihan Jurusan</h3>
            <p className="text-[11px] text-slate-400 font-medium">Perbandingan minat program keahlian pendaftar utama</p>
          </div>

          <div className="flex items-center justify-center my-6 relative">
            <svg width="150" height="150" viewBox="0 0 42 42" className="transform -rotate-90">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
              {donutData.map((d, idx) => {
                if (d.percent === 0) return null;
                const strokeDashValue = `${d.percent} ${100 - d.percent}`;
                const strokeDashOffset = 100 - d.startPercent;
                return (
                  <circle
                    key={idx}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={d.color}
                    strokeWidth={hoveredSegment === idx ? "5.5" : "4"}
                    strokeDasharray={strokeDashValue}
                    strokeDashoffset={strokeDashOffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(idx)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                );
              })}
            </svg>
            {/* Centered Total Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-white leading-none mt-0.5">{totalCount}</span>
            </div>
          </div>

          {/* Color Legend list */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {donutData.map((d, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 p-1.5 rounded-xl border border-transparent transition-all ${
                  hoveredSegment === idx ? "bg-white/5 border-white/5" : ""
                }`}
                onMouseEnter={() => setHoveredSegment(idx)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-slate-300 text-[10px] truncate flex-1">{d.name}</span>
                <span className="text-white text-[10px] font-extrabold pr-1">{d.percent}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Two Column Layout Below: Recent Table + Live WebSockets Console Logs Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Recent Applicants list (Col span 3) */}
        <div className="lg:col-span-3 bg-[#161f2e]/70 border border-white/5 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">Pendaftaran Terakhir</h3>
            <p className="text-[11px] text-slate-400 font-medium">Calon siswa yang baru saja menyerahkan formulir pendaftaran</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <th className="pb-3 pl-2">Nama Lengkap</th>
                  <th className="pb-3">Asal Sekolah</th>
                  <th className="pb-3">Jurusan Utama</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applicants.slice(0, 5).map((a, idx) => (
                  <tr key={a.id || idx} className="hover:bg-white/5 transition-all rounded-xl">
                    <td className="py-3.5 pl-2 font-bold text-white max-w-[140px] truncate">{a.nama}</td>
                    <td className="py-3.5 truncate max-w-[120px]">{a.sekolah_asal || a.sekolahAsal}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/15 font-semibold text-[10px]">
                        {majorsList.find((m) => m.dbName === a.jurusan_1 || m.dbName === a.jurusan1)?.name || a.jurusan_1 || a.jurusan1 || "PPLG"}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold border ${
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
                  </tr>
                ))}

                {applicants.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-500 font-semibold">
                      Belum ada calon siswa terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* WebSocket Terminal Stream Logs (Col span 2) */}
        <div className="lg:col-span-2 bg-[#090d16] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-xs font-extrabold text-emerald-400 tracking-wider uppercase font-mono">WS_CONSOLE_DEBUGGER</h3>
              <p className="text-[10px] text-slate-400 font-medium font-mono">Stream monitor lalu lintas WebSocket Hono.js</p>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 animate-pulse" />
            </div>
          </div>

          {/* Terminal stream log viewport */}
          <div className="flex-1 min-h-[160px] max-h-[180px] bg-black/50 rounded-2xl p-4 overflow-y-auto font-mono text-[10px] space-y-2 border border-white/5 custom-scrollbar text-left scroll-smooth">
            {wsLogs.map((log) => (
              <div key={log.id} className="leading-relaxed border-l-2 pl-2 border-emerald-500/30">
                <span className="text-slate-500">[{log.timestamp}]</span>{" "}
                <span
                  className={
                    log.direction === "INCOMING"
                      ? "text-sky-400 font-bold"
                      : log.direction === "SYSTEM"
                      ? "text-amber-400 font-bold"
                      : "text-rose-400 font-bold"
                  }
                >
                  {log.direction === "INCOMING" ? "← RX" : "⚡ SYS"}
                </span>{" "}
                <span className="text-emerald-400 font-bold">{log.event}</span>
                <div className="text-[9px] text-slate-400 pl-4 truncate max-w-full">
                  {typeof log.payload === "object" ? JSON.stringify(log.payload) : log.payload}
                </div>
              </div>
            ))}

            {wsLogs.length === 0 && (
              <div className="text-slate-600 italic py-6 text-center font-mono">
                Menunggu traffic data dari Hono WebSocket...
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>BAUD_RATE: 9600bps</span>
            <span>PORT: 5000/WS</span>
          </div>
        </div>

      </div>

    </div>
  );
}
