import React from "react";
import { typedMemo } from "~/utils/utils";
import type { Props as TableProps } from "~/components/Table/Table";
import { useFetcher } from "@remix-run/react";

export type Props<T extends { id: string }> = {
  component: React.FC<TableProps<T>>;
  loadDataUrl: string;
  totalCount: number;
} & Omit<TableProps<T>, "addFiltersHandler">;

const ITEMS_ON_PAGE = 5;

export const LoadPaginator = typedMemo(function LoadPaginator<
  T extends { id: string }
>({ component: Component, totalCount, loadDataUrl, ...rest }: Props<T>) {
  const pagesCount = React.useMemo(() => {
    return Math.ceil(totalCount / ITEMS_ON_PAGE);
  }, [totalCount]);

  const fetcher = useFetcher();

  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [filters, setFilters] = React.useState("");
  const [items, setItems] = React.useState(rest.items);

  const loadMore = React.useCallback(
    (filters, pageIndex) => {
      setCurrentPageIndex(pageIndex);
      fetcher.load(
        `${loadDataUrl}?${filters}${
          filters ? "&" : ""
        }limit=${ITEMS_ON_PAGE}&offset=${pageIndex * ITEMS_ON_PAGE}`
      );
    },
    [loadDataUrl]
  );

  const addFiltersHandler = React.useCallback(
    (filters) => {
      setItems([]);
      setFilters(filters);
      loadMore(filters, 0);
    },
    [loadMore]
  );

  React.useEffect(() => {
    if (fetcher.data) {
      setItems((prev) => [...prev, ...fetcher.data]);
    }
  }, [fetcher.data]);

  return (
    <>
      <Component
        {...rest}
        items={items}
        addFiltersHandler={addFiltersHandler}
      />
      {fetcher.state === "submitting" ? (
        <div>"Loading..."</div>
      ) : pagesCount > 1 && currentPageIndex < pagesCount - 1 ? (
        <div
          onClick={() => loadMore(filters, currentPageIndex + 1)}
          className="flex my-9 text-2xl justify-center cursor-pointer items-center text-accent"
        >
          Load more
        </div>
      ) : null}
    </>
  );
});
