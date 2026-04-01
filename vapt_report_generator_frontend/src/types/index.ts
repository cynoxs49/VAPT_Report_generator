// ─── Primitives / Enums ───────────────────────────────────────────────────────

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

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

// ─── Company ──────────────────────────────────────────────────────────────────

export interface Company {
  _id: string;
  name: string;
  logoUrl: string;
  email: string;
  contactInfo: string;
  scope: string;
  createdAt: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface Service {
  _id: string;
  name: string; // e.g. "Web Application VAPT", "Network VAPT"
  createdAt: string;
}

// ─── Template ─────────────────────────────────────────────────────────────────

export interface TemplateBlock {
  blockId: string;
  type: BlockType;
  source: string;
  config: Record<string, unknown>;
}

export interface TemplateSection {
  sectionId: string;
  title: string;
  blocks: TemplateBlock[];
}

export interface Template {
  _id: string;
  name: string;
  serviceId: string;
  version: string;
  isActive: boolean;
  sections: TemplateSection[];
  createdAt: string;
}

// ─── Finding ──────────────────────────────────────────────────────────────────
// This is the most important type — every field maps directly to the SDD

export interface Finding {
  _id: string;
  displayId: string; // e.g. "WEB-01", auto-assigned by backend
  order: number; // for drag-to-reorder
  title: string;
  severity: Severity;
  cvssScore: number; // 0.0 - 10.0
  status: FindingStatus;
  description: string; // rich text (HTML string from Tiptap)
  steps: string[]; // steps to reproduce, ordered list
  impact: string[]; // impact statements
  recommendation: string[]; // how to fix
  images: string[]; // S3 URLs
  references: string[]; // CVE links, articles
}

// ─── ProjectVersion ───────────────────────────────────────────────────────────

export interface ProjectVersion {
  _id: string;
  projectId: string;
  version: string;
  templateId: string;
  versionNumber: number; // used for conflict detection
  lastUpdatedBy: string;
  isLocked: boolean;
  data: {
    findings: Finding[];
  };
  createdAt: string;
  updatedAt: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface Project {
  _id: string;
  companyId: string;
  serviceId: string;
  createdBy: string;
  currentVersion: string; // ref to latest ProjectVersion._id
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  // populated fields (backend may join these)
  company?: Company;
  service?: Service;
}

// ─── AuditLog ─────────────────────────────────────────────────────────────────

export type AuditAction =
  | "finding_created"
  | "finding_updated"
  | "finding_deleted"
  | "report_published";

export interface AuditLog {
  userId: string;
  action: AuditAction;
  entityId: string;
  timestamp: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────
// Wrap these around every API response for consistent handling

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  code?: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Form Types ───────────────────────────────────────────────────────────────
// Used by React Hook Form — Omit backend-assigned fields

export type FindingFormData = Omit<Finding, "_id" | "displayId" | "order">;

export type CreateProjectFormData = {
  companyId: string;
  serviceId: string;
};
