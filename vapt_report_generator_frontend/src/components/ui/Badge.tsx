import { SEVERITY_COLOR, STATUS_COLOR } from "@/constants/enums";
import type { Severity, FindingStatus } from "@/constants/enums";

interface SeverityBadgeProps {
  severity: Severity;
  size?: "sm" | "md";
}

interface StatusBadgeProps {
  status: FindingStatus;
  size?: "sm" | "md";
}

const sizeClass = {
  sm: "text-[10px] px-2 py-[2px]",
  md: "text-[11px] px-2.5 py-[3px]",
};

export function SeverityBadge({ severity, size = "md" }: SeverityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold tracking-[0.05em] uppercase rounded-full border ${sizeClass[size]} ${SEVERITY_COLOR[severity]}`}>
      {severity}
    </span>
  );
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold tracking-[0.05em] uppercase rounded-full ${sizeClass[size]} ${STATUS_COLOR[status]}`}>
      {status}
    </span>
  );
}
