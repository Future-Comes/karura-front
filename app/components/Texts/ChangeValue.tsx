import React from "react";
import clsx from "clsx";

interface Props {
  value: number;
  className?: string;
  before?: string;
  after?: string;
}

export const ChangeValue: React.FC<Props> = ({
  value,
  before,
  after,
  className,
}) => {
  return (
    <span className={clsx(className, value < 0 ? "text-red" : "text-green")}>
      {before}
      {value !== 0 ? (value < 0 ? "↓ " : "↑ ") : ""}
      {Math.abs(value).toFixed(2)}
      {after}
    </span>
  );
};
