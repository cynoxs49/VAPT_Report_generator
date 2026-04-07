import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useFindingsStore } from "@/stores/findingsStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { updateFinding } from "@/api/findings";
import { useAutoSave } from "@/hooks/useAutoSave";
import {
  SEVERITY_OPTIONS,
  STATUS_OPTIONS,
  CVSS_LABEL,
} from "@/constants/enums";
import { FormField, inputClass } from "@/components/ui/FormField";
import { DynamicList } from "@/components/ui/DynamicList";
import { TiptapEditor } from "@/components/findings/TiptapEditor";
import { StepRow } from "@/components/findings/StepRow";
import { SeverityBadge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import type { FindingFormData } from "@/types";

// ── Zod schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  severity: z.enum(["Critical", "High", "Medium", "Low"]),
  cvssScore: z.coerce.number().min(0).max(10),
  status: z.enum(["Open", "Closed"]),
  affectedScope: z.string(),
  owaspMapping: z.string(),
  cweMapping: z.string(),
  epssLikelihood: z.string(),
  riskPriority: z.string(),
  epssRemarks: z.string(),
  description: z.string(),
  steps: z.array(
    z.object({ text: z.string(), imageUrl: z.string().optional() }),
  ),
  impact: z.array(z.string()),
  recommendation: z.array(z.string()),
  references: z.array(z.string()),
  images: z.array(z.string()),
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

// ── Main editor ───────────────────────────────────────────────────────────────
interface FindingEditorProps {
  findingId: string;
  onBack: () => void;
  disabled?: boolean;
}

export function FindingEditor({
  findingId,
  onBack,
  disabled = false,
}: FindingEditorProps) {
  const { findings, updateFinding: updateStore } = useFindingsStore();
  const { currentProject, versionNumber } = useProjectStore();
  const { setSavingStatus } = useUiStore();

  const finding = findings.find((f) => f._id === findingId);
  const projectId = currentProject?._id ?? "";

  const {
    register,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FindingFormData>({
    resolver: zodResolver(schema),
    defaultValues: finding
      ? {
          title: finding.title,
          severity: finding.severity,
          cvssScore: finding.cvssScore,
          status: finding.status,
          affectedScope: finding.affectedScope,
          owaspMapping: finding.owaspMapping,
          cweMapping: finding.cweMapping,
          epssLikelihood: finding.epssLikelihood,
          riskPriority: finding.riskPriority,
          epssRemarks: finding.epssRemarks,
          description: finding.description,
          steps: finding.steps.length ? finding.steps : [{ text: "" }],
          impact: finding.impact.length ? finding.impact : [""],
          recommendation: finding.recommendation.length
            ? finding.recommendation
            : [""],
          references: finding.references.length ? finding.references : [""],
          images: finding.images,
        }
      : undefined,
  });

  // Reset form when active finding changes
  useEffect(() => {
    if (!finding) return;
    reset({
      title: finding.title,
      severity: finding.severity,
      cvssScore: finding.cvssScore,
      status: finding.status,
      affectedScope: finding.affectedScope,
      owaspMapping: finding.owaspMapping,
      cweMapping: finding.cweMapping,
      epssLikelihood: finding.epssLikelihood,
      riskPriority: finding.riskPriority,
      epssRemarks: finding.epssRemarks,
      description: finding.description,
      steps: finding.steps.length ? finding.steps : [{ text: "" }],
      impact: finding.impact.length ? finding.impact : [""],
      recommendation: finding.recommendation.length
        ? finding.recommendation
        : [""],
      references: finding.references.length ? finding.references : [""],
      images: finding.images,
    });
  }, [findingId]);

  // Auto-save wired to watch
  const formValues = watch();

  useAutoSave({
    data: formValues,
    onSave: async (data) => {
      setSavingStatus("saving");
      updateStore(findingId, data);
      try {
        const res = await updateFinding(
          projectId,
          findingId,
          versionNumber,
          data,
        );
        if (res.success) {
          setSavingStatus("saved");
        } else {
          setSavingStatus("error");
        }
      } catch {
        setSavingStatus("error");
      }
    },
    delay: 600,
    enabled: !disabled,
  });

  if (!finding) return null;

  const watchedSeverity = watch("severity");
  const watchedCvss = watch("cvssScore");

  return (
    <div className="flex flex-col h-full">
      {/* Editor top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--c-border-soft)] flex-shrink-0 bg-[var(--c-bg-2)]">
        <IconButton
          variant="ghost"
          size="sm"
          tooltip="Back to findings"
          onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 3L5 7L9 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>

        <div className="w-px h-4 bg-[var(--c-border-soft)]" />

        <span className="text-[11px] font-bold tracking-[0.06em] text-[var(--c-accent)] font-[var(--font-display)]">
          {finding.displayId}
        </span>

        <SeverityBadge
          severity={watchedSeverity ?? finding.severity}
          size="sm"
        />

        <span className="flex-1 text-sm font-medium text-[var(--c-text-secondary)] truncate">
          {watch("title") || "Untitled finding"}
        </span>

        {disabled && (
          <span className="text-[10px] font-semibold tracking-wide uppercase text-[var(--c-critical)] bg-[rgba(255,77,77,0.08)] border border-[rgba(255,77,77,0.2)] px-2 py-[2px] rounded-full">
            Read only
          </span>
        )}
      </div>

      {/* Scrollable form body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
        {/* ── Identity ── */}
        <Section title="Identity" />

        <FormField label="Title" required error={errors.title?.message}>
          <input
            {...register("title")}
            placeholder="e.g. SQL Injection in Login Endpoint"
            disabled={disabled}
            className={inputClass}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Severity" required>
            <Controller
              name="severity"
              control={control}
              render={({ field }) => (
                <NativeSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={SEVERITY_OPTIONS}
                  disabled={disabled}
                />
              )}
            />
          </FormField>

          <FormField
            label="CVSS Score"
            hint={watchedCvss ? CVSS_LABEL(Number(watchedCvss)) : undefined}>
            <input
              {...register("cvssScore")}
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0.0 – 10.0"
              disabled={disabled}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Status" required>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <NativeSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={STATUS_OPTIONS}
                  disabled={disabled}
                />
              )}
            />
          </FormField>

          <FormField label="Risk Priority">
            <input
              {...register("riskPriority")}
              placeholder="e.g. Immediate"
              disabled={disabled}
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Affected Scope">
          <input
            {...register("affectedScope")}
            placeholder="e.g. https://app.example.com/api/login"
            disabled={disabled}
            className={inputClass}
          />
        </FormField>

        {/* ── Classification ── */}
        <Section title="Classification" />

        <div className="grid grid-cols-2 gap-3">
          <FormField label="OWASP Mapping">
            <input
              {...register("owaspMapping")}
              placeholder="e.g. A03: Injection"
              disabled={disabled}
              className={inputClass}
            />
          </FormField>

          <FormField label="CWE Mapping">
            <input
              {...register("cweMapping")}
              placeholder="e.g. CWE-89"
              disabled={disabled}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="EPSS Likelihood">
            <input
              {...register("epssLikelihood")}
              placeholder="e.g. Very High (>80%)"
              disabled={disabled}
              className={inputClass}
            />
          </FormField>

          <FormField label="EPSS Remarks">
            <input
              {...register("epssRemarks")}
              placeholder="Brief remark…"
              disabled={disabled}
              className={inputClass}
            />
          </FormField>
        </div>

        {/* ── Description ── */}
        <Section title="Description" />

        <FormField label="Description" required>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TiptapEditor
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
              />
            )}
          />
        </FormField>

        {/* ── Steps to Reproduce ── */}
        <Section title="Steps to Reproduce" />

        <Controller
          name="steps"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {field.value.map((step, i) => (
                <StepRow
                  key={i}
                  step={step}
                  index={i}
                  disabled={disabled}
                  canRemove={field.value.length > 1}
                  onChange={(updated) => {
                    const next = [...field.value];
                    next[i] = updated;
                    field.onChange(next);
                  }}
                  onRemove={() => {
                    field.onChange(field.value.filter((_, idx) => idx !== i));
                  }}
                />
              ))}
              {!disabled && (
                <button
                  onClick={() => field.onChange([...field.value, { text: "" }])}
                  className="self-start inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--c-accent)] hover:text-[var(--c-text-primary)] transition-colors duration-150 mt-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1v10M1 6h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add step
                </button>
              )}
            </div>
          )}
        />

        {/* ── Impact ── */}
        <Section title="Impact" />

        <Controller
          name="impact"
          control={control}
          render={({ field }) => (
            <DynamicList
              label="Impact"
              values={field.value}
              onChange={field.onChange}
              placeholder="Describe an impact…"
              disabled={disabled}
            />
          )}
        />

        {/* ── Recommendation ── */}
        <Section title="Recommendation" />

        <Controller
          name="recommendation"
          control={control}
          render={({ field }) => (
            <DynamicList
              label="Recommendation"
              values={field.value}
              onChange={field.onChange}
              placeholder="Add a recommendation…"
              disabled={disabled}
            />
          )}
        />

        {/* ── References ── */}
        <Section title="References" />

        <Controller
          name="references"
          control={control}
          render={({ field }) => (
            <DynamicList
              label="References"
              values={field.value}
              onChange={field.onChange}
              placeholder="https://…"
              disabled={disabled}
            />
          )}
        />

        {/* Bottom padding so last field isn't hidden behind nothing */}
        <div className="h-6" />
      </div>
    </div>
  );
}
