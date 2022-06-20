import React from "react";
import { Link, useLoaderData } from "@remix-run/react";

import { AutoSlider } from "~/components/AutoSlider/AutoSlider";
import { ChangeValue } from "~/components/Texts/ChangeValue";
import { fetchFromApi, numToString } from "~/utils/utils";
import { SectionHeader } from "~/components/Texts/SectionHeader";
import { Table } from "~/components/Table";
import { LoadPaginator } from "~/components/Paginator/LoadPaginator";
import { currenciesSchema } from "~/tableSchemas";
import type { Result } from "~/api-queries/currenciesPage";
import {
  currenciesPageQuery,
  currenciesPageTransform,
} from "~/api-queries/currenciesPage";
import { CurrencyLogo } from "~/components/CurrencyLogo";
import type { Currency } from "~/api-queries/currencyData";

export const loader = async () => {
  const data = await fetchFromApi(currenciesPageQuery());

  return currenciesPageTransform(data);
};

export default function Index() {
  const { topMovers, currencies, totalCount } = useLoaderData<Result>();

  return (
    <>
      <h1 className="text-6xl">Currencies</h1>
      <h2 className="text-2xl mt-16">Top movers</h2>
      <AutoSlider className="my-9">
        {topMovers.map((item: Currency, i: number) => {
          return (
            <Link
              to={`/currencies/${item.id}`}
              key={i}
              className="ml-12 first:ml-0 flex items-center"
            >
              <CurrencyLogo className="w-10 h-10" currencyId={item.id} />
              <div className="ml-4">
                {item.currency.symbol}
                <div className="mt-1 whitespace-nowrap">
                  ${numToString(item.price)}
                  <ChangeValue
                    className="ml-3"
                    value={item.priceChange}
                    after="%"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </AutoSlider>
      <section>
        <SectionHeader>All currencies</SectionHeader>
        <LoadPaginator
          loadDataUrl={"/api/currencies"}
          component={Table}
          items={currencies}
          totalCount={totalCount}
          schema={currenciesSchema}
        />
      </section>
    </>
  );
}
