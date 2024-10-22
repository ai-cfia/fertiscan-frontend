// src/store/useStore.ts
import {create} from 'zustand';

interface StoreState {
  counter: number;
  increment: () => void;
}

const useStore = create<StoreState>((set) => ({
  counter: 0,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
}));

export default useStore;
