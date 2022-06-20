import React from "react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import clsx from "clsx";
import { Breadcrumbs } from "~/components/Breadcrumbs/Breadcrumbs";
import type { MouseEventParams, SingleValueData } from "lightweight-charts";
import { HistogramChartFallback, LineChartFallback } from "~/components/Charts";
import { ClientSuspense } from "~/utils/ClientSuspense";
import { fetchFromApi, numToString } from "~/utils/utils";
import {
  currencyDataQuery,
  currencyDataTransform,
} from "~/api-queries/currencyData";
import { CurrencyLogo } from "~/components/CurrencyLogo";
import { VerticalInfo } from "~/components/InfoList/VerticalInfo";
import { Paginator } from "~/components/Paginator/Paginator";
import { Table } from "~/components/Table";
import { poolsSchema, transactionsSchema } from "~/tableSchemas";
import { SectionHeader } from "~/components/Texts/SectionHeader";
import { transactionsDataQuery } from "~/api-queries/transactionsData/transactionsData.query";
import type { TransactionTable } from "~/api-queries/transactionsData/transactionsData.transform";
import {
  convertTransaction,
  Reason,
} from "~/api-queries/transactionsData/transactionsData.transform";
import { Pg } from "~/components/Pg/Pg";

enum ChartType {
  line = "line",
  histigram = "histigram",
}

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id || "";

  const query = await fetchFromApi(currencyDataQuery(id));
  const {
    currency,
    poolsTableData,
    commonInfo,
    volumeList,
    tvlList,
    priceList,
  } = currencyDataTransform(query);
  const { transactions } = await fetchFromApi(transactionsDataQuery(id));
  const transactionsData = convertTransaction(transactions);

  return {
    currency,
    poolsTableData,
    commonInfo,
    volumeList,
    tvlList,
    priceList,
    transactionsData,
  };
};

const HistogramChart = React.lazy(
  () => import("~/components/Charts/HistogramChart/HistogramChart")
);

const LineChart = React.lazy(
  () => import("~/components/Charts/LineChart/LineChart")
);

const CHART_TABS = [{ name: "Volume" }, { name: "TVL" }, { name: "Price" }];
const TRANS_TABS = [
  { name: "All", value: [Reason.SWAP, Reason.ADD, Reason.REMOVE] },
  { name: "Swaps", value: [Reason.SWAP] },
  { name: "Adds", value: [Reason.ADD] },
  { name: "Removes", value: [Reason.REMOVE] },
];

const ChartBlock: React.FC<{
  data: SingleValueData[];
  type: ChartType;
}> = ({ data, type }) => {
  const [currentHistogramPoint, setCurrentHistogramPoint] =
    React.useState<SingleValueData>(() => data[data.length - 1]);

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
    <>
      <div className="border-b-2 border-gray-300 pb-4 text-4xl">
        ${numToString(currentHistogramPoint.value)}
      </div>

      {type === "line" && (
        <ClientSuspense fallback={<LineChartFallback />}>
          <LineChart data={data} onChangePoint={changeHistogramPointHandler} />
        </ClientSuspense>
      )}
      {type === "histigram" && (
        <ClientSuspense fallback={<HistogramChartFallback />}>
          <HistogramChart
            data={data}
            onChangePoint={changeHistogramPointHandler}
          />
        </ClientSuspense>
      )}
    </>
  );
};

export default function CurrencyPage() {
  const {
    currency,
    poolsTableData,
    commonInfo,
    volumeList,
    tvlList,
    priceList,
    transactionsData,
  } = useLoaderData();
  const [activeChartTab, setActiveChartTab] = React.useState(CHART_TABS[0]);
  const [chartData, setChartData] = React.useState(volumeList);
  const [chartType, setChartType] = React.useState(ChartType.histigram);
  const [activeTransTab, setActiveTransTab] = React.useState(TRANS_TABS[0]);

  React.useEffect(() => {
    switch (activeChartTab.name) {
      case "Volume":
        setChartData(volumeList);
        setChartType(ChartType.histigram);
        break;
      case "TVL":
        setChartData(tvlList);
        setChartType(ChartType.line);
        break;
      case "Price":
        setChartData(priceList);
        setChartType(ChartType.line);
        break;
    }
  }, [volumeList, tvlList, priceList, activeChartTab]);

  const getTransTabs = TRANS_TABS.map((tab, i) => (
    <div
      key={i}
      onClick={() => setActiveTransTab(tab)}
      className={clsx(
        "hover:text-white",
        tab === activeTransTab
          ? "cursor-default text-white"
          : "cursor-pointer text-gray-300 "
      )}
    >
      {tab.name}
    </div>
  ));

  return (
    <>
      <Breadcrumbs
        links={[
          {
            title: "Home",
            to: "/",
          },
          {
            title: "Currencies",
            to: "/currencies",
          },
          {
            title: currency.currency.symbol,
            to: "/currencies/" + currency.currency.symbol,
          },
        ]}
      />
      <div className="flex items-center mt-4">
        <CurrencyLogo className="w-12 h-12" currencyId={currency.id} />
        <div className="text-white text-6xl mx-4">{currency.currency.name}</div>
        <span className="text-gray-300 text-2xl">
          ({currency.currency.symbol})
        </span>
      </div>
      <div className="flex mt-10">
        <div className="w-full relative">
          <ChartBlock data={chartData} type={chartType} />
          <div className="flex absolute right-0 top-0 leading-10 text-2xl text-accent">
            {CHART_TABS.map((tab, i) => (
              <div
                key={i}
                onClick={() => setActiveChartTab(tab)}
                className={clsx(
                  "pb-4 ml-8 hover:text-white hover:border-accent hover:border-b-2",
                  tab === activeChartTab
                    ? "text-white border-accent border-b-2"
                    : "cursor-pointer"
                )}
              >
                {tab.name}
              </div>
            ))}
          </div>
        </div>
        <div className="ml-20">
          <VerticalInfo list={commonInfo} />
        </div>
      </div>
      <section>
        <SectionHeader>Pools</SectionHeader>
        <Paginator
          component={Table}
          limit={100}
          loadDataUrl="/api/currencyData"
          loadDataParams={{ id: currency.id }}
          items={poolsTableData}
          schema={poolsSchema}
        />
      </section>
      <section>
        <SectionHeader>Transactions</SectionHeader>
        <Pg<TransactionTable>
          component={Table}
          loadDataUrl="/api/transactionsData"
          loadDataParams={{ id: currency.id }}
          data={transactionsData}
          schema={transactionsSchema}
        />
      </section>
    </>
  );
}
