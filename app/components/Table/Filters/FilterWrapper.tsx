import React from "react";
import type { MouseEvent } from "react";
import CloseIcon from "~/components/Icons/CloseIcon";
import clsx from "clsx";

export interface Props {
  title: string;
  onClear: () => void;
  validateValue?: () => void;
  onApplyFilter: () => void;
  selected?: string;
}

export const FilterWrapper: React.FC<Props> = ({
  title,
  children,
  onApplyFilter,
  validateValue,
  onClear,
  selected,
}) => {
  const [open, setOpen] = React.useState(false);
  const openFilter = React.useCallback(() => {
    setOpen(true);
  }, []);
  const closeFilter = React.useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
  }, []);

  const apply = React.useCallback(
    (e: MouseEvent) => {
      if (!validateValue || validateValue()) {
        onApplyFilter();
        closeFilter(e);
      }
    },
    [onApplyFilter, validateValue]
  );

  return (
    <div>
      <div
        className={clsx(
          "font-normal h-6 mb-2 justify-center inline-flex items-center  text-lg text-sm cursor-pointer relative",
          selected && !open
            ? "bg-accent hover:bg-accent-hover rounded-full px-4 text-white"
            : "text-accent hover:text-accent-hover"
        )}
        onClick={openFilter}
      >
        {open ? "\u00A0" : selected ? selected : "add filter"}
        {selected && !open && (
          <CloseIcon
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="w-3 h-3 ml-4 cursor-pointer text-gray-100 hover:text-white"
          />
        )}
        {open && (
          <div className="absolute cursor-default text-lg left-1/2 -translate-x-1/2 bottom-10 bg-gray-200 rounded px-3 py-5 z-30">
            <CloseIcon
              onClick={closeFilter}
              className="w-3 h-3 right-3 top-3 cursor-pointer absolute hover:opacity-100 text-white opacity-40"
            />
            <div className="text-white text-left mb-3 font-bold">
              {title} filter
            </div>
            {children}
            <div
              onClick={apply}
              className="bg-accent hover:bg-accent-hover text-center mt-3 h-10 leading-10 rounded cursor-pointer text-white"
            >
              Apply filter
            </div>
          </div>
        )}
      </div>
      {open && (
        <div onClick={closeFilter} className="bg-black/50 fixed inset-0 z-20" />
      )}
    </div>
  );
};
