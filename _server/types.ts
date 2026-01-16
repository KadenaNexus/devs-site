 export type  CacheEntry<T> = {
  data: T;
  expiresAt: number;
};


export type NetworkSummaryResponse = {
  network: {
    instance: string;
    id: string;
    origin: any;
    cutHeight: number;
    weight: string;
  };
  chains: Array<{
    chainId: number;
    cutHash: string;
    cutHeight: number;
    height: number;
    creationTime?: number;
    parent?: string;
    payloadHash?: string;
  }>;
  source: string;
  fetchedAt: string;
};


 