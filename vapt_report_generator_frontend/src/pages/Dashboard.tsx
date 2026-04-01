import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "@/api/project";
import type { Project } from "@/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        console.log(data);
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const draftCount = projects.filter((p) => p.status === "draft").length;
  const publishedCount = projects.filter(
    (p) => p.status === "published",
  ).length;
  const totalFindings = projects.length * 4; // Mock calculation

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--c-bg)] text-[var(--c-text-primary)] font-[var(--font-body)] antialiased">
      {/* ── Background decorations ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,230,180,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,230,180,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Main content ── */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
          {/* ── Header ── */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--c-text-primary)] m-0">
              Dashboard
            </h1>
            <p className="text-sm md:text-[15px] text-[var(--c-text-secondary)] mt-2 m-0">
              Manage and track your VAPT reports
            </p>
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 md:mb-12">
            {/* Total Projects */}
            <div className="bg-[var(--c-surface)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs md:text-sm text-[var(--c-text-muted)] uppercase tracking-[0.05em] m-0 mb-2">
                    Total Projects
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-[var(--c-text-primary)] m-0">
                    {projects.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--c-accent-dim)] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--c-accent)"
                    strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="9" x2="15" y2="9" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Draft Projects */}
            <div className="bg-[var(--c-surface)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs md:text-sm text-[var(--c-text-muted)] uppercase tracking-[0.05em] m-0 mb-2">
                    Drafts
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-[var(--c-yellow)] m-0">
                    {draftCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--c-yellow)]20 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--c-yellow)"
                    strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Published Projects */}
            <div className="bg-[var(--c-surface)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs md:text-sm text-[var(--c-text-muted)] uppercase tracking-[0.05em] m-0 mb-2">
                    Published
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-[var(--c-accent)] m-0">
                    {publishedCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--c-accent-dim)] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--c-accent)"
                    strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Findings */}
            <div className="bg-[var(--c-surface)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs md:text-sm text-[var(--c-text-muted)] uppercase tracking-[0.05em] m-0 mb-2">
                    Total Findings
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-[var(--c-critical)] m-0">
                    {totalFindings}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--c-critical)]20 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--c-critical)"
                    strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-sm md:text-base font-semibold tracking-[0.04em] uppercase text-[var(--c-text-muted)] m-0 mb-4">
              Quick Actions
            </h2>
            <div className="flex gap-2 md:gap-3 flex-wrap">
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
                New Report
              </button>
            </div>
          </div>

          {/* ── Projects List ── */}
          <div>
            <h2 className="text-sm md:text-base font-semibold tracking-[0.04em] uppercase text-[var(--c-text-muted)] m-0 mb-4">
              Recent Projects
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-[var(--c-text-muted)]">
                  Loading projects...
                </p>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-[var(--c-surface)] border-2 border-dashed border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-8 md:p-12 text-center">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--c-text-muted)"
                  strokeWidth="1.5"
                  className="mx-auto mb-4 opacity-50">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <p className="text-[var(--c-text-muted)] m-0 mb-4">
                  No projects yet
                </p>
                <button
                  onClick={() => navigate("/projects/new")}
                  className="inline-flex items-center gap-2 px-6 py-[11px] bg-[var(--c-accent)] text-[#051a14] text-sm font-bold rounded-[var(--radius-md)] border-none cursor-pointer transition-all duration-150 tracking-[0.01em] hover:opacity-[0.88] hover:-translate-y-px active:scale-[0.97]">
                  Create First Report
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="bg-[var(--c-surface)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-4 md:p-5 cursor-pointer transition-all duration-150 hover:border-[var(--c-border)] hover:bg-[var(--c-bg-3)] hover:-translate-y-px">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                      {/* Left: Project Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-sm md:text-base font-semibold text-[var(--c-text-primary)] m-0">
                            {project.company?.name || "Unknown Company"}
                          </h3>
                          <span
                            className={`text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.04em] px-2 py-1 rounded-full ${
                              project.status === "draft"
                                ? "bg-[var(--c-yellow)]20 text-[var(--c-yellow)]"
                                : "bg-[var(--c-accent-dim)] text-[var(--c-accent)]"
                            }`}>
                            {project.status === "draft" ? "Draft" : "Published"}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-[var(--c-text-secondary)] m-0">
                          {project.service?.name || "Service"} • Updated{" "}
                          {formatDate(project.updatedAt)}
                        </p>
                      </div>

                      {/* Right: Action Arrow */}
                      <div className="flex items-center justify-between md:justify-end">
                        <span className="text-xs text-[var(--c-text-muted)]">
                          {new Date(project.updatedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--c-text-muted)"
                          strokeWidth="2"
                          className="ml-3 flex-shrink-0">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
