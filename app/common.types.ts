export interface ChartElement {
  time: string | number;
  value: number;
}

export interface PageInfo {
  endCursor: string;
  startCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Connection<T> {
  totalCount: number;
  pageInfo: PageInfo;
  edges: { node: T }[];
}

export interface Volume {
  volumeDayUSD: number;
  date: string;
}

export interface TVL {
  usdTotalLiquidity: number;
  usdPriceZero: number;
  usdPriceOne: number;
  date: string;
}

export interface PriceHistory {
  usdPrice: number;
}

export interface CurrencyTableItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  volume: number;
  TVL: number;
}

export interface TransactionTableItem {
  id: string;
  event: string;
  totalValue: number;
  tokenAmountZero: {
    price: number;
    name: string;
  };
  tokenAmountOne: {
    price: number;
    name: string;
  };
  account: string;
  time: string;
}

export interface ChartValue {
  value: number;
  time: string;
}
