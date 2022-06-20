import { capitalize } from "lodash";
import type { Currency } from "~/common.types";
import type { Connection } from "~/common.types";
import type { PaginatorData } from "~/components/Pg/Pg";

export enum Reason {
  ADD = "ADD",
  SWAP = "SWAP",
  REMOVE = "REMOVE",
}

export interface Transaction {
  timestamp: string;
  reason: Reason;
  amountOne: number;
  amountZero: number;
  currencyZero: Currency;
  currencyOne: Currency;
  account: string;
  totalValue: number;
  hash: string;
  eventId: string;
}

export interface TransactionTable {
  id: string;
  event: {
    text: string;
    link: string;
  };
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
  type: Reason;
}

export const convertTransaction = (
  connection: Connection<Transaction>
): PaginatorData<TransactionTable> => {
  const { totalCount, pageInfo, edges } = connection;
  const items = edges.map(
    ({
      node: {
        reason,
        currencyZero,
        currencyOne,
        totalValue,
        amountZero,
        amountOne,
        account,
        timestamp,
        hash,
        eventId,
      },
    }) => ({
      id: `${hash}`,
      event: {
        text: `${capitalize(reason)} ${currencyZero.name} for ${
          currencyOne.name
        }`,
        link: `https://karura.subscan.io/extrinsic/${hash}?event=${eventId}`,
      },
      totalValue,
      tokenAmountZero: {
        price: amountZero,
        name: currencyZero.name,
      },
      tokenAmountOne: {
        price: amountOne,
        name: currencyOne.name,
      },
      account,
      time: timestamp,
      type: reason,
    })
  );

  return { totalCount, items, pageInfo };
};
