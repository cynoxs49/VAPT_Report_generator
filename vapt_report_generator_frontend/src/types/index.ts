// ─── Primitives / Enums ───────────────────────────────────────────────────────

import type {
  BlockType,
  Severity,
  FindingStatus,
  TestType,
  AuditType,
  ProjectStatus,
  RiskPriority,
  Confidentiality,
} from "@/constants/enums";

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
  displayId: string;
  order: number;
  title: string;
  severity: Severity;
  cvssScore: number;
  status: FindingStatus;

  // NEW FIELDS
  affectedScope: string; // the URL/endpoint affected
  owaspMapping: string; // e.g. "A01: Broken Access Control"
  cweMapping: string; // e.g. "CWE-284 (Improper Access Control)"
  epssLikelihood: string; // e.g. "Very High (>80%)"
  riskPriority: RiskPriority; // e.g. "Immediate"
  epssRemarks: string; // e.g. "Highly exploitable..."

  description: string; // rich text HTML string

  // steps support optional screenshots
  steps: Array<{
    text: string;
    imageUrl?: string;
  }>;

  impact: string[];
  recommendation: string[];
  references: string[];
  images: FindingImage[]; // general images (non-step screenshots)
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

    // Engagement-level fields (Zone 2 data)
    engagementTimeframe: string; // "14.03.2026 – 19.03.2026"
    organizationContact: string; // "Mr. Gokul Vijayakumar"
    constraints: string; // "No constraints were experienced..."
    testType: TestType;
    auditType: AuditType;
    documentId: string; // "214"
    preparedBy: string;
    reviewedBy: string;
    approvedBy: string;
    releasedBy: string;
    releaseDate: string;

    auditTeam: AuditTeamMember[];
    toolsUsed: ToolUsed[];

    executiveSummary: string; // the paragraph on page 9
    strategicRecommendations: string[]; // bullet points on page 9
    overallRiskRating: Severity; // "Critical" — shown highlighted in risk matrix
    confidentiality: Confidentiality;
    changeHistory: ChangeHistoryEntry[];
    distributionList: DistributionEntry[];
    methodology: {
      description: string;
      standards: string[];
      phases: string[];
    };
    retestRecords?: RetestRecord[]; // only present on AuditType = "Re-test Report"
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

// NEW
export interface AuditTeamMember {
  name: string;
  designation: string;
  email: string;
  certifications: string;
  listedInSnapshot: boolean;
}

export interface ToolUsed {
  name: string;
  version: string;
  licenseType: "Open Source" | "Licensed";
}

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

export interface ChangeHistoryEntry {
  version: string; // "v1", "v2", "v3"
  date: string; // ISO date string
  author: string; // person who made the change
  designation?: string;
  remarks: string; // what changed
}

export interface DistributionEntry {
  name: string;
  organization: string;
  designation: string;
  email: string;
}

export interface FindingImage {
  url: string;
  caption?: string;
  stepIndex?: number; // undefined = general image, number = tied to step
}

export interface RetestRecord {
  findingId: string;
  retestDate: string;
  retestBy: string;
  result: "Resolved" | "Partially Resolved" | "Unresolved";
  notes?: string;
}
