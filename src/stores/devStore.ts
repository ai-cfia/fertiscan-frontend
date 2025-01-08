import { LabelDataOutput } from "@/utils/server/backend";
import { create } from "zustand";

interface DevStoreProps {
  triggerLabelDataLoad: boolean;
  setTriggerLabelDataLoad: (triggerLabelDataLoad: boolean) => void;
  triggerConfirmAll: boolean;
  setTriggerConfirmAll: (value: boolean) => void;
  getJsonFile: () => Promise<Response>;
  uploadedJsonFile: File | null;
  setUploadedJsonFile: (file: File) => void;
  labelDataOutput: LabelDataOutput | null;
  setLabelDataOutput: (labelDataOutput: LabelDataOutput) => void;
}

const useDevStore = create<DevStoreProps>((set) => ({
  triggerLabelDataLoad: false,
  setTriggerLabelDataLoad: (triggerLabelDataLoad: boolean) =>
    set({ triggerLabelDataLoad }),
  triggerConfirmAll: false,
  setTriggerConfirmAll: (value) => set({ triggerConfirmAll: value }),
  getJsonFile: async () => {
    const response = await fetch("/labelData.json");
    return response;
  },
  uploadedJsonFile: null,
  setUploadedJsonFile: (file: File) => set({ uploadedJsonFile: file }),
  labelDataOutput: null,
  setLabelDataOutput: (labelDataOutput: LabelDataOutput) =>
    set({ labelDataOutput }),
}));

export default useDevStore;
