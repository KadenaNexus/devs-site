import { useEffect, useState } from "react";

// Get API base URL - defaults to relative path for same-origin requests
function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || "/api";
}

export function useLiveKadenaData() {
  const [networkHeight, setNetworkHeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [stale, setStale] = useState(false);

  // Stats for StatsBar component
  const [activeChains, setActiveChains] = useState<number | null>(null);
  const [tps, setTps] = useState<number | null>(null);
  const [tx24h, setTx24h] = useState<number | null>(null);
  const [avgBlockTime, setAvgBlockTime] = useState<number | null>(null);

  const fetchKadenaData = async () => {
    try {
      setIsLoading(true);
      const apiBase = getApiBaseUrl();

      const [networkRes, metricsRes] = await Promise.all([
        fetch(`${apiBase}/core/network/summary`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        fetch(`${apiBase}/core/network/metrics`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
      ]);

      // Handle network summary response
      if (!networkRes.ok) {
        const text = await networkRes.text();
        console.log("Network summary failed:", networkRes.status, text);
        setLive(false);
        setStale(true);
        return;
      }

      const data = await networkRes.json(); 
      setActiveChains(data.chains?.length ?? 20);
      setNetworkHeight(data.network?.cutHeight ?? null);

      // Handle metrics response
      if (!metricsRes.ok) {
        const text = await metricsRes.text();
        console.log("Network metrics failed:", metricsRes.status, text);
        return;
      }   

      const metricsData = await metricsRes.json();  
      setTps(metricsData.currentTPS);
      setTx24h(metricsData.tx24h);
      setAvgBlockTime(metricsData.avgBlockTime);
    
      if (metricsData.status === "online") {
        setLive(true);
        setStale(false);
      } else {
        setLive(false);
        setStale(true);
      }
    } catch (err) {
      console.error("Failed to fetch Kadena network stats:", err);
      setLive(false);
      setStale(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch network stats immediately
    fetchKadenaData();
    
    // Poll every 10 seconds for fresh stats
    const statsInterval = setInterval(fetchKadenaData, 10000);

    return () => {
      clearInterval(statsInterval);
    };
  }, []);

  return {
    networkHeight,
    activeChains,
    tps,
    tx24h,
    avgBlockTime,
    isLoading,
    live,
    stale,
    // Legacy stats object for backward compatibility
    stats: {
      tps: tps || 0,
      tx24h: tx24h || 0,
      activeNodes: activeChains || 20,
      avgBlockTime: avgBlockTime || 30,
      hashrate: "245 PH/s",
    },
  };
}
