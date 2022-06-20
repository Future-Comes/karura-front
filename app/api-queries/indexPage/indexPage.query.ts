import { dayTimestamp } from "~/constants/time.contants";
import { poolParams } from "~/api-queries/poolData";
import { currencyParams } from "~/api-queries/currencyData";

export const query = () => {
  const monthAgo = Date.now() - dayTimestamp * 30;

  return `
query indexPage {
  currencies(limit: 25) {
    ${currencyParams()}
  }
  pools(limit: 25) {
    ${poolParams()}
  }
  infoList: pools {
    volume: volumeDaysDay(orderBy: timestamp_DESC, where: {timestamp_gte: "${monthAgo}"}) {
      volumeDayUSD
      timestamp
    }
    TVL: liquidityHistory(orderBy: timestamp_DESC, where: {timestamp_gte: "${monthAgo}"}) {
      usdTotalLiquidity
      timestamp
    }
  }
}`;
};
