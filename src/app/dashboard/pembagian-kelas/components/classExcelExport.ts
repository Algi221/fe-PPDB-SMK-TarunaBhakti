import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Applicant, ClassItem } from "../types";

export { exportClassCSV } from "./classExcelExportSingle";
export { exportAllMajors } from "./classExcelExportAllMajors";

export const exportAllClasses = async ({
  classesToExport,
  applicants,
  selectedMajor,
  schoolPeriod,
  activeMajors,
  nipdMap,
  getStudentCurrentClass,
  showToast
}: {
  classesToExport: ClassItem[];
  applicants: Applicant[];
  selectedMajor: string;
  schoolPeriod: string;
  activeMajors: { code: string; name: string }[];
  nipdMap: Map<number, string>;
  getStudentCurrentClass: (s: Applicant) => string | null;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}) => {
  if (classesToExport.length === 0) {
    showToast("Tidak ada kelas untuk diekspor.", "error");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  let totalStudentsExported = 0;

  classesToExport.forEach((c) => {
    const classStudents = applicants.filter((a: Applicant) => {
      if (a.status === 'Rejected') return false;
      return getStudentCurrentClass(a) === c.name;
    }).sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

    const sheetName = c.name.replace(/\s+/g, "_").substring(0, 30);
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.mergeCells('A1:G1');
    worksheet.mergeCells('A2:G2');
    worksheet.mergeCells('A3:G3');
    worksheet.mergeCells('A4:G4');

    worksheet.getCell('A1').value = 'DAFTAR PESERTA DIDIK';
    worksheet.getCell('A2').value = `JURUSAN: ${activeMajors.find(m => m.code === selectedMajor)?.name.toUpperCase() || selectedMajor}`;
    worksheet.getCell('A3').value = `PERIODE AKADEMIK: ${schoolPeriod || '2026-2027'}`;
    worksheet.getCell('A4').value = `KELAS: ${c.name}`;

    ['A1', 'A2', 'A3', 'A4'].forEach((cellId, idx) => {
      const cell = worksheet.getCell(cellId);
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = {
        bold: true,
        name: 'Arial',
        size: idx === 0 ? 14 : 11,
        color: { argb: 'FF1F497D' } 
      };
    });

    worksheet.getRow(1).height = 25;
    worksheet.getRow(2).height = 20;
    worksheet.getRow(3).height = 20;
    worksheet.getRow(4).height = 20;
    worksheet.getRow(5).height = 10; 

    const headerRowIndex = 6;
    const headerRow = worksheet.getRow(headerRowIndex);
    headerRow.height = 28;

    const columns = [
      { header: 'No.', key: 'no', width: 8 },
      { header: 'No. Pendaftaran', key: 'no_pendaftaran', width: 20 },
      { header: 'NIPD', key: 'nipd', width: 20 },
      { header: 'Nama Lengkap', key: 'nama', width: 35 },
      { header: 'L/P', key: 'jk', width: 10 },
      { header: 'NISN', key: 'nisn', width: 18 },
      { header: 'Sekolah Asal', key: 'sekolah', width: 30 },
      { header: 'No. WhatsApp', key: 'whatsapp', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Tanggal Masuk Kelas', key: 'tanggal', width: 22 }
    ];

    worksheet.columns = columns;

    columns.forEach((col, colIdx) => {
      const cell = worksheet.getCell(headerRowIndex, colIdx + 1);
      cell.value = col.header;
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF366092' } 
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
        left: { style: 'thin' },
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
      totalStudentsExported++;
    });

    const totalRows = classStudents.length;
    for (let r = 7; r < 7 + totalRows; r++) {
      const row = worksheet.getRow(r);
      row.height = 22;
      row.eachCell((cell, colIdx) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.font = { name: 'Arial', size: 10 };

        if (r % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF2F5F9' } 
          };
        }

        if ([1, 3, 5, 7].includes(colIdx)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
        }
      });
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Daftar_Semua_Kelas_${selectedMajor}_${schoolPeriod || '2026-2027'}.xlsx`);
  showToast(`Berhasil mengekspor semua kelas jurusan ${selectedMajor} (${totalStudentsExported} siswa)!`, "success");
};
