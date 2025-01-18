import { LabelData } from "@/types/types";
import { VERIFIED_LABEL_DATA } from "@/utils/client/constants";
import { create } from "zustand";

interface LabelDataState {
  labelData: LabelData | null;
  setLabelData: (newData: LabelData) => void;
  resetLabelData: () => void;
}

const useLabelDataStore = create<LabelDataState>((set) => ({
  labelData: VERIFIED_LABEL_DATA,
  setLabelData: (newData) => set({ labelData: newData }),
  resetLabelData: () => set({ labelData: null }),
}));

export default useLabelDataStore;
