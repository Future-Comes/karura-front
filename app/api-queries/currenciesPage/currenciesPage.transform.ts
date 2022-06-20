import type { CurrencyRaw, Currency } from "~/api-queries/currencyData";
import { convertCurrency } from "~/api-queries/currencyData";

interface Data {
  currencies: CurrencyRaw[];
  poolsData: {
    totalCount: number;
  };
}

export interface Result {
  currencies: Currency[];
  topMovers: Currency[];
  totalCount: number;
}

export const currenciesPageTransform = (data: Data): Result => {
  const currencies = data.currencies.map(convertCurrency);
  return {
    currencies: currencies.slice(0, 5),
    topMovers: currencies
      .sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange))
      .slice(0, 10),
    totalCount: data.currencies.length,
  };
};
