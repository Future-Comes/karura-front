import type { BusinessDay } from "lightweight-charts";
import React from "react";
import { fetch } from "@remix-run/node";

const letters: Array<{ letter: string; digits: number }> = [
  { letter: "k", digits: 3 },
  { letter: "m", digits: 6 },
  { letter: "b", digits: 9 },
  { letter: "q", digits: 12 },
];

export const microToString = (num?: number): string => {
  if (!num) {
    return "0";
  }

  const result = Math.abs(num) / Math.pow(10, 12);

  return parseFloat(result.toFixed(2)).toString();
};

export const numToString = (num?: number): string => {
  if (!num) {
    return "0";
  }

  let result = Math.abs(num);
  let digits = 0;

  while (result > 1000) {
    digits += 3;
    result = result / 1000;
  }

  return (
    parseFloat(result.toFixed(2)) +
    (letters.find((i) => digits === i.digits)?.letter || "")
  );
};

export const isBusinessDay = (date: any): date is BusinessDay => {
  return typeof date.year !== "undefined";
};

export const typedMemo: <T>(c: T) => T = React.memo;

export const getPage = <T>({
  list,
  pageIndex,
  itemsOnPage,
}: {
  list: T[];
  pageIndex: number;
  itemsOnPage: number;
}): T[] => {
  return list.slice(pageIndex * itemsOnPage, (pageIndex + 1) * itemsOnPage);
};

export const makeSort =
  ({ key, direction }: { key: string; direction: "ASC" | "DESC" }) =>
  (a: any, b: any): number => {
    const sortDirectionValue = direction === "ASC" ? 1 : -1;

    return a[key] === b[key]
      ? 0
      : a[key] > b[key]
      ? sortDirectionValue
      : -sortDirectionValue;
  };

export const makeRangeFilter =
  ({
    key,
    params,
  }: {
    key: string;
    params: {
      from?: number;
      to?: number;
    };
  }) =>
  (item: Record<string, any>): boolean => {
    if (params.from && item[key] < params.from) {
      return false;
    }

    return !(params.to && item[key] > params.to);
  };

export const getChangePercent = (cur: number, prev: number): number => {
  return 100 * (cur / prev - 1);
};

export const fetchFromApi = async (query: string) => {
  const res = await fetch(
    // "https://app.gc.subsquid.io/beta/karura-dashboard/main/graphql",
    "http://localhost:4350/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    }
  );

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
};
