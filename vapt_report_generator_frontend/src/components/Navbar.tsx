import type { FC } from "react";

const Navbar: FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-[rgba(0,0,0,0.9)] backdrop-blur-md border-b border-[var(--c-border-soft)]">
      <div className="max-w-[1100px] mx-auto px-8 h-[58px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-[var(--radius-sm)] bg-[var(--c-accent-dim)] border border-[var(--c-border)] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 2L3 6.5V11C3 15.1 6.4 18.9 11 20C15.6 18.9 19 15.1 19 11V6.5L11 2Z"
                stroke="var(--c-accent)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M8 11L10 13L14 9"
                stroke="var(--c-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-[0.04em] text-[var(--c-text-primary)]">
            Cynox Security
          </span>
        </div>

        <span className="text-[11px] tracking-[0.08em] uppercase text-[var(--c-accent)] bg-[var(--c-accent-dim)] border border-[var(--c-border)] px-2.5 py-[3px] rounded-full">
          Internal Tool
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
