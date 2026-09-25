const fs = require('fs');
const content = fs.readFileSync('extracted_modal.tsx', 'utf8');
const imports = import React from 'react';
import { User, Info, Calendar, Heart, HelpCircle, FileCheck } from 'lucide-react';
import { formatNoPendaftaran } from '@/app/dashboard/pendaftar/page';

interface ApplicantDetailModalProps {
  selectedApplicant: any;
  setSelectedApplicant: (val: any) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
  setIsFullscreenImageOpen: (val: boolean) => void;
  sanitizeSrc: (src: string | undefined | null) => string;
}

export default function ApplicantDetailModal({
  selectedApplicant,
  setSelectedApplicant,
  activeTab,
  setActiveTab,
  setIsFullscreenImageOpen,
  sanitizeSrc
}: ApplicantDetailModalProps) {
  if (!selectedApplicant) return null;
  return (
    <>
;

const end = 
    </>
  );
}
;

const modifiedContent = content.replace('{selectedApplicant && (', '').slice(0, -1);
let fullCode = imports + modifiedContent + end;

// Fix closing tags mismatch if we removed the top-level condition
const lastParenIndex = fullCode.lastIndexOf(')}');
if(lastParenIndex !== -1) {
    fullCode = fullCode.substring(0, lastParenIndex) + fullCode.substring(lastParenIndex + 2);
}

fs.mkdirSync('src/components/admin/pendaftar', { recursive: true });
fs.writeFileSync('src/components/admin/pendaftar/ApplicantDetailModal.tsx', fullCode);
console.log('Created ApplicantDetailModal.tsx');
