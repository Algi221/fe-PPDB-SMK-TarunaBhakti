export interface Toast {
  id: string;
  title: string;
  message: string;
  type: string;
}

export interface WsLog {
  id: string;
  timestamp: string;
  direction: string;
  event: string;
  payload: any;
}

export interface PPDBContextType {
  applicants: any[];
  publicApplicants: any[];
  activeStudents: any[];
  adminToken: string | null;
  adminUser: any | null;
  wsStatus: string;
  toasts: Toast[];
  wsLogs: WsLog[];
  simulationActive: boolean;
  setSimulationActive: React.Dispatch<React.SetStateAction<boolean>>;
  registerApplicant: (formData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  verifyApplicant: (id: number) => Promise<void>;
  rejectApplicant: (id: number, alasan_ditolak?: string) => Promise<void>;
  deleteApplicant: (id: number) => Promise<void>;
  updateApplicant: (id: number, updatedData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  updateActiveStudent: (id: number, updatedData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  deleteActiveStudent: (id: number) => Promise<void>;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  fetchPublicApplicants: () => Promise<void>;
  fetchAdminApplicants: () => Promise<void>;
  fetchActiveStudents: () => Promise<void>;
  simulateRegistration: () => Promise<void>;
  addToast: (title: string, message: string, type?: string) => void;
  checkPaymentStatus: (nisn: string) => Promise<any>;
  setAdminUser: React.Dispatch<React.SetStateAction<any | null>>;
  ppdbLogo: string;
  ppdbTitle: string;
  fetchConfigs: () => Promise<void>;
}
