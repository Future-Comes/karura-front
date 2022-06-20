import type { LoaderFunction } from "@remix-run/node";
import { fetchFromApi } from "~/utils/utils";
import { currencyDataQuery } from "~/api-queries/currencyData";
import { poolsDataTransform } from "~/api-queries/poolsData";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams?.get("id");

  if (id) {
    const { pools } = await fetchFromApi(currencyDataQuery(id));

    return poolsDataTransform({ pools }, url.searchParams);
  }

  return null;
};
