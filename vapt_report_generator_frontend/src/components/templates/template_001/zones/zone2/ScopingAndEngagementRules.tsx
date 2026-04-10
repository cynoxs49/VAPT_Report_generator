import type { ReportPreviewPayload } from "@/components/templates/types";

interface ScopingAndEngagementRulesProps {
  payload: ReportPreviewPayload;
}

const testTypeDescriptions = {
  "Black Box":
    "Black box testing is performed with no prior knowledge of the application or infrastructure, simulating the behavior of an external attacker.",
  "Grey Box":
    "Grey box testing is conducted with partial knowledge of the application, user roles, documentation, or architecture.",
  "White Box":
    "White box testing is performed with deeper access to application and infrastructure details, allowing testers to evaluate logic and architecture more thoroughly.",
};

export function ScopingAndEngagementRules({
  payload,
}: ScopingAndEngagementRulesProps) {
  const { project, data } = payload;

  return (
    <div className="t-prose">
      <h3>Constraints</h3>
      <p>{data.constraints || "No constraints were provided."}</p>

      <h3>Scoping</h3>
      <p>{project.company?.scope || "Scope was not provided."}</p>
      <p>
        <strong>{data.testType} Method:</strong>{" "}
        {testTypeDescriptions[data.testType]}
      </p>

      <h3>Description</h3>
      <p>
        The scope includes the target applications and associated
        infrastructure agreed for this assessment. Testing was limited to the
        authorized scope and conducted according to the engagement rules.
      </p>
    </div>
  );
}
