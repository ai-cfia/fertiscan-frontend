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

  addUploadedFile: (file) => {
    console.log(`[File Store] Added: ${file.getInfo().path}`);
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] }));
  },

  removeUploadedFile: (path) => {
    console.log(`[File Store] Removed: ${path}`);
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter(
        (file) => file.getInfo().path !== path,
      ),
    }));
  },

  clearUploadedFiles: () => {
    console.log("[File Store] Cleared all files");
    set({ uploadedFiles: [] });
  },

  renameUploadedFile: (path, newName) => {
    console.log(`[File Store] Renamed: ${path} -> ${newName}`);
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
    }));
  },
}));

export default useUploadedFilesStore;
