import { typedMemo } from "~/utils/utils";
import clsx from "clsx";
import React from "react";
import type { Props, TableColumn } from "~/components/Table/Table";

type HeadProps<T extends { id: string }> = Pick<Props<T>, "schema">;

export const SimpleTableHead = typedMemo(function TableHead<
  T extends { id: string }
>({ schema }: HeadProps<T>) {
  return (
    <thead className="text-gray-300 text-left">
      <tr>
        {schema.map((col: TableColumn<T>, i: number) => (
          <th
            className={clsx(
              "font-normal border-b align-top border-gray-300 h-8 whitespace-nowrap",
              i === 0 ? "text-2xl" : "text-sm",
              col.textAlign === "text-center" ? "px-3" : " pr-7 last:pr-0",
              col.textAlign || "text-left"
            )}
            key={i}
            style={{ width: col.width ? `${col.width}%` : "auto" }}
          >
            <span>{col.title}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
});
