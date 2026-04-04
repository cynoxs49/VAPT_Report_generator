import { Router } from "express";
import * as companyController from "./company.controller";

const router: Router = Router();

// Create or verify a company (uses upsert for idempotency)
router.post("/", companyController.createCompany);

// List all registered companies
router.get("/", companyController.getCompanies);

// Get specific company details
router.get("/:id", companyController.getCompanyById);

// Update company profile (branding, scope, or contact info)
router.patch("/:id", companyController.updateCompany);

// Delete a company (Note: Implement with caution if projects exist)
router.delete("/:id", companyController.deleteCompany);

export default router;
