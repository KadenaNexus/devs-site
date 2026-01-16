import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kadena Nexus API",
      version: "1.0.0",
      description:
        "API documentation for Kadena Nexus - Real-time Chainweb network explorer. " +
        "Provides endpoints for fetching cut data, per-chain statistics, and comprehensive network stats from the Kadena Chainweb network.",
      contact: {
        name: "Kadena Nexus",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.kadenanexus.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Chainweb",
        description: "Chainweb API endpoints for network data",
      },
      {
        name: "Cache",
        description: "Cache management endpoints",
      },
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
            message: {
              type: "string",
              description: "Detailed error message",
            },
          },
        },
        NetworkStats: {
          type: "object",
          properties: {
            networkHeight: {
              type: "number",
              description: "Current network block height",
              example: 4258900,
            },
            activeChains: {
              type: "number",
              description: "Number of active chains",
              example: 20,
            },
            avgBlockTime: {
              type: "number",
              description: "Average block time in seconds",
              example: 1.5,
            },
            totalTxCount: {
              type: "number",
              description: "Total transaction count in the sampling window",
              example: 1250,
            },
            tps: {
              type: "number",
              description: "Transactions per second",
              example: 41.67,
            },
            chains: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ChainData",
              },
            },
            timestamp: {
              type: "number",
              description: "Unix timestamp when data was fetched",
              example: 1704067200000,
            },
          },
        },
        ChainData: {
          type: "object",
          properties: {
            chainId: {
              type: "number",
              description: "Chain ID (0-19)",
              example: 0,
            },
            height: {
              type: "number",
              description: "Current chain height",
              example: 4258900,
            },
            latestBlockHash: {
              type: "string",
              description: "Hash of the latest block",
              example: "abc123...",
            },
            blockTime: {
              type: "number",
              description: "Block time in seconds",
              example: 1.5,
            },
            txCount: {
              type: "number",
              description: "Transaction count in the block",
              example: 25,
            },
            timestamp: {
              type: "number",
              description: "Unix timestamp when data was fetched",
              example: 1704067200000,
            },
          },
        },
        CutData: {
          type: "object",
          properties: {
            networkHeight: {
              type: "number",
              description: "Current network block height",
              example: 4258900,
            },
            instance: {
              type: "string",
              description: "Network instance name",
              example: "mainnet01",
            },
            origin: {
              type: "string",
              description: "Network origin",
            },
            chains: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  chainId: {
                    type: "number",
                    example: 0,
                  },
                  height: {
                    type: "number",
                    example: 4258900,
                  },
                },
              },
            },
            timestamp: {
              type: "number",
              description: "Unix timestamp when data was fetched",
              example: 1704067200000,
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(projectRoot, "_server", "routes.ts"),
    path.join(projectRoot, "_server", "core_routes.ts"),
    path.join(projectRoot, "_server", "index.ts"),
  ], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);

// Log if swagger spec was generated successfully (only in dev)
if (process.env.NODE_ENV !== "production") {
  console.log("📚 Swagger documentation generated successfully");
  console.log(`   API docs available at: http://localhost:${process.env.PORT || 3000}/api-docs`);
}

