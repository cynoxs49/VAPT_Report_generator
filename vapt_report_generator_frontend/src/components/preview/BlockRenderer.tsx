
import type { TemplateBlock, ProjectVersion } from "@/types";

interface Props {
  block: TemplateBlock;
  versionData: ProjectVersion["data"];
}

export default function BlockRenderer({ block, versionData }: Props) {
  switch (block.type) {
    case "derived_table":
      // return <FindingsSummaryTable findings={versionData.findings} />
      void versionData;
      return null;

    case "repeatable_detail":
      // return versionData.findings.map((finding) => (
      //   <FindingDetailBlock key={finding._id} finding={finding} />
      // ));
      return null;

    case "rich_text":
      // return <RichTextBlock source={block.source} versionData={versionData} />
      return null;

    case "image":
      // return <ImageBlock config={block.config} />
      return null;

    case "vulnerability_list":
      // return <VulnerabilityListBlock findings={versionData.findings} />
      return null;

    default:
      return null;
  }
}
