import { dayTimestamp, sevenDayTimestamp } from "~/constants/time.contants";

export const poolParams = () => {
  const now = Date.now();
  const dayAgo = (now: number) => now - dayTimestamp;
  const sevenDayAgo = (now: number) => now - sevenDayTimestamp;

  return `
  id
  from: currencyZero {
    id
    name: currencyName
    priceHistory(limit: 1, orderBy: timestamp_DESC) {
        usdPrice
    }
  }
  to: currencyOne {
    id
    name: currencyName
    priceHistory(limit: 1, orderBy: timestamp_DESC) {
        usdPrice
    }
  }
  volumeList: volumeDaysDay(orderBy: timestamp_ASC) {
    volumeDayUSD
    timestamp
  }
  tvlList: liquidityHistory(orderBy: timestamp_ASC) {
    usdPriceOne
    usdPriceZero
    usdTotalLiquidity
    timestamp
  }
  tvl: liquidityHistory(where: {timestamp_gte: "${dayAgo(now)}"}) {
    usdPriceOne
    usdPriceZero
    usdTotalLiquidity
    timestamp
  }
  tvlPrev: liquidityHistory(where: {timestamp_gte: "${dayAgo(dayAgo(now))}"}) {
    usdPriceOne
    usdPriceZero
    usdTotalLiquidity
    timestamp
  } 
  volume1Day: volumeDaysDay(where: {timestamp_gte: "${dayAgo(now)}"}) {
    volumeDayUSD
    timestamp
  }
  volumePrev1Day: volumeDaysDay(where: {timestamp_gte: "${dayAgo(
    dayAgo(now)
  )}"}) {
    volumeDayUSD
    timestamp
  }
  volume7Day: volumeDaysDay(where: {timestamp_gte: "${sevenDayAgo(now)}"}) {
    volumeDayUSD
    timestamp
  }
`;
};

export const poolDataQuery = (id: string) => {
  return `
query poolData {
  pool: poolById(id: "${id}") {
    ${poolParams()}
  }
}`;
};
