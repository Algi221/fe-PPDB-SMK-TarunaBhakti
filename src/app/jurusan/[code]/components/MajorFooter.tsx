"use client";

import React from "react";
import Link from "next/link";

export default function MajorFooter() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900 py-16 transition-colors duration-300 relative z-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-slate-500 dark:text-slate-400">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo_smktb.png" alt="Logo SMK TB" className="w-12 h-12 object-contain shrink-0" />
              <div>
                <span className="logo-text font-black text-slate-800 dark:text-white text-lg">PPDB <span className="text-blue-600 dark:text-sky-400">SMK TB</span></span>
                <span className="block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-550 uppercase mt-0.5">SMK Taruna Bhakti</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              Pionir pendidikan kejuruan teknologi informasi dan industri kreatif. Membina talenta unggul berkarakter mulia dan berdaya saing global sejak 1987.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/starbhak.official"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link instagram"
                title="Instagram Resmi SMK Taruna Bhakti"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@starbhak.official"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link youtube"
                title="YouTube Resmi SMK Taruna Bhakti"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.099-2.099C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.399.564C.776 4.337-.026 5.141-.298 6.163 0 8.01 0 12 0 12s0 3.99.298 5.837c.272 1.022 1.074 1.826 2.099 2.099C4.45 20.5 12 20.5 12 20.5s7.55 0 9.399-.564c1.025-.273 1.827-1.077 2.099-2.099C24 15.99 24 12 24 12s0-3.99-.298-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@starbhak.official?lang=id-ID"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link tiktok"
                title="TikTok Resmi SMK Taruna Bhakti"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.6-4.03-1.46-.07-.05-.13-.1-.19-.15v5.08c.03 2.76-1.11 5.46-3.21 7.15-2.3 1.88-5.5 2.5-8.29 1.63-2.93-.93-5.27-3.41-6.01-6.42-.87-3.51.52-7.46 3.49-9.56 1.86-1.32 4.17-1.83 6.41-1.42V9.3c-1.07-.34-2.28-.19-3.22.42-1.08.7-1.74 1.94-1.73 3.22.01 1.42.87 2.77 2.19 3.29 1.34.52 2.92.21 3.93-.76.92-.88 1.34-2.18 1.25-3.44V0h-.02z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/smktarunabhaktidepok"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link facebook"
                title="Facebook Resmi SMK Taruna Bhakti"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Program Keahlian</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/jurusan/rpl" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Rekayasa Perangkat Lunak (PPLG)</Link></li>
              <li><Link href="/jurusan/tjkt" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Teknik Jaringan Komputer &amp; Telkom (TJKT)</Link></li>
              <li><Link href="/jurusan/dkv" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Desain Komunikasi Visual (DKV)</Link></li>
              <li><Link href="/jurusan/bc" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Broadcasting &amp; Perfilman (BC)</Link></li>
              <li><Link href="/jurusan/an" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Animasi (AN)</Link></li>
              <li><Link href="/jurusan/te" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Teknik Elektronika (TE)</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Portal PPDB</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/daftar" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Pendaftaran Online</Link></li>
              <li><Link href="/#alur" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Alur &amp; Prosedur</Link></li>
              <li><Link href="/#majors" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Syarat Kompetensi</Link></li>
              <li><Link href="/#kemitraan" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Kerjasama Industri</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Dashboard Seleksi Admin</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Hubungi Kami</h4>
            <p className="text-xs leading-relaxed font-semibold">
              Jalan Pekapuran Kel. Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16453
            </p>
            <div className="space-y-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <p>Telp: <span className="text-slate-700 dark:text-slate-350">+62 21 874 4810</span></p>
              <p>WhatsApp: <span className="text-slate-700 dark:text-slate-350">08119892324</span></p>
              <p>Email: <span className="text-slate-700 dark:text-slate-350">info@smktarunabhakti.sch.id</span></p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/50 dark:border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs font-semibold text-slate-400 dark:text-slate-555">
          <div>
            &copy; {new Date().getFullYear()} SMK Taruna Bhakti Depok. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
