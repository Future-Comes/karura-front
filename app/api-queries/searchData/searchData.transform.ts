import { convertPool } from "~/api-queries/poolData";

import type { PoolRaw, Pool } from "~/api-queries/poolData";
import type { Currency, CurrencyRaw } from "~/api-queries/currencyData";
import { convertCurrency } from "~/api-queries/currencyData";

interface Data {
  currencies: CurrencyRaw[];
  pools: PoolRaw[];
}

export interface Result {
  pools: Pool[];
  currencies: Currency[];
}

export const searchDataTransform = (data: Data): Result => {
  return {
    pools: data.pools.map(convertPool),
    currencies: data.currencies.map(convertCurrency),
  };
};
