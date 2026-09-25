import React from "react";
import { 
  Calendar, 
  Image as ImageIcon, 
  ArrowRight, 
  Edit3, 
  Trash2, 
  Loader2 
} from "lucide-react";
import { Informasi, parseMedia, formatDate, sanitizeSrc } from "./types";

interface InformasiCardProps {
  item: Informasi;
  loadingDetailId: number | null;
  onPreview: (item: Informasi) => void;
  onEdit: (item: Informasi) => void;
  onDelete: (id: number) => void;
}

export const InformasiCard: React.FC<InformasiCardProps> = ({
  item,
  loadingDetailId,
  onPreview,
  onEdit,
  onDelete
}) => {
  const media = parseMedia(item.foto_url);

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 hover:border-slate-350 dark:hover:border-white/10 rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.01)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative cursor-pointer ${
        loadingDetailId === item.id ? "opacity-75 pointer-events-none" : ""
      }`}
      onClick={() => {
        if (loadingDetailId === null) {
          onPreview(item);
        }
      }}
    >
      {/* Floating Date Badge */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-md">
        <Calendar size={11} className="text-blue-400" />
        <span>{formatDate(item.tanggal)}</span>
      </div>

      {/* Floating Media Indicators */}
      <div className="absolute top-4 right-4 z-10 flex gap-1">
        {media.video && (
          <span className="px-2.5 py-1.5 bg-blue-600/90 backdrop-blur-md border border-blue-400/20 text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-md">
            🎥 Video
          </span>
        )}
        {media.dokumen && (
          <span className="px-2.5 py-1.5 bg-emerald-600/90 backdrop-blur-md border border-emerald-400/20 text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-md">
            📄 Dokumen
          </span>
        )}
      </div>

      <div>
        {/* Image Section */}
        <div className="h-48 bg-slate-100 dark:bg-slate-955 overflow-hidden relative border-b border-slate-150 dark:border-white/5">
          {media.foto ? (
            <img
              src={sanitizeSrc(media.foto)}
              alt={item.judul}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-500/10 to-indigo-650/10 dark:from-blue-600/5 dark:to-indigo-500/5 flex flex-col items-center justify-center text-slate-400 dark:text-slate-650 gap-2">
              <ImageIcon
                size={32}
                strokeWidth={1.5}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-600">
                Media Poster Kosong
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-3">
          <h4 className="text-slate-850 dark:text-white font-extrabold text-base tracking-tight leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.judul}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-405 font-medium leading-relaxed line-clamp-3">
            {item.konten}
          </p>
        </div>
      </div>

      {/* Action Bar Footer */}
      <div
        className="px-6 py-4 bg-slate-50/50 dark:bg-slate-955/20 border-t border-slate-100 dark:border-white/5 flex items-center justify-between relative z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onPreview(item)}
          className="text-[11px] font-extrabold uppercase tracking-wide text-blue-550 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-1 active:scale-[0.98] transition-all cursor-pointer"
          disabled={loadingDetailId !== null}
        >
          {loadingDetailId === item.id ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 size={11} className="animate-spin" />
              <span>Memuat...</span>
            </span>
          ) : (
            <>
              <span>Pratinjau</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(item)}
            className={`p-2 bg-slate-100 hover:bg-blue-500/10 dark:bg-white/5 dark:hover:bg-blue-500/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300 rounded-xl transition-all border border-slate-200/50 dark:border-white/5 hover:border-blue-500/20 cursor-pointer ${
              loadingDetailId !== null ? "opacity-50 pointer-events-none" : ""
            }`}
            title="Edit Informasi"
            disabled={loadingDetailId !== null}
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 bg-slate-100 hover:bg-rose-500/10 dark:bg-white/5 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 rounded-xl transition-all border border-slate-200/50 dark:border-white/5 hover:border-rose-500/20 cursor-pointer"
            title="Hapus Informasi"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
