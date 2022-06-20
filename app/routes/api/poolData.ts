import type { LoaderFunction } from "@remix-run/node";
import { fetchFromApi } from "~/utils/utils";
import { poolDataQuery, poolDataTransform } from "~/api-queries/poolData";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams?.get("id");

  if (id) {
    const data = await fetchFromApi(poolDataQuery(id));

    return poolDataTransform(data, url.searchParams);
  }

  return null;
};
