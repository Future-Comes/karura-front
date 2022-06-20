import type { LoaderFunction } from "@remix-run/node";
import { fetchFromApi } from "~/utils/utils";
import { poolsDataQuery, poolsDataTransform } from "~/api-queries/poolsData";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const data = await fetchFromApi(poolsDataQuery());

  return poolsDataTransform(data, url.searchParams);
};
