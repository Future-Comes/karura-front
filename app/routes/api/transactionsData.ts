import type { LoaderFunction } from "@remix-run/node";
import { fetchFromApi } from "~/utils/utils";
import { transactionsDataQuery } from "~/api-queries/transactionsData/transactionsData.query";
import { convertTransaction } from "~/api-queries/transactionsData/transactionsData.transform";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams?.get("id");
  const cursor = url.searchParams?.get("cursor") || "0";
  const reason = url.searchParams?.get("reason");

  if (id) {
    const data = await fetchFromApi(transactionsDataQuery(id, cursor));

    return convertTransaction(data.transactions);
  }

  return null;
};
