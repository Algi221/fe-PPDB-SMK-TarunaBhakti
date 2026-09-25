import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { InformasiItem, formatDate, parseMedia, sanitizeSrc } from './types';

interface ForumCardProps {
  item: InformasiItem;
  index: number;
  loadingDetailId: number | null;
  onViewDetail: (id: number) => void;
}

export default function ForumCard({
  item,
  index,
  loadingDetailId,
  onViewDetail
}: ForumCardProps) {
  const badge = { label: 'INFORMASI', cls: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' };
  const media = parseMedia(item.foto_url);

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => {
        if (loadingDetailId === null) {
          onViewDetail(item.id);
        }
      }}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer group ${loadingDetailId === item.id ? 'opacity-80 pointer-events-none' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${badge.cls}`}>
            {badge.label}
          </span>
          {media.video && (
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 border border-blue-500/15">
              🎥 Video
            </span>
          )}
          {media.dokumen && (
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 border border-emerald-500/15">
              📄 Dokumen
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Calendar size={13} />
          {formatDate(item.tanggal)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 mb-4">
        {media.foto && (
          <div className="w-full sm:w-48 h-48 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <img 
              src={sanitizeSrc(media.foto) || ''} 
              alt={item.judul || "Pengumuman"} 
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-350" 
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug break-all hyphens-auto">
            {item.judul}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 break-all hyphens-auto">
            {item.konten}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <User size={12} className="text-slate-400" />
          </div>
          Panitia PPDB SMK TB
        </div>
        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1">
          {loadingDetailId === item.id ? (
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent dark:border-blue-400 dark:border-t-transparent rounded-full animate-spin"></span>
              Memuat...
            </span>
          ) : (
            <>
              Baca Selengkapnya
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
      </div>
    </motion.div>
  );
}
