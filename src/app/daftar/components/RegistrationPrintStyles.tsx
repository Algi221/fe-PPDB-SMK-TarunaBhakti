"use client";

import React from "react";

export default function RegistrationPrintStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      @media print {
        /* Hide all non-printable elements */
        .bg-glow-container, .print-hide-sidebar, .signature-block, .floating-action-nav, button, a, nav, header, footer {
          display: none !important;
        }
        
        /* Reset parent wrappers to normal block display with visible overflow */
        html,
        body,
        body > div,
        main,
        #__next,
        .ppdb-print-container,
        .ppdb-print-content {
          display: block !important;
          overflow: visible !important;
          background: white !important;
          color: black !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          box-shadow: none !important;
          border: none !important;
          height: auto !important;
          min-height: auto !important;
          position: static !important;
        }
        
        /* Apply custom padding and formatting on the invoice sheet itself */
        .printable-invoice-sheet {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 1.5cm !important;
          box-shadow: none !important;
          border: none !important;
          background: white !important;
          background-color: white !important;
          color: #0f172a !important;
          overflow: visible !important;
          position: static !important;
        }
        
        /* Force all text in print to be dark and visible */
        .printable-invoice-sheet *,
        .printable-invoice-sheet span,
        .printable-invoice-sheet p,
        .printable-invoice-sheet h1,
        .printable-invoice-sheet h2,
        .printable-invoice-sheet h4,
        .printable-invoice-sheet td,
        .printable-invoice-sheet th {
          color: #0f172a !important;
          background: transparent !important;
          background-color: transparent !important;
        }
        
        /* Keep specific colored text for status and rombel */
        .printable-invoice-sheet .text-blue-650,
        .printable-invoice-sheet .text-blue-600 {
          color: #2563eb !important;
        }
        
        .printable-invoice-sheet .text-emerald-600 {
          color: #059669 !important;
        }
        
        .printable-invoice-sheet .text-amber-500 {
          color: #d97706 !important;
        }
        
        .printable-invoice-sheet border,
        .printable-invoice-sheet td,
        .printable-invoice-sheet th,
        .printable-invoice-sheet tr,
        .printable-invoice-sheet table {
          border-color: #000000 !important;
        }
        
        @page {
          size: auto;
          margin: 0mm; /* hides default browser header (title) and footer (localhost URL) */
        }
      }

      /* Force light theme colors on the printable invoice container even in dark mode on screen */
      html.dark .printable-invoice-sheet,
      html.dark .printable-invoice-sheet.bg-white,
      .printable-invoice-sheet {
        background-color: #ffffff !important;
        color: #0f172a !important;
        border-color: #e2e8f0 !important;
      }

      html.dark .printable-invoice-sheet .text-slate-955,
      html.dark .printable-invoice-sheet .text-slate-900,
      html.dark .printable-invoice-sheet .text-slate-850,
      html.dark .printable-invoice-sheet .text-slate-855,
      html.dark .printable-invoice-sheet .text-slate-800,
      html.dark .printable-invoice-sheet .text-slate-700,
      .printable-invoice-sheet .text-slate-955,
      .printable-invoice-sheet .text-slate-900,
      .printable-invoice-sheet .text-slate-855,
      .printable-invoice-sheet .text-slate-850,
      .printable-invoice-sheet .text-slate-800,
      .printable-invoice-sheet .text-slate-700 {
        color: #0f172a !important;
      }

      html.dark .printable-invoice-sheet .text-slate-550,
      html.dark .printable-invoice-sheet .text-slate-500,
      html.dark .printable-invoice-sheet .text-slate-450,
      html.dark .printable-invoice-sheet .text-slate-400,
      .printable-invoice-sheet .text-slate-550,
      .printable-invoice-sheet .text-slate-500,
      .printable-invoice-sheet .text-slate-450,
      .printable-invoice-sheet .text-slate-400 {
        color: #64748b !important;
      }

      html.dark .printable-invoice-sheet .bg-slate-50,
      .printable-invoice-sheet .bg-slate-50 {
        background-color: #f8fafc !important;
      }

      html.dark .printable-invoice-sheet .bg-white,
      .printable-invoice-sheet .bg-white {
        background-color: #ffffff !important;
      }

      html.dark .printable-invoice-sheet .border-slate-200,
      html.dark .printable-invoice-sheet .border-slate-100,
      .printable-invoice-sheet .border-slate-200,
      .printable-invoice-sheet .border-slate-100 {
        border-color: #e2e8f0 !important;
      }

      html.dark .printable-invoice-sheet .border-slate-800,
      html.dark .printable-invoice-sheet .border-slate-900,
      .printable-invoice-sheet .border-slate-800,
      .printable-invoice-sheet .border-slate-900 {
        border-color: #1e293b !important;
      }
      
      html.dark .printable-invoice-sheet .divide-slate-200,
      .printable-invoice-sheet .divide-slate-200 {
        border-color: #e2e8f0 !important;
      }

      html.dark .printable-invoice-sheet .text-blue-600,
      .printable-invoice-sheet .text-blue-600 {
        color: #2563eb !important;
      }
    `}} />
  );
}
