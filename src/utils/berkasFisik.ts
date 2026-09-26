export interface BerkasItem {
  id: string;
  label: string;
  short: string;
}

export const BERKAS_FISIK_LIST: BerkasItem[] = [
  { id: 'kk', label: 'Fotokopi Kartu Keluarga (KK)', short: 'KK' },
  { id: 'ktp', label: 'Fotokopi KTP Orang Tua (Ayah & Ibu)', short: 'KTP Ortu' },
  { id: 'akta', label: 'Akta Kelahiran asli & 1 Fotokopi', short: 'Akta Kelahiran' },
  { id: 'ijazah', label: 'Fotokopi Ijazah / SKL legalisir', short: 'Ijazah/SKL' },
  { id: 'foto', label: 'Pas foto berwarna 3×4 (3 lembar)', short: 'Pas Foto' },
  { id: 'bayar', label: 'Bukti Pembayaran Pendaftaran', short: 'Bukti Bayar' }
];

export const getBerkasFisikStatus = (applicantId: number | string | undefined | null): Record<string, boolean> => {
  if (!applicantId || typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(`ppdb_berkas_fisik_${applicantId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading berkas fisik status:', e);
  }
  return {};
};

export const setBerkasFisikStatus = (applicantId: number | string | undefined | null, status: Record<string, boolean>) => {
  if (!applicantId || typeof window === 'undefined') return;
  try {
    localStorage.setItem(`ppdb_berkas_fisik_${applicantId}`, JSON.stringify(status));
    window.dispatchEvent(new CustomEvent('ppdb_berkas_updated', { detail: { applicantId, status } }));
  } catch (e) {
    console.error('Error saving berkas fisik status:', e);
  }
};

export const getMissingBerkas = (status: Record<string, boolean>): BerkasItem[] => {
  return BERKAS_FISIK_LIST.filter(item => !status[item.id]);
};

export const getMissingBerkasSummary = (status: Record<string, boolean>): {
  isComplete: boolean;
  missingList: BerkasItem[];
  text: string;
  isOnlyIjazah: boolean;
} => {
  const missingList = getMissingBerkas(status);
  const isComplete = missingList.length === 0;
  const isOnlyIjazah = missingList.length === 1 && missingList[0].id === 'ijazah';

  if (isComplete) {
    return { isComplete: true, missingList: [], text: 'Berkas Lengkap', isOnlyIjazah: false };
  }

  if (missingList.length === BERKAS_FISIK_LIST.length) {
    return { isComplete: false, missingList, text: 'Berkas Fisik Belum Lengkap', isOnlyIjazah: false };
  }

  if (missingList.length === 1) {
    return { isComplete: false, missingList, text: `Belum: ${missingList[0].label}`, isOnlyIjazah };
  }

  return {
    isComplete: false,
    missingList,
    text: `Belum: ${missingList.map(b => b.short).join(', ')}`,
    isOnlyIjazah: false
  };
};
