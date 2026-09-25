"use client";

import React from "react";

interface PrintableInvoiceSheetProps {
  successData: any;
  ppdbLogo?: string;
  ppdbTitle?: string;
  schoolPeriod: string;
  regCost: number;
  tglDaftarFormatted: string;
}

export default function PrintableInvoiceSheet({
  successData,
  ppdbLogo,
  ppdbTitle,
  schoolPeriod,
  regCost,
  tglDaftarFormatted,
}: PrintableInvoiceSheetProps) {
  return (
    <div className="lg:col-span-7 w-full bg-white text-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200/50 print-full-width relative overflow-hidden invoice-sheet-container printable-invoice-sheet">
      {/* Elegant official diagonal stamp seal inside sheet */}
      {successData.payment_status === "Paid" ? (
        <div className="absolute top-28 right-8 border-4 border-emerald-500/60 text-emerald-500/60 font-black text-sm uppercase tracking-widest px-4 py-2 rounded-xl -rotate-12 pointer-events-none select-none z-10 bg-white/70 backdrop-blur-xs font-mono">
          LUNAS / VERIFIED
        </div>
      ) : (
        <div className="absolute top-28 right-8 border-4 border-amber-500/60 text-amber-500/60 font-black text-xs uppercase tracking-widest px-3 py-1.5 rounded-xl -rotate-12 pointer-events-none select-none z-10 bg-white/70 backdrop-blur-xs font-mono">
          PROSES VERIFIKASI
        </div>
      )}

      {/* School Letterhead */}
      <div className="flex items-center gap-4 border-b-4 border-double border-slate-800 pb-4 mb-6">
        <img 
          src={ppdbLogo || "/logo_smktb.png"} 
          alt="Logo Sekolah" 
          className="w-14 h-14 object-contain" 
          onError={(e: any) => e.target.src = "https://smktarunabhakti.sch.id/wp-content/uploads/2019/02/cropped-logo-tb-32x32.png"} 
        />
        <div className="text-left">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-0.5">Panitia Penerimaan Peserta Didik Baru</h4>
          <h2 className="text-lg font-black text-slate-900 leading-tight">
            {ppdbTitle ? ppdbTitle.replace(/^(ppdb\s+)/i, '').toUpperCase() : "SMK TARUNA BHAKTI DEPOK"}
          </h2>
          <p className="text-[9px] font-bold text-slate-500">Terakreditasi A · Jl. Pekapuran No. 22, Cimanggis, Depok, Jawa Barat</p>
          <p className="text-[9px] text-slate-400">Telp: (021) 874 7475 · Website: www.smktarunabhakti.sch.id</p>
        </div>
      </div>

      {/* Invoice Header */}
      <div className="text-center mb-6">
        <h1 className="text-base font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 inline-block pb-1.5 mb-1.5">TANDA BUKTI REGISTRASI & INVOICE PEMBAYARAN</h1>
        <p className="text-[10px] font-mono font-bold text-slate-450">Nomor Dokumen: INV-{successData.nisn}</p>
      </div>

      {/* Invoice details layout: 2-Columns grid */}
      <div className="grid grid-cols-2 gap-4 bg-white border border-slate-300 shadow-sm rounded-2xl p-4.5 text-[10px] leading-relaxed text-left text-slate-700 font-bold mb-6">
        <div className="space-y-1">
          <div className="flex gap-2">
            <span className="text-slate-400 w-24">No. Invoice:</span>
            <span className="text-slate-900 font-mono font-extrabold">INV-{successData.nisn}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 w-24">Tanggal Daftar:</span>
            <span className="text-slate-900">{tglDaftarFormatted}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 w-24">Periode Ajaran:</span>
            <span className="text-slate-900 font-extrabold">{successData.periode || schoolPeriod}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex gap-2">
            <span className="text-slate-400 w-24">Nama Pendaftar:</span>
            <span className="text-slate-900 uppercase font-extrabold">{successData.nama}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 w-24">NISN Pendaftar:</span>
            <span className="text-slate-900 font-mono font-extrabold">{successData.nisn}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 w-24">Program Rombel:</span>
            <span className="text-blue-600 font-extrabold uppercase">{successData.jurusan_1 || successData.jurusan1 || "-"}</span>
          </div>
        </div>
      </div>

      {/* Fee item details table */}
      <table className="w-full text-left text-[11px] font-bold text-slate-700 border-collapse mb-6">
        <thead>
          <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-450">
            <th className="py-2.5">Deskripsi Alokasi Tagihan</th>
            <th className="py-2.5 text-right w-36">Jumlah (Rp)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          <tr>
            <td className="py-3 text-slate-900 font-extrabold">
              Biaya Registrasi Formulir PPDB SMK Taruna Bhakti
              <span className="block text-[9px] font-bold text-slate-400 mt-0.5">Alokasi administrasi berkas dan formulir online</span>
            </td>
            <td className="py-3 text-right text-slate-900 font-black">
              Rp { regCost.toLocaleString("id-ID") }
            </td>
          </tr>
        </tbody>
      </table>

      {/* Bottom Total summary */}
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-1.5 text-[10px] font-bold">
          <div className="flex justify-between text-slate-500 py-1.5 border-b border-slate-100">
            <span>Subtotal:</span>
            <span>Rp {regCost.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-slate-550">
            <span>Pajak (PPN 0%):</span>
            <span>Nihil</span>
          </div>
          <div className="flex justify-between text-slate-955 font-black text-xs py-2 border-t-2 border-slate-800">
            <span>Total Tagihan:</span>
            <span className="text-blue-600 font-black text-sm">Rp {regCost.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Payment Details footer and official approval stamp */}
      <div className="flex justify-between items-center text-[9px] text-slate-500 leading-normal border-t border-slate-150 pt-4 mb-8 print:hidden">
        <div className="flex gap-4">
          <div>
            <span className="font-black">Metode Bayar:</span> <span className="text-slate-800 font-bold uppercase">
              {successData.metode_pembayaran === 'Transfer Manual' ? 'Transfer' : successData.metode_pembayaran}
            </span>
          </div>
          <div>
            <span className="font-black">Status Bayar:</span> <span className={`font-black uppercase ${successData.payment_status === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}`}>{successData.payment_status === 'Paid' ? 'LUNAS (VERIFIED)' : 'PENDING'}</span>
          </div>
        </div>
        <p className="text-[8px] font-bold text-slate-400">
          * Tanda terima digital PPDB SMK Taruna Bhakti.
        </p>
      </div>

      {/* Physical Documents Warning Block */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4 mt-5 text-[11px] text-amber-800 dark:text-amber-500 leading-relaxed font-bold">
        <div className="flex items-center gap-2 mb-2 font-black text-amber-700 dark:text-amber-500 uppercase tracking-wider text-xs">
          <span className="text-sm">⚠️</span>
          Penting: Bawa Berkas Fisik!
        </div>
        <p className="mb-2">
          Harap datang langsung ke loket sekretariat PPDB sekolah untuk verifikasi fisik berkas-berkas pendaftaran berikut:
        </p>
        <ul className="list-disc pl-5 m-0 space-y-1">
          <li>Fotokopi Kartu Keluarga (KK)</li>
          <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
          <li>Akta Kelahiran asli &amp; Fotokopi</li>
          <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
          <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
        </ul>
      </div>
    </div>
  );
}
