import { Applicant, ClassItem } from "../types";

export const majors = [
  { code: "RPL", name: "Rekayasa Perangkat Lunak" },
  { code: "TJKT", name: "Teknik Jaringan Komputer & Telekomunikasi" },
  { code: "DKV", name: "Desain Komunikasi Visual" },
  { code: "BC", name: "Broadcasting & Perfilman" },
  { code: "ANM", name: "Animasi" },
  { code: "TE", name: "Teknik Elektronika" }
];

export function generateDefaultClasses(): ClassItem[] {
  const defaultList: ClassItem[] = [];
  majors.forEach(m => {
    defaultList.push({ id: `X-${m.code}-1`, name: `X ${m.code} 1`, majorCode: m.code, maxCapacity: 100 });
    defaultList.push({ id: `X-${m.code}-2`, name: `X ${m.code} 2`, majorCode: m.code, maxCapacity: 100 });
    
    defaultList.push({ id: `XI-${m.code}-1`, name: `XI ${m.code} 1`, majorCode: m.code, maxCapacity: 100 });
    defaultList.push({ id: `XI-${m.code}-2`, name: `XI ${m.code} 2`, majorCode: m.code, maxCapacity: 100 });
    
    defaultList.push({ id: `XII-${m.code}-1`, name: `XII ${m.code} 1`, majorCode: m.code, maxCapacity: 100 });
    defaultList.push({ id: `XII-${m.code}-2`, name: `XII ${m.code} 2`, majorCode: m.code, maxCapacity: 100 });
  });
  return defaultList;
}

export const getClassGrade = (className: string): number => {
  if (!className) return 10;
  const upper = className.toUpperCase().trim();
  const match = upper.match(/^(XII|XI|X|12|11|10)\b/) || upper.match(/^(XII|XI|X|12|11|10)/);
  if (match) {
    const val = match[1];
    if (val === "XII" || val === "12") return 12;
    if (val === "XI" || val === "11") return 11;
    if (val === "X" || val === "10") return 10;
  }
  return 10;
};

export const getStudentGrade = (student: Applicant, schoolPeriod: string): number => {
  const baseClass = student.diterima_kelas || student.diterimaKelas;
  if (baseClass) {
    const classGrade = getClassGrade(baseClass);
    if (classGrade) return classGrade;
  }

  const studentPeriod = student.periode || "2026-2027";
  const currentPeriod = schoolPeriod || "2026-2027";
  
  try {
    const studentStart = parseInt(studentPeriod.split("-")[0]);
    const currentStart = parseInt(currentPeriod.split("-")[0]);
    if (isNaN(studentStart) || isNaN(currentStart)) return 10;
    
    const diff = currentStart - studentStart;
    if (diff === 0) return 10;
    if (diff === 1) return 11;
    if (diff === 2) return 12;
    if (diff >= 3) return 99; 
    return 10;
  } catch (e) {
    return 10;
  }
};

export const getStudentCurrentClass = (student: Applicant): string | null => {
  return student.diterima_kelas || student.diterimaKelas || null;
};

export const isApplicantMajorMatch = (a: Applicant, selectedMajor: string): boolean => {
  if (a.status === 'Rejected') return false;
  const maj1 = (a.jurusan || a.jurusan_1 || a.jurusan1 || "").toUpperCase();
  
  const majorNameMap: Record<string, string> = {
    RPL: "REKAYASA PERANGKAT LUNAK",
    TJKT: "TEKNIK JARINGAN KOMPUTER & TELEKOMUNIKASI",
    DKV: "DESAIN KOMUNIKASI VISUAL",
    BC: "BROADCASTING & PERFILMAN",
    ANM: "ANIMASI",
    TE: "TEKNIK ELEKTRONIKA"
  };

  const selectedMajorName = majorNameMap[selectedMajor] || selectedMajor;
  
  if (selectedMajor === "RPL") {
    return (
      maj1 === "RPL" || 
      maj1 === "PPLG" || 
      maj1.includes("REKAYASA PERANGKAT LUNAK") || 
      maj1.includes("PENGEMBANGAN PERANGKAT LUNAK")
    );
  } else if (selectedMajor === "TJKT") {
    return (
      maj1 === "TJKT" || 
      maj1 === "TKJ" || 
      maj1.includes("JARINGAN") || 
      maj1.includes("TELEKOMUNIKASI") || 
      maj1.includes("TJKT")
    );
  } else if (selectedMajor === "DKV") {
    return maj1 === "DKV" || maj1.includes("DESAIN KOMUNIKASI VISUAL");
  } else if (selectedMajor === "BC") {
    return maj1 === "BC" || maj1.includes("BROADCASTING") || maj1.includes("PERFILMAN");
  } else if (selectedMajor === "ANM") {
    return maj1 === "ANM" || maj1.includes("ANIMASI");
  } else if (selectedMajor === "TE") {
    return (
      maj1 === "TE" || 
      maj1 === "TEI" || 
      maj1 === "TEKNIK ELEKTRONIKA" || 
      maj1.includes("ELEKTRONIKA") || 
      maj1.includes("TEI")
    );
  }
  return maj1 === selectedMajor || maj1 === selectedMajorName;
};

export const initiateStudentDrag = (
  e: React.DragEvent,
  studentId: number,
  selectedStudentIds: number[]
) => {
  const dragIds = selectedStudentIds.includes(studentId)
    ? selectedStudentIds
    : [studentId];
  e.dataTransfer.setData("application/json", JSON.stringify(dragIds));
  e.dataTransfer.effectAllowed = "move";

  const dragGhost = document.createElement("div");
  dragGhost.style.padding = "10px 20px";
  dragGhost.style.background = "linear-gradient(135deg, #3b82f6, #4f46e5)";
  dragGhost.style.color = "white";
  dragGhost.style.fontSize = "11px";
  dragGhost.style.fontWeight = "900";
  dragGhost.style.textTransform = "uppercase";
  dragGhost.style.letterSpacing = "0.05em";
  dragGhost.style.borderRadius = "14px";
  dragGhost.style.position = "absolute";
  dragGhost.style.top = "-1000px";
  dragGhost.style.boxShadow = "0 8px 30px rgba(59, 130, 246, 0.4)";
  dragGhost.textContent = `📦 Memindahkan ${Number(dragIds.length)} Siswa TB`;
  document.body.appendChild(dragGhost);
  e.dataTransfer.setDragImage(dragGhost, 0, 0);
  setTimeout(() => {
    document.body.removeChild(dragGhost);
  }, 0);
};

export const saveClassesConfig = async (
  updatedClasses: ClassItem[],
  setClasses: (classes: ClassItem[]) => void
) => {
  setClasses(updatedClasses);
  localStorage.setItem("ppdb_classes_config", JSON.stringify(updatedClasses));

  const token = localStorage.getItem("ppdb_admin_token");
  if (token) {
    try {
      await fetch("http://localhost:5000/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          key: "ppdb_classes_config",
          value: updatedClasses
        })
      });
    } catch (e) {
      console.error("Gagal menyimpan konfigurasi kelas ke backend:", e);
    }
  }
};

