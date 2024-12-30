import { create } from "zustand";
import { LabelData, DEFAULT_LABEL_DATA } from "@/types/types";

// Add labelData management to your Zustand store
interface DevStore {
  isDemoUser: boolean;
  triggerConfirmAll: boolean;
  setDemoUser: (value: boolean) => void;
  setTriggerConfirmAll: (value: boolean) => void;
  triggerLabelDataLoad: boolean;
  setTriggerLabelDataLoad: (value: boolean) => void;
  getJsonFile: () => Promise<Response>;
}

const useDevStore = create<DevStore>((set) => ({
  isDemoUser: process.env.NEXT_PUBLIC_DEV_MODE === "true",
  triggerConfirmAll: false,
  setDemoUser: (value) => set({ isDemoUser: value }),
  setTriggerConfirmAll: (value) => set({ triggerConfirmAll: value }),
  triggerLabelDataLoad: false,
  setTriggerLabelDataLoad: (value) => set({ triggerLabelDataLoad: value }),
  getJsonFile: async () => {
    const response = await fetch("/labelDataTest.json");
    return response;
  },
}));

export default useDevStore;
