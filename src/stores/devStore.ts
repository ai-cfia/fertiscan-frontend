import { create } from "zustand";

interface DevStoreProps {
  isDemoUser: boolean;
  setIsDemoUser: (isDemoUser: boolean) => void;
  triggerLabelDataLoad: boolean;
  setTriggerLabelDataLoad: (triggerLabelDataLoad: boolean) => void;
  getJsonFile: () => Promise<Response>;
}

const useDevStore = create<DevStoreProps>((set) => ({
  isDemoUser: false,
  setIsDemoUser: (isDemoUser: boolean) => set({ isDemoUser }),
  triggerLabelDataLoad: false,
  setTriggerLabelDataLoad: (triggerLabelDataLoad: boolean) =>
    set({ triggerLabelDataLoad }),
  getJsonFile: async () => {
    const response = await fetch("/labelData.json");
    return response;
  },
}));

export default useDevStore;
