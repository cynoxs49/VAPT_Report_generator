import { create } from "zustand";

interface ProjectState {
  // project state
}

export const useProjectStore = create<ProjectState>((set) => ({
  // project store logic
}));
