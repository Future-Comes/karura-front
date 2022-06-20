import { IndexCell, PoolNameCell, ValueCell } from "~/components/Table";

import type { TableColumn } from "~/components/Table";
import type { Pool } from "~/api-queries/poolData";

export const poolsSchema: TableColumn<Pool>[] = [
  {
    title: "#",
    key: "id",
    value: IndexCell,
  },
  {
    title: "Name",
    width: 80,
    key: "pool",
    value: PoolNameCell,
  },
  {
    title: "TVL",
    textAlign: "text-center",
    key: "tvl",
    sortable: true,
    value: ValueCell,
  },
  {
    title: "Volume 24H",
    textAlign: "text-center",
    key: "volume1Day",
    sortable: true,
    value: ValueCell,
  },
  {
    title: "Volume 7D",
    textAlign: "text-center",
    key: "volume7Day",
    sortable: true,
    value: ValueCell,
  },
];
