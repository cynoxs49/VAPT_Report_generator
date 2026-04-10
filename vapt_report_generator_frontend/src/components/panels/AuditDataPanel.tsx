import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { updateAuditData } from "@/api/project";
import { FormField, inputClass } from "@/components/ui/FormField";
import type {
  AuditTeamMember,
  ToolUsed,
  DistributionEntry,
  ChangeHistoryEntry,
} from "@/types";

// ── Zod schemas ───────────────────────────────────────────────────────────────
const auditTeamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  email: z.string().email("Valid email required"),
  certifications: z.string(),
  listedInSnapshot: z.boolean(),
});

const toolUsedSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  version: z.string().min(1, "Version is required"),
  licenseType: z.enum(["Open Source", "Licensed"]),
});

const distributionEntrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  organization: z.string().min(1, "Organization is required"),
  designation: z.string().min(1, "Designation is required"),
  email: z.string().email("Valid email required"),
});

// ── Section divider ───────────────────────────────────────────────────────────
function Section({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--c-text-muted)]">
        {title}
      </span>
      <div className="flex-1 h-px bg-[var(--c-border-soft)]" />
    </div>
  );
}

// ── Audit Team Modal ───────────────────────────────────────────────────────────
interface AuditTeamModalProps {
  isOpen: boolean;
  member: AuditTeamMember | null;
  onClose: () => void;
  onSave: (member: AuditTeamMember) => void;
  isLocked: boolean;
}

function AuditTeamModal({
  isOpen,
  member,
  onClose,
  onSave,
  isLocked,
}: AuditTeamModalProps) {
  const { register, handleSubmit, reset } = useForm<AuditTeamMember>({
    resolver: zodResolver(auditTeamSchema),
    defaultValues: member || {
      name: "",
      designation: "",
      email: "",
      certifications: "",
      listedInSnapshot: true,
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: AuditTeamMember) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--c-bg-2)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-6 w-[500px] shadow-2xl">
        <h3 className="text-sm font-semibold text-[var(--c-text-primary)] mb-4">
          {member ? "Edit Team Member" : "Add Team Member"}
        </h3>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4">
          <FormField label="Name" required>
            <input
              {...register("name")}
              placeholder="Full name"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Designation" required>
            <input
              {...register("designation")}
              placeholder="e.g. Security Lead"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Email" required>
            <input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Certifications">
            <input
              {...register("certifications")}
              placeholder="e.g. OSCP, CEH"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("listedInSnapshot")}
              disabled={isLocked}
              className="w-4 h-4"
            />
            <label className="text-xs text-[var(--c-text-secondary)]">
              Include in snapshot
            </label>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--c-text-secondary)] bg-transparent border border-[var(--c-border-soft)] rounded-[var(--radius-sm)] hover:border-[var(--c-border)]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLocked}
              className="px-4 py-2 text-xs font-bold text-[#051a14] bg-[var(--c-accent)] rounded-[var(--radius-sm)] hover:opacity-90 disabled:opacity-50">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Tool Used Modal ────────────────────────────────────────────────────────────
interface ToolUsedModalProps {
  isOpen: boolean;
  tool: ToolUsed | null;
  onClose: () => void;
  onSave: (tool: ToolUsed) => void;
  isLocked: boolean;
}

function ToolUsedModal({
  isOpen,
  tool,
  onClose,
  onSave,
  isLocked,
}: ToolUsedModalProps) {
  const { register, handleSubmit, reset } = useForm<ToolUsed>({
    resolver: zodResolver(toolUsedSchema),
    defaultValues: tool || {
      name: "",
      version: "",
      licenseType: "Open Source",
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: ToolUsed) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--c-bg-2)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-6 w-[450px] shadow-2xl">
        <h3 className="text-sm font-semibold text-[var(--c-text-primary)] mb-4">
          {tool ? "Edit Tool" : "Add Tool"}
        </h3>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4">
          <FormField label="Tool Name" required>
            <input
              {...register("name")}
              placeholder="e.g. Burp Suite"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Version" required>
            <input
              {...register("version")}
              placeholder="e.g. 2023.10.2"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="License Type" required>
            <select
              {...register("licenseType")}
              disabled={isLocked}
              className={`${inputClass} appearance-none cursor-pointer`}>
              <option value="Open Source">Open Source</option>
              <option value="Licensed">Licensed</option>
            </select>
          </FormField>

          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--c-text-secondary)] bg-transparent border border-[var(--c-border-soft)] rounded-[var(--radius-sm)] hover:border-[var(--c-border)]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLocked}
              className="px-4 py-2 text-xs font-bold text-[#051a14] bg-[var(--c-accent)] rounded-[var(--radius-sm)] hover:opacity-90 disabled:opacity-50">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Distribution Entry Modal ───────────────────────────────────────────────────
interface DistributionModalProps {
  isOpen: boolean;
  entry: DistributionEntry | null;
  onClose: () => void;
  onSave: (entry: DistributionEntry) => void;
  isLocked: boolean;
}

function DistributionModal({
  isOpen,
  entry,
  onClose,
  onSave,
  isLocked,
}: DistributionModalProps) {
  const { register, handleSubmit, reset } = useForm<DistributionEntry>({
    resolver: zodResolver(distributionEntrySchema),
    defaultValues: entry || {
      name: "",
      organization: "",
      designation: "",
      email: "",
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: DistributionEntry) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--c-bg-2)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-6 w-[500px] shadow-2xl">
        <h3 className="text-sm font-semibold text-[var(--c-text-primary)] mb-4">
          {entry ? "Edit Distribution Entry" : "Add Distribution Entry"}
        </h3>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4">
          <FormField label="Name" required>
            <input
              {...register("name")}
              placeholder="Full name"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Organization" required>
            <input
              {...register("organization")}
              placeholder="Organization name"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Designation" required>
            <input
              {...register("designation")}
              placeholder="e.g. IT Manager"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Email" required>
            <input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--c-text-secondary)] bg-transparent border border-[var(--c-border-soft)] rounded-[var(--radius-sm)] hover:border-[var(--c-border)]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLocked}
              className="px-4 py-2 text-xs font-bold text-[#051a14] bg-[var(--c-accent)] rounded-[var(--radius-sm)] hover:opacity-90 disabled:opacity-50">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── List Item Row ──────────────────────────────────────────────────────────────
interface ListItemProps {
  onEdit: () => void;
  onDelete: () => void;
  isLocked: boolean;
  children: React.ReactNode;
}

function ListItem({ onEdit, onDelete, isLocked, children }: ListItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--c-bg)] border border-[var(--c-border-soft)] rounded-[var(--radius-sm)] text-sm text-[var(--c-text-secondary)]">
      <div className="flex-1">{children}</div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          disabled={isLocked}
          className="text-[var(--c-accent)] hover:text-[var(--c-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed">
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={isLocked}
          className="text-[var(--c-critical)] hover:text-[var(--c-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed">
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const AuditDataPanel = () => {
  const {
    currentVersion,
    currentProject,
    versionNumber,
    setVersionNumber,
    updateVersionData,
  } = useProjectStore();
  const { setSavingStatus } = useUiStore();
  const projectId = currentProject?._id ?? "";
  const isLocked = currentVersion?.isLocked ?? false;

  const auditData = currentVersion?.data;

  // State for modals
  const [auditTeamModal, setAuditTeamModal] = useState<{
    isOpen: boolean;
    member: AuditTeamMember | null;
  }>({ isOpen: false, member: null });

  const [toolModal, setToolModal] = useState<{
    isOpen: boolean;
    tool: ToolUsed | null;
  }>({ isOpen: false, tool: null });

  const [distributionModal, setDistributionModal] = useState<{
    isOpen: boolean;
    entry: DistributionEntry | null;
  }>({ isOpen: false, entry: null });

  // State for data
  const [auditTeam, setAuditTeam] = useState<AuditTeamMember[]>(
    auditData?.auditTeam || [],
  );
  const [toolsUsed, setToolsUsed] = useState<ToolUsed[]>(
    auditData?.toolsUsed || [],
  );
  const [distributionList, setDistributionList] = useState<DistributionEntry[]>(
    auditData?.distributionList || [],
  );
  const [changeHistory] = useState<ChangeHistoryEntry[]>(
    auditData?.changeHistory || [],
  );

  useEffect(() => {
    if (!auditData) return;
    setAuditTeam(auditData.auditTeam || []);
    setToolsUsed(auditData.toolsUsed || []);
    setDistributionList(auditData.distributionList || []);
  }, [currentVersion?._id]);

  const handleSaveAuditTeam = (member: AuditTeamMember) => {
    const nextAuditTeam = auditTeamModal.member
      ? auditTeam.map((m) => (m === auditTeamModal.member ? member : m))
      : [...auditTeam, member];

    setAuditTeam(nextAuditTeam);
    saveData({
      auditTeam: nextAuditTeam,
      toolsUsed,
      distributionList,
    });
  };

  const handleDeleteAuditTeam = (member: AuditTeamMember) => {
    const nextAuditTeam = auditTeam.filter((m) => m !== member);
    setAuditTeam(nextAuditTeam);
    saveData({
      auditTeam: nextAuditTeam,
      toolsUsed,
      distributionList,
    });
  };

  const handleSaveTool = (tool: ToolUsed) => {
    const nextToolsUsed = toolModal.tool
      ? toolsUsed.map((t) => (t === toolModal.tool ? tool : t))
      : [...toolsUsed, tool];

    setToolsUsed(nextToolsUsed);
    saveData({
      auditTeam,
      toolsUsed: nextToolsUsed,
      distributionList,
    });
  };

  const handleDeleteTool = (tool: ToolUsed) => {
    const nextToolsUsed = toolsUsed.filter((t) => t !== tool);
    setToolsUsed(nextToolsUsed);
    saveData({
      auditTeam,
      toolsUsed: nextToolsUsed,
      distributionList,
    });
  };

  const handleSaveDistribution = (entry: DistributionEntry) => {
    const nextDistributionList = distributionModal.entry
      ? distributionList.map((e) =>
          e === distributionModal.entry ? entry : e,
        )
      : [...distributionList, entry];

    setDistributionList(nextDistributionList);
    saveData({
      auditTeam,
      toolsUsed,
      distributionList: nextDistributionList,
    });
  };

  const handleDeleteDistribution = (entry: DistributionEntry) => {
    const nextDistributionList = distributionList.filter((e) => e !== entry);
    setDistributionList(nextDistributionList);
    saveData({
      auditTeam,
      toolsUsed,
      distributionList: nextDistributionList,
    });
  };

  const saveData = async (nextData: {
    auditTeam: AuditTeamMember[];
    toolsUsed: ToolUsed[];
    distributionList: DistributionEntry[];
  }) => {
    updateVersionData(nextData);
    setSavingStatus("saving");
    try {
      const res = await updateAuditData(projectId, versionNumber, nextData);
      if (res.success) {
        if (res.data?.versionNumber) {
          setVersionNumber(res.data.versionNumber);
        }
        setSavingStatus("saved");
        setTimeout(() => setSavingStatus("idle"), 2000);
      } else {
        setSavingStatus("error");
      }
    } catch {
      setSavingStatus("error");
    }
  };

  if (!auditData) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
        {/* ── Audit Team ── */}
        <Section title="Audit Team" />

        <div className="flex flex-col gap-2">
          {auditTeam.map((member, idx) => (
            <ListItem
              key={idx}
              onEdit={() => setAuditTeamModal({ isOpen: true, member })}
              onDelete={() => handleDeleteAuditTeam(member)}
              isLocked={isLocked}>
              <div>
                <p className="font-medium text-[var(--c-text-primary)]">
                  {member.name}
                </p>
                <p className="text-xs text-[var(--c-text-muted)]">
                  {member.designation}
                </p>
              </div>
            </ListItem>
          ))}
          {!isLocked && (
            <button
              onClick={() => setAuditTeamModal({ isOpen: true, member: null })}
              className="self-start inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--c-accent)] hover:text-[var(--c-text-primary)] transition-colors duration-150 mt-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1v10M1 6h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Add Team Member
            </button>
          )}
        </div>

        {/* ── Tools Used ── */}
        <Section title="Tools Used" />

        <div className="flex flex-col gap-2">
          {toolsUsed.map((tool, idx) => (
            <ListItem
              key={idx}
              onEdit={() => setToolModal({ isOpen: true, tool })}
              onDelete={() => handleDeleteTool(tool)}
              isLocked={isLocked}>
              <div>
                <p className="font-medium text-[var(--c-text-primary)]">
                  {tool.name} v{tool.version}
                </p>
                <p className="text-xs text-[var(--c-text-muted)]">
                  {tool.licenseType}
                </p>
              </div>
            </ListItem>
          ))}
          {!isLocked && (
            <button
              onClick={() => setToolModal({ isOpen: true, tool: null })}
              className="self-start inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--c-accent)] hover:text-[var(--c-text-primary)] transition-colors duration-150 mt-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1v10M1 6h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Add Tool
            </button>
          )}
        </div>

        {/* ── Distribution List ── */}
        <Section title="Distribution List" />

        <div className="flex flex-col gap-2">
          {distributionList.map((entry, idx) => (
            <ListItem
              key={idx}
              onEdit={() => setDistributionModal({ isOpen: true, entry })}
              onDelete={() => handleDeleteDistribution(entry)}
              isLocked={isLocked}>
              <div>
                <p className="font-medium text-[var(--c-text-primary)]">
                  {entry.name}
                </p>
                <p className="text-xs text-[var(--c-text-muted)]">
                  {entry.organization} • {entry.designation}
                </p>
              </div>
            </ListItem>
          ))}
          {!isLocked && (
            <button
              onClick={() =>
                setDistributionModal({ isOpen: true, entry: null })
              }
              className="self-start inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--c-accent)] hover:text-[var(--c-text-primary)] transition-colors duration-150 mt-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1v10M1 6h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Add Entry
            </button>
          )}
        </div>

        {/* ── Change History (Read-only) ── */}
        <Section title="Change History" />

        <div className="flex flex-col gap-2">
          {changeHistory.length > 0 ? (
            changeHistory.map((entry, idx) => (
              <div
                key={idx}
                className="p-3 bg-[var(--c-bg)] border border-[var(--c-border-soft)] rounded-[var(--radius-sm)] text-xs">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-[var(--c-text-primary)]">
                    {entry.version}
                  </p>
                  <span className="text-[var(--c-text-muted)]">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[var(--c-text-muted)] mb-1">
                  By {entry.author}
                  {entry.designation && ` (${entry.designation})`}
                </p>
                <p className="text-[var(--c-text-secondary)]">
                  {entry.remarks}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[var(--c-text-muted)] italic">
              No changes yet
            </p>
          )}
        </div>

        {/* Bottom padding */}
        <div className="h-48" />
      </div>

      {/* Modals */}
      <AuditTeamModal
        isOpen={auditTeamModal.isOpen}
        member={auditTeamModal.member}
        onClose={() => setAuditTeamModal({ isOpen: false, member: null })}
        onSave={handleSaveAuditTeam}
        isLocked={isLocked}
      />

      <ToolUsedModal
        isOpen={toolModal.isOpen}
        tool={toolModal.tool}
        onClose={() => setToolModal({ isOpen: false, tool: null })}
        onSave={handleSaveTool}
        isLocked={isLocked}
      />

      <DistributionModal
        isOpen={distributionModal.isOpen}
        entry={distributionModal.entry}
        onClose={() => setDistributionModal({ isOpen: false, entry: null })}
        onSave={handleSaveDistribution}
        isLocked={isLocked}
      />
    </div>
  );
};

export default AuditDataPanel;
