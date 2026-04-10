import type { ReactNode } from "react";

interface ReportTableProps {
  headers: string[];
  children: ReactNode;
}

export function ReportTable({ headers, children }: ReportTableProps) {
  return (
    <table className="t-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
