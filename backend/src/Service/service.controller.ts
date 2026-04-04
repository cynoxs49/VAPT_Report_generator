import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /services
 * Lists all available services.
 */
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      include: { _count: { select: { projects: true } } }, // Helpful for the UI
      orderBy: { name: "asc" },
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

/**
 * POST /services
 * Creates a new service category or returns the existing one if the name matches.
 */
export const createService = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const service = await prisma.service.upsert({
      where: { name },
      update: {}, // If it exists, we change nothing
      create: { name },
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: "Could not create/verify service" });
  }
};

/**
 * PATCH /services/:id
 * Updates service naming or description.
 * Ensures the name remains unique across the collection.
 */
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Optional: Basic validation to ensure name isn't empty if provided
    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({ error: "Service name cannot be empty." });
    }

    const updatedService = await prisma.service.update({
      where: { id: id as string },
      data: {
        ...(name && { name }), // Only update name if it exists in req.body
      },
    });

    return res.status(200).json(updatedService);
  } catch (error: any) {
    // Handle Prisma unique constraint violation (P2002)
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A service with this name already exists." });
    }

    // Handle record not found (P2025)
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Service not found." });
    }

    console.error("Update Service Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * GET /services/:id/templates
 * Retrieves versioned templates for a specific service.
 */
export const getServiceTemplates = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const templates = await prisma.template.findMany({
      where: { serviceId: id as string },
      orderBy: { version: "desc" },
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};
