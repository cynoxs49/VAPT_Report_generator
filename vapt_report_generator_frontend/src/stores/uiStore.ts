import { create } from "zustand";

type SavingStatus = "idle" | "saving" | "saved" | "error";

interface UiState {
  // Preview panel toggle
  isPreviewOpen: boolean;

  // Auto save indicator shown in the top bar
  savingStatus: SavingStatus;

  // Conflict modal — shown when backend returns 409
  conflictDetected: boolean;

  // Publish confirm modal
  isPublishModalOpen: boolean;

  // Delete confirm modal — stores the findingId pending deletion
  deletingFindingId: string | null;

  // Actions
  togglePreview: () => void;
  setPreviewOpen: (open: boolean) => void;

  setSavingStatus: (status: SavingStatus) => void;

  setConflictDetected: (value: boolean) => void;

  setPublishModalOpen: (open: boolean) => void;

  setDeletingFindingId: (id: string | null) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isPreviewOpen: false,
  savingStatus: "idle",
  conflictDetected: false,
  isPublishModalOpen: false,
  deletingFindingId: null,

  togglePreview: () =>
    set((state) => ({ isPreviewOpen: !state.isPreviewOpen })),

  setPreviewOpen: (open) => set({ isPreviewOpen: open }),

  setSavingStatus: (status) => set({ savingStatus: status }),

  setConflictDetected: (value) => set({ conflictDetected: value }),

  setPublishModalOpen: (open) => set({ isPublishModalOpen: open }),

  setDeletingFindingId: (id) => set({ deletingFindingId: id }),
}));
