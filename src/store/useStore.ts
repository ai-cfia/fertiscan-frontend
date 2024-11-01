import { create } from "zustand";

interface State {
  // Represents whether the user pop-up is open or closed
  isUserMenuOpen: boolean;

  // Reference to the HTML element that anchors the user pop-up
  anchorElement: null | HTMLElement;

  // Function to set the state of 'isUserMenuOpen'
  setIsUserMenuOpen: (open: boolean) => void;

  // Function to set the reference to 'anchorElement'
  setAnchorElement: (el: null | HTMLElement) => void;
}

export const useStore = create<State>((set) => ({
  // Initial state for user pop-up
  isUserMenuOpen: false,

  // Initial state for the anchor element
  anchorElement: null,

  // Action to set the 'isUserMenuOpen' state
  setIsUserMenuOpen: (open) => set({ isUserMenuOpen: open }),

  // Action to set the 'anchorElement' state
  setAnchorElement: (element) => set({ anchorElement: element }),
}));
