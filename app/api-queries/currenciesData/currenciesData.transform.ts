import { makeRangeFilter, makeSort } from "~/utils/utils";
import { convertCurrency } from "../currencyData";
import type { CurrencyRaw, Currency } from "../currencyData";

interface Data {
  currencies: CurrencyRaw[];
}

export const currenciesDataTransform = (
  data: Data,
  filters?: URLSearchParams
): Currency[] => {
  let currencies = data.currencies.map(convertCurrency);
  const limit = parseInt(filters?.get("limit") || "0");
  const offset = parseInt(filters?.get("offset") || "0");

  if (filters) {
    for (let [typeOrKey, value] of filters) {
      if (!value || value === "undefined") {
        continue;
      }
      switch (typeOrKey) {
        case "sort":
          currencies.sort(makeSort(JSON.parse(value) as any));
          break;
        default:
          currencies = currencies.filter(
            makeRangeFilter({
              key: typeOrKey,
              params: JSON.parse(value) as any,
            })
          );
      }
    }
  }

  if (limit) {
    currencies = currencies.slice(offset, offset + limit);
  }

  return currencies;
};
