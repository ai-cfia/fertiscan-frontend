import { create } from "zustand";

interface State {
  // Represents whether the side navigation is open or closed
  sideNavOpen: boolean;

  // Represents whether the user pop-up is open or closed
  userPopUpOpen: boolean;

  // Reference to the HTML element that anchors the user pop-up
  anchorElement: null | HTMLElement;

  // Function to set the state of 'sideNavOpen'
  setSideNavOpen: (open: boolean) => void;

  // Function to set the state of 'userPopUpOpen'
  setUserPopUpOpen: (open: boolean) => void;

  // Function to set the reference to 'anchorElement'
  setAnchorElement: (el: null | HTMLElement) => void;
}

export const useStore = create<State>((set) => ({
  // Initial state for side navigation
  sideNavOpen: false,

  // Initial state for user pop-up
  userPopUpOpen: false,

  // Initial state for the anchor element
  anchorElement: null,

  // Action to set the 'sideNavOpen' state
  setSideNavOpen: (open) => set({ sideNavOpen: open }),

  // Action to set the 'userPopUpOpen' state
  setUserPopUpOpen: (open) => set({ userPopUpOpen: open }),

  // Action to set the 'anchorElement' state
  setAnchorElement: (element) => set({ anchorElement: element }),
}));
