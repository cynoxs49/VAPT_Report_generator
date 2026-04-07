import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import type { Finding } from "@/types";

interface FindingCardProps {
  finding: Finding;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function FindingCard({
  finding,
  isActive,
  onSelect,
  onDelete,
  disabled = false,
}: FindingCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: finding._id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-start gap-3 px-3 py-3 rounded-[var(--radius-md)] border cursor-pointer transition-all duration-150 ${
        isDragging ? "opacity-50 shadow-xl scale-[1.02] z-50" : ""
      } ${
        isActive
          ? "bg-[var(--c-accent-dim)] border-[var(--c-border)]"
          : "bg-[var(--c-surface)] border-[var(--c-border-soft)] hover:border-[var(--c-border)] hover:bg-[var(--c-bg-3)]"
      }`}
      onClick={onSelect}>
      {/* Drag handle */}
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 flex flex-col gap-[3px] pt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          onClick={(e) => e.stopPropagation()}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-[3px]">
              <div className="w-[3px] h-[3px] rounded-full bg-[var(--c-text-muted)]" />
              <div className="w-[3px] h-[3px] rounded-full bg-[var(--c-text-muted)]" />
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-[0.06em] text-[var(--c-accent)] font-[var(--font-display)]">
            {finding.displayId}
          </span>
          <SeverityBadge severity={finding.severity} size="sm" />
          <StatusBadge status={finding.status} size="sm" />
        </div>
        <p className="text-sm font-medium text-[var(--c-text-primary)] leading-snug truncate">
          {finding.title || (
            <span className="text-[var(--c-text-muted)] italic">
              Untitled finding
            </span>
          )}
        </p>
        {finding.cvssScore > 0 && (
          <span className="text-[11px] text-[var(--c-text-muted)]">
            CVSS {finding.cvssScore.toFixed(1)}
          </span>
        )}
      </div>

      {/* Delete button */}
      {!disabled && (
        <IconButton
          size="sm"
          variant="danger"
          tooltip="Delete finding"
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M2 3.5h9M5 3.5V2.5h3v1M4 3.5l.5 7h4l.5-7"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>
      )}
    </div>
  );
}
