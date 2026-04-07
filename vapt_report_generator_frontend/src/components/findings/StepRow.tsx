import { useRef } from "react";
import { inputClass } from "@/components/ui/FormField";
import { IconButton } from "@/components/ui/IconButton";
import type { Finding } from "@/types";

type Step = Finding["steps"][number];

interface StepRowProps {
  step: Step;
  index: number;
  onChange: (step: Step) => void;
  onRemove: () => void;
  disabled?: boolean;
  canRemove: boolean;
}

export function StepRow({
  step,
  index,
  onChange,
  onRemove,
  disabled = false,
  canRemove,
}: StepRowProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO 11b: wire to uploadImage() API, set imageUrl on success
    const previewUrl = URL.createObjectURL(file);
    onChange({ ...step, imageUrl: previewUrl });
  };

  const removeImage = () => onChange({ ...step, imageUrl: undefined });

  return (
    <div className="flex flex-col gap-2 p-3 rounded-[var(--radius-sm)] bg-[var(--c-bg)] border border-[var(--c-border-soft)]">
      {/* Row header */}
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-[var(--c-accent-dim)] border border-[var(--c-border)] flex items-center justify-center text-[10px] font-bold text-[var(--c-accent)] flex-shrink-0">
          {index + 1}
        </span>

        <input
          value={step.text}
          onChange={(e) => onChange({ ...step, text: e.target.value })}
          placeholder={`Step ${index + 1} description…`}
          disabled={disabled}
          className={`${inputClass} flex-1`}
        />

        {/* Upload image */}
        {!disabled && (
          <IconButton
            size="sm"
            variant="ghost"
            tooltip="Attach screenshot"
            onClick={() => fileRef.current?.click()}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect
                x="1"
                y="3"
                width="11"
                height="8"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
              <circle
                cx="4.5"
                cy="6.5"
                r="1"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M1 9.5l3-2.5 2 2 2-2.5 3 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 1v4M7 3l2-2 2 2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
        )}

        {/* Remove step */}
        <IconButton
          size="sm"
          variant="danger"
          tooltip="Remove step"
          disabled={disabled || !canRemove}
          onClick={onRemove}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 2l8 8M10 2l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </IconButton>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Image preview */}
      {step.imageUrl && (
        <div className="relative ml-7 rounded-[var(--radius-sm)] overflow-hidden border border-[var(--c-border-soft)] bg-[var(--c-bg-3)]">
          <img
            src={step.imageUrl}
            alt={`Step ${index + 1} screenshot`}
            className="w-full max-h-48 object-contain"
          />
          {!disabled && (
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[rgba(0,0,0,0.7)] text-white flex items-center justify-center hover:bg-[var(--c-critical)] transition-colors duration-150"
              title="Remove image">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 1l8 8M9 1L1 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
