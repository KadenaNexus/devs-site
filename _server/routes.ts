import { Router } from "express";
import {
  fetchCutData,
  fetchChainData,
  fetchAllChainsData,
  fetchNetworkStats,
  clearCache,
} from "./services/chainwebService";

const router = Router();

// ─────────────────────────────────────
// Legacy Kadena Network Stats (redirects to chainweb/stats)
// ─────────────────────────────────────
/**
 * @swagger
 * /api/kadena/stats:
 *   get:
 *     summary: Get Kadena network statistics (legacy endpoint)
 *     description: Returns comprehensive network statistics. This is a legacy endpoint that redirects to /api/chainweb/stats
 *     tags: [Chainweb]
 *     parameters:
 *       - in: query
 *         name: cache
 *         schema:
 *           type: string
 *           default: "true"
 *         description: Whether to use cached data. Set to "false" to bypass cache
 *     responses:
 *       200:
 *         description: Network statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NetworkStats'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/kadena/stats", async (req, res) => {
  try {
    const useCache = req.query.cache !== "false";
    const stats = await fetchNetworkStats(useCache);
    res.json(stats);
  } catch (error) {
    console.error("Kadena stats error:", error);
    res.status(500).json({
      error: "Failed to fetch Kadena network stats",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// ─────────────────────────────────────
// Chainweb API Endpoints
// ─────────────────────────────────────

/**
 * @swagger
 * /api/chainweb/cut:
 *   get:
 *     summary: Get network cut data
 *     description: Returns the current cut (network-wide state) showing heights for all chains
 *     tags: [Chainweb]
 *     parameters:
 *       - in: query
 *         name: cache
 *         schema:
 *           type: string
 *           default: "true"
 *         description: Whether to use cached data. Set to "false" to bypass cache
 *     responses:
 *       200:
 *         description: Cut data with network-wide state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CutData'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/chainweb/cut", async (req, res) => {
  try {
    const useCache = req.query.cache !== "false";
    const cutData = await fetchCutData(useCache);
    res.json(cutData);
  } catch (error) {
    console.error("Chainweb cut error:", error);
    res.status(500).json({
      error: "Failed to fetch cut data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/chainweb/chain/{chainId}:
 *   get:
 *     summary: Get data for a specific chain
 *     description: Returns block height, block time, transaction count, and other statistics for a specific chain
 *     tags: [Chainweb]
 *     parameters:
 *       - in: path
 *         name: chainId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 19
 *         description: Chain ID (0-19)
 *       - in: query
 *         name: cache
 *         schema:
 *           type: string
 *           default: "true"
 *         description: Whether to use cached data. Set to "false" to bypass cache
 *     responses:
 *       200:
 *         description: Chain data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChainData'
 *       400:
 *         description: Invalid chain ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/chainweb/chain/:chainId", async (req, res) => {
  try {
    const chainId = parseInt(req.params.chainId, 10);
    if (isNaN(chainId) || chainId < 0 || chainId >= 20) {
      return res.status(400).json({
        error: "Invalid chain ID. Must be between 0 and 19",
      });
    }

    const useCache = req.query.cache !== "false";
    const chainData = await fetchChainData(chainId, useCache);
    res.json(chainData);
  } catch (error) {
    console.error(`Chainweb chain ${req.params.chainId} error:`, error);
    res.status(500).json({
      error: `Failed to fetch chain ${req.params.chainId} data`,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/chainweb/chains:
 *   get:
 *     summary: Get data for all chains
 *     description: Returns block height, block time, transaction count, and other statistics for all 20 chains
 *     tags: [Chainweb]
 *     parameters:
 *       - in: query
 *         name: cache
 *         schema:
 *           type: string
 *           default: "true"
 *         description: Whether to use cached data. Set to "false" to bypass cache
 *     responses:
 *       200:
 *         description: Array of chain data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChainData'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/chainweb/chains", async (req, res) => {
  try {
    const useCache = req.query.cache !== "false";
    const chainsData = await fetchAllChainsData(useCache);
    res.json(chainsData);
  } catch (error) {
    console.error("Chainweb chains error:", error);
    res.status(500).json({
      error: "Failed to fetch chains data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/chainweb/stats:
 *   get:
 *     summary: Get comprehensive network statistics
 *     description: Returns aggregated network statistics including network height, active chains, TPS, average block time, and detailed chain data
 *     tags: [Chainweb]
 *     parameters:
 *       - in: query
 *         name: cache
 *         schema:
 *           type: string
 *           default: "true"
 *         description: Whether to use cached data. Set to "false" to bypass cache
 *     responses:
 *       200:
 *         description: Comprehensive network statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NetworkStats'
 *             example:
 *               networkHeight: 4258900
 *               activeChains: 20
 *               avgBlockTime: 1.5
 *               totalTxCount: 1250
 *               tps: 41.67
 *               chains: []
 *               timestamp: 1704067200000
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/chainweb/stats", async (req, res) => {
  try {
    const useCache = req.query.cache !== "false";
    const stats = await fetchNetworkStats(useCache);
    res.json(stats);
  } catch (error) {
    console.error("Chainweb stats error:", error);
    res.status(500).json({
      error: "Failed to fetch network stats",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/chainweb/cache/clear:
 *   post:
 *     summary: Clear all caches
 *     description: Clears all cached API responses. Useful for testing or forcing fresh data fetch. Admin endpoint.
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cache cleared"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/chainweb/cache/clear", async (_req, res) => {
  try {
    clearCache();
    res.json({ success: true, message: "Cache cleared" });
  } catch (error) {
    console.error("Cache clear error:", error);
    res.status(500).json({
      error: "Failed to clear cache",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// ─────────────────────────────────────
// Default API Route
// ─────────────────────────────────────
/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get API information
 *     description: Returns API name, status, and available endpoints
 *     tags: [Chainweb]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Kadena Nexus API"
 *                 status:
 *                   type: string
 *                   example: "running"
 *                 endpoints:
 *                   type: object
 */
router.get("/", (_req, res) => {
  res.json({
    name: "Kadena Nexus API",
    status: "running",
    endpoints: {
      cut: "/api/chainweb/cut",
      chain: "/api/chainweb/chain/:chainId",
      chains: "/api/chainweb/chains",
      stats: "/api/chainweb/stats",
      clearCache: "POST /api/chainweb/cache/clear",
      docs: "/api-docs",
    },
  });
});

export default router;
