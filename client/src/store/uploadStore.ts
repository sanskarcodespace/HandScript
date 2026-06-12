import { create } from 'zustand';

export interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

export interface UploadProgressData {
  status: 'uploading' | 'uploaded' | 'ocr_processing' | 'ocr_complete' | 'ai_processing' | 'ai_complete' | 'rendering' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  error?: { message: string };
}

interface UploadState {
  files: FileWithPreview[];
  mode: 'realistic' | 'personal';
  selectedProfileId: string | null;
  isUploading: boolean;
  currentAssignmentId: string | null;
  progressData: UploadProgressData | null;
  error: string | null;
  
  setFiles: (files: FileWithPreview[]) => void;
  removeFile: (id: string) => void;
  setMode: (mode: 'realistic' | 'personal') => void;
  setProfile: (id: string | null) => void;
  startUpload: () => void;
  setAssignmentId: (id: string) => void;
  updateProgress: (data: UploadProgressData) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  files: [],
  mode: 'realistic',
  selectedProfileId: null,
  isUploading: false,
  currentAssignmentId: null,
  progressData: null,
  error: null,

  setFiles: (files) => set({ files }),
  removeFile: (id) => set((state) => ({ files: state.files.filter((f) => f.id !== id) })),
  setMode: (mode) => set({ mode }),
  setProfile: (id) => set({ selectedProfileId: id }),
  startUpload: () => set({ isUploading: true, error: null, progressData: { status: 'uploading', progress: 0, currentStep: 'Uploading files...' } }),
  setAssignmentId: (id) => set({ currentAssignmentId: id }),
  updateProgress: (data) => set({ progressData: data }),
  setError: (error) => set({ error, isUploading: false }),
  reset: () => set({
    files: [],
    mode: 'realistic',
    selectedProfileId: null,
    isUploading: false,
    currentAssignmentId: null,
    progressData: null,
    error: null,
  }),
}));
