import { SectionBlock } from "@/components/templates/template_001/components/SectionBlock";
import { TemplateSeverityBadge } from "@/components/templates/template_001/components/TemplateSeverityBadge";
import type { Finding } from "@/types";

interface FindingDetailProps {
  finding: Finding;
}

export function FindingDetail({ finding }: FindingDetailProps) {
  return (
    <>
      <div className="t-finding-header">
        <h2 className="t-finding-title">
          {finding.displayId} {finding.title}
        </h2>
        <TemplateSeverityBadge severity={finding.severity} />
      </div>

      <div className="t-field-grid">
        <div className="t-field-label">Severity</div>
        <div className="t-field-value">{finding.severity}</div>
        <div className="t-field-label">CVSS Score</div>
        <div className="t-field-value">{finding.cvssScore}</div>
        <div className="t-field-label">Status</div>
        <div className="t-field-value">{finding.status}</div>
        <div className="t-field-label">Affected Scope</div>
        <div className="t-field-value">{finding.affectedScope || "Not provided"}</div>
      </div>

      <SectionBlock title="Description">
        <div
          className="t-rich-text"
          dangerouslySetInnerHTML={{ __html: finding.description || "" }}
        />
      </SectionBlock>

      <SectionBlock title="Steps to Reproduce">
        <ol className="t-steps">
          {finding.steps.map((step, index) => (
            <li key={`${finding._id}-step-${index}`}>
              {step.text}
              {step.imageUrl && (
                <img
                  src={step.imageUrl}
                  alt={`Step ${index + 1} screenshot`}
                  className="t-step-image"
                />
              )}
            </li>
          ))}
        </ol>
      </SectionBlock>

      <SectionBlock title="Impact">
        <ul className="t-list">
          {finding.impact.map((item, index) => (
            <li key={`${finding._id}-impact-${index}`}>{item}</li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock title="Recommendation">
        <ul className="t-list">
          {finding.recommendation.map((item, index) => (
            <li key={`${finding._id}-recommendation-${index}`}>{item}</li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock title="References">
        <ul className="t-list">
          {finding.references.map((reference, index) => (
            <li key={`${finding._id}-reference-${index}`}>{reference}</li>
          ))}
        </ul>
      </SectionBlock>
    </>
  );
}
