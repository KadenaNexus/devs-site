import express from "express";
import axios from "axios";
import pLimit from "p-limit";
import rateLimit from "express-rate-limit";
import type { CacheEntry, NetworkSummaryResponse } from "./types";

const router = express.Router();

const PRIMARY = "https://api.chainweb-community.org/chainweb/0.0/mainnet01";
const FALLBACK = "https://chainweb.chaddex.com/chainweb/0.0/mainnet01";

async function fetchWithFallback(path: string, opts?: { accept?: string }) {
  const config = {
    timeout: 10_000,
    headers: {
      Accept: opts?.accept ?? "application/json",
    },
  };

  try {
    const res = await axios.get(`${PRIMARY}${path}`, config);
    return res.data;
  } catch {
    const res = await axios.get(`${FALLBACK}${path}`, config);
    return res.data;
  }
}

async function fetchPayloadSmart(chainId: number, payloadHash: string) {
  const path = `/chain/${chainId}/payload/${payloadHash}`;

  try {
    // try richer encoding first
    return await fetchWithFallback(path, {
      accept: "application/json;blockpayload-encoding=object",
    });
  } catch (e: any) {
    const status = e?.response?.status;

    // 406 means "Accept header not supported"
    if (status === 406) {
      return await fetchWithFallback(path, {
        accept: "application/json",
      });
    }

    // any other error: rethrow
    throw e;
  }
}

const networkLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again after a minute.",
  },
});

let networkSummaryCache: CacheEntry<NetworkSummaryResponse> = {
  data: null as any,
  expiresAt: 0,
};
const CACHE_TTL_MS = 10_000;

/**
 * @swagger
 * /api/core/network/summary:
 *   get:
 *     summary: Get normalized Kadena network summary
 *     description: Fetches the latest Chainweb cut and per-chain data and returns a frontend-friendly summary.
 *     tags:
 *       - Network
 *     responses:
 *       200:
 *         description: Successful response with network summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - network
 *                 - chains
 *                 - source
 *                 - fetchedAt
 *               properties:
 *                 network:
 *                   type: object
 *                   required:
 *                     - instance
 *                     - id
 *                     - origin
 *                     - cutHeight
 *                     - weight
 *                   properties:
 *                     instance:
 *                       type: string
 *                       example: mainnet01
 *                     id:
 *                       type: string
 *                       example: WkZzgGmD1yqmIyZm9J5JZZHra_ojcdNRFq6ZhGV7zSE
 *                     origin:
 *                       nullable: true
 *                       oneOf:
 *                         - type: object
 *                         - type: "null"
 *                       example: null
 *                     cutHeight:
 *                       type: integer
 *                       example: 130491417
 *                     weight:
 *                       type: string
 *                       example: ms4Z7dnjAh3MvS4AAAAAAAAAAAAAAAAAAAAAAAAAAAA
 *                 chains:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required:
 *                       - chainId
 *                       - cutHash
 *                       - cutHeight
 *                       - height
 *                     properties:
 *                       chainId:
 *                         type: integer
 *                         minimum: 0
 *                         maximum: 19
 *                         example: 0
 *                       cutHash:
 *                         type: string
 *                         example: 4uMwx_ADe1w0I___O4qcXs9gwNHYtDLKi0zzSA5POJQ
 *                       cutHeight:
 *                         type: integer
 *                         example: 6524571
 *                       height:
 *                         type: integer
 *                         example: 6524571
 *                       creationTime:
 *                         type: integer
 *                         nullable: true
 *                         example: 1768246912
 *                       parent:
 *                         type: string
 *                         nullable: true
 *                         example: "someParentHash"
 *                       payloadHash:
 *                         type: string
 *                         nullable: true
 *                         example: "somePayloadHash"
 *                 source:
 *                   type: string
 *                   example: chainweb
 *                 fetchedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-12T19:52:06.985Z"
 *       500:
 *         description: Server error while fetching or normalizing network data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch network summary
 *                 message:
 *                   type: string
 *                   example: Request failed with status code 400
 */
router.get("/network/summary", networkLimiter, async (req, res) => {
  try {
    if (networkSummaryCache && networkSummaryCache.expiresAt > Date.now()) {
      return res.json({
        ...networkSummaryCache.data,
        cache: { hit: true, ttlMs: networkSummaryCache.expiresAt - Date.now() },
      });
    }

    const cut = await fetchWithFallback("/cut");

    const hashes = cut?.hashes || cut?.cut?.hashes || {};

    if (!hashes || Object.keys(hashes).length === 0) {
      return res.status(500).json({
        error: "Could not extract per-chain hashes from cut response",
        receivedKeys: Object.keys(cut || {}),
      });
    }

    const limit = pLimit(5);
    const chainIds = Object.keys(hashes)
      .map(Number)
      .sort((a, b) => a - b);

    const chains = await Promise.all(
      chainIds.map((chainId) =>
        limit(async () => {
          const hashEntry = hashes[String(chainId)];

          const chainHash =
            typeof hashEntry === "string" ? hashEntry : hashEntry?.hash;

          const cutHeight =
            typeof hashEntry === "object" ? hashEntry?.height : undefined;

          if (!chainHash) {
            throw new Error(`No chain hash found for chain ${chainId}`);
          }

          const header = await fetchWithFallback(
            `/chain/${chainId}/header/${chainHash}`
          );

          return {
            chainId,

            // from cut
            cutHash: chainHash,
            cutHeight,

            // from header
            height: header?.height ?? cutHeight,
            creationTime: header?.creationTime,
            parent: header?.parent,
            payloadHash: header?.payloadHash,
          };
        })
      )
    );

    const normalized = {
      network: {
        instance: cut?.instance,
        id: cut?.id,
        origin: cut?.origin,
        cutHeight: cut?.height,
        weight: cut?.weight,
      },
      chains,
      source: "chainweb",
      fetchedAt: new Date().toISOString(),
    };

    networkSummaryCache = {
      data: normalized,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    return res.json({
      ...normalized,
      cache: { hit: false, ttlMs: CACHE_TTL_MS },
    });
  } catch (error: any) {
    console.error("Failed /api/network/summary:", error?.message || error);

    return res.status(500).json({
      error: "Failed to fetch network summary",
      message: error?.message,
    });
  }
});


/**
 * @swagger
 * /api/core/network/metrics-v2:
 *   get:
 *     summary: Get Kadena network metrics (stable sampling v2)
 *     description: Samples multiple recent blocks per chain for a stable TPS estimate, with safe payload decoding fallback.
 *     tags:
 *       - Network
 *     parameters:
 *       - in: query
 *         name: depth
 *         schema:
 *           type: integer
 *           example: 20
 *         description: How many blocks to walk back per chain (min 5, max 50)
 *       - in: query
 *         name: chains
 *         schema:
 *           type: string
 *           example: "0,1,2,3,4"
 *         description: Comma-separated chain ids to sample
 */
type MetricsV2Response = {
  networkHeight: number | null;
  activeChainsCount: number;
  currentTPS: number;
  tx24h: number;
  avgBlockTime: number;
  status: "online" | "offline";
  fetchedAt: string;
};

let networkMetricsV2Cache: CacheEntry<MetricsV2Response> = {
  data: null as any,
  expiresAt: 0,
};

const METRICS_V2_CACHE_TTL_MS = 30_000;

router.get("/network/metrics", networkLimiter, async (_req, res) => {
  try {

    if (networkMetricsV2Cache && networkMetricsV2Cache.expiresAt > Date.now()) {
      return res.json({
        ...networkMetricsV2Cache.data,
        cache: {
          hit: true,
          ttlMs: networkMetricsV2Cache.expiresAt - Date.now(),
        },
      });
    }

    // Sample all 20 chains for accurate network-wide metrics
    const ALL_CHAINS = Array.from({ length: 20 }, (_, i) => i);
    const SAMPLE_DEPTH = 50; // Sample last 50 blocks per chain
    const CONCURRENCY = 5;
    const limit = pLimit(CONCURRENCY);

    const cut = await fetchWithFallback("/cut");

    const hashes = cut?.hashes || cut?.cut?.hashes || {};
    if (!hashes || Object.keys(hashes).length === 0) {
      return res.status(500).json({
        error: "Could not extract hashes from cut",
        receivedKeys: Object.keys(cut || {}),
      });
    }

    const networkHeight = cut?.height ?? cut?.cut?.height ?? null;
    const activeChainsCount = Object.keys(hashes).length;
    const fetchedAt = new Date().toISOString();

    /**
     * Fetch a batch of headers for a chain using the range API
     * GET /chain/{chainId}/header?minheight={min}&maxheight={max}
     */
    async function fetchHeaderRange(chainId: number, maxHeight: number, count: number) {
      const minHeight = Math.max(0, maxHeight - count + 1);
      const path = `/chain/${chainId}/header?minheight=${minHeight}&maxheight=${maxHeight}`;
      
      try {
        const data = await fetchWithFallback(path, {
          accept: "application/json;blockheader-encoding=object",
        });
        // API returns { items: [...], next: ..., limit: ... }
        return Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(`Failed to fetch header range for chain ${chainId}:`, e);
        return [];
      }
    }

    /**
     * Calculate average block time for a single chain
     * Formula: avgBlockTime = mean(creationTime[i] - creationTime[i-1])
     * Note: creationTime is in MICROSECONDS, we convert to seconds
     */
    async function sampleChain(chainId: number) {
      const entry = hashes[String(chainId)];
      const height = typeof entry === "object" ? entry?.height : null;

      if (!height) {
        return {
          chainId,
          blocksSampled: 0,
          txTotal: 0,
          avgBlockTimeSec: null as number | null,
        };
      }

      // Fetch batch of headers
      const headers = await fetchHeaderRange(chainId, height, SAMPLE_DEPTH);
      
      if (headers.length < 2) {
        return {
          chainId,
          blocksSampled: headers.length,
          txTotal: 0,
          avgBlockTimeSec: null,
        };
      }

      // Sort headers by height descending (newest first)
      headers.sort((a: any, b: any) => (b.height ?? 0) - (a.height ?? 0));

      // Extract creation times (in microseconds)
      const times: number[] = headers
        .map((h: any) => h.creationTime)
        .filter((t: any) => typeof t === "number");

      if (times.length < 2) {
        return {
          chainId,
          blocksSampled: headers.length,
          txTotal: 0,
          avgBlockTimeSec: null,
        };
      }

      // Calculate time differences between consecutive blocks
      // times[i] - times[i+1] because sorted descending (newer to older)
      // creationTime is in MICROSECONDS, convert to SECONDS
      const diffs: number[] = [];
      for (let i = 0; i < times.length - 1; i++) {
        const diffMicroseconds = times[i] - times[i + 1];
        const diffSeconds = diffMicroseconds / 1_000_000; // Convert microseconds to seconds
        
        // Sanity check: block time should be between 1 and 120 seconds
        if (diffSeconds > 0 && diffSeconds < 120) {
          diffs.push(diffSeconds);
        }
      }

      // Calculate average block time for this chain
      const avgBlockTimeSec = diffs.length > 0
        ? diffs.reduce((a, b) => a + b, 0) / diffs.length
        : null;

      // Count transactions (optional, for TPS calculation)
      let txTotal = 0;
      for (const header of headers.slice(0, 10)) { // Only check first 10 for performance
        if (header.payloadHash) {
          try {
            const payload = await fetchPayloadSmart(chainId, header.payloadHash);
            if (Array.isArray(payload?.transactions)) {
              txTotal += payload.transactions.length;
            }
          } catch {
            // Ignore payload fetch errors
          }
        }
      }

      return {
        chainId,
        blocksSampled: headers.length,
        txTotal,
        avgBlockTimeSec,
      };
    }

    // Sample all chains in parallel with concurrency limit
    const perChain = await Promise.all(
      ALL_CHAINS.map((chainId) => limit(() => sampleChain(chainId)))
    );

    // Calculate network-wide average block time
    // Formula: networkAvg = mean(avgBlockTime(chain 0..19))
    const validBlockTimes = perChain
      .map((c) => c.avgBlockTimeSec)
      .filter((x): x is number => typeof x === "number" && x > 0);

    const networkAvgBlockTime = validBlockTimes.length > 0
      ? validBlockTimes.reduce((a, b) => a + b, 0) / validBlockTimes.length
      : 30; // Default to 30 seconds if no data

    // Calculate TPS
    const totalTx = perChain.reduce((sum, c) => sum + c.txTotal, 0);
    const totalBlocks = perChain.reduce((sum, c) => sum + Math.min(c.blocksSampled, 10), 0);
    const avgTxPerBlock = totalBlocks > 0 ? totalTx / totalBlocks : 0;
    
    // TPS = (avgTxPerBlock / avgBlockTime) * numberOfChains
    const estimatedTPS = networkAvgBlockTime > 0
      ? (avgTxPerBlock / networkAvgBlockTime) * 20
      : 0;
    
    const tx24h = Math.round(estimatedTPS * 86400);

    const normalized: MetricsV2Response = {
      networkHeight,
      activeChainsCount,
      currentTPS: Number(estimatedTPS.toFixed(2)),
      tx24h,
      avgBlockTime: Number(networkAvgBlockTime.toFixed(2)),
      status: "online",
      fetchedAt,
    };

    // Cache the result
    networkMetricsV2Cache = {
      data: normalized,
      expiresAt: Date.now() + METRICS_V2_CACHE_TTL_MS,
    };

    return res.json({
      ...normalized,
      cache: { hit: false, ttlMs: METRICS_V2_CACHE_TTL_MS },
    });
  } catch (error: any) {
    console.error("Failed /network/metrics:", error?.message || error);

    return res.status(500).json({
      error: "Failed to compute metrics",
      message: error?.message,
      status: "offline",
    });
  }
});

export { router as coreRoutes };
