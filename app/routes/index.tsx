import React from "react";
import { useLoaderData } from "@remix-run/react";

import {
  ChartHeader,
  LineChartFallback,
  HistogramChartFallback,
} from "~/components/Charts";
import { fetchFromApi, numToString } from "~/utils/utils";
import { ClientSuspense } from "~/utils/ClientSuspense";
import { poolsSchema, currenciesSchema } from "~/tableSchemas";

import { Table } from "~/components/Table";
import { InfoList } from "~/components/InfoList/InfoList";
import { Paginator } from "~/components/Paginator/Paginator";
import { SectionHeader } from "~/components/Texts/SectionHeader";

import { query, indexPageTransform } from "~/api-queries/indexPage";

import type { MouseEventParams, SingleValueData } from "lightweight-charts";
import type { Result } from "~/api-queries/indexPage";

export const loader = async () => {
  const data = await fetchFromApi(query());

  return indexPageTransform(data);
};

const LineChart = React.lazy(
  () => import("~/components/Charts/LineChart/LineChart")
);

const HistogramChart = React.lazy(
  () => import("~/components/Charts/HistogramChart/HistogramChart")
);

const HistogramChartBlock: React.FC<{ data: SingleValueData[] }> = ({
  data,
}) => {
  const [currentHistogramPoint, setCurrentHistogramPoint] =
    React.useState<SingleValueData | null>(() => {
      return data.length ? data[data.length - 1] : null;
    });

  const changeHistogramPointHandler = React.useCallback(
    (params: MouseEventParams) => {
      if (params.time && params.point) {
        setCurrentHistogramPoint((prev) => {
          return prev?.time === params.time
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
    <div className="flex flex-col w-1/2">
      {currentHistogramPoint && (
        <ChartHeader
          value={`$${numToString(currentHistogramPoint.value)}`}
          title={"Volume 24H"}
          date={currentHistogramPoint.time}
        />
      )}
      <ClientSuspense fallback={<HistogramChartFallback />}>
        <HistogramChart
          data={data}
          onChangePoint={changeHistogramPointHandler}
        />
      </ClientSuspense>
    </div>
  );
};

const LineChartBLock: React.FC<{ data: SingleValueData[] }> = ({ data }) => {
  const [currentPoint, setCurrentPoint] =
    React.useState<SingleValueData | null>(() => {
      return data.length ? data[data.length - 1] : null;
    });

  const changePointHandler = React.useCallback(
    (params: MouseEventParams) => {
      if (params.time && params.point) {
        setCurrentPoint((prev) => {
          return prev?.time === params.time
            ? prev
            : data.find(({ time }) => {
                return time === params.time;
              }) || data[data.length - 1];
        });
      } else if (data.length) {
        setCurrentPoint(data[data.length - 1]);
      }
    },
    [data]
  );
  return (
    <div className="flex flex-col w-1/2">
      {currentPoint && (
        <ChartHeader
          value={`$${numToString(currentPoint.value)}`}
          title={"TVL"}
          date={currentPoint.time}
        />
      )}
      <ClientSuspense fallback={<LineChartFallback />}>
        <LineChart data={data} onChangePoint={changePointHandler} />
      </ClientSuspense>
    </div>
  );
};

export default function Index() {
  const {
    commonInfo,
    currenciesTableData,
    poolsTableData,
    totalTVLData,
    totalVolumeData,
  } = useLoaderData<Result>();

  return (
    <>
      <section className="flex gap-x-20">
        <LineChartBLock data={totalTVLData} />
        <HistogramChartBlock data={totalVolumeData} />
      </section>
      <section>
        <InfoList list={commonInfo} />
      </section>
      <section>
        <SectionHeader link={{ to: "/currencies", text: "View all →" }}>
          Top currencies
        </SectionHeader>
        <Paginator
          component={Table}
          limit={25}
          loadDataUrl="/api/currenciesData"
          items={currenciesTableData}
          schema={currenciesSchema}
        />
      </section>
      <section>
        <SectionHeader link={{ to: "/pools", text: "View all →" }}>
          Top Pools
        </SectionHeader>
        <Paginator
          component={Table}
          limit={25}
          loadDataUrl="/api/poolsData"
          items={poolsTableData}
          schema={poolsSchema}
        />
      </section>
    </>
  );
}
