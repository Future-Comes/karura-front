import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import React from "react";
import clsx from "clsx";

import { Breadcrumbs } from "~/components/Breadcrumbs/Breadcrumbs";
import { CurrenciesList } from "~/components/InfoList/CurrenciesList";
import { VerticalInfo } from "~/components/InfoList/VerticalInfo";
import { HistogramChartFallback } from "~/components/Charts";
import { SectionHeader } from "~/components/Texts/SectionHeader";
import { Table } from "~/components/Table";

import { fetchFromApi, numToString } from "~/utils/utils";
import { ClientSuspense } from "~/utils/ClientSuspense";
import { transactionsSchema } from "~/tableSchemas/transactions.schema";

import type { MouseEventParams, SingleValueData } from "lightweight-charts";
import { poolDataQuery, poolDataTransform } from "~/api-queries/poolData";
import { CurrencyLogo } from "~/components/CurrencyLogo";
import type { TransactionTable } from "~/api-queries/transactionsData/transactionsData.transform";
import { Pg } from "~/components/Pg/Pg";
import { transactionsDataQuery } from "~/api-queries/transactionsData/transactionsData.query";
import { convertTransaction } from "~/api-queries/transactionsData/transactionsData.transform";

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id || "";

  const query = await fetchFromApi(poolDataQuery(id));
  const { data, volumeList, tvlList, commonInfo } = poolDataTransform(
    query.pool
  );
  const { transactions } = await fetchFromApi(
    transactionsDataQuery([data.pool.from.id, data.pool.to.id])
  );
  const transactionsData = convertTransaction(transactions);

  return {
    data,
    currenciesList: [
      {
        currency: data.pool.from,
        value: data.pool.from.tvl,
      },

      {
        currency: data.pool.to,
        value: data.pool.to.tvl,
      },
    ],
    volumeList,
    tvlList,
    commonInfo,
    transactionsData,
  };
};

const tabs = [{ name: "Volume" }, { name: "TVL" }];

const HistogramChart = React.lazy(
  () => import("~/components/Charts/HistogramChart/HistogramChart")
);

const HistogramChartBlock: React.FC<{ data: SingleValueData[] }> = ({
  data,
}) => {
  const [currentHistogramPoint, setCurrentHistogramPoint] =
    React.useState<SingleValueData>(() => {
      return data[data.length - 1];
    });

  const changeHistogramPointHandler = React.useCallback(
    (params: MouseEventParams) => {
      if (params.time && params.point) {
        setCurrentHistogramPoint((prev) => {
          return prev.time === params.time
            ? prev
            : data.find(({ time }) => {
                return time === params.time;
              }) || data[data.length - 1];
        });
      } else {
        setCurrentHistogramPoint(data[data.length - 1]);
      }
    },
    [data]
  );

  return (
    <div className="flex flex-col grow">
      <div className="border-b-2 border-gray-300 pb-4 text-4xl">
        ${numToString(currentHistogramPoint.value)}
      </div>
      <div className="grow">
        <ClientSuspense fallback={<HistogramChartFallback />}>
          <HistogramChart
            data={data}
            onChangePoint={changeHistogramPointHandler}
          />
        </ClientSuspense>
      </div>
    </div>
  );
};

export default function CurrencyPage() {
  const {
    data,
    volumeList,
    tvlList,
    commonInfo,
    currenciesList,
    transactionsData,
  } = useLoaderData();
  const { pool } = data;

  const [activeTab, setActiveTab] = React.useState(() => {
    return tabs[0];
  });

  let chartData = volumeList;

  switch (activeTab.name) {
    case "Volume":
      chartData = volumeList;
      break;
    case "TVL":
      chartData = tvlList;
      break;
  }

  return (
    <>
      <Breadcrumbs
        links={[
          {
            title: "Home",
            to: "/",
          },
          {
            title: "Pools",
            to: "/pools",
          },
          {
            title: `${pool.from.name}-${pool.to.name}`,
            to: "/pools/" + pool.id,
          },
        ]}
      />
      <div className="flex items-center text-6xl text-white font-light">
        <CurrencyLogo className="w-12 h-12" currencyId={pool.from.id} />
        <div className="text-white mx-4">
          {pool.from.name}
          <div className="text-2xl text-gray-300 font-normal -mb-7">
            {numToString(pool.from.price / pool.to.price)} {pool.to.name}
          </div>
        </div>
        <div className="text-gray-300 mr-4">/</div>
        <CurrencyLogo className="w-12 h-12" currencyId={pool.to.id} />
        <div className="text-white mx-4">
          {pool.to.name}
          <div className="text-2xl text-gray-300 font-normal -mb-7">
            {numToString(pool.to.price / pool.from.price)} {pool.from.name}
          </div>
        </div>
      </div>
      <div className="flex mt-16 items-stretch">
        <div className="w-full relative flex flex-col">
          <HistogramChartBlock data={chartData} />
          <div className="flex absolute right-0 top-0 leading-10 text-2xl text-accent">
            {tabs.map((tab, i) => (
              <div
                key={i}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "pb-4 ml-8 hover:text-white hover:border-accent hover:border-b-2",
                  tab === activeTab
                    ? "text-white border-accent border-b-2"
                    : "cursor-pointer"
                )}
              >
                {tab.name}
              </div>
            ))}
          </div>
        </div>
        <div className="ml-20 whitespace-nowrap">
          <CurrenciesList
            title="Total Currencies Locked"
            list={currenciesList}
          />
          <VerticalInfo list={commonInfo} />
        </div>
      </div>
      <section>
        <SectionHeader>Transactions</SectionHeader>
        <Pg<TransactionTable>
          component={Table}
          loadDataUrl="/api/transactionsData"
          loadDataParams={{ id: [pool.from.id, pool.to.id] }}
          data={transactionsData}
          schema={transactionsSchema}
        />
      </section>
    </>
  );
}
