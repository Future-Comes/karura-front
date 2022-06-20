import {
  IndexCell,
  PriceChangeCell,
  CurrencyNameCell,
  ValueCell,
} from "~/components/Table";
import { RangeFilter } from "~/components/Table/Filters";

import type { TableColumn } from "~/components/Table";
import type { Currency } from "~/api-queries/currencyData";

export const currenciesSchema: TableColumn<Currency>[] = [
  {
    title: "#",
    key: "id",
    value: IndexCell,
  },
  {
    title: "Name",
    width: 80,
    key: "currency",
    value: CurrencyNameCell,
  },
  {
    title: "Price",
    textAlign: "text-center",
    key: "price",
    sortable: true,
    filter: {
      component: RangeFilter,
      params: {
        title: "Price",
      },
    },
    value: ValueCell,
  },
  {
    title: "Price Change",
    textAlign: "text-center",
    key: "priceChange",
    sortable: true,
    filter: {
      component: RangeFilter,
      params: {
        title: "Price Change",
        min: -100,
        max: 100,
      },
    },
    value: PriceChangeCell,
  },
  {
    title: "Volume 24H",
    textAlign: "text-center",
    key: "volume",
    sortable: true,
    value: ValueCell,
  },
  {
    title: "TVL",
    textAlign: "text-center",
    key: "tvl",
    sortable: true,
    value: ValueCell,
  },
];
