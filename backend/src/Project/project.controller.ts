import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

/**
 * GET /projects/:id
 */
export const getProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: id as string },
      include: {
        company: true, // Includes name and logoUrl
        service: true, // Includes service name
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Fetch the current version data
    const currentVersion = await prisma.projectVersion.findUnique({
      where: { id: project.currentVersion as string },
      include: {
        template: true, // To get sections and block config
      },
    });

    return res.status(200).json({
      ...project,
      currentVersionData: currentVersion,
    });
  } catch (error) {
    console.error("Get Project Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PATCH /projects/:id/findings/reorder
 * Implementation of Flow 5 [cite: 170-185]
 */
export const reorderFindings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order } = req.body; // Array of { id: string, order: number } [cite: 173]

    const result = await prisma.$transaction(async (tx) => {
      // 1. Get current version
      const project = await tx.project.findUnique({
        where: { id: id as string },
        select: { currentVersion: true },
      });

      if (!project?.currentVersion)
        throw new Error("Project version not found");

      const currentVersion = await tx.projectVersion.findUnique({
        where: { id: project.currentVersion },
      });

      if (!currentVersion || currentVersion.isLocked) {
        throw new Error(
          "Cannot reorder findings in a locked version [cite: 195]",
        );
      }

      // 2. Map through existing findings and update their order based on input
      const findings = (currentVersion.data as any).findings || [];

      const updatedFindings = findings.map((finding: any) => {
        const newOrderObj = order.find((o: any) => o.id === finding.id);
        return newOrderObj ? { ...finding, order: newOrderObj.order } : finding;
      });

      // 3. Sort by the new order to maintain array integrity
      updatedFindings.sort((a: any, b: any) => a.order - b.order);

      // 4. Update the version
      return tx.projectVersion.update({
        where: { id: currentVersion.id },
        data: {
          versionNumber: { increment: 1 },
          data: {
            ...(currentVersion.data as object),
            findings: updatedFindings,
          },
        },
      });
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Reorder Error:", error);
    return res.status(400).json({ error: error.message });
  }
};

/**
 * POST /projects
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const { companyId, serviceId, createdBy } = req.body;
    const userId = (req as any).user?.id || createdBy; // Assumes auth middleware

    // 1. Fetch active template for the service
    const activeTemplate = await prisma.template.findFirst({
      where: {
        serviceId,
        isActive: true,
      },
    });

    if (!activeTemplate) {
      return res.status(404).json({
        message:
          "No active template found for this service. Cannot create project.",
      });
    }

    // 2. Execute transaction to ensure Project and v1 Version are linked
    const result = await prisma.$transaction(async (tx) => {
      // Create the Project
      const project = await tx.project.create({
        data: {
          companyId,
          serviceId,
          createdBy: userId,
          status: "draft",
        },
      });

      // Create ProjectVersion (v1)
      const version = await tx.projectVersion.create({
        data: {
          projectId: project.id,
          templateId: activeTemplate.id,
          versionNumber: 1, // For conflict control
          lastUpdatedBy: userId,
          isLocked: false,
          data: {
            findings: [], // Initialize empty findings array
          },
        },
      });

      // Update project with the current version ID
      return tx.project.update({
        where: { id: project.id },
        data: { currentVersion: version.id },
        include: { versions: true },
      });
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Project Creation Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error during project creation." });
  }
};

/**
 * POST /projects/:id/findings
 */
export const addFinding = async (req: Request, res: Response) => {
  const { id } = req.params; // Project ID
  const findingData = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch current project version [cite: 81, 145]
      const project = await tx.project.findUnique({
        where: { id: id as string },
        select: { currentVersion: true },
      });

      if (!project || !project.currentVersion) {
        throw new Error("Project or active version not found.");
      }

      const currentVersion = await tx.projectVersion.findUnique({
        where: { id: project.currentVersion },
      });

      if (!currentVersion || currentVersion.isLocked) {
        throw new Error("Cannot add findings to a locked or missing version.");
      }

      // 2. Calculate next displayId (X-01 format) and order [cite: 156, 157]
      const findings = (currentVersion.data as any).findings || [];
      const nextIndex = findings.length + 1;
      const displayId = `X-${nextIndex.toString().padStart(2, "0")}`;

      // 3. Construct the new finding object [cite: 99-113]
      const newFinding = {
        id: uuidv4(),
        displayId,
        order: nextIndex,
        title: findingData.title || "New Finding",
        severity: findingData.severity || "Low",
        status: "Open",
        description: findingData.description || "",
        cvssScore: findingData.cvssScore || 0,
        steps: findingData.steps || [],
        impact: findingData.impact || [],
        recommendation: findingData.recommendation || "",
        images: findingData.images || [],
        references: findingData.references || [],
      };

      // 4. Update the ProjectVersion with the new finding [cite: 11, 153]
      return tx.projectVersion.update({
        where: { id: currentVersion.id },
        data: {
          versionNumber: { increment: 1 },
          data: {
            ...(currentVersion.data as object),
            findings: [...findings, newFinding],
          },
        },
      });
    });

    return res.status(201).json(result);
  } catch (error: any) {
    console.error("Add Finding Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to add finding." });
  }
};
