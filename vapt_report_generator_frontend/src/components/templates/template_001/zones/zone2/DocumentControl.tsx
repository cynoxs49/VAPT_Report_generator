import { ReportTable } from "@/components/templates/template_001/components/ReportTable";
import type { ProjectVersion } from "@/types";

interface DocumentControlProps {
  data: ProjectVersion["data"];
  versionLabel: string;
}

export function DocumentControl({ data, versionLabel }: DocumentControlProps) {
  return (
    <ReportTable headers={["Field Name", "Details"]}>
      <tr>
        <td>Document Title</td>
        <td>Web Application Penetration Testing Report</td>
      </tr>
      <tr>
        <td>Document ID</td>
        <td>{data.documentId || "Not provided"}</td>
      </tr>
      <tr>
        <td>Document Version</td>
        <td>{versionLabel}</td>
      </tr>
      <tr>
        <td>Prepared By</td>
        <td>{data.preparedBy || "Not provided"}</td>
      </tr>
      <tr>
        <td>Reviewed By</td>
        <td>{data.reviewedBy || "Not provided"}</td>
      </tr>
      <tr>
        <td>Approved By</td>
        <td>{data.approvedBy || "Not provided"}</td>
      </tr>
      <tr>
        <td>Released By</td>
        <td>{data.releasedBy || "Not provided"}</td>
      </tr>
      <tr>
        <td>Release Date</td>
        <td>{data.releaseDate || "Not provided"}</td>
      </tr>
    </ReportTable>
  );
}
