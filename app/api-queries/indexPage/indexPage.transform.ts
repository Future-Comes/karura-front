import dayjs from "dayjs";

import { getChangePercent } from "~/utils/utils";
import type { ChartValue } from "~/common.types";
import type { InfoItem } from "~/components/InfoList/InfoList";
import type { Currency, CurrencyRaw } from "~/api-queries/currencyData";
import { convertCurrency } from "~/api-queries/currencyData";
import type { PoolRaw, Pool } from "~/api-queries/poolData";
import { convertPool } from "~/api-queries/poolData";

interface Data {
  currencies: CurrencyRaw[];
  pools: PoolRaw[];
  infoList: Array<{
    volume: Array<{
      volumeDayUSD: number;
      timestamp: string;
    }>;
    TVL: Array<{
      usdTotalLiquidity: number;
      timestamp: string;
    }>;
  }>;
}

export interface Result {
  totalTVLData: ChartValue[];
  totalVolumeData: ChartValue[];
  currenciesTableData: Currency[];
  poolsTableData: Pool[];
  commonInfo: InfoItem[];
}

export const indexPageTransform = (data: Data): Result => {
  const tvlResult: Record<string, number> = {};
  const volumeResult: Record<string, number> = {};

  let volumeCurrent = 0;
  let volumePrev = 0;
  let tvlCurrent = 0;
  let tvlPrev = 0;

  for (let item of data.infoList) {
    const volumeDates: Record<string, boolean> = {};
    const TVLDates: Record<string, boolean> = {};

    if (item.volume && item.volume.length > 0) {
      volumeCurrent += item.volume[0].volumeDayUSD;

      for (let volume of item.volume) {
        const dateKey = dayjs(parseInt(volume.timestamp)).format("YYYY-MM-DD");

        if (!volumeDates[dateKey]) {
          //write prev day value
          if (Object.keys(volumeDates).length === 1) {
            volumePrev += volume.volumeDayUSD;
          }

          volumeDates[dateKey] = true;
          volumeResult[dateKey] =
            (volumeResult[dateKey] ?? 0) + volume.volumeDayUSD;
        }
      }
    }

    if (item.TVL && item.TVL.length > 0) {
      tvlCurrent += item.TVL[0].usdTotalLiquidity;

      for (let TVL of item.TVL) {
        const dateKey = dayjs(parseInt(TVL.timestamp)).format("YYYY-MM-DD");

        if (!TVLDates[dateKey]) {
          //write prev day value
          if (Object.keys(TVLDates).length === 1) {
            tvlPrev += TVL.usdTotalLiquidity;
          }

          //summ only 1 date
          TVLDates[dateKey] = true;
          tvlResult[dateKey] =
            (tvlResult[dateKey] ?? 0) + TVL.usdTotalLiquidity;
        }
      }
    }
  }

  return {
    totalTVLData: Object.entries(tvlResult)
      .sort((a, b) => (a > b ? 1 : -1))
      .map(([time, value]) => ({
        value,
        time,
      })),
    totalVolumeData: Object.entries(volumeResult)
      .sort((a, b) => (a > b ? 1 : -1))
      .map(([time, value]) => ({
        value,
        time,
      })),
    currenciesTableData: data.currencies.map(convertCurrency),
    poolsTableData: data.pools.map(convertPool),
    commonInfo: [
      {
        name: "Volume 24H",
        value: volumeCurrent,
        change: getChangePercent(volumeCurrent, volumePrev),
      },
      {
        name: "TVL 24H",
        value: tvlCurrent,
        change: getChangePercent(tvlCurrent, tvlPrev),
      },
    ],
  };
};
