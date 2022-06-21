import clsx from "clsx";
import React from "react";

interface Props {
  className: string;
  currencyId: string;
}

export const CurrencyLogo: React.FC<Props> = ({ className, currencyId }) => {
  return (
    <div
      className={clsx(className, "rounded-full bg-white bg-contain")}
      style={{
        backgroundImage: `url(/icons/Token-${currencyId}.png)`,
      }}
    />
  );
};
