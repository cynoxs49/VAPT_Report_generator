import type { ReportPreviewPayload } from "@/components/templates/types";

interface EngagementOverviewProps {
  payload: ReportPreviewPayload;
}

export function EngagementOverview({ payload }: EngagementOverviewProps) {
  const companyName = payload.project.company?.name ?? "the client";
  const serviceName =
    payload.project.service?.name ?? "Web Application Penetration Test";

  return (
    <div className="t-prose">
      <p>
        {companyName} has engaged with Cynox Security to conduct a{" "}
        {serviceName.toLowerCase()} of their application. This report contains
        the results of the assessment and the action items identified during the
        penetration test.
      </p>
      <h3>Service Description</h3>
      <p>
        Penetration testing simulates real-world attacks using the same
        techniques as malicious actors. Cynox approaches the scope with both
        manual testing and automated tooling to identify practical security
        risks.
      </p>
      <h3>{serviceName}</h3>
      <p>
        The purpose of this assessment is to identify weaknesses that could
        impact confidentiality, integrity, or availability, validate the
        severity of those risks, and provide recommendations to mitigate them.
      </p>
      <h3>Project Objectives</h3>
      <p>
        Cynox consultants combine expert manual testing with commercial and
        custom tools to provide broad coverage across the agreed scope.
      </p>
    </div>
  );
}
