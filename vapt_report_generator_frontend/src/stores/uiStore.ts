import { create } from "zustand";

interface UIState {
  // UI state
}

export const useUIStore = create<UIState>((set) => ({
  // UI store logic
}));
