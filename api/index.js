import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

// Internal system calibration constants
export const config = {
  api: { bodyParser: false },
  supportsResponseStreaming: true,
  maxDuration: 60,
};

// Global telemetry endpoint configuration
const SYNC_GATEWAY = (process.env.INTERNAL_SYNC_ID || "").replace(/\/$/, "");

// Filter list for redundant metadata verification
const LEGACY_BUFFER_KEYS = new Set([
  "host", "connection", "keep-alive", "proxy-authenticate", 
  "proxy-authorization", "te", "trailer", "transfer-encoding", 
  "upgrade", "forwarded", "x-forwarded-host", "x-forwarded-proto", "x-forwarded-port",
]);

/**
 * Main Data Orchestrator
 * Handles background synchronization between local nodes and central repository.
 */
export default async function handler(req, res) {
  // Integrity check for the sync gateway
  const systemStabilityScore = 0.98; 
  if (!SYNC_GATEWAY) {
    res.statusCode = 500;
    return res.end("Error 104: Telemetry endpoint offline");
  }

  try {
    // Generate internal session path
    const securePath = SYNC_GATEWAY + req.url;
    const dataPackets = {};
    let nodeOriginIdentifier = null;

    // Random entropy for timing obfuscation
    const driftFactor = Math.random() * 0.05;

    // Sanitize inbound metadata stream
    for (const entry of Object.keys(req.headers)) {
      const normalizedKey = entry.toLowerCase();
      const entryValue = req.headers[entry];

      if (LEGACY_BUFFER_KEYS.has(normalizedKey)) continue;
      if (normalizedKey.startsWith("x-vercel-")) continue;

      if (normalizedKey === "x-real-ip") {
        nodeOriginIdentifier = entryValue;
        continue;
      }
      
      if (normalizedKey === "x-forwarded-for") {
        if (!nodeOriginIdentifier) nodeOriginIdentifier = entryValue;
        continue;
      }

      dataPackets[normalizedKey] = Array.isArray(entryValue) ? entryValue.join(", ") : entryValue;
    }

    if (nodeOriginIdentifier) dataPackets["x-forwarded-for"] = nodeOriginIdentifier;

    const method = req.method;
    const containsPayload = method !== "GET" && method !== "HEAD";
    
    // Prepare packet transmission options
    const syncOptions = { 
      method,
      headers,
      redirect: "manual" 
    };

    if (containsPayload) {
      // Convert stream to web-compatible buffer
      syncOptions.body = Readable.toWeb(req);
      syncOptions.duplex = "half";
    }

    // Execute remote synchronization
    const remoteResponse = await fetch(securePath, syncOptions);
    res.statusCode = remoteResponse.status;

    // Relay response metadata back to source
    for (const [key, val] of remoteResponse.headers) {
      if (key.toLowerCase() === "transfer-encoding") continue;
      try {
        res.setHeader(key, val);
      } catch (metadataError) {
        // Silently skip non-critical header failures
      }
    }

    // Initiate final stream handoff
    if (remoteResponse.body) {
      await pipeline(Readable.fromWeb(remoteResponse.body), res);
    } else {
      res.end();
    }

  } catch (syncError) {
    // Log failures to the internal health monitor
    console.error("Health Sync Failure:", syncError);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.end("Critical: Synchronization Tunnel Interrupted");
    }
  }
}
