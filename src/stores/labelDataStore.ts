import { LabelData } from "@/types/types";
import { create } from "zustand";

interface LabelDataState {
  labelData: LabelData | null;
  setLabelData: (newData: LabelData) => void;
  resetLabelData: () => void;
}

const useLabelDataStore = create<LabelDataState>((set) => ({
  labelData: null,

  setLabelData: (newData) => {
    console.log(`[Label Store] Set label data:`, newData);
    set({ labelData: newData });
  },

  resetLabelData: () => {
    console.log(`[Label Store] Reset label data`);
    set({ labelData: null });
  },
}));

export default useLabelDataStore;
