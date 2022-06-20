import type { LoaderFunction } from "@remix-run/node";
import { fetchFromApi } from "~/utils/utils";
import {
  currenciesDataQuery,
  currenciesDataTransform,
} from "~/api-queries/currenciesData";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const data = await fetchFromApi(currenciesDataQuery());

  return currenciesDataTransform(data, url.searchParams);
};
