import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Applicant, formatNoPendaftaran } from './types';

export const handleExportExcel = async (
  students: Applicant[],
  fileNameSuffix: string,
  nipdMap: Record<number, string>
) => {
  if (students.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  
  // Group students by period
  const groups: Record<string, Applicant[]> = {};
  students.forEach((a: Applicant) => {
    const period = a.periode || '2026-2027';
    if (!groups[period]) {
      groups[period] = [];
    }
    groups[period].push(a);
  });

  // Sort periods descending to have the latest period first
  const periods = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  periods.forEach((period) => {
    // Sheet name must not exceed 31 characters and cannot contain special characters
    const sheetName = `Periode ${period.replace(/[:\\/?*\[\]]/g, '')}`.substring(0, 31);
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = [
      { header: 'No.', key: 'no', width: 10 },
      { header: 'NIPD', key: 'nipd', width: 20 },
      { header: 'No. Pendaftaran', key: 'no_pendaftaran', width: 20 },
      { header: 'Periode Angkatan', key: 'periode', width: 20 },
      { header: 'Nama Lengkap', key: 'nama', width: 35 },
      { header: 'Jenis Kelamin', key: 'jk', width: 15 },
      { header: 'NISN', key: 'nisn', width: 25 },
      { header: 'NIK', key: 'nik', width: 25 },
      { header: 'Asal Sekolah', key: 'sekolah', width: 35 },
      { header: 'Jurusan', key: 'jurusan', width: 35 },
      { header: 'Kelas', key: 'kelas', width: 20 },
      { header: 'No. WhatsApp', key: 'whatsapp', width: 25 },
      { header: 'Email', key: 'email', width: 35 },
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
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    const periodStudents = groups[period];
    // Sort periodStudents alphabetically by name
    periodStudents.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

    periodStudents.forEach((a: Applicant, idx: number) => {
      const generatedNipd = a.nipd || nipdMap[a.id] || "-";
      const row = worksheet.addRow({
        no: idx + 1,
        nipd: generatedNipd,
        no_pendaftaran: formatNoPendaftaran(a.periode, a.id),
        periode: a.periode || '-',
        nama: a.nama || '-',
        jk: (a.jenis_kelamin || a.jenisKelamin || '-').toUpperCase().startsWith('L') ? 'Laki-laki' : 'Perempuan',
        nisn: a.nisn || '-',
        nik: a.nik || '-',
        sekolah: a.sekolah_asal || a.sekolahAsal || '-',
        jurusan: a.jurusan || a.jurusan_1 || a.jurusan1 || '-',
        kelas: a.diterima_kelas || a.diterimaKelas || '-',
        whatsapp: a.whatsapp || '-',
        email: a.email || '-',
      });

      row.height = 24;
      row.eachCell((cell, colNumber) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: [1, 2, 3, 4, 6, 7, 8, 11, 12].includes(colNumber) ? 'center' : 'left'
        };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        
        // Alternating row background colors
        if (idx % 2 === 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' }
          };
        }
      });
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Daftar_Siswa_Aktif_${fileNameSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
