import React from "react";
import clsx from "clsx";

export interface FilterParams {
  list: Record<string, string>;
}

export interface Props extends FilterParams {
  value?: string;
  onApplyFilter: (value: Record<string, any>) => void;
}

export const RadioInlineFilter: React.FC<Props> = ({
  list,
  value,
  onApplyFilter,
}) => {
  const listArray = React.useMemo(() => Object.entries(list), [list]);
  const [newValue, setNewValue] = React.useState<string | undefined>(() => {
    return listArray.find(([key]) => key === value)?.[0] || listArray[0][0];
  });

  const selectValue = React.useCallback(
    (key) => {
      setNewValue(key);
      onApplyFilter({
        key,
      });
    },
    [onApplyFilter]
  );

  return (
    <div className="flex">
      {listArray.map(([key, title]) => {
        return (
          <div
            key={key}
            className={clsx(
              newValue === key && "text-white",
              "mr-4 last:mr-0 hover:text-white cursor-pointer"
            )}
            onClick={() => selectValue(key)}
          >
            {title}
          </div>
        );
      })}
    </div>
  );
};
