import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Applicant, ClassItem, formatNoPendaftaran } from "../types";

export const exportAllMajors = async ({
  classes,
  applicants,
  activeMajors,
  schoolPeriod,
  nipdMap,
  getStudentCurrentClass,
  showToast
}: {
  classes: ClassItem[];
  applicants: Applicant[];
  activeMajors: { code: string; name: string }[];
  schoolPeriod: string;
  nipdMap: Map<number, string>;
  getStudentCurrentClass: (s: Applicant) => string | null;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}) => {
  const workbook = new ExcelJS.Workbook();
  let totalStudentsExported = 0;

  activeMajors.forEach((m) => {
    const majorClasses = classes.filter(c => c.majorCode === m.code);
    const sheetName = m.code.toUpperCase().substring(0, 30);
    const worksheet = workbook.addWorksheet(sheetName);

    // Sheet title
    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').value = `LAPORAN DAFTAR KELAS - JURUSAN ${m.name.toUpperCase()}`;
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A1').font = {
      bold: true,
      name: 'Arial',
      size: 14,
      color: { argb: 'FF1F497D' }
    };
    worksheet.getRow(1).height = 30;

    let currentRowIndex = 3;

    majorClasses.forEach((c) => {
      const classStudents = applicants.filter((a: Applicant) => {
        if (a.status === 'Rejected') return false;
        return getStudentCurrentClass(a) === c.name;
      }).sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

      worksheet.mergeCells(`A${currentRowIndex}:G${currentRowIndex}`);
      const classHeaderCell = worksheet.getCell(`A${currentRowIndex}`);
      classHeaderCell.value = `KELAS: ${c.name.toUpperCase()} (Total: ${classStudents.length} Siswa)`;
      classHeaderCell.font = { bold: true, name: 'Arial', size: 11, color: { argb: 'FF366092' } };
      classHeaderCell.alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getRow(currentRowIndex).height = 24;

      currentRowIndex++;

      const columns = [
        { header: 'No.', key: 'no', width: 8 },
        { header: 'No. Pendaftaran', key: 'no_pendaftaran', width: 20 },
        { header: 'NIPD', key: 'nipd', width: 20 },
        { header: 'Nama Lengkap', key: 'nama', width: 35 },
        { header: 'L/P', key: 'jk', width: 10 },
        { header: 'NISN', key: 'nisn', width: 18 },
        { header: 'Sekolah Asal', key: 'sekolah', width: 30 },
        { header: 'No. WhatsApp', key: 'whatsapp', width: 20 },
        { header: 'Email', key: 'email', width: 30 }
      ];

      columns.forEach((col, colIdx) => {
        const cell = worksheet.getCell(currentRowIndex, colIdx + 1);
        cell.value = col.header;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      worksheet.getRow(currentRowIndex).height = 22;

      currentRowIndex++;

      if (classStudents.length > 0) {
        classStudents.forEach((s: Applicant, index: number) => {
          const dataRow = worksheet.getRow(currentRowIndex);
          dataRow.height = 20;

          const values = {
            no: index + 1,
            no_pendaftaran: formatNoPendaftaran(s.periode, s.id),
            nipd: nipdMap.get(s.id) || "-",
            nama: s.nama || "",
            jk: (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("p") ? "P" : "-",
            nisn: s.nisn || "",
            sekolah: s.sekolah_asal || s.sekolahAsal || "",
            whatsapp: s.whatsapp || "",
            email: s.email || ""
          };

          columns.forEach((col, colIdx) => {
            const cell = dataRow.getCell(colIdx + 1);
            cell.value = (values as any)[col.key];
            cell.font = { name: 'Arial', size: 9 };
            cell.border = {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            };

            if (index % 2 === 1) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF2F5F9' }
              };
            }

            if ([1, 2, 4, 6].includes(colIdx + 1)) {
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
              cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
            }
          });

          totalStudentsExported++;
          currentRowIndex++;
        });
      } else {
        worksheet.mergeCells(`A${currentRowIndex}:G${currentRowIndex}`);
        const emptyCell = worksheet.getCell(`A${currentRowIndex}`);
        emptyCell.value = "TIDAK ADA SISWA TERDAFTAR DI KELAS INI";
        emptyCell.font = { italic: true, name: 'Arial', size: 9, color: { argb: 'FF7F7F7F' } };
        emptyCell.alignment = { vertical: 'middle', horizontal: 'center' };
        emptyCell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
        worksheet.getRow(currentRowIndex).height = 20;
        currentRowIndex++;
      }

      currentRowIndex += 2;
    });

    worksheet.columns = [
      { width: 8 },
      { width: 22 },
      { width: 38 },
      { width: 20 },
      { width: 32 },
      { width: 22 },
      { width: 32 }
    ];
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Daftar_Semua_Jurusan_PPDB_${schoolPeriod || '2026-2027'}.xlsx`);
  showToast(`Berhasil mengekspor semua jurusan (${totalStudentsExported} siswa)!`, "success");
};
