import { LabelData } from "@/types/types";
import { create } from "zustand";

interface LabelDataState {
  labelData: LabelData | null;
  setLabelData: (newData: LabelData) => void;
  setComment: (comment: string) => void;
  resetLabelData: () => void;
}

const useLabelDataStore = create<LabelDataState>((set) => ({
  labelData: null,

  setLabelData: (newData) => {
    console.debug(`[Label Store] Set label data:`, newData);
    set({ labelData: newData });
  },

  setComment: (comment) => {
    console.debug(`[Label Store] Set comment:`, comment);
    set((state) => ({
      labelData: state.labelData ? { ...state.labelData, comment } : null,
    }));
  },

  resetLabelData: () => {
    console.debug(`[Label Store] Reset label data`);
    set({ labelData: null });
  },
}));

export default useLabelDataStore;
