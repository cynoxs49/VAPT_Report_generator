import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { updateMethodology } from "@/api/project";
import { useAutoSave } from "@/hooks/useAutoSave";
import { FormField, inputClass } from "@/components/ui/FormField";
import { DynamicList } from "@/components/ui/DynamicList";
import { TiptapEditor } from "@/components/findings/TiptapEditor";
import type { RetestRecord } from "@/types";

// ── Zod schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  description: z.string(),
  standards: z.array(z.string()),
  phases: z.array(z.string()),
});

type MethodologyFormData = z.infer<typeof schema>;

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

// ── Retest Modal ───────────────────────────────────────────────────────────────
interface RetestModalProps {
  isOpen: boolean;
  record: RetestRecord | null;
  onClose: () => void;
  onSave: (record: RetestRecord) => void;
  isLocked: boolean;
}

function RetestModal({
  isOpen,
  record,
  onClose,
  onSave,
  isLocked,
}: RetestModalProps) {
  const { register, handleSubmit, reset } = useForm<RetestRecord>({
    defaultValues: record || {
      findingId: "",
      retestDate: "",
      retestBy: "",
      result: "Unresolved",
      notes: "",
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: RetestRecord) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--c-bg-2)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] p-6 w-[500px] shadow-2xl">
        <h3 className="text-sm font-semibold text-[var(--c-text-primary)] mb-4">
          {record ? "Edit Retest Record" : "Add Retest Record"}
        </h3>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4">
          <FormField label="Finding ID" required>
            <input
              {...register("findingId")}
              placeholder="e.g. WEB-01"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Retest Date" required>
            <input
              {...register("retestDate")}
              type="date"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Retest By" required>
            <input
              {...register("retestBy")}
              placeholder="Tester name"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Result" required>
            <select
              {...register("result")}
              disabled={isLocked}
              className={`${inputClass} appearance-none cursor-pointer`}>
              <option value="Resolved">Resolved</option>
              <option value="Partially Resolved">Partially Resolved</option>
              <option value="Unresolved">Unresolved</option>
            </select>
          </FormField>

          <FormField label="Notes">
            <textarea
              {...register("notes")}
              placeholder="Additional notes…"
              disabled={isLocked}
              rows={3}
              className={`${inputClass} resize-none`}
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

// ── Retest Record Item ─────────────────────────────────────────────────────────
interface RetestItemProps {
  record: RetestRecord;
  onEdit: () => void;
  onDelete: () => void;
  isLocked: boolean;
}

function RetestItem({ record, onEdit, onDelete, isLocked }: RetestItemProps) {
  const resultColor = {
    Resolved: "text-[var(--c-accent)]",
    "Partially Resolved": "text-[var(--c-border)]",
    Unresolved: "text-[var(--c-critical)]",
  }[record.result];

  return (
    <div className="p-3 bg-[var(--c-bg)] border border-[var(--c-border-soft)] rounded-[var(--radius-sm)]">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-[var(--c-text-primary)]">
          {record.findingId}
        </p>
        <span className={`text-xs font-semibold ${resultColor}`}>
          {record.result}
        </span>
      </div>
      <p className="text-xs text-[var(--c-text-muted)] mb-2">
        By {record.retestBy} on{" "}
        {new Date(record.retestDate).toLocaleDateString()}
      </p>
      {record.notes && (
        <p className="text-xs text-[var(--c-text-secondary)] mb-2">
          {record.notes}
        </p>
      )}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          disabled={isLocked}
          className="text-[11px] text-[var(--c-accent)] hover:text-[var(--c-text-primary)] disabled:opacity-50">
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={isLocked}
          className="text-[11px] text-[var(--c-critical)] hover:text-[var(--c-text-primary)] disabled:opacity-50">
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const MethodologyPanel = () => {
  const {
    currentVersion,
    currentProject,
    versionNumber,
    incrementVersionNumber,
    setVersionNumber,
    updateVersionData,
  } = useProjectStore();
  const { setSavingStatus } = useUiStore();
  const projectId = currentProject?._id ?? "";
  const isLocked = currentVersion?.isLocked ?? false;
  const isRetestReport = currentVersion?.data.auditType === "Re-test Report";

  const methodologyData = currentVersion?.data.methodology ?? {
    description: "",
    standards: [""],
    phases: [""],
  };
  const retestRecords = currentVersion?.data.retestRecords || [];

  const {
    control,
    watch,
    reset,
  } = useForm<MethodologyFormData>({
    resolver: zodResolver(schema),
    defaultValues: methodologyData
      ? {
          description: methodologyData.description || "",
          standards: methodologyData.standards || [""],
          phases: methodologyData.phases || [""],
        }
      : undefined,
  });

  // State for retest modal
  const [retestModal, setRetestModal] = useState<{
    isOpen: boolean;
    record: RetestRecord | null;
  }>({ isOpen: false, record: null });

  // State for retest records
  const [retests, setRetests] = useState<RetestRecord[]>(retestRecords);

  // Reset form when methodology data changes
  useEffect(() => {
    if (!methodologyData) return;
    reset({
      description: methodologyData.description || "",
      standards: methodologyData.standards.length
        ? methodologyData.standards
        : [""],
      phases: methodologyData.phases.length ? methodologyData.phases : [""],
    });
  }, [currentVersion?._id]);

  // Auto-save for methodology
  const formValues = watch();
  const serializedFormValues = JSON.stringify(formValues);

  useEffect(() => {
    if (isLocked) return;
    updateVersionData({
      methodology: formValues as typeof methodologyData,
    });
  }, [serializedFormValues, isLocked]);

  useAutoSave({
    data: formValues,
    onSave: async (data) => {
      setSavingStatus("saving");
      try {
        const res = await updateMethodology(
          projectId,
          versionNumber,
          data as MethodologyFormData,
        );
        if (res.success) {
          if (res.data?.versionNumber) {
            setVersionNumber(res.data.versionNumber);
          } else {
            incrementVersionNumber();
          }
          setSavingStatus("saved");
          setTimeout(() => setSavingStatus("idle"), 2000);
        } else {
          setSavingStatus("error");
        }
      } catch {
        setSavingStatus("error");
      }
    },
    delay: 600,
    enabled: !isLocked,
  });

  const handleSaveRetest = async (record: RetestRecord) => {
    const nextRetests = retestModal.record
      ? retests.map((r) => (r === retestModal.record ? record : r))
      : [...retests, record];

    setRetests(nextRetests);
    updateVersionData({ retestRecords: nextRetests });
    // You'd also want to save this to backend
  };

  const handleDeleteRetest = (record: RetestRecord) => {
    const nextRetests = retests.filter((r) => r !== record);
    setRetests(nextRetests);
    updateVersionData({ retestRecords: nextRetests });
    // You'd also want to delete from backend
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
        {/* ── Methodology ── */}
        <Section title="Methodology" />

        <FormField label="Description" required>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TiptapEditor
                value={field.value}
                onChange={field.onChange}
                disabled={isLocked}
              />
            )}
          />
        </FormField>

        {/* ── Standards ── */}
        <Section title="Standards" />

        <Controller
          name="standards"
          control={control}
          render={({ field }) => (
            <DynamicList
              label="Standards"
              values={field.value}
              onChange={field.onChange}
              placeholder="e.g. OWASP Top 10, NIST"
              disabled={isLocked}
            />
          )}
        />

        {/* ── Phases ── */}
        <Section title="Testing Phases" />

        <Controller
          name="phases"
          control={control}
          render={({ field }) => (
            <DynamicList
              label="Phases"
              values={field.value}
              onChange={field.onChange}
              placeholder="e.g. Information Gathering"
              disabled={isLocked}
            />
          )}
        />

        {/* ── Retest Records (Conditional) ── */}
        {isRetestReport && (
          <>
            <Section title="Retest Records" />

            <div className="flex flex-col gap-2">
              {retests.length > 0 ? (
                retests.map((record, idx) => (
                  <RetestItem
                    key={idx}
                    record={record}
                    onEdit={() => setRetestModal({ isOpen: true, record })}
                    onDelete={() => handleDeleteRetest(record)}
                    isLocked={isLocked}
                  />
                ))
              ) : (
                <p className="text-xs text-[var(--c-text-muted)] italic">
                  No retest records yet
                </p>
              )}

              {!isLocked && (
                <button
                  onClick={() => setRetestModal({ isOpen: true, record: null })}
                  className="self-start inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--c-accent)] hover:text-[var(--c-text-primary)] transition-colors duration-150 mt-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1v10M1 6h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add Retest Record
                </button>
              )}
            </div>
          </>
        )}

        {/* Bottom padding */}
        <div className="h-48" />
      </div>

      {/* Retest Modal */}
      <RetestModal
        isOpen={retestModal.isOpen}
        record={retestModal.record}
        onClose={() => setRetestModal({ isOpen: false, record: null })}
        onSave={handleSaveRetest}
        isLocked={isLocked}
      />
    </div>
  );
};

export default MethodologyPanel;
