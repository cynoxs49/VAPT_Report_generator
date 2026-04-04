import { Router } from "express";
import * as projectController from "./project.controller";

const router: Router = Router();

// Projects
router.post("/", projectController.createProject);
router.get("/:id", projectController.getProject);

// Findings
router.post("/:id/findings", projectController.addFinding);
router.patch("/:id/findings/reorder", projectController.reorderFindings);

export default router;
