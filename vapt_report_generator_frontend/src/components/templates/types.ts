import type { Finding, Project, ProjectVersion } from "@/types";

export interface ReportPreviewPayload {
  project: Project;
  version: ProjectVersion;
  data: ProjectVersion["data"];
  findings: Finding[];
}

export interface TemplateRendererProps {
  payload: ReportPreviewPayload;
}
