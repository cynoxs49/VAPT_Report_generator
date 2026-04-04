import { Router } from "express";
import * as serviceController from "./service.controller";

const router: Router = Router();

// List all available services
router.get("/", serviceController.getServices);

// Create a new service category
router.post("/", serviceController.createService);

// Update service naming or description
router.patch("/:id", serviceController.updateService);

// Retrieve versioned templates for a specific service
router.get("/:id/templates", serviceController.getServiceTemplates);

export default router;
