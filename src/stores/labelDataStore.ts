import { LabelData } from "@/types/types";
import { create } from "zustand";

interface LabelDataState {
  labelData: LabelData | null;
  setLabelData: (newData: LabelData) => void;
  resetLabelData: () => void;
}

const useLabelDataStore = create<LabelDataState>((set) => ({
  labelData: null,
  setLabelData: (newData) => set({ labelData: newData }),
  resetLabelData: () => set({ labelData: null }),
}));

export default useLabelDataStore;
