"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import InvoicePrintStyles from "./components/InvoicePrintStyles";
import InvoiceSheet from "./components/InvoiceSheet";
import InvoiceActionPanel from "./components/InvoiceActionPanel";

function InvoiceContent() {
  const searchParams = useSearchParams();
  const nisn = searchParams.get("nisn");
  const isAdmin = searchParams.get("isAdmin") === "true";
  const [data, setData] = useState<any>(null);
  const [regCost, setRegCost] = useState(250000);
  const [waGroupUrl, setWaGroupUrl] = useState("https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCleanWaNumber = () => {
    if (!data || !data.whatsapp) return "";
    let rawPhone = data.whatsapp;
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    }
    return cleanPhone;
  };

  const getWaSendUrl = () => {
    if (typeof window === 'undefined' || !data) return "";
    const cleanPhone = getCleanWaNumber();
    const invoiceUrl = `${window.location.origin}/invoice?nisn=${data.nisn}`;
    const messageText = `Halo ${data.nama},\n\nPembayaran registrasi formulir PPDB SMK Taruna Bhakti Depok Anda dengan NISN: ${data.nisn} telah BERHASIL DIVERIFIKASI dan dinyatakan LUNAS.\n\nBerikut adalah tautan bukti registrasi & invoice resmi pembayaran Anda:\n${invoiceUrl}\n\nTerima kasih.\nPanitia PPDB SMK Taruna Bhakti`;
    const encodedMessage = encodeURIComponent(messageText);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  const handleSendWhatsApp = () => {
    const url = getWaSendUrl();
    if (url) {
      window.open(url, '_blank');
      setTimeout(() => {
        window.location.href = "/dashboard/pendaftar";
      }, 1000);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('ppdb-theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    const savedCost = localStorage.getItem('ppdb_reg_cost');
    if (savedCost) {
      const parsed = parseInt(savedCost);
      if (!isNaN(parsed)) setRegCost(parsed);
    }
    const savedWaGroup = localStorage.getItem('ppdb_wa_group_url');
    if (savedWaGroup) {
      setWaGroupUrl(savedWaGroup);
    }

    const loadLiveCost = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/config");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.ppdb_form_fee) {
            const parsed = parseInt(json.data.ppdb_form_fee);
            if (!isNaN(parsed)) {
              setRegCost(parsed);
              localStorage.setItem('ppdb_reg_cost', json.data.ppdb_form_fee);
            }
          }
          if (json.data.ppdb_wa_group_url) {
            setWaGroupUrl(json.data.ppdb_wa_group_url);
            localStorage.setItem('ppdb_wa_group_url', json.data.ppdb_wa_group_url);
          }
        }
      } catch (err) {
        console.warn("Using cached config for invoice view");
      }
    };
    loadLiveCost();

    if (!nisn) {
      setError("Parameter NISN tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchInvoiceData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/applicants/public-status?nisn=${nisn}`);
        const result = await res.json();
        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.error || "Data pendaftar tidak ditemukan.");
        }
      } catch (err) {
        setError("Gagal menghubungi server untuk memuat invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [nisn]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">Menyiapkan tanda bukti registrasi...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/50">
            ⚠️
          </div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white mb-2">Invoice Tidak Ditemukan</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 leading-relaxed">
            {error || "Data pendaftar dengan NISN tersebut tidak terdaftar di sistem PPDB."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const tglDaftarFormatted = data.created_at
    ? new Date(data.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "-";

  return (
    <div className="print-root min-h-screen bg-slate-100 dark:bg-slate-950 py-10 px-4 transition-colors">
      <InvoicePrintStyles />

      <div className="screen-layout">
        {/* ===== INVOICE SHEET ===== */}
        <InvoiceSheet
          data={data}
          regCost={regCost}
          tglDaftarFormatted={tglDaftarFormatted}
        />

        {/* ===== ACTION PANEL ===== */}
        <InvoiceActionPanel
          data={data}
          isAdmin={isAdmin}
          waGroupUrl={waGroupUrl}
          onPrint={handlePrint}
          onSendWhatsApp={handleSendWhatsApp}
        />
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
