import {
  ValueCell,
  TimeCell,
  AmountCell,
  LinkCell,
  AccountCell,
} from "~/components/Table";

import type { TableColumn } from "~/components/Table";
import type { TransactionTableItem } from "~/common.types";

export const transactionsSchema: TableColumn<TransactionTableItem>[] = [
  {
    title: "",
    key: "event",
    value: LinkCell,
  },
  {
    title: "Total Value",
    textAlign: "text-center",
    key: "totalValue",
    width: 13,
    value: ValueCell,
  },
  {
    title: "Token Amount",
    textAlign: "text-center",
    key: "tokenAmountZero",
    width: 13,
    value: AmountCell,
  },
  {
    title: "Token Amount",
    textAlign: "text-center",
    key: "tokenAmountOne",
    width: 13,
    value: AmountCell,
  },
  {
    title: "Account",
    textAlign: "text-center",
    key: "account",
    width: 15,
    value: AccountCell,
  },
  {
    title: "Time",
    textAlign: "text-center",
    key: "time",
    width: 13,
    value: TimeCell,
  },
];
