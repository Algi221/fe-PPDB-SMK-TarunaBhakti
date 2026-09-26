"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePPDB } from "@/context/PPDBContext";
import {
  Newspaper, Plus, Pencil, Trash2, Save, X, Eye, EyeOff,
  Loader2, Image as ImageIcon, ArrowLeft
} from "lucide-react";

interface BlogPost {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  image_url: string;
  published: boolean;
}

const EMPTY_POST: BlogPost = {
  title: "",
  excerpt: "",
  content: "",
  category: "Berita Sekolah",
  author: "Humas SMK TB",
  read_time: "3 menit baca",
  image_url: "",
  published: true,
};

const CATEGORIES = ["Berita Sekolah", "Prestasi", "Tips PPDB", "Teknologi", "Kegiatan", "Pengumuman"];

export default function KelolaBlogPage() {
  const { adminToken, addToast } = usePPDB();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost>(EMPTY_POST);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgUploading, setImgUploading] = useState(false);

  const BACKEND_URL = typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000`
    : "http://localhost:5000";

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/blog/all`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success) setPosts(json.data);
    } catch {
      addToast("Gagal memuat data blog.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleImageUpload = async (file: File) => {
    setImgUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const safeName = `blog-${Date.now()}`;
      try {
        const res = await fetch(`${BACKEND_URL}/api/upload/teacher-photo`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
          body: JSON.stringify({ base64, filename: safeName }),
        });
        const data = await res.json();
        if (data.success) {
          setCurrentPost((p) => ({ ...p, image_url: `http://${window.location.hostname}:3000${data.url}` }));
          addToast("Gambar berhasil diupload!", "success");
        } else {
          addToast(data.message || "Gagal upload gambar.", "error");
        }
      } catch {
        addToast("Koneksi gagal.", "error");
      } finally {
        setImgUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!currentPost.title || !currentPost.excerpt || !currentPost.content) {
      addToast("Judul, ringkasan, dan konten wajib diisi.", "error");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!currentPost.id;
      const url = isEdit ? `${BACKEND_URL}/api/blog/${currentPost.id}` : `${BACKEND_URL}/api/blog`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(currentPost),
      });
      const json = await res.json();
      if (json.success) {
        addToast(isEdit ? "Artikel diperbarui!" : "Artikel berhasil dibuat!", "success");
        setEditMode(false);
        setCurrentPost(EMPTY_POST);
        fetchPosts();
      } else {
        addToast(json.message || "Gagal menyimpan.", "error");
      }
    } catch {
      addToast("Koneksi gagal.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success) {
        addToast("Artikel dihapus.", "success");
        fetchPosts();
      } else {
        addToast(json.message || "Gagal menghapus.", "error");
      }
    } catch {
      addToast("Koneksi gagal.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ published: !post.published }),
      });
      const json = await res.json();
      if (json.success) {
        addToast(post.published ? "Artikel disembunyikan." : "Artikel dipublikasikan.", "success");
        fetchPosts();
      }
    } catch {
      addToast("Koneksi gagal.", "error");
    }
  };

  if (editMode) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setEditMode(false); setCurrentPost(EMPTY_POST); }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">
              {currentPost.id ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h1>
            <p className="text-xs text-slate-500 font-semibold">Blog SMK Taruna Bhakti</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Judul Artikel *</label>
                <input
                  type="text"
                  value={currentPost.title}
                  onChange={(e) => setCurrentPost((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Masukkan judul artikel..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Ringkasan (Excerpt) *</label>
                <textarea
                  rows={3}
                  value={currentPost.excerpt}
                  onChange={(e) => setCurrentPost((p) => ({ ...p, excerpt: e.target.value }))}
                  placeholder="Ringkasan singkat artikel untuk ditampilkan di daftar blog..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Isi Artikel *</label>
                <textarea
                  rows={14}
                  value={currentPost.content}
                  onChange={(e) => setCurrentPost((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Tulis isi artikel lengkap di sini..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar options */}
          <div className="space-y-4">
            {/* Publish */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Publikasi</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPost((p) => ({ ...p, published: !p.published }))}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${currentPost.published ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${currentPost.published ? "left-6" : "left-1"}`} />
                </button>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {currentPost.published ? "Dipublikasikan" : "Draft (tersembunyi)"}
                </span>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-60 cursor-pointer"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Menyimpan..." : "Simpan Artikel"}
              </button>
            </div>

            {/* Category & Meta */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Detail Artikel</h3>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Kategori</label>
                <select
                  value={currentPost.category}
                  onChange={(e) => setCurrentPost((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Penulis</label>
                <input
                  type="text"
                  value={currentPost.author}
                  onChange={(e) => setCurrentPost((p) => ({ ...p, author: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Estimasi Baca</label>
                <input
                  type="text"
                  value={currentPost.read_time}
                  onChange={(e) => setCurrentPost((p) => ({ ...p, read_time: e.target.value }))}
                  placeholder="3 menit baca"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Cover image */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Gambar Cover</h3>

              {currentPost.image_url ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={currentPost.image_url} alt="cover" className="w-full h-36 object-cover" />
                  <button
                    onClick={() => setCurrentPost((p) => ({ ...p, image_url: "" }))}
                    className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className={`h-28 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 transition-colors ${imgUploading ? "opacity-60" : ""}`}>
                    {imgUploading ? (
                      <Loader2 size={20} className="animate-spin text-blue-500" />
                    ) : (
                      <>
                        <ImageIcon size={20} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-400">Upload gambar</span>
                        <span className="text-[10px] text-slate-300">JPG, PNG, WEBP · Maks 3MB</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={imgUploading}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                  />
                </label>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">atau masukkan URL gambar</label>
                <input
                  type="text"
                  value={currentPost.image_url}
                  onChange={(e) => setCurrentPost((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper size={20} className="text-blue-600" />
            Kelola Blog
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {posts.length} artikel terdaftar · {posts.filter((p) => p.published).length} dipublikasikan
          </p>
        </div>
        <button
          onClick={() => { setCurrentPost(EMPTY_POST); setEditMode(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-blue-500/25"
        >
          <Plus size={14} />
          Tulis Artikel
        </button>
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-blue-600" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
          <Newspaper size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-sm font-bold text-slate-500">Belum ada artikel. Mulai tulis artikel pertama!</p>
          <button
            onClick={() => { setCurrentPost(EMPTY_POST); setEditMode(true); }}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Tulis Artikel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-blue-500/30 transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper size={20} className="text-slate-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400">
                    {post.category}
                  </span>
                  {!post.published && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{post.title}</h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">{post.excerpt}</p>
                <p className="text-[10px] text-slate-400 mt-1">Oleh {post.author} · {post.read_time}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTogglePublish(post)}
                  title={post.published ? "Sembunyikan" : "Publikasikan"}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {post.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => { setCurrentPost({ ...post, image_url: post.image_url || "" }); setEditMode(true); }}
                  title="Edit"
                  className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setDeleteId(post.id!)}
                  title="Hapus"
                  className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center mx-auto">
              <Trash2 size={20} className="text-rose-500" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Hapus Artikel?</h3>
            <p className="text-xs text-slate-500">Artikel yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
