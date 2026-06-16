import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import toolRoutes from "./routes/toolRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "AI Multi-Tool API is running" });
});

app.use("/api/tools", toolRoutes);

// Serve static assets from frontend build directory in production
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
