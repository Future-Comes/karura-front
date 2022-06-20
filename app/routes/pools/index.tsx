import React from "react";
import { Table } from "~/components/Table";
import { useLoaderData } from "@remix-run/react";
import { LoadPaginator } from "~/components/Paginator/LoadPaginator";
import { poolsSchema } from "~/tableSchemas";

import { fetchFromApi } from "~/utils/utils";
import { poolsPageQuery, poolsPageTransform } from "~/api-queries/poolsPage";
import type { Result } from "~/api-queries/poolsPage";

export const loader = async (): Promise<Result> => {
  const data = await fetchFromApi(poolsPageQuery());

  return poolsPageTransform(data);
};

export default function Index() {
  const data = useLoaderData<Result>();

  return (
    <>
      <h1 className="text-6xl">Pools</h1>
      <LoadPaginator
        loadDataUrl="/api/poolsData"
        totalCount={data.totalCount}
        component={Table}
        items={data.pools}
        schema={poolsSchema}
      />
    </>
  );
}
