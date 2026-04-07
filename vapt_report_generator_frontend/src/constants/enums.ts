export type Severity = "Critical" | "High" | "Medium" | "Low";
export type FindingStatus = "Open" | "Closed";
export type ProjectStatus = "draft" | "published";
export type BlockType =
  | "rich_text"
  | "table"
  | "derived_table"
  | "repeatable_detail"
  | "image"
  | "vulnerability_list";

export const SEVERITY_OPTIONS: Severity[] = [
  "Critical",
  "High",
  "Medium",
  "Low",
];

export const STATUS_OPTIONS: FindingStatus[] = ["Open", "Closed"];

// For color-coding severity badges in the UI
export const SEVERITY_COLOR: Record<Severity, string> = {
  Critical: "bg-red-100 text-red-700 border-red-300",
  High: "bg-orange-100 text-orange-700 border-orange-300",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Low: "bg-blue-100 text-blue-700 border-blue-300",
};

export const STATUS_COLOR: Record<FindingStatus, string> = {
  Open: "bg-red-50 text-red-600",
  Closed: "bg-green-50 text-green-600",
};

// CVSS score range labels — useful for displaying alongside score
export const CVSS_LABEL = (score: number): Severity => {
  if (score >= 9.0) return "Critical";
  if (score >= 7.0) return "High";
  if (score >= 4.0) return "Medium";
  return "Low";
};

export type TestType = "Black Box" | "Grey Box" | "White Box";
export type AuditType = "Initial Audit Report" | "Re-test Report";
