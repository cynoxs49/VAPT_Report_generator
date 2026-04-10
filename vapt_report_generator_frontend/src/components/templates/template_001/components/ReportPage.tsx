import type { ReactNode } from "react";

interface ReportPageProps {
  children: ReactNode;
  className?: string;
}

export function ReportPage({ children, className = "" }: ReportPageProps) {
  return <section className={`t-page ${className}`}>{children}</section>;
}
