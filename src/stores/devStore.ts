import { create } from "zustand";

interface DevStoreProps {
  isDemoUser: boolean;
  setIsDemoUser: (isDemoUser: boolean) => void;
  triggerLabelDataLoad: boolean;
  setTriggerLabelDataLoad: (triggerLabelDataLoad: boolean) => void;
  triggerConfirmAll: boolean;
  setTriggerConfirmAll: (value: boolean) => void;
  getJsonFile: () => Promise<Response>;
}

const useDevStore = create<DevStoreProps>((set) => ({
  isDemoUser: false,
  setIsDemoUser: (isDemoUser: boolean) => set({ isDemoUser }),
  triggerLabelDataLoad: false,
  setTriggerLabelDataLoad: (triggerLabelDataLoad: boolean) =>
    set({ triggerLabelDataLoad }),
  triggerConfirmAll: false,
  setTriggerConfirmAll: (value) => set({ triggerConfirmAll: value }),
  getJsonFile: async () => {
    const response = await fetch("/labelData.json");
    return response;
  },
}));

export default useDevStore;
