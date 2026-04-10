import { ReportTable } from "@/components/templates/template_001/components/ReportTable";
import type { ToolUsed } from "@/types";

interface ToolsUsedProps {
  toolsUsed: ToolUsed[];
}

export function ToolsUsed({ toolsUsed }: ToolsUsedProps) {
  if (toolsUsed.length === 0) {
    return <p className="t-muted">No tools or software have been added.</p>;
  }

  return (
    <ReportTable
      headers={[
        "S. No",
        "Name of Tool / Software Used",
        "Version of the Tool / Software Used",
        "Open Source / Licensed",
      ]}>
      {toolsUsed.map((tool, index) => (
        <tr key={`${tool.name}-${index}`}>
          <td>{index + 1}</td>
          <td>{tool.name}</td>
          <td>{tool.version}</td>
          <td>{tool.licenseType}</td>
        </tr>
      ))}
    </ReportTable>
  );
}
