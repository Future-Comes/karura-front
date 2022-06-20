import type { LoaderFunction } from "@remix-run/node";
import { fetchFromApi } from "~/utils/utils";
import { searchDataQuery, searchDataTransform } from "~/api-queries/searchData";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const data = await fetchFromApi(
    searchDataQuery(url.searchParams.get("search"))
  );

  return searchDataTransform(data);
};
