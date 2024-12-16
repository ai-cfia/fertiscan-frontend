import { create } from "zustand";

interface HoverStore {
  hoveredText: string | null;
  setHoveredText: (text: string | null) => void;
}

const useHoverStore = create<HoverStore>((set) => ({
  hoveredText: null,
  setHoveredText: (text) => set({ hoveredText: text }),
}));

export default useHoverStore;
