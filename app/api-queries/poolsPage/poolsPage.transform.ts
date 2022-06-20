import type { PoolRaw, Pool } from "~/api-queries/poolData";
import { convertPool } from "~/api-queries/poolData";

interface Data {
  pools: PoolRaw[];
  poolsData: {
    totalCount: number;
  };
}

export interface Result {
  pools: Pool[];
  totalCount: number;
}

export const poolsPageTransform = (data: Data): Result => ({
  pools: data.pools.map(convertPool),
  totalCount: data.poolsData.totalCount,
});
