import { dayTimestamp, sevenDayTimestamp } from "~/constants/time.contants";
import { poolParams } from "~/api-queries/poolData";

export const currencyParams = () => {
  const now = Date.now();
  const dayAgo = (now: number) => now - dayTimestamp;
  const sevenDayAgo = (now: number) => now - sevenDayTimestamp;

  return `
    id
    name: currencyName
    coinGecko {
      name
    }
    volumeList: volumeDayHistory(orderBy: timestamp_ASC) {
      volumeDayNative
      volumeDayUSD
      timestamp
    }
    tvlList: liquidityHistory(orderBy: timestamp_ASC) {
      liquidity
      liquidityUSD
      timestamp
    }
    firstPrice: priceHistory(limit: 1, orderBy: timestamp_DESC, where: {timestamp_lte: "${dayAgo(
      now
    )}"}) {
      usdPrice
    }
    lastPrice: priceHistory(limit: 1, orderBy: timestamp_DESC) {
      usdPrice
    }
    priceList: priceHistory(orderBy: timestamp_ASC) {
      usdPrice
      timestamp
    }
    tvl: liquidityHistory(where: {timestamp_gte: "${dayAgo(now)}"}) {
      liquidity
      liquidityUSD
      timestamp
    }
    tvlPrev: liquidityHistory(where: {timestamp_gte: "${dayAgo(
      dayAgo(now)
    )}"}) {
      liquidity
      liquidityUSD
      timestamp
    }
    volume1Day: volumeDayHistory(where: {timestamp_gte: "${dayAgo(now)}"}) {
      volumeDayNative
      volumeDayUSD
      timestamp
    }
    volumePrev1Day: volumeDayHistory(where: {timestamp_gte: "${dayAgo(
      dayAgo(now)
    )}"}) {
      volumeDayNative
      volumeDayUSD
      timestamp
    }
    volume7Day: volumeDayHistory(where: {timestamp_gte: "${sevenDayAgo(
      now
    )}"}) {
      volumeDayNative
      volumeDayUSD
    }
  `;
};

export const currencyDataQuery = (id: string) => {
  return `
query currencyData {
  currency: currencyById(id: "${id}") {
    ${currencyParams()}
  }
  pools(where: {currencyOne: {id_eq: "${id}"}, OR: {currencyZero: {id_eq: "${id}"}}}) {
    ${poolParams()}
  }
}`;
};
