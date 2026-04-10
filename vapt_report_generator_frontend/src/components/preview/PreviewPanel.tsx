import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { useFindingsStore } from "@/stores/findingsStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import type { TemplateRendererProps } from "@/components/templates/types";

const renderers: Record<
  string,
  LazyExoticComponent<ComponentType<TemplateRendererProps>>
> = {
  template_001: lazy(
    () => import("@/components/templates/template_001/PreviewRenderer"),
  ),
};

export default function PreviewPanel() {
  const currentProject = useProjectStore((s) => s.currentProject);
  const currentVersion = useProjectStore((s) => s.currentVersion);
  const findings = useFindingsStore((s) => s.findings);
  const savingStatus = useUiStore((s) => s.savingStatus);

  if (!currentProject || !currentVersion) {
    return (
      <div className="h-full bg-[var(--c-bg-3)] flex items-center justify-center">
        <p className="text-sm text-[var(--c-text-muted)]">
          Open a project to preview the report.
        </p>
      </div>
    );
  }

  const data = { ...currentVersion.data, findings };
  const payload = {
    project: currentProject,
    version: { ...currentVersion, data },
    data,
    findings,
  };
  const templateId = currentVersion.templateId || "template_001";
  const Renderer = renderers[templateId] ?? renderers.template_001;

  return (
    <div className="h-full bg-[var(--c-bg-3)] overflow-hidden flex flex-col">
      <div className="flex-shrink-0 h-10 border-b border-[var(--c-border-soft)] bg-[var(--c-bg-2)] flex items-center justify-between px-4">
        <span className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--c-text-secondary)]">
          Report Preview
        </span>
        <span className="text-[11px] text-[var(--c-text-muted)]">
          {savingStatus === "saving"
            ? "Saving draft..."
            : savingStatus === "error"
              ? "Draft save failed"
              : "Live draft"}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center">
              <span className="text-sm text-[var(--c-text-muted)]">
                Loading template...
              </span>
            </div>
          }>
          <Renderer payload={payload} />
        </Suspense>
      </div>
    </div>
  );
}
