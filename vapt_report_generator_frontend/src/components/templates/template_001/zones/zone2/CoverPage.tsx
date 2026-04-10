import type { ReportPreviewPayload } from "@/components/templates/types";

interface CoverPageProps {
  payload: ReportPreviewPayload;
}

export function CoverPage({ payload }: CoverPageProps) {
  const { project, data } = payload;
  const companyName = project.company?.name ?? "Client";
  const serviceName = project.service?.name ?? "Web Application Penetration Testing";
  const scope = project.company?.scope || "Scope not provided";

  return (
    <>
      <div>
        <h1 className="t-cover-title">
          {serviceName}
          <br />
          Report
        </h1>

        <dl className="t-cover-meta">
          <dt>Date</dt>
          <dd>{data.releaseDate || payload.version.updatedAt}</dd>
          <dt>Scope</dt>
          <dd>{scope}</dd>
          <dt>Test Type</dt>
          <dd>{data.testType}</dd>
        </dl>
      </div>

      <div className="t-confidentiality">
        Prepared by Cynox for {companyName}. All information contained in this
        document is proprietary to Cynox. The content, terms and details of this
        report are strictly confidential and intended only for internal use by{" "}
        {companyName}.
      </div>
    </>
  );
}
