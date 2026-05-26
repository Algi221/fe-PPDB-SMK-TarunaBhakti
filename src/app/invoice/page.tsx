"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Printer, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function InvoiceContent() {
  const searchParams = useSearchParams();
  const nisn = searchParams.get("nisn");
  const [data, setData] = useState<any>(null);
  const [regCost, setRegCost] = useState(150000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedCost = localStorage.getItem('ppdb_reg_cost');
    if (savedCost) {
      const parsed = parseInt(savedCost);
      if (!isNaN(parsed)) setRegCost(parsed);
    }
  }, []);

  useEffect(() => {
    if (!nisn) {
      setError("NISN tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchInvoice = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/applicants/public-invoice/${nisn}`);
        const json = await res.json();
        
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.message || "Gagal mengambil data invoice.");
        }
      } catch (err: any) {
        setError("Error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [nisn]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-500 mb-6">{error || "Data tidak ditemukan."}</p>
          <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 print:bg-white print:py-0 print:px-0 flex flex-col items-center">
      
      {/* Controls (Hidden on Print) */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 print:hidden">
        <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium">
          <ArrowLeft size={18} />
          Kembali
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md transition font-bold"
        >
          <Printer size={18} />
          Cetak Invoice
        </button>
      </div>

      {/* Invoice Paper */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 flex justify-between items-center print:bg-slate-900 print:text-white">
          <div>
            <h1 className="text-2xl font-black mb-1">INVOICE PPDB</h1>
            <p className="text-slate-400 text-sm print:text-slate-300">SMK Taruna Bhakti Depok</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1 print:text-slate-300">No. Invoice</p>
            <p className="font-mono text-lg font-bold">INV-{data.nisn}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Tagihan Kepada:</p>
              <h2 className="text-xl font-bold text-slate-800 mb-1">{data.nama}</h2>
              <p className="text-sm text-slate-600 mb-1">NISN: {data.nisn}</p>
              <p className="text-sm text-slate-600">Jurusan: {data.jurusan_1}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Tanggal:</p>
              <p className="text-sm font-semibold text-slate-800">
                {new Date(data.tgl_daftar).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 text-sm text-slate-500 font-bold uppercase">Deskripsi</th>
                <th className="text-right py-3 text-sm text-slate-500 font-bold uppercase">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-4 text-slate-800 font-medium">Biaya Registrasi PPDB {data.periode || "2026-2027"}</td>
                <td className="py-4 text-right text-slate-800 font-bold">Rp {regCost.toLocaleString("id-ID")}</td>
              </tr>
            </tbody>
          </table>

          {/* Total & Status */}
          <div className="flex justify-end mb-12">
            <div className="w-1/2">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Subtotal</span>
                <span className="text-slate-800 font-bold">Rp {regCost.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-slate-800">
                <span className="text-slate-800 font-black text-lg">Total</span>
                <span className="text-blue-600 font-black text-xl">Rp {regCost.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col items-center justify-center print:border-2 print:border-emerald-500">
            <CheckCircle size={48} className="text-emerald-500 mb-3" />
            <h3 className="text-xl font-black text-emerald-600 uppercase tracking-widest">Lunas</h3>
            <p className="text-emerald-600/80 text-sm mt-1 text-center">Pembayaran telah berhasil diverifikasi oleh sistem.</p>
          </div>

        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 p-6 text-center text-xs text-slate-400 border-t border-slate-100">
          Dokumen ini dicetak otomatis oleh Sistem PPDB SMK Taruna Bhakti Depok dan sah sebagai bukti pembayaran.
        </div>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}
