import dayjs from "dayjs";
import { getChangePercent } from "~/utils/utils";
import type { InfoItem } from "~/components/InfoList/InfoList";
import type { ChartElement } from "~/common.types";
import type { PoolRaw, Pool } from "~/api-queries/poolData";
import { convertPool } from "~/api-queries/poolData";

export interface CurrencyVolume {
  volumeDayNative: number;
  volumeDayUSD: number;
  timestamp: string;
}

export interface CurrencyTVL {
  liquidity: number;
  liquidityUSD: number;
  timestamp: string;
}

export interface CurrencyPrice {
  usdPrice: number;
  timestamp: string;
}

export interface CurrencyRaw {
  name: string;
  id: string;
  coinGecko: { name: string };
  firstPrice: CurrencyPrice[];
  lastPrice: CurrencyPrice[];
  volumeList: CurrencyVolume[];
  tvlList: CurrencyTVL[];
  priceList: CurrencyPrice[];
  tvl: CurrencyTVL[];
  tvlPrev: CurrencyTVL[];
  volume1Day: CurrencyVolume[];
  volumePrev1Day: CurrencyVolume[];
  volume7Day: CurrencyVolume[];
}

export interface CurrencyData {
  id: string;
  name: string;
  symbol: string;
}

export interface Currency {
  id: string;
  currency: CurrencyData;
  price: number;
  priceChange: number;
  volume: number;
  tvl: number;
}

interface Data {
  currency: CurrencyRaw;
  pools: PoolRaw[];
}

export type Result = {
  currency: Currency;
  poolsTableData: Pool[];
  commonInfo: InfoItem[];
  volumeList: ChartElement[];
  tvlList: ChartElement[];
  priceList: ChartElement[];
};

export const convertCurrency = (currency: CurrencyRaw): Currency => ({
  id: currency.id,
  currency: {
    id: currency.id,
    name: currency.coinGecko.name,
    symbol: currency.name,
  },
  price: currency.firstPrice[0].usdPrice,
  priceChange: getChangePercent(
    currency.lastPrice[0].usdPrice,
    currency.firstPrice[0].usdPrice
  ),
  volume: currency.volumeList[0].volumeDayUSD,
  tvl: currency.tvlList[0].liquidityUSD,
});

export const currencyDataTransform = (data: Data): Result => {
  const { currency, pools } = data;
  const funcReduceTVL = (data: CurrencyTVL[]) =>
    data.reduce((acc, { liquidityUSD }) => acc + liquidityUSD, 0);
  const tvlCurrent = funcReduceTVL(currency.tvl);
  const tvlPrev = funcReduceTVL(currency.tvlPrev);
  const funcReduceVolume = (data: CurrencyVolume[]) =>
    data.reduce((acc, { volumeDayUSD }) => acc + volumeDayUSD, 0);
  const volume1Day = funcReduceVolume(currency.volume1Day);
  const volumePrev1Day = funcReduceVolume(currency.volumePrev1Day);
  const volume7Day = funcReduceVolume(currency.volume7Day);

  const volumeDate: Record<string, number> = {};
  for (const { timestamp, volumeDayUSD } of currency.volumeList) {
    const date = dayjs(parseInt(timestamp)).format("YYYY-MM-DD").toString();

    if (!volumeDate[date]) {
      volumeDate[date] = volumeDayUSD;
    }

    volumeDate[date] += volumeDayUSD;
  }

  const tvlDate: Record<string, number> = {};
  for (const { timestamp, liquidityUSD } of currency.tvlList) {
    const date = dayjs(parseInt(timestamp)).format("YYYY-MM-DD").toString();

    if (!tvlDate[date]) {
      tvlDate[date] = liquidityUSD;
    }

    tvlDate[date] += liquidityUSD;
  }

  const priceDate: Record<string, number> = {};
  const countDate: Record<string, number> = {};
  for (const { timestamp, usdPrice } of currency.priceList) {
    const date = dayjs(parseInt(timestamp)).minute(0).second(0).unix();

    if (!priceDate[date]) {
      priceDate[date] = usdPrice;
      countDate[date] = 1;
    }

    priceDate[date] += usdPrice;
    countDate[date] += 1;
  }

  for (const [key, value] of Object.entries(priceDate)) {
    priceDate[key] = value / countDate[key];
  }

  return {
    currency: convertCurrency(currency),
    poolsTableData: pools.map(convertPool),
    volumeList: Object.entries(volumeDate).map(([key, value]) => ({
      time: key,
      value,
    })),
    tvlList: Object.entries(tvlDate).map(([key, value]) => ({
      time: key,
      value,
    })),
    priceList: Object.entries(priceDate).map(([key, value]) => ({
      time: parseInt(key),
      value,
    })),
    commonInfo: [
      {
        name: "TVL",
        value: tvlCurrent,
        change: getChangePercent(tvlCurrent, tvlPrev),
      },
      {
        name: "24h Trading Vol",
        value: volume1Day,
        change: getChangePercent(volume1Day, volumePrev1Day),
      },
      {
        name: "7d Trading Vol",
        value: volume7Day,
      },
    ],
  };
};
