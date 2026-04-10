import type { Severity } from "@/constants/enums";

interface TemplateSeverityBadgeProps {
  severity: Severity;
}

export function TemplateSeverityBadge({
  severity,
}: TemplateSeverityBadgeProps) {
  return (
    <span className={`t-severity t-severity-${severity.toLowerCase()}`}>
      {severity}
    </span>
  );
}
