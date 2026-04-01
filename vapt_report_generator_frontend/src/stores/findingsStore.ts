import { create } from "zustand";
import type { Finding } from "@/types";

interface FindingsState {
  findings: Finding[];

  // Which finding is currently open/active in the editor panel
  activeFindingId: string | null;

  // Actions
  setFindings: (findings: Finding[]) => void;
  setActiveFinding: (id: string | null) => void;

  addFinding: (finding: Finding) => void;

  // Partial update — only changed fields, matches backend PATCH behaviour
  updateFinding: (id: string, changes: Partial<Finding>) => void;

  deleteFinding: (id: string) => void;

  // After drag-to-reorder — receives the new sorted array
  reorderFindings: (reordered: Finding[]) => void;

  clearFindings: () => void;
}

export const useFindingsStore = create<FindingsState>()((set) => ({
  findings: [],
  activeFindingId: null,

  setFindings: (findings) => set({ findings }),

  setActiveFinding: (id) => set({ activeFindingId: id }),

  addFinding: (finding) =>
    set((state) => ({
      findings: [...state.findings, finding],
    })),

  updateFinding: (id, changes) =>
    set((state) => ({
      findings: state.findings.map((f) =>
        f._id === id ? { ...f, ...changes } : f,
      ),
    })),

  deleteFinding: (id) =>
    set((state) => ({
      findings: state.findings.filter((f) => f._id !== id),
      // If the deleted finding was active, clear the active panel
      activeFindingId:
        state.activeFindingId === id ? null : state.activeFindingId,
    })),

  reorderFindings: (reordered) => set({ findings: reordered }),

  clearFindings: () => set({ findings: [], activeFindingId: null }),
}));
