export const formatNoPendaftaran = (periode: string | null | undefined, id: number) => {
  try {
    const parts = (periode || "2026-2027").split("-");
    const year1 = parts[0].slice(-2);
    const year2 = parts[1].slice(-2);
    const prefix = `${year1}${year2}`;
    const sequence = 10000 + id;
    return `${prefix}${sequence}`;
  } catch (e) {
    return `2627${10000 + id}`;
  }
};

export interface Applicant {
  id: number;
  nama: string;
  nisn: string;
  nik?: string;
  tempat_lahir?: string;
  tempatLahir?: string;
  tgl_lahir?: string;
  tglLahir?: string;
  jenis_kelamin?: string;
  jenisKelamin?: string;
  agama?: string;
  alamat?: string;
  rt_rw?: string;
  rtRw?: string;
  kelurahan?: string;
  kecamatan?: string;
  kode_pos?: string;
  kodePos?: string;
  whatsapp?: string;
  email?: string;
  tinggal_dengan?: string;
  tinggalDengan?: string;
  transportasi?: string;
  tinggi_badan?: string | number;
  tinggiBadan?: string | number;
  berat_badan?: string | number;
  beratBadan?: string | number;
  golongan_darah?: string;
  golonganDarah?: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  tgl_lulus?: string;
  tglLulus?: string;
  jurusan_1?: string;
  jurusan1?: string;
  nama_ayah?: string;
  namaAyah?: string;
  pekerjaan_ayah?: string;
  pekerjaanAyah?: string;
  penghasilan_ayah?: string;
  penghasilanAyah?: string;
  nama_ibu?: string;
  namaIbu?: string;
  pendidikan_ibu?: string;
  pendidikanIbu?: string;
  pekerjaan_ibu?: string;
  pekerjaanIbu?: string;
  penghasilan_ibu?: string;
  penghasilanIbu?: string;
  telepon_ortu?: string;
  teleponOrtu?: string;
  cita_cita?: string;
  citaCita?: string;
  alasan_memilih?: string;
  alasanMemilih?: string;
  status?: string;
  tgl_daftar?: string;
  createdAt?: string;
  nama_wali?: string;
  namaWali?: string;
  no_ijazah?: string;
  noIjazah?: string;
  no_skhun?: string;
  noSkhun?: string;
  lama_belajar?: string | number;
  lamaBelajar?: string | number;
  jarak_sekolah?: string | number;
  jarakSekolah?: string | number;
  waktu_jam?: number;
  waktuJam?: number;
  waktu_menit?: number;
  waktuMenit?: number;
  jumlah_saudara?: number;
  jumlahSaudara?: number;
  penyakit_diderita?: string;
  penyakitDiderita?: string;
  kebutuhan_khusus?: string[];
  punya_kps?: string;
  punyaKps?: string;
  no_kps?: string;
  noKps?: string;
  punya_kip?: string;
  punyaKip?: string;
  no_kip?: string;
  noKip?: string;
  uraian_prestasi?: string;
  uraianPrestasi?: string;
  uraian_beasiswa?: string;
  uraianBeasiswa?: string;
  perkelahian?: string;
  narkoba?: string;
  pelanggaran_lain?: string;
  periode?: string;
  berkas_foto?: string;
  diterima_kelas?: string | null;
  diterimaKelas?: string | null;
  diterima_tanggal?: string | null;
  diterimaTanggal?: string | null;
  verified_by?: string;
  rejected_by?: string;
  alasan_ditolak?: string;
  deleted_at?: string;
  deleted_by?: string;
  gelombang?: string;
  [key: string]: any;
}

export interface EditFormState {
  nama: string;
  nisn: string;
  nik: string;
  tempat_lahir: string;
  tgl_lahir: string;
  jenis_kelamin: string;
  agama: string;
  alamat: string;
  rt_rw: string;
  kelurahan: string;
  kecamatan: string;
  kode_pos: string;
  whatsapp: string;
  email: string;
  tinggal_dengan: string;
  transportasi: string;
  tinggi_badan: string;
  berat_badan: string;
  golongan_darah: string;
  sekolah_asal: string;
  tgl_lulus: string;
  jurusan_1: string;
  nama_ayah: string;
  pekerjaan_ayah: string;
  penghasilan_ayah: string;
  nama_ibu: string;
  pekerjaan_ibu: string;
  penghasilan_ibu: string;
  telepon_ortu: string;
  cita_cita: string;
  alasan_memilih: string;
  [key: string]: string;
}

export type SyncStatus = "IDLE" | "SYNCING" | "SUCCESS";

export interface BSTNode {
  key: string;       
  id: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

export function bstInsert(root: BSTNode | null, node: BSTNode): BSTNode {
  if (!root) return node;
  if (node.key < root.key) root.left = bstInsert(root.left, node);
  else root.right = bstInsert(root.right, node);
  return root;
}

export function bstSearch(root: BSTNode | null, query: string, results: number[]): void {
  if (!root) return;
  bstSearch(root.left, query, results);
  if (root.key.includes(query)) results.push(root.id);
  bstSearch(root.right, query, results);
}

export function buildKey(a: Applicant): string {
  const initial = (a.nama || "").trim().charAt(0).toLowerCase();
  const jurusan = (a.jurusan_1 || a.jurusan1 || "").toLowerCase();
  const sekolah = (a.sekolah_asal || a.sekolahAsal || "").toLowerCase();
  return `${initial}|${jurusan}|${sekolah}`;
}
