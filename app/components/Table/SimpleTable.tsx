import React from "react";
import { typedMemo } from "~/utils/utils";
import { SimpleTableHead } from "~/components/Table/SimpleTableHead";
import type { TableColumn } from "~/components/Table/Table";
import { TableRow } from "~/components/Table/TableRow";
import clsx from "clsx";

export interface Props<T extends { id: string }> {
  items: T[];
  schema: TableColumn<T>[];
  className?: string;
}

export const SimpleTable = typedMemo(function Table<T extends { id: string }>({
  items,
  schema,
  className,
}: Props<T>) {
  return (
    <table className={clsx(className, "table-auto w-full text-lg")}>
      <SimpleTableHead schema={schema} />
      <tbody>
        {items.length ? (
          items.map((item, i) => {
            return (
              <TableRow
                key={item.id + i}
                small
                schema={schema}
                item={item}
                index={i}
              />
            );
          })
        ) : (
          <tr>
            <td className="text-center py-5 text-2xl" colSpan={schema.length}>
              Nothing Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
});
