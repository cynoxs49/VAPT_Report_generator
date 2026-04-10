import { ReportTable } from "@/components/templates/template_001/components/ReportTable";
import type { ReportPreviewPayload } from "@/components/templates/types";

interface AssessmentInformationProps {
  payload: ReportPreviewPayload;
}

export function AssessmentInformation({
  payload,
}: AssessmentInformationProps) {
  const { project, data } = payload;

  return (
    <ReportTable headers={["Field", "Details"]}>
      <tr>
        <td>Engagement Timeframe</td>
        <td>{data.engagementTimeframe || "Not provided"}</td>
      </tr>
      <tr>
        <td>Organization Contact</td>
        <td>{data.organizationContact || "Not provided"}</td>
      </tr>
      <tr>
        <td>Test Limitation & Constraints</td>
        <td>{data.constraints || "Not provided"}</td>
      </tr>
      <tr>
        <td>Scope and Limitations</td>
        <td>{project.company?.scope || "Not provided"}</td>
      </tr>
      <tr>
        <td>Type of Audit Report</td>
        <td>{data.auditType}</td>
      </tr>
      <tr>
        <td>Test Type</td>
        <td>{data.testType}</td>
      </tr>
      <tr>
        <td>Version</td>
        <td>{payload.version.version}</td>
      </tr>
    </ReportTable>
  );
}
