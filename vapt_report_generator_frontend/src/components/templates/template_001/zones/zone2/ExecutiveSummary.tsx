import { TemplateSeverityBadge } from "@/components/templates/template_001/components/TemplateSeverityBadge";
import type { ReportPreviewPayload } from "@/components/templates/types";

interface ExecutiveSummaryProps {
  payload: ReportPreviewPayload;
}

export function ExecutiveSummary({ payload }: ExecutiveSummaryProps) {
  const { project, data } = payload;
  const companyName = project.company?.name ?? "the client";

  return (
    <div className="t-prose">
      {data.executiveSummary ? (
        <p>{data.executiveSummary}</p>
      ) : (
        <p>
          Cynox conducted a penetration test for {companyName}. The assessment
          was performed to identify vulnerabilities, validate severity, and
          provide remediation guidance.
        </p>
      )}

      <p>
        The overall risk rating determined for this scope is{" "}
        <TemplateSeverityBadge severity={data.overallRiskRating} />.
      </p>

      <h3>Strategic Recommendations</h3>
      {data.strategicRecommendations.length > 0 ? (
        <ul className="t-list">
          {data.strategicRecommendations.map((item, index) => (
            <li key={`strategic-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="t-muted">No strategic recommendations have been added.</p>
      )}
    </div>
  );
}
