import React from "react";
import type { ChangeEvent } from "react";
import { FilterWrapper } from "~/components/Table/Filters/FilterWrapper";

export interface FilterParams {
  title: string;
}

export interface Props extends FilterParams {
  value?: string;
  onApplyFilter: (value: string) => void;
  onRemoveFilter: () => void;
}

export const StringFilter: React.FC<Props> = ({
  title,
  value,
  onApplyFilter,
  onRemoveFilter,
}) => {
  const [newValue, setNewValue] = React.useState<string>("");

  const changeString = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value);
  }, []);

  return (
    <FilterWrapper
      onClear={onRemoveFilter}
      title={title}
      validateValue={() => !!newValue}
      onApplyFilter={() => onApplyFilter(newValue)}
      selected={value}
    >
      <input
        className={`h-10 p-2 w-72 bg-gray-100 text-white rounded outline-none`}
        onChange={changeString}
        type="text"
        placeholder="filter text"
        value={value}
      />
    </FilterWrapper>
  );
};
