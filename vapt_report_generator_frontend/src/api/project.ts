import apiClient from "@/lib/axios";
import { dummyProjects, dummyProjectVersion } from "@/lib/dummyData";
import type { Project, ProjectVersion } from "@/types";

// GET /projects/:id
// Fetches a project and its current version data
export const getProject = async (id: string): Promise<Project> => {
  // TODO: replace with real call when backend is ready
  // const res = await apiClient.get(`/projects/${id}`)
  // return res.data.data
  return dummyProjects.find((p) => p._id === id) ?? dummyProjects[0];
};

// GET /projects
// Fetches all projects for the dashboard list
export const getAllProjects = async (): Promise<Project[]> => {
  // TODO: replace with real call when backend is ready
  // const res = await apiClient.get('/projects')
  // return res.data.data
  return dummyProjects;
};

// GET /projects/:id/version (current version with findings)
// Separate call because version data is heavy — only fetched when project is opened
export const getProjectVersion = async (
  projectId: string,
): Promise<ProjectVersion> => {
  // TODO: replace with real call when backend is ready
  // const res = await apiClient.get(`/projects/${projectId}/version/current`)
  // return res.data.data
  void projectId; // suppress unused warning until real call is added
  return dummyProjectVersion;
};

// POST /projects
// Creates a new project — backend auto-assigns template based on serviceId
export const createProject = async (payload: {
  companyId: string;
  serviceId: string;
}): Promise<Project> => {
  void payload;
  return dummyProjects[0];
};

// POST /projects/:id/publish
// Locks the current version — no further edits allowed after this
export const publishProject = async (projectId: string): Promise<void> => {
  await apiClient.post(`/projects/${projectId}/publish`);
};

// POST /projects/:id/version
// Clones the latest locked version into a new editable version
export const createNewVersion = async (
  projectId: string,
): Promise<ProjectVersion> => {
  const res = await apiClient.post(`/projects/${projectId}/version`);
  return res.data.data;
};
