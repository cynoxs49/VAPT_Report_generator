import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "@/api/project";
import { CreateProjectModal } from "@/components/ui/CreateProjectModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  const draftCount = projects.filter((p) => p.status === "draft").length;
  const publishedCount = projects.filter(
    (p) => p.status === "published",
  ).length;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--c-bg)] text-[var(--c-text-primary)] font-[var(--font-body)] antialiased">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,230,180,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,230,180,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <main className="flex-1 relative overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8 md:mb-12 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--c-text-primary)] m-0">
                Dashboard
              </h1>
              <p className="text-sm md:text-[15px] text-[var(--c-text-secondary)] mt-2 m-0">
                Manage and track your VAPT reports
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-[var(--c-accent)] text-[#051a14] text-xs sm:text-sm font-bold rounded-[var(--radius-md)] border-none cursor-pointer transition-all duration-150 hover:opacity-[0.88] hover:-translate-y-px active:scale-[0.97] flex-shrink-0">
              <PlusIcon />
              New Report
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 md:mb-12">
            <StatCard
              label="Total Projects"
              value={projects.length}
              color="var(--c-accent)"
              dimColor="rgba(0,230,180,0.08)"
              icon={<FolderIcon />}
            />
            <StatCard
              label="Drafts"
              value={draftCount}
              color="var(--c-yellow)"
              dimColor="rgba(245,197,66,0.10)"
              icon={<DraftIcon />}
            />
            <StatCard
              label="Published"
              value={publishedCount}
              color="var(--c-accent)"
              dimColor="rgba(0,230,180,0.08)"
              icon={<CheckIcon />}
            />
            <StatCard
              label="Total Findings"
              value="--"
              color="var(--c-critical)"
              dimColor="rgba(255,77,77,0.10)"
              icon={<AlertIcon />}
            />
          </div>

          {/* Projects list */}
          <div>
            <h2 className="text-sm font-semibold tracking-[0.04em] uppercase text-[var(--c-text-muted)] m-0 mb-4">
              Recent Projects
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-16 gap-3">
                <div className="w-5 h-5 border-2 border-[var(--c-border)] border-t-[var(--c-accent)] rounded-full animate-spin" />
                <span className="text-sm text-[var(--c-text-muted)]">
                  Loading projects…
                </span>
              </div>
            ) : projects.length === 0 ? (
              <EmptyState onCreateClick={() => setModalOpen(true)} />
            ) : (
              <div className="flex flex-col gap-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="group bg-[var(--c-surface)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-4 md:p-5 cursor-pointer transition-all duration-150 hover:border-[var(--c-border)] hover:bg-[var(--c-bg-3)] hover:-translate-y-px">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm md:text-base font-semibold text-[var(--c-text-primary)] m-0">
                            {project.company?.name ?? "Unknown Company"}
                          </h3>
                          <span
                            className="text-[10px] font-semibold uppercase tracking-[0.04em] px-2 py-[3px] rounded-full"
                            style={{
                              backgroundColor:
                                project.status === "draft"
                                  ? "rgba(245,197,66,0.12)"
                                  : "rgba(0,230,180,0.10)",
                              color:
                                project.status === "draft"
                                  ? "var(--c-yellow)"
                                  : "var(--c-accent)",
                            }}>
                            {project.status === "draft" ? "Draft" : "Published"}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-[var(--c-text-secondary)] m-0">
                          {project.service?.name ?? "Unknown Service"} · Updated{" "}
                          {formatDate(project.updatedAt)}
                        </p>
                      </div>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--c-text-muted)"
                        strokeWidth="2"
                        className="flex-shrink-0 transition-colors duration-150 group-hover:stroke-[var(--c-text-secondary)]">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && <CreateProjectModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
  dimColor,
  icon,
}: {
  label: string;
  value: number | string;
  color: string;
  dimColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--c-surface)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-4 md:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-[var(--c-text-muted)] uppercase tracking-[0.06em] m-0 mb-2">
            {label}
          </p>
          <p className="text-2xl md:text-3xl font-bold m-0" style={{ color }}>
            {value}
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: dimColor }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="bg-[var(--c-surface)] border-2 border-dashed border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-10 text-center flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--c-accent-dim)] border border-[var(--c-border)] flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect
            x="2"
            y="2"
            width="18"
            height="18"
            rx="3"
            stroke="var(--c-accent)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M11 7v8M7 11h8"
            stroke="var(--c-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--c-text-secondary)] m-0">
          No projects yet
        </p>
        <p className="text-xs text-[var(--c-text-muted)] mt-1 m-0">
          Create your first VAPT report to get started
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--c-accent)] text-[#051a14] text-sm font-bold rounded-[var(--radius-md)] border-none cursor-pointer transition-all duration-150 hover:opacity-[0.88] active:scale-[0.97]">
        <PlusIcon />
        Create First Report
      </button>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const FolderIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--c-accent)"
    strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="9" x2="15" y2="9" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);
const DraftIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--c-yellow)"
    strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--c-accent)"
    strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const AlertIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--c-critical)"
    strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 2v10M2 7h10"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
