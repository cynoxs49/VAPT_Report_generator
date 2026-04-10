import { useState } from "react";
import { useFindingsStore } from "@/stores/findingsStore";
import { FindingsList } from "@/components/findings/FindingsList";
import { FindingEditor } from "@/components/findings/FindingEditor";

interface FindingsPanelProps {
  isLocked: boolean;
}

export default function FindingsPanel({ isLocked }: FindingsPanelProps) {
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);
  const { findings } = useFindingsStore();

  const handleSelectFinding = (id: string) => setActiveFindingId(id);
  const handleBack = () => setActiveFindingId(null);

  // If active finding was deleted, fall back to list
  const activeExists = findings.some((f) => f._id === activeFindingId);
  const resolvedActiveId = activeExists ? activeFindingId : null;

  if (resolvedActiveId) {
    return (
      <FindingEditor
        findingId={resolvedActiveId}
        onBack={handleBack}
        disabled={isLocked}
      />
    );
  }

  return (
    <FindingsList
      onSelectFinding={handleSelectFinding}
      activeFindingId={resolvedActiveId}
      disabled={isLocked}
    />
  );
}
