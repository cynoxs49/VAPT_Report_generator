import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProject, getProjectVersion } from "@/api/project";
import { useProjectStore } from "@/stores/projectStore";
import { useFindingsStore } from "@/stores/findingsStore";
import { useUiStore } from "@/stores/uiStore";
import FindingsPanel from "@/components/panels/FindingsPanel";
import PreviewPanel from "@/components/preview/PreviewPanel";
import EngagementsPanel from "@/components/panels/EngagementsPanel";
import AuditDataPanel from "@/components/panels/AuditDataPanel";
import MethodologyPanel from "@/components/panels/MethodologyPanel";

const SavingIndicator = () => {
  const savingStatus = useUiStore((s) => s.savingStatus);
  const map = {
    idle: { label: "", cls: "" },
    saving: { label: "Saving…", cls: "text-[var(--c-text-secondary)]" },
    saved: { label: "Saved ✓", cls: "text-[var(--c-accent)]" },
    error: { label: "Save failed", cls: "text-[var(--c-critical)]" },
  } as const;
  const current = map[savingStatus];
  if (!current.label) return null;
  return (
    <span
      className={`text-xs font-medium tracking-wide transition-colors duration-300 ${current.cls}`}>
      {current.label}
    </span>
  );
};

const VersionBadge = ({ version }: { version: string }) => (
  <span className="text-[11px] font-semibold tracking-[0.08em] uppercase px-2.5 py-[3px] rounded-full bg-[var(--c-accent-dim)] border border-[var(--c-border)] text-[var(--c-accent)]">
    {version}
  </span>
);

const LockedBadge = () => (
  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase px-2.5 py-[3px] rounded-full bg-[rgba(255,77,77,0.08)] border border-[rgba(255,77,77,0.2)] text-[var(--c-critical)]">
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <rect
        x="1.5"
        y="4.5"
        width="7"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M3 4.5V3a2 2 0 014 0v1.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
    Locked
  </span>
);

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("Findings");

  const panels = ["Engagements", "Findings", "Audit Data", "Methodology"];

  const {
    setProject,
    setVersion,
    currentProject,
    currentVersion,
    lockCurrentVersion,
  } = useProjectStore();
  const { setFindings } = useFindingsStore();
  const { isPublishModalOpen, setPublishModalOpen } = useUiStore();

  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id!),
    enabled: !!id,
  });

  const { data: versionData, isLoading: versionLoading } = useQuery({
    queryKey: ["projectVersion", id],
    queryFn: () => getProjectVersion(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (projectData) setProject(projectData);
  }, [projectData]);

  useEffect(() => {
    if (versionData) {
      setVersion(versionData);
      setFindings(versionData.data.findings);
    }
  }, [versionData]);

  const isLoading = projectLoading || versionLoading;
  const isLocked = currentVersion?.isLocked ?? false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[var(--c-border)] border-t-[var(--c-accent)] rounded-full animate-spin" />
          <span className="text-sm text-[var(--c-text-muted)] tracking-wide">
            Loading project…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--c-bg)] text-[var(--c-text-primary)] font-[var(--font-body)] overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 h-[56px] bg-[var(--c-bg-2)] border-b border-[var(--c-border-soft)] flex items-center px-5 gap-4 z-40">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] hover:bg-[var(--c-surface)] transition-all duration-150 flex-shrink-0"
          title="Back to dashboard">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="w-px h-5 bg-[var(--c-border-soft)]" />

        <div className="flex items-center gap-2.5 min-w-0 flex-1 flex-wrap">
          <span className="text-sm font-semibold text-[var(--c-text-primary)] truncate">
            {currentProject?.company?.name ?? "—"}
          </span>
          <span className="text-[var(--c-text-muted)] text-sm">·</span>
          <span className="text-sm text-[var(--c-text-secondary)] truncate">
            {currentProject?.service?.name ?? "—"}
          </span>
          {currentVersion && <VersionBadge version={currentVersion.version} />}
          {isLocked && <LockedBadge />}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <SavingIndicator />

          <button
            onClick={() => setPreviewOpen((v) => !v)}
            className={`inline-flex items-center gap-2 px-3.5 py-[7px] text-xs font-semibold rounded-[var(--radius-sm)] border transition-all duration-200 ${
              previewOpen
                ? "bg-[var(--c-accent-dim)] border-[var(--c-border)] text-[var(--c-accent)]"
                : "bg-transparent border-[var(--c-border-soft)] text-[var(--c-text-secondary)] hover:border-[var(--c-border)] hover:text-[var(--c-text-primary)]"
            }`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect
                x="1"
                y="2"
                width="12"
                height="10"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
                fill="none"
              />
              <path
                d="M4 5h6M4 7.5h4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            {previewOpen ? "Hide Preview" : "Preview"}
          </button>

          {!isLocked ? (
            <button
              onClick={() => setPublishModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-[7px] text-xs font-bold rounded-[var(--radius-sm)] bg-[var(--c-accent)] text-[#051a14] border-none cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.97]">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M6.5 1.5v7M3.5 5.5l3-3 3 3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.5 10.5h10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Publish
            </button>
          ) : (
            <button className="inline-flex items-center gap-2 px-4 py-[7px] text-xs font-bold rounded-[var(--radius-sm)] bg-[var(--c-accent)] text-[#051a14] border-none cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.97]">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M6.5 9.5v-8M3.5 6.5l3 3 3-3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.5 10.5h10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Download PDF
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out border-r border-[var(--c-border-soft)] ${
            previewOpen ? "w-1/3 flex-shrink-0" : "w-full"
          }`}>
          <section className="w-full p-2 flex gap-2 border border-[var(--c-border-soft)]">
            {panels.map((panel, idx) => (
              <button
                key={idx}
                onClick={() => setActivePanel(panel)}
                className={`px-3.5 py-[7px] text-xs font-semibold rounded-[var(--radius-sm)] border transition-all duration-200 ${
                  activePanel === panel
                    ? "bg-[var(--c-accent-dim)] border-[var(--c-border)] text-[var(--c-accent)]"
                    : "bg-transparent border-[var(--c-border-soft)] text-[var(--c-text-secondary)] hover:border-[var(--c-border)] hover:text-[var(--c-text-primary)]"
                }`}>
                {panel}
              </button>
            ))}
          </section>

          {activePanel === "Findings" && <FindingsPanel isLocked={isLocked} />}
          {activePanel === "Engagements" && <EngagementsPanel />}
          {activePanel === "Audit Data" && <AuditDataPanel />}
          {activePanel === "Methodology" && <MethodologyPanel />}
        </div>

        <div
          className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
            previewOpen ? "opacity-100" : "w-0 opacity-0 pointer-events-none"
          }`}>
          {previewOpen && <PreviewPanel />}
        </div>
      </div>

      {isPublishModalOpen && (
        <PublishModal
          onConfirm={() => {
            lockCurrentVersion();
            setPublishModalOpen(false);
          }}
          onCancel={() => setPublishModalOpen(false)}
        />
      )}

      <ConflictModal />
    </div>
  );
}

function PublishModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--c-bg-2)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-6 w-[420px] shadow-2xl">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--c-accent-dim)] border border-[var(--c-border)] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2L2 6v5c0 4 3.1 7.7 7 8.8 3.9-1.1 7-4.8 7-8.8V6L9 2Z"
                stroke="var(--c-accent)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M6 9l2 2 4-4"
                stroke="var(--c-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--c-text-primary)] mb-1">
              Publish this report?
            </h3>
            <p className="text-xs text-[var(--c-text-secondary)] leading-relaxed">
              Publishing will lock this version. No further edits will be
              possible. You can create a new version afterwards for re-testing.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-[var(--c-text-secondary)] bg-transparent border border-[var(--c-border-soft)] rounded-[var(--radius-sm)] hover:border-[var(--c-border)] hover:text-[var(--c-text-primary)] transition-all duration-150">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-bold text-[#051a14] bg-[var(--c-accent)] rounded-[var(--radius-sm)] hover:opacity-90 transition-all duration-150 active:scale-[0.97]">
            Yes, Publish
          </button>
        </div>
      </div>
    </div>
  );
}

function ConflictModal() {
  const { conflictDetected, setConflictDetected } = useUiStore();
  if (!conflictDetected) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--c-bg-2)] border border-[rgba(255,77,77,0.25)] rounded-[var(--radius-lg)] p-6 w-[420px] shadow-2xl">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[rgba(255,77,77,0.08)] border border-[rgba(255,77,77,0.2)] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2L1.5 15.5h15L9 2Z"
                stroke="var(--c-critical)"
                strokeWidth="1.5"
                fill="none"
                strokeLinejoin="round"
              />
              <path
                d="M9 7v4"
                stroke="var(--c-critical)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="9" cy="13" r="0.8" fill="var(--c-critical)" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--c-text-primary)] mb-1">
              Conflict detected
            </h3>
            <p className="text-xs text-[var(--c-text-secondary)] leading-relaxed">
              Another user has made changes to this report. Refresh to get the
              latest version — your unsaved changes may be lost.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setConflictDetected(false)}
            className="px-4 py-2 text-xs font-semibold text-[var(--c-text-secondary)] bg-transparent border border-[var(--c-border-soft)] rounded-[var(--radius-sm)] hover:border-[var(--c-border)] hover:text-[var(--c-text-primary)] transition-all duration-150">
            Dismiss
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-xs font-bold text-white bg-[var(--c-critical)] rounded-[var(--radius-sm)] hover:opacity-90 transition-all duration-150">
            Refresh Now
          </button>
        </div>
      </div>
    </div>
  );
}
