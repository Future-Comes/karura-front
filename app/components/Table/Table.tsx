import React from "react";
import type {
  Props as RangeFilterProps,
  FilterParams as RangeFilterParams,
} from "./Filters/RangeFilter";
import type {
  Props as StringFilterProps,
  FilterParams as StringFilterParams,
} from "~/components/Table/Filters/StringFilter";
import type {
  Props as RadioInlineFilterProps,
  FilterParams as RadioInlineFilterParams,
} from "~/components/Table/Filters/RadioInlineFilter";
import { TableHead } from "~/components/Table/TableHead";
import { TableRow } from "~/components/Table/TableRow";
import { typedMemo } from "~/utils/utils";

interface RangeFilter {
  inline?: false;
  component: React.FC<RangeFilterProps>;
  params: RangeFilterParams;
}

interface StringFilter {
  inline?: false;
  component: React.FC<StringFilterProps>;
  params: StringFilterParams;
}

interface RadioInlineFilter {
  inline: true;
  component: React.FC<RadioInlineFilterProps>;
  params: RadioInlineFilterParams;
}

export interface TableColumn<T> {
  title: string;
  value: React.FC<{ index: number; value: any; small?: boolean }>;
  textAlign?: "text-center" | "text-right";
  width?: number;
  key: keyof T;
  sortable?: boolean;
  filter?: RangeFilter | StringFilter | RadioInlineFilter;
}

export interface Props<T> {
  items: T[];
  addFiltersHandler: (filters: string) => void;
  schema: TableColumn<T>[];
  buttons?: React.ReactNode;
}

export const Table = typedMemo(function Table<T extends { id: string }>({
  items,
  schema,
  addFiltersHandler,
  buttons,
}: Props<T>) {
  const [sortedKey, setSortedKey] = React.useState<keyof T | null>(null);
  const [sortedDirection, setSortedDirection] = React.useState<"ASC" | "DESC">(
    "ASC"
  );
  const [filters, setFilters] = React.useState<Record<keyof T, string>>(
    {} as any
  );

  const addFilter = React.useCallback(
    (key: keyof T, value: Record<string, any>) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );
  const removeFilter = React.useCallback((removeKey: keyof T) => {
    setFilters((prev) => ({ ...prev, [removeKey]: undefined }));
  }, []);

  const onSortClick = React.useCallback(
    (key: keyof T, direction: "ASC" | "DESC") => {
      setSortedKey(key);
      setSortedDirection(direction);
      setFilters((prev) => ({
        ...prev,
        sort: JSON.stringify({
          key,
          direction,
        }),
      }));
    },
    []
  );

  React.useEffect(() => {
    if (Object.keys(filters).length) {
      addFiltersHandler(new URLSearchParams(filters).toString());
    }
  }, [filters, addFiltersHandler]);

  return (
    <table className="table-auto w-full text-lg mt-10">
      <TableHead
        schema={schema}
        sortedKey={sortedKey}
        sortedDirection={sortedDirection}
        onSortClick={onSortClick}
        onApplyFilter={addFilter}
        onRemoveFilter={removeFilter}
        filters={filters}
        buttons={buttons}
      />
      <tbody>
        {items.length ? (
          items.map((item, i) => (
            <TableRow key={item.id + i} schema={schema} item={item} index={i} />
          ))
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
