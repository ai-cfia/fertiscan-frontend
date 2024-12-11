import FileUploaded from "@/classe/File";
import { create } from "zustand";

interface UploadedFilesState {
  uploadedFiles: FileUploaded[];
  addUploadedFile: (file: FileUploaded) => void;
  removeUploadedFile: (path: string) => void;
  clearUploadedFiles: () => void;
}

const useUploadedFilesStore = create<UploadedFilesState>((set) => ({
  uploadedFiles: [],
  addUploadedFile: (file) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
  removeUploadedFile: (path) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter(
        (file) => file.getInfo().path !== path,
      ),
    })),
  clearUploadedFiles: () => set({ uploadedFiles: [] }),
}));

export default useUploadedFilesStore;
