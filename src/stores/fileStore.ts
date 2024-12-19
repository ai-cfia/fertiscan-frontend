import FileUploaded from "@/classe/File";
import { create } from "zustand";

interface UploadedFilesState {
  uploadedFiles: FileUploaded[];
  addUploadedFile: (file: FileUploaded) => void;
  removeUploadedFile: (path: string) => void;
  clearUploadedFiles: () => void;
  renameUploadedFile: (path: string, newName: string) => void;
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

  renameUploadedFile: (path, newName) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.map((file) =>
        file.getInfo().path === path
          ? (() => {
              const newFile = new FileUploaded(
                file.getInfo(),
                file.getInfo().path,
                file.getFile(),
              );
              newFile.setName(newName);
              return newFile;
            })()
          : file,
      ),
    })),
}));

export default useUploadedFilesStore;
