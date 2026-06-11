/**
 * Zustand store: Upload and processing state
 */
import { create } from 'zustand';

interface UploadState {
  progress: number;
  setProgress: (val: number) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
}));
