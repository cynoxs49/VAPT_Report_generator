import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--c-bg)] text-[var(--c-text-primary)] font-[var(--font-body)] antialiased">
      {/* ── Hero ── */}
      <main className="flex-1 relative">
        {/* Background grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,230,180,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,230,180,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />

        {/* Glow blob */}
        <div
          aria-hidden="true"
          className="absolute -top-28 -left-20 w-[500px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,230,180,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-20 flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center">
          {/* ── Left: Content ── */}
          <div className="relative z-10 flex flex-col gap-6 w-full md:w-1/2">
            {/* Logo mark */}
            <div className="w-16 h-16">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect
                  width="64"
                  height="64"
                  rx="16"
                  fill="var(--c-accent-dim)"
                />
                <path
                  d="M32 10L14 20V32C14 43.3 22.1 53.7 32 56C41.9 53.7 50 43.3 50 32V20L32 10Z"
                  stroke="var(--c-accent)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M24 32L29 37L40 26"
                  stroke="var(--c-accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Eyebrow */}
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--c-accent)]">
              VAPT Report Generator
            </span>

            {/* Title */}
            <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--c-text-primary)] m-0">
              Build Security Reports
              <br />
              <span className="text-[var(--c-accent)]">That Mean Business</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] leading-6 sm:leading-7 text-[var(--c-text-secondary)] m-0 max-w-[420px]">
              Structured penetration testing reports for Cynox engineers.
              <br />
              From vulnerability input to polished PDF — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => navigate("/projects/new")}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-[11px] bg-[var(--c-accent)] text-[#051a14] text-xs sm:text-sm font-bold rounded-[var(--radius-md)] border-none cursor-pointer transition-all duration-150 tracking-[0.01em] hover:opacity-[0.88] hover:-translate-y-px active:scale-[0.97]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3V13M3 8H13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                Create Report
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-[11px] bg-transparent text-[var(--c-text-primary)] text-xs sm:text-sm font-semibold border border-[var(--c-border-soft)] rounded-[var(--radius-md)] cursor-pointer transition-all duration-150 hover:border-[var(--c-border)] hover:bg-[var(--c-accent-dim)] hover:-translate-y-px active:scale-[0.97]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2"
                    y="3"
                    width="12"
                    height="10"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M5 7H11M5 10H9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                See Projects
              </button>
            </div>

            {/* Stats strip */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pt-2 w-full sm:w-auto">
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold tracking-[-0.02em] text-[var(--c-text-primary)]">
                  10+
                </span>
                <span className="text-[11px] tracking-[0.05em] text-[var(--c-text-muted)]">
                  Report Templates
                </span>
              </div>
              <div className="hidden sm:block w-px h-[30px] bg-[var(--c-border-soft)]" />
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold tracking-[-0.02em] text-[var(--c-text-primary)]">
                  V1
                </span>
                <span className="text-[11px] tracking-[0.05em] text-[var(--c-text-muted)]">
                  Live Prototype
                </span>
              </div>
              <div className="hidden sm:block w-px h-[30px] bg-[var(--c-border-soft)]" />
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold tracking-[-0.02em] text-[var(--c-text-primary)]">
                  PDF
                </span>
                <span className="text-[11px] tracking-[0.05em] text-[var(--c-text-muted)]">
                  Export Ready
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Terminal card ── */}
          <div
            aria-hidden="true"
            className="relative z-10 rounded-[var(--radius-lg)] overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface)] hidden md:block w-full md:w-1/2"
            style={{
              boxShadow:
                "0 0 0 1px rgba(0,230,180,0.06), 0 40px 80px rgba(0,0,0,0.6)",
            }}>
            {/* Terminal bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[var(--c-bg-3)] border-b border-[var(--c-border-soft)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs text-[var(--c-text-muted)] font-[var(--font-display)]">
                vapt-report.json
              </span>
            </div>

            {/* Terminal body */}
            <div className="px-6 py-5 pb-7 font-[var(--font-display)] text-[13.5px] leading-8 flex flex-col">
              <div className="flex gap-1">
                <span className="text-[#79c0ff]">"severity"</span>
                <span className="text-[var(--c-text-muted)]">:</span>
                <span className="text-[var(--c-critical)] font-bold">
                  "Critical"
                </span>
                <span className="text-[var(--c-text-muted)]">,</span>
              </div>
              <div className="flex gap-1">
                <span className="text-[#79c0ff]">"title"</span>
                <span className="text-[var(--c-text-muted)]">:</span>
                <span className="text-[#a5d6a7]">"SQL Injection"</span>
                <span className="text-[var(--c-text-muted)]">,</span>
              </div>
              <div className="flex gap-1">
                <span className="text-[#79c0ff]">"cvssScore"</span>
                <span className="text-[var(--c-text-muted)]">:</span>
                <span className="text-[#f9a825]">9.8</span>
                <span className="text-[var(--c-text-muted)]">,</span>
              </div>
              <div className="flex gap-1">
                <span className="text-[#79c0ff]">"status"</span>
                <span className="text-[var(--c-text-muted)]">:</span>
                <span className="text-[var(--c-yellow)]">"Open"</span>
                <span className="text-[var(--c-text-muted)]">,</span>
              </div>
              <div className="flex gap-1">
                <span className="text-[#79c0ff]">"displayId"</span>
                <span className="text-[var(--c-text-muted)]">:</span>
                <span className="text-[#a5d6a7]">"WEB-01"</span>
              </div>
              <div className="text-[var(--c-accent)] animate-[blink_1s_step-end_infinite]">
                |
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Blink keyframe — Tailwind doesn't include this by default */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
