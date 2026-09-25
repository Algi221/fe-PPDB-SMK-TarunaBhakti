import React from 'react';
import { Calendar, BookOpen } from 'lucide-react';
import { InformasiItem, formatDate, parseMedia, sanitizeSrc, sanitizeUrl } from './types';

interface ForumDetailModalProps {
  post: InformasiItem | null;
  onClose: () => void;
  onOpenLightbox: (src: string) => void;
}

export default function ForumDetailModal({
  post,
  onClose,
  onOpenLightbox
}: ForumDetailModalProps) {
  if (!post) return null;

  const media = parseMedia(post.foto_url);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden my-8 max-h-[90vh] md:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {media.foto && (
          <div 
            onClick={() => onOpenLightbox(media.foto)}
            className="w-full md:w-auto md:max-w-[45%] bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 cursor-zoom-in relative group max-h-87.5 md:max-h-none shrink-0"
          >
            <img 
              src={sanitizeSrc(media.foto) || ''} 
              alt={post.judul} 
              className="max-w-full max-h-full md:max-h-[75vh] w-auto h-auto object-contain rounded-xl" 
            />
            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm">
                🔍 Klik untuk Zoom
              </span>
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col min-w-0 h-auto md:h-full overflow-visible md:overflow-y-auto">
          <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/15 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900">
              <Calendar size={11} />
              {formatDate(post.tanggal)}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6 flex-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-snug break-all">{post.judul}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line break-all">{post.konten}</p>

            {/* Additional Media Section */}
            {(media.video || media.dokumen) && (
              <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-6">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-left">
                  Lampiran Pengumuman
                </h4>
                
                <div className="space-y-6">
                  {/* Video Player */}
                  {media.video && (
                    <div className="space-y-3 text-left">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">🎥 Video Lampiran:</span>
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 shadow-md">
                        <video src={sanitizeSrc(media.video) || ''} controls className="w-full max-h-72 object-contain">
                          <track kind="captions" label="No captions" default />
                        </video>
                      </div>
                    </div>
                  )}

                  {/* Document Preview & Download Button */}
                  {media.dokumen && (
                    <div className="space-y-3 text-left w-full">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">📄 Pratinjau Dokumen Resmi / Surat Keputusan:</span>
                      
                      {media.dokumen.startsWith("data:application/pdf") ? (
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md bg-white">
                          <iframe src={sanitizeSrc(media.dokumen) || ''} className="w-full h-87.5 border-0" />
                        </div>
                      ) : media.dokumen.startsWith("data:image/") ? (
                        <div 
                          onClick={() => onOpenLightbox(media.dokumen)}
                          className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 cursor-zoom-in group relative"
                        >
                          <img src={sanitizeSrc(media.dokumen) || ''} alt="Dokumen Preview" className="max-w-full max-h-80 object-contain rounded-xl" />
                          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="bg-black/60 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">🔍 Zoom Dokumen</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                            <BookOpen size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{media.dokumenName || "dokumen.pdf"}</h6>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5">Pratinjau langsung tidak tersedia untuk format berkas ini. Silakan unduh dokumen untuk melihat isi berkas.</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <a
                          href={sanitizeUrl(media.dokumen) || '#'}
                          download={media.dokumenName || "lampiran_dokumen.pdf"}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]"
                        >
                          Unduh Lampiran Dokumen ({media.dokumenName || "dokumen.pdf"})
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-slate-50/50 dark:bg-slate-950/15 border-t border-slate-100 dark:border-white/5 flex justify-end sticky bottom-0 z-20 backdrop-blur-md">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
