import type { Finding } from "@/types";
import type { FindingFormData } from "@/types";
import { dummyFindings } from "@/lib/dummyData";

// POST /projects/:id/findings
// Backend assigns _id, displayId, and order automatically
export const addFinding = async (
  projectId: string,
  payload: Partial<FindingFormData>,
): Promise<{ success: true; data: Finding }> => {
  // const res = await apiClient.post(`/projects/${projectId}/findings`, payload);
  // return res.data.data;

  // TEMPORARY: Return dummy finding
  void projectId;
  const newFinding: Finding = {
    _id: `finding_${Date.now()}`,
    displayId: `WEB-${dummyFindings.length + 1}`,
    order: dummyFindings.length + 1,
    title: (payload as any).title || "New Finding",
    severity: (payload as any).severity || "Medium",
    cvssScore: (payload as any).cvssScore || 0,
    status: (payload as any).status || "Open",
    affectedScope: (payload as any).affectedScope || "",
    owaspMapping: (payload as any).owaspMapping || "",
    cweMapping: (payload as any).cweMapping || "",
    epssLikelihood: (payload as any).epssLikelihood || "",
    riskPriority: (payload as any).riskPriority || "",
    epssRemarks: (payload as any).epssRemarks || "",
    description: (payload as any).description || "",
    steps: (payload as any).steps || [],
    impact: (payload as any).impact || [],
    recommendation: (payload as any).recommendation || [],
    images: (payload as any).images || [],
    references: (payload as any).references || [],
  };
  return { success: true, data: newFinding };
};

// PATCH /projects/:id/findings/:findingId
// Partial update — only send changed fields
// versionNumber is required for conflict detection
export const updateFinding = async (
  projectId: string,
  findingId: string,
  versionNumber: number,
  changes: Partial<FindingFormData>,
): Promise<{ success: boolean; data?: { versionNumber: number } }> => {
  // const res = await apiClient.patch(
  //   `/projects/${projectId}/findings/${findingId}`,
  //   {
  //     versionNumber,
  //     data: changes,
  //   },
  // );
  // Backend returns updated versionNumber — store this in projectStore
  // return res.data.data;

  // TEMPORARY: Return incremented versionNumber
  void projectId;
  void findingId;
  void changes;
  return { success: true, data: { versionNumber: versionNumber + 1 } };
};

// DELETE /projects/:id/findings/:findingId
// displayIds of other findings are NOT renumbered after deletion
export const deleteFinding = async (
  projectId: string,
  findingId: string,
): Promise<{ success: true }> => {
  // await apiClient.delete(`/projects/${projectId}/findings/${findingId}`);
  // TEMPORARY: No-op, dummy data
  void projectId;
  void findingId;
  return { success: true };
};

// PATCH /projects/:id/findings/reorder
// Sends the full new order array after drag-to-reorder
export const reorderFindings = async (
  projectId: string,
  order: { id: string; order: number }[],
): Promise<void> => {
  // await apiClient.patch(`/projects/${projectId}/findings/reorder`, { order });
  // TEMPORARY: No-op, dummy data
  void projectId;
  void order;
};
