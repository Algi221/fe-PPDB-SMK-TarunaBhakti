import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Applicant } from "../types";

export const exportClassCSV = async ({
  className,
  applicants,
  nipdMap,
  getStudentCurrentClass,
  showToast
}: {
  className: string;
  applicants: Applicant[];
  nipdMap: Map<number, string>;
  getStudentCurrentClass: (s: Applicant) => string | null;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}) => {
  const classStudents = applicants.filter((a: Applicant) => {
    if (a.status === 'Rejected') return false;
    const cls = getStudentCurrentClass(a);
    return cls === className;
  }).sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

  if (classStudents.length === 0) {
    showToast("Kelas kosong, tidak ada data untuk diekspor.", "error");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Kelas_${className}`);

  worksheet.columns = [
    { header: 'No.', key: 'no', width: 10 },
    { header: 'No. Pendaftaran', key: 'no_pendaftaran', width: 25 },
    { header: 'NIPD', key: 'nipd', width: 20 },
    { header: 'Nama Siswa', key: 'nama', width: 35 },
    { header: 'L/P', key: 'jk', width: 10 },
    { header: 'NISN', key: 'nisn', width: 25 },
    { header: 'Asal Sekolah', key: 'sekolah', width: 35 },
    { header: 'No. WhatsApp', key: 'whatsapp', width: 25 },
    { header: 'Email', key: 'email', width: 35 },
    { header: 'Tanggal Diterima', key: 'tanggal', width: 25 }
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.height = 35;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FF000000' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF9BC2E6' } 
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  classStudents.forEach((s: Applicant, index: number) => {
    worksheet.addRow({
      no: index + 1,
      no_pendaftaran: s.no_pendaftaran || "-",
      nipd: nipdMap.get(s.id) || "-",
      nama: s.nama || "",
      jk: (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("p") ? "P" : "-",
      nisn: s.nisn || "",
      sekolah: s.sekolah_asal || s.sekolahAsal || "",
      whatsapp: s.whatsapp || "",
      email: s.email || "",
      tanggal: s.diterima_tanggal || s.diterimaTanggal || ""
    });
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.height = 25;
    }
    row.eachCell((cell, colNumber) => {
      if (rowNumber > 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };

        if ([1, 3, 5, 7].includes(colNumber)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
        }
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Daftar_Kelas_${className.replace(/\s+/g, "_")}_${Date.now()}.xlsx`);
};
