import { useProjectStore } from "@/stores/projectStore";

export default function PreviewRenderer() {
  const currentVersion = useProjectStore((s) => s.currentVersion);
  const currentProject = useProjectStore((s) => s.currentProject);

  return (
    <div className="report-root">
      {/* ── Fixed Pages ── */}
      {/* <CoverPage project={currentProject} /> */}
      {/* <TableOfContents template={dummyTemplate} /> */}
      {/* <ScopeAndMethodology company={currentProject.company} /> */}

      {/* ── Dynamic Template Sections ── */}
      {/* {dummyTemplate.sections.map((section) => (
        <ReportSection key={section.sectionId} title={section.title}>
          {section.blocks.map((block) => (
            <BlockRenderer
              key={block.blockId}
              block={block}
              versionData={currentVersion.data}
            />
          ))}
        </ReportSection>
      ))} */}
    </div>
  );
}
