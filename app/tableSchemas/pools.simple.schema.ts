import { PoolNameCell, ValueCell } from "~/components/Table";

import type { TableColumn } from "~/components/Table";
import type { Pool } from "~/api-queries/poolData";

export const poolsSimpleSchema: TableColumn<Pool>[] = [
  {
    title: "Pools",
    width: 80,
    key: "pool",
    value: PoolNameCell,
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
    key: "volume1Day",
    value: ValueCell,
  },
  {
    title: "Volume 7D",
    textAlign: "text-right",
    key: "volume7Day",
    value: ValueCell,
  },
];
