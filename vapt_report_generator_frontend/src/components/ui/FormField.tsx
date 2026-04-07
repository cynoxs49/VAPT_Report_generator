import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  hint,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold tracking-[0.07em] uppercase text-[var(--c-text-secondary)]">
          {label}
          {required && (
            <span className="text-[var(--c-critical)] ml-0.5">*</span>
          )}
        </label>
        {hint && (
          <span className="text-[10px] text-[var(--c-text-muted)]">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <span className="text-[11px] text-[var(--c-critical)]">{error}</span>
      )}
    </div>
  );
}

// ── Shared input class string — import and reuse across all inputs ────────────
export const inputClass =
  "w-full bg-[var(--c-bg)] border border-[var(--c-border-soft)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--c-text-primary)] placeholder:text-[var(--c-text-muted)] outline-none transition-colors duration-150 focus:border-[var(--c-border)] focus:ring-1 focus:ring-[var(--c-accent)] focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed";
