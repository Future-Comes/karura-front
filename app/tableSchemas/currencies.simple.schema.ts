import { CurrencyNameCell, ValueCell } from "~/components/Table";

import type { TableColumn } from "~/components/Table";
import type { Currency } from "~/api-queries/currencyData";

export const currenciesSimpleSchema: TableColumn<Currency>[] = [
  {
    title: "Currencies",
    width: 80,
    key: "currency",
    value: CurrencyNameCell,
  },
  {
    title: "TVL",
    textAlign: "text-right",
    key: "tvl",
    value: ValueCell,
  },
  {
    title: "Volume 24H",
    textAlign: "text-right",
    key: "volume",
    value: ValueCell,
  },
  {
    title: "Price",
    textAlign: "text-right",
    key: "price",
    value: ValueCell,
  },
];
