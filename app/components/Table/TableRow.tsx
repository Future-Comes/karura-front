import clsx from "clsx";
import React from "react";
import type { TableColumn } from "~/components/Table/Table";

export function TableRow<T extends { id: string }>({
  item,
  index,
  schema,
  small,
}: {
  item: T;
  index: number;
  small?: boolean;
  schema: TableColumn<T>[];
}) {
  return (
    <tr>
      {schema.map((col, i) => {
        return (
          <td
            className={clsx(
              "border-b border-gray-200 h-8",
              small ? "pt-5" : "py-3",
              col.textAlign === "text-center" ? "px-3" : " pr-7 p-0-last",
              col.textAlign || "text-left"
            )}
            key={i}
          >
            <col.value index={index} small={small} value={item[col.key]} />
          </td>
        );
      })}
    </tr>
  );
}
