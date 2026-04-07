// Shell — filled in Phase 11e
export default function PreviewPanel() {
  return (
    <div className="h-full bg-[var(--c-bg-3)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center px-8">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--c-accent-dim)] border border-[var(--c-border)] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect
              x="3"
              y="1.5"
              width="12"
              height="15"
              rx="1.5"
              stroke="var(--c-accent)"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d="M6 5h6M6 8h6M6 11h4"
              stroke="var(--c-accent)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-[var(--c-text-secondary)]">
          Live preview
        </p>
        <p className="text-xs text-[var(--c-text-muted)]">
          Coming in Phase 11e
        </p>
      </div>
    </div>
  );
}
