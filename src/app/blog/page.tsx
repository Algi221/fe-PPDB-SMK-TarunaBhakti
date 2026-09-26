"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Newspaper, Calendar, ArrowRight, Search, Loader2 } from "lucide-react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  author: string;
  read_time: string;
  image_url: string | null;
  content: string;
}

const BACKEND_URL = typeof window !== "undefined"
  ? `http://${window.location.hostname}:5000`
  : "http://localhost:5000";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/blog`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setArticles(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Semua", ...Array.from(new Set(articles.map((a) => a.category)))];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === "Semua" || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      <Navbar activePath="/blog" />

      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[350px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-[10%] right-[20%] w-[450px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-6 pt-32 pb-24 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-blue-600 dark:text-sky-400">Blog & Berita</span>
        </div>

        {/* Hero */}
        <div className="space-y-4 mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-sky-400 text-xs font-bold tracking-wide">
            <Newspaper size={14} />
            <span>Kabar & Artikel Terkini</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Blog & Informasi Sekolah <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              SMK Taruna Bhakti
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Dapatkan wawasan seputar dunia vokasi, prestasi siswa, tips seleksi PPDB, dan perkembangan teknologi mutakhir di kampus kami.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
            <Newspaper size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-bold text-slate-500">
              {articles.length === 0
                ? "Belum ada artikel. Admin dapat menambahkan melalui dashboard."
                : "Tidak ada artikel yang cocok."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={art.image_url || FALLBACK_IMG}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600/90 text-white backdrop-blur-xs">
                        {art.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {formatDate(art.created_at)}
                      </span>
                      <span>•</span>
                      <span>{art.read_time}</span>
                    </div>
                    <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors leading-snug mb-3">
                      {art.title}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Oleh {art.author}</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 group-hover:gap-2.5 transition-all">
                    <span>Baca Lengkap</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                ✕
              </button>
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400">
                  {selectedArticle.category}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <span>{formatDate(selectedArticle.created_at)}</span>
                  <span>•</span>
                  <span>Oleh {selectedArticle.author}</span>
                </div>
                {selectedArticle.image_url && (
                  <div className="rounded-2xl overflow-hidden my-4 max-h-64">
                    <img src={selectedArticle.image_url} alt={selectedArticle.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedArticle.content}
                </p>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
