import type { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="border-t bg-black border-[var(--c-border-soft)] text-white px-8 py-5">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs ">
          © 2025 Cynox Security — Internal Use Only
        </span>
        <div className="flex items-center gap-1.5 text-xs">
          <span>VAPT Report Generator</span>
          <span className="opacity-40">·</span>
          <span>v1.0 Prototype</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
