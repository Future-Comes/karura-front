import React from "react";
import clsx from "clsx";
import type { Props as TableProps } from "~/components/Table/Table";
import { getPage, typedMemo } from "~/utils/utils";
import { useFetcher } from "@remix-run/react";

export type Props<T extends { id: string }> = {
  component: React.FC<TableProps<T>>;
  loadDataUrl: string;
  loadDataParams?: Record<string, any>;
  limit: number;
  buttons?: React.ReactNode;
} & Omit<TableProps<T>, "addFiltersHandler">;

const Arrow: React.FC<{
  isActive: boolean;
  onClick: () => void;
  direction: "left" | "right";
}> = ({ isActive, onClick, direction }) => {
  return (
    <div
      className={clsx(
        direction === "left" ? "mr-12" : "ml-12",
        isActive
          ? "text-transparent cursor-default select-none"
          : "cursor-pointer hover:text-accent-hover"
      )}
      onClick={onClick}
    >
      {direction === "left" ? "←" : "→"}
    </div>
  );
};

export const Paginator = typedMemo(function Paginator<
  T extends { id: string }
>({
  component: Component,
  loadDataUrl,
  loadDataParams,
  limit,
  ...rest
}: Props<T>) {
  const data = rest.items;
  const fetcher = useFetcher();
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [sortedItems, setSortedItems] = React.useState(data);
  const [items, setItems] = React.useState(() =>
    getPage({
      list: sortedItems,
      pageIndex: currentPageIndex - 1,
      itemsOnPage: limit,
    })
  );

  const pagesCount = React.useMemo(() => {
    return Math.ceil(sortedItems.length / limit);
  }, [sortedItems.length]);

  const prevPageHandler = React.useCallback(() => {
    setCurrentPageIndex((prev) => (prev < 1 ? 0 : prev - 1));
  }, []);
  const nextPageHandler = React.useCallback(() => {
    setCurrentPageIndex((prev) =>
      prev > pagesCount - 1 ? pagesCount - 1 : prev + 1
    );
  }, [pagesCount]);

  const addFiltersHandler = React.useCallback(
    (filters: string) => {
      const params = loadDataParams
        ? `${new URLSearchParams(loadDataParams).toString()}&`
        : "";
      fetcher.load(
        `${loadDataUrl}?${params}${filters}${filters ? "&" : ""}limit=${limit}`
      );
    },
    [loadDataUrl, limit]
  );

  React.useEffect(() => {
    if (fetcher.data) {
      setSortedItems(fetcher.data);
    }
  }, [fetcher.data]);

  React.useEffect(() => {
    setItems(
      getPage({
        list: sortedItems,
        pageIndex: currentPageIndex - 1,
        itemsOnPage: limit,
      })
    );
  }, [sortedItems, currentPageIndex]);

  return (
    <>
      <Component
        {...rest}
        items={items}
        addFiltersHandler={addFiltersHandler}
        buttons={rest.buttons}
      />
      {pagesCount > 1 ? (
        <div className="flex my-9 text-2xl justify-center items-center text-accent user-select-none">
          <Arrow
            isActive={currentPageIndex === 1}
            direction="left"
            onClick={prevPageHandler}
          />
          <div className="text-white text-sm">
            Page {currentPageIndex} of {pagesCount}
          </div>
          <Arrow
            isActive={currentPageIndex === pagesCount}
            onClick={nextPageHandler}
            direction="right"
          />
        </div>
      ) : null}
    </>
  );
});
