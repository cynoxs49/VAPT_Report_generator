import { inputClass } from "@/components/ui/FormField";
import { IconButton } from "@/components/ui/IconButton";

interface DynamicListProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}

export function DynamicList({
  label,
  values,
  onChange,
  placeholder = "Add item…",
  disabled = false,
  hint,
}: DynamicListProps) {
  const update = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const add = () => onChange([...values, ""]);

  const remove = (index: number) => {
    const next = values.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold tracking-[0.07em] uppercase text-[var(--c-text-secondary)]">
          {label}
        </label>
        {hint && (
          <span className="text-[10px] text-[var(--c-text-muted)]">{hint}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {values.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--c-text-muted)] w-5 text-right flex-shrink-0">
              {i + 1}.
            </span>
            <input
              value={val}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={`${inputClass} flex-1`}
            />
            <IconButton
              variant="danger"
              size="sm"
              tooltip="Remove"
              disabled={disabled || values.length === 1}
              onClick={() => remove(i)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 2l8 8M10 2l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </IconButton>
          </div>
        ))}
      </div>

      {!disabled && (
        <button
          onClick={add}
          className="mt-1 self-start inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--c-accent)] hover:text-[var(--c-text-primary)] transition-colors duration-150">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Add {label.toLowerCase()}
        </button>
      )}
    </div>
  );
}
