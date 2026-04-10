const sections = [
  "Assessment Information",
  "About Cynox",
  "Document Control",
  "Details of the Auditing Team",
  "Tools / Software Used",
  "Engagement Overview",
  "Process and Methodology",
  "Scoping and Engagement Rules",
  "Executive Summary of Findings",
  "Assessment Risk Rating",
  "Vulnerability Overview",
  "Summary of Findings",
  "Summary of Findings vs OWASP and CWE",
  "Summary of Findings vs EPSS",
  "Findings Section",
  "Tactical and Strategic Recommendations",
  "Description of Severity Ratings",
  "Testing Methodology",
];

export function TableOfContents() {
  return (
    <ol className="t-toc">
      {sections.map((section, index) => (
        <li key={section}>
          <span>{section}</span>
          <span>{index + 1}</span>
        </li>
      ))}
    </ol>
  );
}
