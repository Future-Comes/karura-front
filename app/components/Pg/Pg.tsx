import React from "react";
import clsx from "clsx";
import type { Props as TableProps } from "~/components/Table/Table";
import { typedMemo } from "~/utils/utils";
import { useFetcher } from "@remix-run/react";
import type { PageInfo } from "~/common.types";

export interface PaginatorData<T> {
  totalCount: number;
  items: T[];
  pageInfo: PageInfo;
}

export type Props<T extends { id: string }> = {
  component: React.FC<TableProps<T>>;
  data: PaginatorData<T>;
  loadDataUrl: string;
  loadDataParams?: Record<string, any>;
  buttons?: React.ReactNode;
} & Omit<TableProps<T[]>, "addFiltersHandler">;

const Arrow: React.FC<{
  isActive: boolean;
  onClick: () => void;
  direction: "left" | "right";
}> = ({ isActive, onClick, direction }) => {
  return (
    <div
      className={clsx(
        direction === "left" ? "mr-12" : "ml-12",
        !isActive
          ? "text-transparent cursor-default select-none"
          : "cursor-pointer hover:text-accent-hover"
      )}
      onClick={onClick}
    >
      {direction === "left" ? "←" : "→"}
    </div>
  );
};

const LIMIT = 10;

export const Pg = typedMemo(function Paginator<T extends { id: string }>({
  component: Component,
  data,
  loadDataUrl,
  loadDataParams,
  ...rest
}: Props<T>) {
  const fetcher = useFetcher();
  const [info, setInfo] = React.useState(data);

  const params = loadDataParams
    ? `${new URLSearchParams(loadDataParams).toString()}&`
    : "";

  const pageNumber = React.useMemo(() => {
    return Number(info.pageInfo.endCursor) / LIMIT;
  }, [info.pageInfo.endCursor]);
  const pagesCount = React.useMemo(() => {
    return Math.ceil(Number(info.totalCount) / LIMIT);
  }, [info.totalCount]);

  const prevPageHandler = React.useCallback(() => {
    const cursor = Number(info.pageInfo.startCursor) - LIMIT - 1;
    fetcher.load(`${loadDataUrl}?${params}cursor=${cursor.toString()}`);
  }, [info.pageInfo.startCursor]);
  const nextPageHandler = React.useCallback(() => {
    fetcher.load(`${loadDataUrl}?${params}cursor=${info.pageInfo.endCursor}`);
  }, [info.pageInfo.endCursor]);

  const addFiltersHandler = React.useCallback(
    (filters: string) => {
      fetcher.load(
        `${loadDataUrl}?${params}${filters}${filters ? "&" : ""}cursor="0"`
      );
    },
    [loadDataParams]
  );

  React.useEffect(() => {
    if (fetcher.data) {
      setInfo(fetcher.data);
    }
  }, [fetcher.data]);

  return (
    <>
      <Component
        {...rest}
        items={info.items}
        addFiltersHandler={addFiltersHandler}
        buttons={rest.buttons}
      />
      {pagesCount > 1 ? (
        <div className="flex my-9 text-2xl justify-center items-center text-accent user-select-none">
          <Arrow
            isActive={info.pageInfo.hasPreviousPage}
            direction="left"
            onClick={prevPageHandler}
          />
          <div className="text-white text-sm">
            Page {pageNumber} of {pagesCount}
          </div>
          <Arrow
            isActive={info.pageInfo.hasNextPage}
            onClick={nextPageHandler}
            direction="right"
          />
        </div>
      ) : null}
    </>
  );
});
