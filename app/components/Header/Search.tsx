import React from "react";
import { useFetcher } from "@remix-run/react";

import SearchIcon from "~/components/Icons/SearchIcon";
import { SimpleTable } from "~/components/Table/SimpleTable";

import { useWindowClick } from "~/utils/useWindowClick";
import { poolsSimpleSchema } from "~/tableSchemas/pools.simple.schema";
import { currenciesSimpleSchema } from "~/tableSchemas/currencies.simple.schema";
import type { Result } from "~/api-queries/searchData";

export const Search = () => {
  const [open, setOpen] = React.useState(false);
  const fetcher = useFetcher<Result>();

  const close = React.useCallback(() => {
    setOpen(false);
  }, []);

  useWindowClick(close);

  React.useEffect(() => {
    if (fetcher.data) {
      setOpen(true);
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form method="get" action="/api/search" className="relative">
      <input
        required
        name="search"
        className="h-12 w-96 bg-black py-3 pl-5 pr-14 focus:outline-none rounded-full text-lg placeholder:text-gray-300"
        type="text"
        placeholder="Search pools & currencies"
        autoComplete="off"
      />
      <button
        type="submit"
        className="absolute w-5 h-5 top-0 right-5 bottom-0 my-auto text-accent hover:text-accent-hover"
      >
        <SearchIcon />
      </button>
      {open && (
        <div className="absolute w-[46rem] top--full right-0 px-6 py-8 mt-4 rounded bg-gray-200 z-20">
          <SimpleTable
            items={fetcher.data?.currencies || []}
            schema={currenciesSimpleSchema}
          />
          <SimpleTable
            className="mt-12"
            items={fetcher.data?.pools || []}
            schema={poolsSimpleSchema}
          />
        </div>
      )}
    </fetcher.Form>
  );
};
