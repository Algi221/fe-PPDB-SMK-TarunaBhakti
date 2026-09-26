/**
 * Format Nomor Pendaftaran SPMB SMK Taruna Bhakti
 * Format: SPMB-228-10-001
 * - SPMB : Seleksi Penerimaan Murid Baru
 * - 228  : Angkatan 28 (Tahun berdiri 1998 -> 2026 = Angkatan 28)
 * - 10   : Tingkat Kelas 10
 * - 001  : Nomor Urut 3 digit (target penerimaan 688 siswa)
 */
export const formatNoPendaftaran = (
  periode: string | null | undefined,
  id: number | string | undefined | null
): string => {
  try {
    const num = Number(id) || 1;
    const seq = String(num).padStart(3, "0");
    const p = (periode || "2026-2027").trim();
    const match = p.match(/^(\d{4})/);
    let code = "228";
    if (match) {
      const year = parseInt(match[1], 10);
      const angkatan = year - 1998;
      code = `2${angkatan > 0 ? angkatan : 28}`;
    }
    return `SPMB-${code}-10-${seq}`;
  } catch (e) {
    const seq = String(id || 1).padStart(3, "0");
    return `SPMB-228-10-${seq}`;
  }
};
