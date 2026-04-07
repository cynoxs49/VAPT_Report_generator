import apiClient from "@/lib/axios";

// POST /upload/image
// Uploads an image file to S3 via backend
// Returns the permanent S3 URL stored in finding.images[]
// Uses multipart/form-data — different Content-Type from other calls
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiClient.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  // Backend returns: { success: true, data: { url: "https://s3.amazonaws.com/..." } }
  return res.data.data.url;
};
