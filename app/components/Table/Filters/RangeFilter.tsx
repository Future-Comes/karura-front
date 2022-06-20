import React from "react";
import NumberFormat from "react-number-format";
import { FilterWrapper } from "~/components/Table/Filters/FilterWrapper";
import { numToString } from "~/utils/utils";

export interface FilterParams {
  title: string;
  min?: number;
  max?: number;
}

export interface Props extends FilterParams {
  value?: string;
  onApplyFilter: (value: string) => void;
  onRemoveFilter: () => void;
}

const inputStylesClass =
  "h-10 p-2 w-36 bg-gray-100 text-white rounded outline-none";

export const RangeFilter: React.FC<Props> = ({
  title,
  value,
  onApplyFilter,
  onRemoveFilter,
}) => {
  const [newValue, setNewValue] = React.useState<Record<string, any>>({});

  const changeFrom = React.useCallback(({ floatValue }) => {
    setNewValue((prev) => ({
      ...prev,
      from: floatValue,
    }));
  }, []);
  const changeTo = React.useCallback(({ floatValue }) => {
    if (floatValue) {
      setNewValue((prev) => ({
        ...prev,
        to: floatValue,
      }));
    }
  }, []);

  const { from, to } = React.useMemo(() => {
    return value ? JSON.parse(value) : {};
  }, [value]);

  return (
    <FilterWrapper
      title={title}
      onClear={() => {
        setNewValue({});
        onRemoveFilter();
      }}
      validateValue={() =>
        typeof newValue?.from !== "undefined" ||
        typeof newValue?.to !== "undefined"
      }
      onApplyFilter={() => onApplyFilter(JSON.stringify(newValue))}
      selected={
        from
          ? to
            ? `${numToString(from)} - ${numToString(to)}`
            : `above ${numToString(from)}`
          : to
          ? `under ${numToString(to)}`
          : ""
      }
    >
      <div className="flex justify-between">
        <NumberFormat
          className={`${inputStylesClass} mr-2.5`}
          thousandSeparator={" "}
          type="text"
          placeholder="from"
          value={newValue.from || from}
          onValueChange={changeFrom}
        />
        <NumberFormat
          className={inputStylesClass}
          thousandSeparator={" "}
          type="text"
          placeholder="to"
          value={newValue.to || to}
          onValueChange={changeTo}
        />
      </div>
    </FilterWrapper>
  );
};
