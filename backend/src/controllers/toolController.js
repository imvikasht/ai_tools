import { categories, toolCatalog } from "../data/tools.js";
import { executeTool } from "../services/toolService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getToolCatalog = asyncHandler(async (_req, res) => {
  res.json({ success: true, categories, tools: toolCatalog });
});

export const runTool = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const payload = req.body || {};
  const { tool, output } = await executeTool({ slug, payload });
  res.json({ success: true, tool, result: output });
});
