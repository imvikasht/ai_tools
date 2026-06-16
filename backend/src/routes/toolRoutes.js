import { Router } from "express";
import { getToolCatalog, runTool } from "../controllers/toolController.js";

const router = Router();
router.get("/", getToolCatalog);
router.post("/:slug/run", runTool);
export default router;
