import apiClient from "@/lib/axios";

// POST /projects/:id/generate
// Triggers PDF generation on the backend:
// 1. Fetches ProjectVersion
// 2. Injects into HTML template
// 3. Converts to PDF via Puppeteer
// 4. Uploads to S3
// This can take a few seconds — show a loading state in the UI
export const generatePdf = async (projectId: string): Promise<void> => {
  await apiClient.post(`/projects/${projectId}/generate`);
};

// GET /projects/:id/download
// Returns a signed S3 URL for the generated PDF
// URL is temporary (S3 presigned URLs expire) — open immediately on receive
export const downloadPdf = async (projectId: string): Promise<string> => {
  const res = await apiClient.get(`/projects/${projectId}/download`);
  // Backend returns: { success: true, data: { url: "https://s3.amazonaws.com/..." } }
  return res.data.data.url;
};
