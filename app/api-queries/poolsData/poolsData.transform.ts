import { makeRangeFilter, makeSort } from "~/utils/utils";
import type { PoolRaw, Pool } from "~/api-queries/poolData";
import { convertPool } from "~/api-queries/poolData";

export interface Volume {
  volumeDayUSD: number;
  timestamp: string;
}

export interface TVL {
  usdTotalLiquidity: number;
  usdPriceZero: number;
  usdPriceOne: number;
  timestamp: string;
}

interface Data {
  pools: PoolRaw[];
}

export const poolsDataTransform = (
  data: Data,
  filters?: URLSearchParams
): Pool[] => {
  let pools = data.pools.map(convertPool);
  const limit = parseInt(filters?.get("limit") || "0");
  const offset = parseInt(filters?.get("offset") || "0");

  if (filters) {
    for (let [typeOrKey, value] of filters) {
      if (!value) {
        continue;
      }
      switch (typeOrKey) {
        case "sort":
          pools.sort(makeSort(JSON.parse(value) as any));
          break;
        case "id":
          break;
        default:
          pools = pools.filter(
            makeRangeFilter({
              key: typeOrKey,
              params: JSON.parse(value) as any,
            })
          );
      }
    }
  }

  if (limit) {
    pools = pools.slice(offset, offset + limit);
  }

  return pools;
};
