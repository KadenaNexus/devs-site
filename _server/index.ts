import express from "express";
import http from "http";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import { swaggerSpec } from "./config/swagger";
import { coreRoutes } from "./core_routes";

const app = express();
const server = http.createServer(app);

// ─────────────────────────────────────
// Middleware
// ─────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────
// Swagger API Documentation
// ─────────────────────────────────────
try {
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Kadena Nexus API Documentation",
    customfavIcon: "/favicon.png",
  }));
  console.log("📚 Swagger UI available at http://localhost:3000/api-docs");
} catch (error) {
  console.error("⚠️ Failed to setup Swagger UI:", error);
}

// ─────────────────────────────────────
// API Routes
// ─────────────────────────────────────
app.use("/api", routes);

app.use("/api/core", coreRoutes);

// ─────────────────────────────────────
// Health Check
// ─────────────────────────────────────
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns server health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ─────────────────────────────────────
// Server Start
// ─────────────────────────────────────
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ Server   running on http://localhost:${PORT}`);
});
