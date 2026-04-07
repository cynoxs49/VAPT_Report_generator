import type {
  Company,
  Service,
  Template,
  Project,
  ProjectVersion,
  Finding,
  AuditTeamMember,
} from "@/types";

// ─── Companies ────────────────────────────────────────────────────────────────

export const dummyCompanies: Company[] = [
  {
    _id: "company_001",
    name: "Acme Corp",
    logoUrl: "",
    email: "security@acmecorp.com",
    contactInfo: "+91 98765 43210",
    scope: "https://app.acmecorp.com, https://api.acmecorp.com",
    createdAt: "2025-01-10T08:00:00.000Z",
  },
  {
    _id: "company_002",
    name: "FinVault Technologies",
    logoUrl: "",
    email: "it@finvault.in",
    contactInfo: "+91 91234 56789",
    scope: "192.168.1.0/24, https://portal.finvault.in",
    createdAt: "2025-02-14T09:30:00.000Z",
  },
];

// ─── Services ─────────────────────────────────────────────────────────────────

export const dummyServices: Service[] = [
  {
    _id: "service_001",
    name: "Web Application VAPT",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    _id: "service_002",
    name: "Network VAPT",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    _id: "service_003",
    name: "Mobile Application VAPT",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    _id: "service_004",
    name: "API Security Testing",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];

// ─── Template ─────────────────────────────────────────────────────────────────

export const dummyTemplate: Template = {
  _id: "template_001",
  name: "Web Application VAPT Report v1",
  serviceId: "service_001",
  version: "1.0",
  isActive: true,
  sections: [
    {
      sectionId: "sec_001",
      title: "Executive Summary",
      blocks: [
        {
          blockId: "blk_001",
          type: "rich_text",
          source: "summary",
          config: {},
        },
      ],
    },
    {
      sectionId: "sec_002",
      title: "Vulnerability Summary",
      blocks: [
        {
          blockId: "blk_002",
          type: "derived_table",
          source: "findings",
          config: {},
        },
      ],
    },
    {
      sectionId: "sec_003",
      title: "Detailed Findings",
      blocks: [
        {
          blockId: "blk_003",
          type: "repeatable_detail",
          source: "findings",
          config: {},
        },
      ],
    },
  ],
  createdAt: "2025-01-01T00:00:00.000Z",
};

// ─── Findings ─────────────────────────────────────────────────────────────────

export const dummyFindings: Finding[] = [
  {
    _id: "finding_001",
    displayId: "WEB-01",
    order: 1,
    title: "SQL Injection in Login Endpoint",
    severity: "Critical",
    cvssScore: 9.8,
    status: "Open",
    affectedScope: "https://app.acmecorp.com/api/auth/login",
    owaspMapping: "A03: Injection",
    cweMapping: "CWE-89 (SQL Injection)",
    epssLikelihood: "Very High (>80%)",
    riskPriority: "Immediate",
    epssRemarks: "Highly exploitable, full database compromise risk",
    description:
      "<p>The login endpoint <code>/api/auth/login</code> is vulnerable to SQL Injection. An attacker can manipulate the SQL query by injecting malicious input in the <strong>username</strong> parameter, potentially gaining unauthorized access to the database.</p>",
    steps: [
      { text: "Navigate to login page", imageUrl: undefined },
      { text: "Enter payload: ' OR '1'='1", imageUrl: undefined },
      { text: "Observe authentication bypass", imageUrl: undefined },
    ],
    impact: [
      "Complete authentication bypass allowing unauthorized access",
      "Full read/write access to the backend database",
      "Potential exfiltration of sensitive customer PII data",
    ],
    recommendation: [
      "Use parameterized queries or prepared statements for all database interactions",
      "Implement an ORM (e.g. Prisma, TypeORM) to abstract raw SQL",
      "Apply strict input validation and sanitization on all user-supplied fields",
    ],
    images: [],
    references: [
      "https://owasp.org/www-community/attacks/SQL_Injection",
      "https://nvd.nist.gov/vuln/detail/CVE-2023-12345",
    ],
  },
  {
    _id: "finding_002",
    displayId: "WEB-02",
    order: 2,
    title: "Cross-Site Scripting (XSS) in Search Feature",
    severity: "High",
    cvssScore: 7.4,
    status: "Open",
    affectedScope: "https://app.acmecorp.com/api/auth/login",
    owaspMapping: "A03: Injection",
    cweMapping: "CWE-89 (SQL Injection)",
    epssLikelihood: "Very High (>80%)",
    riskPriority: "Immediate",
    epssRemarks: "Highly exploitable, full database compromise risk",
    description:
      "<p>A reflected XSS vulnerability exists in the search functionality. The <strong>query</strong> parameter is reflected in the response without proper encoding, allowing an attacker to inject arbitrary JavaScript.</p>",
    steps: [
      { text: "Navigate to login page", imageUrl: undefined },
      { text: "Enter payload: ' OR '1'='1", imageUrl: undefined },
      { text: "Observe authentication bypass", imageUrl: undefined },
    ],
    impact: [
      "Session hijacking via cookie theft",
      "Phishing attacks by injecting fake login forms",
      "Defacement of the application for end users",
    ],
    recommendation: [
      "Encode all user-supplied data before rendering in HTML context",
      "Implement a strict Content Security Policy (CSP) header",
      "Use a trusted sanitization library such as DOMPurify on the frontend",
    ],
    images: [],
    references: ["https://owasp.org/www-community/attacks/xss/"],
  },
  {
    _id: "finding_003",
    displayId: "WEB-03",
    order: 3,
    title: "Sensitive Data Exposed in API Response",
    severity: "Medium",
    cvssScore: 5.3,
    status: "Closed",
    affectedScope: "https://app.acmecorp.com/api/auth/login",
    owaspMapping: "A03: Injection",
    cweMapping: "CWE-89 (SQL Injection)",
    epssLikelihood: "Very High (>80%)",
    riskPriority: "Immediate",
    epssRemarks: "Highly exploitable, full database compromise risk",
    description:
      "<p>The <code>GET /api/users/profile</code> endpoint returns sensitive fields including <strong>passwordHash</strong> and internal <strong>role flags</strong> in the JSON response, which are not required by the frontend.</p>",
    steps: [
      { text: "Navigate to login page", imageUrl: undefined },
      { text: "Enter payload: ' OR '1'='1", imageUrl: undefined },
      { text: "Observe authentication bypass", imageUrl: undefined },
    ],
    impact: [
      "Password hash exposure enables offline brute-force attacks",
      "Internal role information aids attackers in privilege escalation attempts",
    ],
    recommendation: [
      "Apply a response DTO (Data Transfer Object) pattern — only return fields the client explicitly needs",
      "Audit all API endpoints to ensure no sensitive fields are leaked",
    ],
    images: [],
    references: [
      "https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/",
    ],
  },
  {
    _id: "finding_004",
    displayId: "WEB-04",
    order: 4,
    title: "Missing HTTP Security Headers",
    severity: "Low",
    cvssScore: 3.1,
    status: "Open",
    affectedScope: "https://app.acmecorp.com/api/auth/login",
    owaspMapping: "A03: Injection",
    cweMapping: "CWE-89 (SQL Injection)",
    epssLikelihood: "Very High (>80%)",
    riskPriority: "Immediate",
    epssRemarks: "Highly exploitable, full database compromise risk",
    description:
      "<p>Several recommended HTTP security headers are absent from the application responses, including <strong>X-Content-Type-Options</strong>, <strong>X-Frame-Options</strong>, and <strong>Strict-Transport-Security</strong>.</p>",
    steps: [
      { text: "Navigate to login page", imageUrl: undefined },
      { text: "Enter payload: ' OR '1'='1", imageUrl: undefined },
      { text: "Observe authentication bypass", imageUrl: undefined },
    ],
    impact: [
      "Absence of X-Frame-Options enables clickjacking attacks",
      "Missing HSTS allows protocol downgrade attacks",
      "Without X-Content-Type-Options, MIME-sniffing attacks are possible",
    ],
    recommendation: [
      "Configure the web server or reverse proxy to include all recommended security headers",
      "Use helmet.js if the backend is Node.js — it sets secure headers with a single middleware",
      "Validate headers using securityheaders.com after deployment",
    ],
    images: [],
    references: [
      "https://owasp.org/www-project-secure-headers/",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security",
    ],
  },
];

// ─── Project Version ──────────────────────────────────────────────────────────

export const dummyProjectVersion: ProjectVersion = {
  _id: "version_001",
  projectId: "project_001",
  version: "v1",
  templateId: "template_001",
  versionNumber: 1,
  lastUpdatedBy: "user_001",
  isLocked: false,
  data: {
    findings: dummyFindings,
    engagementTimeframe: "01.03.2025 – 07.03.2025",
    organizationContact: "Mr. John Smith",
    constraints: "No constraints were experienced during the testing.",
    testType: "White Box",
    auditType: "Initial Audit Report",
    documentId: "101",
    preparedBy: "Ujjwal (Cyber Security Analyst)",
    reviewedBy: "Senior Analyst",
    approvedBy: "Head – Information Security",
    releasedBy: "Information Security Project Team",
    releaseDate: "07-03-2025",
    auditTeam: [
      {
        name: "Puneet Pathak",
        designation: "Manager Information Security",
        email: "puneet@gmail.com",
        certifications: "CEH, CISA, ISO, 27001 LA",
        listedInSnapshot: false,
      },
      {
        name: "Pranav Pathak",
        designation: "Cyber Security Analytics",
        email: "pravav@gmail.com",
        certifications: "COSA, Z+ Security",
        listedInSnapshot: false,
      },
    ],
    toolsUsed: [
      {
        name: "Burp Suite Professional",
        version: "v2025.8.7",
        licenseType: "Licensed",
      },
      { name: "Nmap", version: "v7.95", licenseType: "Open Source" },
    ],
    executiveSummary: "Cynox conducted a penetration test for Acme Corp...",
    strategicRecommendations: [
      "Enforce centralized authorization checks across all modules...",
      "Implement strict server-side validation...",
    ],
    overallRiskRating: "Critical",
  },
  createdAt: "2025-03-01T10:00:00.000Z",
  updatedAt: "2025-03-01T10:00:00.000Z",
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const dummyProjects: Project[] = [
  {
    _id: "project_001",
    companyId: "company_001",
    serviceId: "service_001",
    createdBy: "user_001",
    currentVersion: "version_001",
    status: "draft",
    createdAt: "2025-03-01T10:00:00.000Z",
    updatedAt: "2025-03-15T14:30:00.000Z",
    company: dummyCompanies[0],
    service: dummyServices[0],
  },
  {
    _id: "project_002",
    companyId: "company_002",
    serviceId: "service_002",
    createdBy: "user_001",
    currentVersion: "version_002",
    status: "published",
    createdAt: "2025-02-20T09:00:00.000Z",
    updatedAt: "2025-02-28T17:00:00.000Z",
    company: dummyCompanies[1],
    service: dummyServices[1],
  },
];
