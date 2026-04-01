import { create } from "zustand";
import type { Project, ProjectVersion } from "@/types";

interface ProjectState {
  // Data
  currentProject: Project | null;
  currentVersion: ProjectVersion | null;

  // Derived — versionNumber is read very frequently (every autosave PATCH)
  // so we surface it directly instead of drilling into currentVersion each time
  versionNumber: number;

  // Actions
  setProject: (project: Project) => void;
  setVersion: (version: ProjectVersion) => void;

  // Called after a successful PATCH — backend returns new versionNumber
  incrementVersionNumber: () => void;

  // Called after publish — locks the UI
  lockCurrentVersion: () => void;

  // Called after "Create New Version" — replaces current version with clone
  resetToNewVersion: (version: ProjectVersion) => void;

  clearProject: () => void;
}

export const useProjectStore = create<ProjectState>()((set) => ({
  currentProject: null,
  currentVersion: null,
  versionNumber: 1,

  setProject: (project) => set({ currentProject: project }),

  setVersion: (version) =>
    set({
      currentVersion: version,
      versionNumber: version.versionNumber,
    }),

  incrementVersionNumber: () =>
    set((state) => ({ versionNumber: state.versionNumber + 1 })),

  lockCurrentVersion: () =>
    set((state) => {
      if (!state.currentVersion) return state;
      return {
        currentVersion: { ...state.currentVersion, isLocked: true },
      };
    }),

  resetToNewVersion: (version) =>
    set({
      currentVersion: version,
      versionNumber: version.versionNumber,
    }),

  clearProject: () =>
    set({
      currentProject: null,
      currentVersion: null,
      versionNumber: 1,
    }),
}));
