import { create } from "zustand";

interface AuthState {
  // auth state
}

export const useAuthStore = create<AuthState>((set) => ({
  // auth store logic
}));
