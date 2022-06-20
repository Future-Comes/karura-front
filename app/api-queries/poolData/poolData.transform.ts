import dayjs from "dayjs";
import type { InfoItem } from "~/components/InfoList/InfoList";
import type { ChartElement } from "~/common.types";
import { getChangePercent } from "~/utils/utils";

export interface QueryPoolCurrency {
  id: string;
  name: string;
  priceHistory: [{ usdPrice: number }];
}

export interface PoolCurrency {
  id: string;
  name: string;
  price: number;
  tvl: number;
}

export interface PoolCurrencies {
  id: string;
  from: PoolCurrency;
  to: PoolCurrency;
}

export interface PoolVolume {
  volumeDayUSD: number;
  timestamp: string;
}

export interface PoolTVL {
  usdTotalLiquidity: number;
  usdPriceZero: number;
  usdPriceOne: number;
  timestamp: string;
}

export interface PoolRaw {
  id: string;
  from: QueryPoolCurrency;
  to: QueryPoolCurrency;
  volumeList: PoolVolume[];
  tvlList: PoolTVL[];
  tvl: PoolTVL[];
  tvlPrev: PoolTVL[];
  volume1Day: PoolVolume[];
  volumePrev1Day: PoolVolume[];
  volume7Day: PoolVolume[];
}

export interface Pool {
  id: string;
  pool: PoolCurrencies;
  tvl: number;
  volume1Day: number;
  volume7Day: number;
}

export interface Result {
  data: Pool;
  volumeList: ChartElement[];
  tvlList: ChartElement[];
  commonInfo: InfoItem[];
}

export const convertPool = (pool: PoolRaw): Pool => ({
  id: pool.id,
  pool: {
    id: pool.id,
    from: {
      ...pool.from,
      price: pool.from.priceHistory[0]?.usdPrice,
      tvl: pool.tvl[0]?.usdPriceZero,
    },
    to: {
      ...pool.to,
      price: pool.to.priceHistory[0]?.usdPrice,
      tvl: pool.tvl[0]?.usdPriceOne,
    },
  },
  tvl: pool.tvl[0]?.usdTotalLiquidity,
  volume1Day: pool.volume1Day[0]?.volumeDayUSD,
  volume7Day: pool.volume7Day[0]?.volumeDayUSD,
});

export const poolDataTransform = (data: PoolRaw): Result => {
  const { volumeList, tvlList } = data;

  const funcReduceTVL = (data: PoolTVL[]) =>
    data.reduce((acc, { usdTotalLiquidity }) => acc + usdTotalLiquidity, 0);
  const tvlCurrent = funcReduceTVL(data.tvl);
  const tvlPrev = funcReduceTVL(data.tvlPrev);
  const funcReduceVolume = (data: PoolVolume[]) =>
    data.reduce((acc, { volumeDayUSD }) => acc + volumeDayUSD, 0);
  const volume1Day = funcReduceVolume(data.volume1Day);
  const volumePrev1Day = funcReduceVolume(data.volumePrev1Day);
  const volume7Day = funcReduceVolume(data.volume7Day);

  const volumeDate: Record<string, number> = {};
  for (const { timestamp, volumeDayUSD } of volumeList) {
    const date = dayjs(parseInt(timestamp)).format("YYYY-MM-DD").toString();

    if (!volumeDate[date]) {
      volumeDate[date] = volumeDayUSD;
    }

    volumeDate[date] += volumeDayUSD;
  }

  const tvlDate: Record<string, number> = {};
  for (const { timestamp, usdTotalLiquidity } of tvlList) {
    const date = dayjs(parseInt(timestamp)).format("YYYY-MM-DD").toString();

    if (!tvlDate[date]) {
      tvlDate[date] = usdTotalLiquidity;
    }

    tvlDate[date] += usdTotalLiquidity;
  }

  return {
    data: convertPool(data),
    volumeList: Object.entries(volumeDate).map(([key, value]) => ({
      time: key,
      value,
    })),
    tvlList: Object.entries(tvlDate).map(([key, value]) => ({
      time: key,
      value,
    })),
    commonInfo: [
      {
        name: "TVL",
        value: tvlCurrent,
        change: getChangePercent(tvlCurrent, tvlPrev),
      },
      {
        name: "Volume 24H",
        value: volume1Day,
        change: getChangePercent(volume1Day, volumePrev1Day),
      },
      {
        name: "Volume 7D",
        value: volume7Day,
      },
    ],
  };
};
