import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useMutation } from "@tanstack/react-query";
import { useFindingsStore } from "@/stores/findingsStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { addFinding, deleteFinding, reorderFindings } from "@/api/findings";
import { FindingCard } from "@/components/findings/FindingCard";

interface FindingsListProps {
  onSelectFinding: (id: string) => void;
  activeFindingId: string | null;
  disabled?: boolean;
}

export function FindingsList({
  onSelectFinding,
  activeFindingId,
  disabled = false,
}: FindingsListProps) {
  const {
    findings,
    setFindings,
    reorderFindings: reorderStore,
    deleteFinding: deleteFromStore,
  } = useFindingsStore();
  const { currentProject, updateVersionData } = useProjectStore();
  const { setDeletingFindingId, deletingFindingId } = useUiStore();

  const projectId = currentProject?._id ?? "";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // ── Add finding ────────────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: () => addFinding(projectId, {}),
    onSuccess: (res) => {
      if (res.success) {
        const nextFindings = [...findings, res.data];
        setFindings(nextFindings);
        updateVersionData({ findings: nextFindings });
        onSelectFinding(res.data._id);
      }
    },
  });

  // ── Delete finding ─────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (findingId: string) => deleteFinding(projectId, findingId),
    onSuccess: (res, findingId) => {
      if (res.success) {
        const nextFindings = useFindingsStore
          .getState()
          .findings.filter((f) => f._id !== findingId);
        deleteFromStore(findingId);
        updateVersionData({ findings: nextFindings });
        setDeletingFindingId(null);
      }
    },
  });

  // ── Reorder ────────────────────────────────────────────────────────────────
  const reorderMutation = useMutation({
    mutationFn: (order: { id: string; order: number }[]) =>
      reorderFindings(projectId, order),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = findings.findIndex((f) => f._id === active.id);
    const newIndex = findings.findIndex((f) => f._id === over.id);
    const reordered = arrayMove(findings, oldIndex, newIndex);

    reorderStore(reordered);
    updateVersionData({ findings: reordered });
    reorderMutation.mutate(
      reordered.map((f, i) => ({ id: f._id, order: i + 1 })),
    );
  };

  // ── Delete confirmation modal ──────────────────────────────────────────────
  const confirmDelete = () => {
    if (!deletingFindingId) return;
    deleteMutation.mutate(deletingFindingId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--c-border-soft)] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--c-text-secondary)] tracking-wide uppercase">
            Findings
          </span>
          <span className="text-[11px] font-bold px-1.5 py-[1px] rounded-full bg-[var(--c-surface)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)]">
            {findings.length}
          </span>
        </div>
        {!disabled && (
          <button
            onClick={() => addMutation.mutate()}
            disabled={addMutation.isPending}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--c-accent)] hover:text-[var(--c-text-primary)] transition-colors duration-150 disabled:opacity-50">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1v10M1 6h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Add Finding
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
        {findings.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--c-accent-dim)] border border-[var(--c-border)] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="14"
                  height="14"
                  rx="2"
                  stroke="var(--c-accent)"
                  strokeWidth="1.4"
                  fill="none"
                />
                <path
                  d="M9 5v8M5 9h8"
                  stroke="var(--c-accent)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--c-text-secondary)]">
                No findings yet
              </p>
              <p className="text-xs text-[var(--c-text-muted)] mt-0.5">
                Click "Add Finding" to get started
              </p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={findings.map((f) => f._id)}
              strategy={verticalListSortingStrategy}>
              {findings.map((finding) => (
                <FindingCard
                  key={finding._id}
                  finding={finding}
                  isActive={finding._id === activeFindingId}
                  onSelect={() => onSelectFinding(finding._id)}
                  onDelete={() => setDeletingFindingId(finding._id)}
                  disabled={disabled}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deletingFindingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--c-bg-2)] border border-[rgba(255,77,77,0.25)] rounded-[var(--radius-lg)] p-6 w-[380px] shadow-2xl">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[rgba(255,77,77,0.08)] border border-[rgba(255,77,77,0.2)] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4h12M6 4V2.5h4V4M3 4l.7 9h8.6L13 4"
                    stroke="var(--c-critical)"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--c-text-primary)] mb-1">
                  Delete{" "}
                  {findings.find((f) => f._id === deletingFindingId)
                    ?.displayId ?? "this finding"}
                  ?
                </h3>
                <p className="text-xs text-[var(--c-text-secondary)] leading-relaxed">
                  This action cannot be undone. The finding and all its data
                  will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeletingFindingId(null)}
                className="px-4 py-2 text-xs font-semibold text-[var(--c-text-secondary)] bg-transparent border border-[var(--c-border-soft)] rounded-[var(--radius-sm)] hover:border-[var(--c-border)] transition-all duration-150">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-xs font-bold text-white bg-[var(--c-critical)] rounded-[var(--radius-sm)] hover:opacity-90 transition-all duration-150 disabled:opacity-50">
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
