import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /companies
 * Creates a new company or updates existing data if the name matches.
 */
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, email, scope, contactInfo, logoUrl } = req.body;

    const company = await prisma.company.upsert({
      where: { name },
      update: { email, scope, contactInfo, logoUrl },
      create: { name, email, scope, contactInfo, logoUrl },
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: "Failed to process company data." });
  }
};

/**
 * GET /companies
 */
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      include: { _count: { select: { projects: true } } }, // Count linked projects
      orderBy: { name: "asc" },
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch companies." });
  }
};

/**
 * GET /companies/:id
 */
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: { id: id as string },
      include: { projects: true }, // See all projects for this client
    });

    if (!company) return res.status(404).json({ error: "Company not found." });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * PATCH /companies/:id
 */
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedCompany = await prisma.company.update({
      where: { id: id as string },
      data: data,
    });

    res.json(updatedCompany);
  } catch (error: any) {
    if (error.code === "P2002")
      return res.status(409).json({ error: "Company name already in use." });
    if (error.code === "P2025")
      return res.status(404).json({ error: "Company not found." });
    res.status(500).json({ error: "Update failed." });
  }
};

/**
 * DELETE /companies/:id
 */
export const deleteCompany = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || (id as string).trim() === "") {
    return res.status(400).json({ error: "Company ID is required." });
  }

  if (!/^[0-9a-fA-F]{24}$/.test(id as string)) {
    return res.status(400).json({ error: "Invalid ID format." });
  }

  try {
    await prisma.company.delete({ where: { id: id as string } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Company not found." });
    }

    res.status(400).json({
      error: "Could not delete company. Ensure no active projects are linked.",
    });
  }
};
