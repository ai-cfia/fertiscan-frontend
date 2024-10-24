import { create } from "zustand";

interface State {
  sideNavOpen: boolean;
  userPopUpOpen: boolean;
  anchorElement: null | HTMLElement;
  setSideNavOpen: (open: boolean) => void;
  setUserPopUpOpen: (open: boolean) => void;
  setAnchorElement: (el: null | HTMLElement) => void;
}

export const useStore = create<State>((set) => ({
  sideNavOpen: false,
  userPopUpOpen: false,
  anchorElement: null,
  setSideNavOpen: (open) => set({ sideNavOpen: open }),
  setUserPopUpOpen: (open) => set({ userPopUpOpen: open }),
  setAnchorElement: (element) => set({ anchorElement: element }),
}));
