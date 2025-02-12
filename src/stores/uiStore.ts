import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,

  toggleSidebar: () => {
    set((state) => {
      console.debug(`[UI Store] Toggle sidebar: ${!state.sidebarOpen}`);
      return { sidebarOpen: !state.sidebarOpen };
    });
  },

  openSidebar: () => {
    console.debug(`[UI Store] Open sidebar`);
    set({ sidebarOpen: true });
  },

  closeSidebar: () => {
    console.debug(`[UI Store] Close sidebar`);
    set({ sidebarOpen: false });
  },
}));

export default useUIStore;
