import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createProject } from "@/api/project";
import { dummyCompanies, dummyServices } from "@/lib/dummyData";
import { inputClass } from "@/components/ui/FormField";

interface CreateProjectModalProps {
  onClose: () => void;
}

export function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => createProject({ companyId, serviceId }),
    onSuccess: (project) => {
      navigate(`/projects/${project._id}`);
    },
    onError: () => {
      setError("Failed to create project. Please try again.");
    },
  });

  const handleSubmit = () => {
    setError(null);
    if (!companyId) {
      setError("Please select a company.");
      return;
    }
    if (!serviceId) {
      setError("Please select a service.");
      return;
    }
    mutation.mutate();
  };

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdrop}>
      <div className="bg-[var(--c-bg-2)] border border-[var(--c-border-soft)] rounded-[var(--radius-lg)] w-[440px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--c-border-soft)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--c-accent-dim)] border border-[var(--c-border)] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1.5L1.5 4.5V7.5C1.5 10.3 4 12.8 7 13.5C10 12.8 12.5 10.3 12.5 7.5V4.5L7 1.5Z"
                  stroke="var(--c-accent)"
                  strokeWidth="1.3"
                  fill="none"
                />
                <path
                  d="M4.5 7L6 8.5L9.5 5"
                  stroke="var(--c-accent)"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--c-text-primary)]">
                New Report
              </h2>
              <p className="text-[11px] text-[var(--c-text-muted)]">
                Select a company and service to begin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--c-text-muted)] hover:text-[var(--c-text-primary)] hover:bg-[var(--c-surface)] transition-all duration-150">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Company select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-[0.07em] uppercase text-[var(--c-text-secondary)]">
              Company <span className="text-[var(--c-critical)]">*</span>
            </label>
            <select
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value);
                setError(null);
              }}
              className={`${inputClass} appearance-none cursor-pointer`}>
              <option value="" className="bg-[var(--c-bg-2)]">
                Select a company…
              </option>
              {dummyCompanies.map((c) => (
                <option
                  key={c._id}
                  value={c._id}
                  className="bg-[var(--c-bg-2)]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-[0.07em] uppercase text-[var(--c-text-secondary)]">
              Service Type <span className="text-[var(--c-critical)]">*</span>
            </label>
            <select
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setError(null);
              }}
              className={`${inputClass} appearance-none cursor-pointer`}>
              <option value="" className="bg-[var(--c-bg-2)]">
                Select a service…
              </option>
              {dummyServices.map((s) => (
                <option
                  key={s._id}
                  value={s._id}
                  className="bg-[var(--c-bg-2)]">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preview of selection */}
          {companyId && serviceId && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--c-accent-dim)] border border-[var(--c-border)]">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2 6.5l3 3 6-6"
                  stroke="var(--c-accent)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs text-[var(--c-accent)]">
                {dummyCompanies.find((c) => c._id === companyId)?.name}
                {" · "}
                {dummyServices.find((s) => s._id === serviceId)?.name}
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-[11px] text-[var(--c-critical)] flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <circle
                  cx="5.5"
                  cy="5.5"
                  r="4.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  fill="none"
                />
                <path
                  d="M5.5 3.5v2.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <circle cx="5.5" cy="7.5" r="0.6" fill="currentColor" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--c-border-soft)] bg-[var(--c-bg-3)]">
          <p className="text-[11px] text-[var(--c-text-muted)]">
            Backend will assign the report template automatically
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 text-xs font-semibold text-[var(--c-text-secondary)] bg-transparent border border-[var(--c-border-soft)] rounded-[var(--radius-sm)] hover:border-[var(--c-border)] hover:text-[var(--c-text-primary)] transition-all duration-150 disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending || !companyId || !serviceId}
              className="px-4 py-2 text-xs font-bold text-[#051a14] bg-[var(--c-accent)] rounded-[var(--radius-sm)] hover:opacity-90 transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed">
              {mutation.isPending ? (
                <span className="flex items-center gap-1.5">
                  <svg
                    className="animate-spin"
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none">
                    <circle
                      cx="5.5"
                      cy="5.5"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="6 6"
                    />
                  </svg>
                  Creating…
                </span>
              ) : (
                "Create Report"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
