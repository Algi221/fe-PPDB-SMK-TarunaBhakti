import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Applicant, formatNoPendaftaran } from "../types";

export async function exportApplicantsToExcel(filteredApplicants: Applicant[]) {
  if (filteredApplicants.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data Pendaftar");

  worksheet.columns = [
    { header: "No.", key: "no", width: 10 },
    { header: "No. Pendaftaran", key: "no_pendaftaran", width: 20 },
    { header: "Nama Lengkap", key: "nama", width: 35 },
    { header: "Jenis Kelamin", key: "jk", width: 15 },
    { header: "NISN", key: "nisn", width: 25 },
    { header: "NIK", key: "nik", width: 25 },
    { header: "Asal Sekolah", key: "sekolah", width: 35 },
    { header: "Program Studi Pilihan Utama", key: "jurusan1", width: 35 },
    { header: "No. WhatsApp", key: "whatsapp", width: 25 },
    { header: "Email", key: "email", width: 35 },
    { header: "Status Verifikasi", key: "status", width: 25 },
    { header: "Tanggal Mendaftar", key: "tanggal", width: 25 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.height = 35;

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FF000000" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF9BC2E6" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  filteredApplicants.forEach((a: Applicant, index: number) => {
    worksheet.addRow({
      no: index + 1,
      no_pendaftaran: formatNoPendaftaran(a.periode, a.id),
      nama: a.nama || "",
      jk: (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
        ? "Laki-laki"
        : (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("p")
          ? "Perempuan"
          : "-",
      nisn: a.nisn || "",
      nik: a.nik || "",
      sekolah: a.sekolah_asal || a.sekolahAsal || "",
      jurusan1: a.jurusan_1 || a.jurusan1 || "",
      whatsapp: a.whatsapp || "",
      email: a.email || "",
      status: a.status || "Pending",
      tanggal: new Date(a.tgl_daftar || a.createdAt || Date.now()).toLocaleDateString("id-ID"),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `PPDB_SMK_Taruna_Bhakti_${Date.now()}.xlsx`);
}
