import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { updateEngagement } from "@/api/project";
import { useAutoSave } from "@/hooks/useAutoSave";
import {
  SEVERITY_OPTIONS,
  CONFIDENTIALITY_OPTIONS,
  TEST_TYPE_OPTIONS,
  AUDIT_TYPE_OPTIONS,
} from "@/constants/enums";
import { FormField, inputClass } from "@/components/ui/FormField";
import { DynamicList } from "@/components/ui/DynamicList";
import { TiptapEditor } from "@/components/findings/TiptapEditor";

// ── Zod schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  engagementTimeframe: z.string(),
  organizationContact: z.string(),
  constraints: z.string(),
  testType: z.enum(["Black Box", "Grey Box", "White Box"]),
  auditType: z.enum(["Initial Audit Report", "Re-test Report"]),
  documentId: z.string(),
  preparedBy: z.string(),
  reviewedBy: z.string(),
  approvedBy: z.string(),
  releasedBy: z.string(),
  releaseDate: z.string(),
  executiveSummary: z.string(),
  strategicRecommendations: z.array(z.string()),
  overallRiskRating: z.enum(["Critical", "High", "Medium", "Low"]),
  confidentiality: z.enum([
    "Confidential",
    "Internal Use",
    "Restricted",
    "Public",
  ]),
});

type EngagementFormData = z.infer<typeof schema>;

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

// ── Custom select ─────────────────────────────────────────────────────────────
function NativeSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`${inputClass} appearance-none cursor-pointer`}>
      {options.map((o) => (
        <option key={o} value={o} className="bg-[var(--c-bg-2)]">
          {o}
        </option>
      ))}
    </select>
  );
}

const EngagementsPanel = () => {
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

  const engagementData = currentVersion?.data;

  const {
    register,
    control,
    watch,
    reset,
  } = useForm<EngagementFormData>({
    resolver: zodResolver(schema),
    defaultValues: engagementData
      ? {
          engagementTimeframe: engagementData.engagementTimeframe || "",
          organizationContact: engagementData.organizationContact || "",
          constraints: engagementData.constraints || "",
          testType: engagementData.testType || "Black Box",
          auditType: engagementData.auditType || "Initial Audit Report",
          documentId: engagementData.documentId || "",
          preparedBy: engagementData.preparedBy || "",
          reviewedBy: engagementData.reviewedBy || "",
          approvedBy: engagementData.approvedBy || "",
          releasedBy: engagementData.releasedBy || "",
          releaseDate: engagementData.releaseDate || "",
          executiveSummary: engagementData.executiveSummary || "",
          strategicRecommendations: engagementData.strategicRecommendations || [
            "",
          ],
          overallRiskRating: engagementData.overallRiskRating || "Medium",
          confidentiality: engagementData.confidentiality || "Confidential",
        }
      : undefined,
  });

  // Reset form when engagement data changes
  useEffect(() => {
    if (!engagementData) return;
    reset({
      engagementTimeframe: engagementData.engagementTimeframe || "",
      organizationContact: engagementData.organizationContact || "",
      constraints: engagementData.constraints || "",
      testType: engagementData.testType || "Black Box",
      auditType: engagementData.auditType || "Initial Audit Report",
      documentId: engagementData.documentId || "",
      preparedBy: engagementData.preparedBy || "",
      reviewedBy: engagementData.reviewedBy || "",
      approvedBy: engagementData.approvedBy || "",
      releasedBy: engagementData.releasedBy || "",
      releaseDate: engagementData.releaseDate || "",
      executiveSummary: engagementData.executiveSummary || "",
      strategicRecommendations: engagementData.strategicRecommendations || [""],
      overallRiskRating: engagementData.overallRiskRating || "Medium",
      confidentiality: engagementData.confidentiality || "Confidential",
    });
  }, [currentVersion?._id]);

  // Auto-save wired to watch
  const formValues = watch();
  const serializedFormValues = JSON.stringify(formValues);

  useEffect(() => {
    if (!engagementData || isLocked) return;
    updateVersionData(formValues);
  }, [serializedFormValues, isLocked]);

  useAutoSave({
    data: formValues,
    onSave: async (data) => {
      setSavingStatus("saving");
      try {
        // Fire the API PATCH
        const res = await updateEngagement(
          projectId,
          versionNumber,
          data as EngagementFormData,
        );
        if (res.success) {
          // Backend returned new versionNumber — store it
          if (res.data?.versionNumber) {
            setVersionNumber(res.data.versionNumber);
          } else {
            incrementVersionNumber();
          }
          setSavingStatus("saved");
          // Reset to idle after 2s
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

  if (!engagementData) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable form body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
        {/* ── Basic Information ── */}
        <Section title="Basic Information" />

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Document ID" required>
            <input
              {...register("documentId")}
              placeholder="e.g. 214"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Engagement Timeframe">
            <input
              {...register("engagementTimeframe")}
              placeholder="e.g. 14.03.2026 – 19.03.2026"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Test Type">
            <Controller
              name="testType"
              control={control}
              render={({ field }) => (
                <NativeSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={TEST_TYPE_OPTIONS}
                  disabled={isLocked}
                />
              )}
            />
          </FormField>

          <FormField label="Audit Type">
            <Controller
              name="auditType"
              control={control}
              render={({ field }) => (
                <NativeSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={AUDIT_TYPE_OPTIONS}
                  disabled={isLocked}
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Organization Contact">
          <input
            {...register("organizationContact")}
            placeholder="e.g. Mr. Gokul Vijayakumar"
            disabled={isLocked}
            className={inputClass}
          />
        </FormField>

        <FormField label="Constraints">
          <input
            {...register("constraints")}
            placeholder="e.g. No constraints were experienced..."
            disabled={isLocked}
            className={inputClass}
          />
        </FormField>

        {/* ── Signatories ── */}
        <Section title="Signatories" />

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Prepared By">
            <input
              {...register("preparedBy")}
              placeholder="Name"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Reviewed By">
            <input
              {...register("reviewedBy")}
              placeholder="Name"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Approved By">
            <input
              {...register("approvedBy")}
              placeholder="Name"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>

          <FormField label="Released By">
            <input
              {...register("releasedBy")}
              placeholder="Name"
              disabled={isLocked}
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Release Date">
          <input
            {...register("releaseDate")}
            type="date"
            disabled={isLocked}
            className={inputClass}
          />
        </FormField>

        {/* ── Report Classification ── */}
        <Section title="Report Classification" />

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Overall Risk Rating">
            <Controller
              name="overallRiskRating"
              control={control}
              render={({ field }) => (
                <NativeSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={SEVERITY_OPTIONS}
                  disabled={isLocked}
                />
              )}
            />
          </FormField>

          <FormField label="Confidentiality">
            <Controller
              name="confidentiality"
              control={control}
              render={({ field }) => (
                <NativeSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={CONFIDENTIALITY_OPTIONS}
                  disabled={isLocked}
                />
              )}
            />
          </FormField>
        </div>

        {/* ── Summary ── */}
        <Section title="Summary" />

        <FormField label="Executive Summary">
          <Controller
            name="executiveSummary"
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

        {/* ── Strategic Recommendations ── */}
        <Section title="Strategic Recommendations" />

        <Controller
          name="strategicRecommendations"
          control={control}
          render={({ field }) => (
            <DynamicList
              label="Strategic Recommendations"
              values={field.value}
              onChange={field.onChange}
              placeholder="Add a strategic recommendation…"
              disabled={isLocked}
            />
          )}
        />

        {/* Bottom padding */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default EngagementsPanel;
