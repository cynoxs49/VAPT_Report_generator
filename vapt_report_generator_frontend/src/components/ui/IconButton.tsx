import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "ghost" | "danger" | "accent";
  size?: "sm" | "md";
  tooltip?: string;
}

const variantClass = {
  ghost:
    "text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] hover:bg-[var(--c-surface)]",
  danger:
    "text-[var(--c-text-muted)] hover:text-[var(--c-critical)] hover:bg-[rgba(255,77,77,0.08)]",
  accent: "text-[var(--c-accent)] hover:bg-[var(--c-accent-dim)]",
};

const sizeClass = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
};

export function IconButton({
  children,
  variant = "ghost",
  size = "md",
  tooltip,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      title={tooltip}
      className={`inline-flex items-center justify-center rounded-[var(--radius-sm)] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${sizeClass[size]} ${variantClass[variant]} ${className}`}
      {...props}>
      {children}
    </button>
  );
}
