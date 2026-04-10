import type { TemplateRendererProps } from "@/components/templates/types";
import { ReportPage } from "@/components/templates/template_001/components/ReportPage";
import { SectionBlock } from "@/components/templates/template_001/components/SectionBlock";
import { AssessmentInformation } from "@/components/templates/template_001/zones/zone2/AssessmentInformation";
import { AssessmentRiskRating } from "@/components/templates/template_001/zones/zone2/AssessmentRiskRating";
import { AuditingTeam } from "@/components/templates/template_001/zones/zone2/AuditingTeam";
import { CoverPage } from "@/components/templates/template_001/zones/zone2/CoverPage";
import { DocumentControl } from "@/components/templates/template_001/zones/zone2/DocumentControl";
import { EngagementOverview } from "@/components/templates/template_001/zones/zone2/EngagementOverview";
import { ExecutiveSummary } from "@/components/templates/template_001/zones/zone2/ExecutiveSummary";
import { ScopingAndEngagementRules } from "@/components/templates/template_001/zones/zone2/ScopingAndEngagementRules";
import { TableOfContents } from "@/components/templates/template_001/zones/zone2/TableOfContents";
import { ToolsUsed } from "@/components/templates/template_001/zones/zone2/ToolsUsed";
import { SummaryOfFindings } from "@/components/templates/template_001/zones/zone3/SummaryOfFindings";
import { FindingDetail } from "@/components/templates/template_001/zones/zone4/FindingDetail";
import "./template.css";

export default function PreviewRenderer({ payload }: TemplateRendererProps) {
  const orderedFindings = [...payload.findings].sort((a, b) => a.order - b.order);

  return (
    <div className="template-001-preview">
      <ReportPage className="t-cover-page">
        <CoverPage payload={payload} />
      </ReportPage>

      <ReportPage>
        <SectionBlock title="Contents">
          <TableOfContents />
        </SectionBlock>
      </ReportPage>

      <ReportPage>
        <SectionBlock title="Assessment Information">
          <AssessmentInformation payload={payload} />
        </SectionBlock>

        <SectionBlock title="Document Control">
          <DocumentControl
            data={payload.data}
            versionLabel={payload.version.version}
          />
        </SectionBlock>
      </ReportPage>

      <ReportPage>
        <SectionBlock title="Details of the Auditing Team">
          <AuditingTeam auditTeam={payload.data.auditTeam} />
        </SectionBlock>

        <SectionBlock title="Tools / Software Used">
          <ToolsUsed toolsUsed={payload.data.toolsUsed} />
        </SectionBlock>
      </ReportPage>

      <ReportPage>
        <SectionBlock title="Engagement Overview">
          <EngagementOverview payload={payload} />
        </SectionBlock>
      </ReportPage>

      <ReportPage>
        <SectionBlock title="Scoping and Engagement Rules">
          <ScopingAndEngagementRules payload={payload} />
        </SectionBlock>
      </ReportPage>

      <ReportPage>
        <SectionBlock title="Executive Summary of Findings">
          <ExecutiveSummary payload={payload} />
        </SectionBlock>

        <SectionBlock title="Assessment Risk Rating">
          <AssessmentRiskRating
            overallRiskRating={payload.data.overallRiskRating}
          />
        </SectionBlock>
      </ReportPage>

      <ReportPage>
        <SectionBlock title="Summary of Findings">
          {orderedFindings.length > 0 ? (
            <SummaryOfFindings findings={orderedFindings} />
          ) : (
            <p className="t-muted">No findings have been added yet.</p>
          )}
        </SectionBlock>
      </ReportPage>

      {orderedFindings.map((finding) => (
        <ReportPage key={finding._id}>
          <FindingDetail finding={finding} />
        </ReportPage>
      ))}
    </div>
  );
}
