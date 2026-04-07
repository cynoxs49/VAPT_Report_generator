
import type { TemplateBlock, ProjectVersion, Finding } from '@/types'

interface Props {
  block: TemplateBlock
  versionData: ProjectVersion['data']
}

export default function BlockRenderer({ block, versionData }: Props) {
  switch (block.type) {
    case 'derived_table':
      // return <FindingsSummaryTable findings={versionData.findings} />

    case 'repeatable_detail':
      return (
        <>
          {versionData.findings.map(finding  => (
            // <FindingDetailBlock key={finding._id} finding={finding} />
          ))}
        </>
      )

    case 'rich_text':
      // return <RichTextBlock source={block.source} versionData={versionData} />

    case 'image':
      // return <ImageBlock config={block.config} />

    case 'vulnerability_list':
      // return <VulnerabilityListBlock findings={versionData.findings} />

    default:
      return null
  }
}