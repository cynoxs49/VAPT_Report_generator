import { ReportTable } from "@/components/templates/template_001/components/ReportTable";
import { TemplateSeverityBadge } from "@/components/templates/template_001/components/TemplateSeverityBadge";
import type { Finding } from "@/types";

interface SummaryOfFindingsProps {
  findings: Finding[];
}

export function SummaryOfFindings({ findings }: SummaryOfFindingsProps) {
  const orderedFindings = [...findings].sort((a, b) => a.order - b.order);

  return (
    <ReportTable headers={["ID", "Finding Name", "Risk", "Status"]}>
      {orderedFindings.map((finding) => (
        <tr key={finding._id}>
          <td>{finding.displayId}</td>
          <td>{finding.title}</td>
          <td>
            <TemplateSeverityBadge severity={finding.severity} />
          </td>
          <td>{finding.status}</td>
        </tr>
      ))}
    </ReportTable>
  );
}
