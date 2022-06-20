import { typedMemo } from "~/utils/utils";
import clsx from "clsx";
import React from "react";
import type { Props, TableColumn } from "~/components/Table/Table";

type HeadProps<T extends { id: string }> = Pick<Props<T>, "schema"> & {
  onSortClick: (key: keyof T, direction: "ASC" | "DESC") => void;
  sortedKey?: keyof T | null;
  sortedDirection: "ASC" | "DESC";
  onApplyFilter: (key: keyof T, value: Record<string, any>) => void;
  onRemoveFilter: (key: keyof T) => void;
  filters: Record<keyof T, string>;
  buttons?: React.ReactNode;
};

export const TableHead = typedMemo(function TableHead<
  T extends { id: string }
>({
  schema,
  sortedDirection,
  sortedKey,
  onSortClick,
  onApplyFilter,
  onRemoveFilter,
  filters,
  buttons,
}: HeadProps<T>) {
  const noFilters = schema.every((s) => !s.filter);

  return (
    <thead className="text-gray-300 text-left">
      {buttons && (
        <div className="absolute flex pt-3 pb-5 gap-1">{buttons}</div>
      )}
      <tr>
        {schema.map((col: TableColumn<T>, i: number) => (
          <th
            className={clsx(
              "pt-3 font-normal border-b align-top border-gray-200 h-8 whitespace-nowrap",
              noFilters && "pb-5",
              col.textAlign === "text-center" ? "px-3" : " pr-7",
              col.textAlign || "text-left"
            )}
            key={i}
            style={{ width: col.width ? `${col.width}%` : "auto" }}
          >
            {col.filter?.inline ? (
              <col.filter.component
                {...col.filter.params}
                value={filters[col.key]}
                onApplyFilter={(value: {}) => onApplyFilter(col.key, value)}
              />
            ) : (
              <>
                <span
                  className={clsx(
                    col.sortable && "cursor-pointer hover:text-white",
                    sortedKey === col.key && "text-white"
                  )}
                  onClick={() => {
                    if (col.sortable) {
                      onSortClick(
                        col.key,
                        col.key === sortedKey
                          ? sortedDirection === "ASC"
                            ? "DESC"
                            : "ASC"
                          : sortedDirection
                      );
                    }
                  }}
                >
                  {col.sortable && (
                    <span className={"text-transparent"}>{"↑ "}</span>
                  )}
                  {col.title}
                  {col.sortable && (
                    <span
                      className={
                        sortedKey !== col.key ? "text-transparent" : ""
                      }
                    >
                      {sortedDirection === "DESC" ? " ↓" : " ↑"}
                    </span>
                  )}
                </span>
                {col.filter && !col.filter.inline && (
                  <col.filter.component
                    {...col.filter.params}
                    value={filters[col.key]}
                    onApplyFilter={(value: {}) => onApplyFilter(col.key, value)}
                    onRemoveFilter={() => onRemoveFilter(col.key)}
                  />
                )}
              </>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
});
