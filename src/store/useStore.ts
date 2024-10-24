import { create } from "zustand";

interface State {
  // Represents whether the side navigation is open or closed
  sideNavOpen: boolean;

  // Function to set the state of 'sideNavOpen'
  setSideNavOpen: (open: boolean) => void;
}

export const useStore = create<State>((set) => ({
  // Initial state for side navigation
  sideNavOpen: false,

  // Action to set the 'sideNavOpen' state
  setSideNavOpen: (open) => set({ sideNavOpen: open }),
}));
