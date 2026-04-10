import { ReportTable } from "@/components/templates/template_001/components/ReportTable";
import type { AuditTeamMember } from "@/types";

interface AuditingTeamProps {
  auditTeam: AuditTeamMember[];
}

export function AuditingTeam({ auditTeam }: AuditingTeamProps) {
  if (auditTeam.length === 0) {
    return <p className="t-muted">No audit team members have been added.</p>;
  }

  return (
    <ReportTable
      headers={[
        "S. No",
        "Name",
        "Designation",
        "Email ID",
        "Professional Qualifications / Certifications",
        "CERT-In Snapshot",
      ]}>
      {auditTeam.map((member, index) => (
        <tr key={`${member.email}-${index}`}>
          <td>{index + 1}</td>
          <td>{member.name}</td>
          <td>{member.designation}</td>
          <td>{member.email}</td>
          <td>{member.certifications}</td>
          <td>{member.listedInSnapshot ? "Yes" : "No"}</td>
        </tr>
      ))}
    </ReportTable>
  );
}
