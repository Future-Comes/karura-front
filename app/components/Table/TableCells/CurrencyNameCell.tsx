import React from "react";
import clsx from "clsx";
import { Link } from "@remix-run/react";
import { CurrencyLogo } from "~/components/CurrencyLogo";
import type { CurrencyData } from "~/api-queries/currencyData";

interface Props {
  value: CurrencyData;
  small?: boolean;
}

export const CurrencyNameCell: React.FC<Props> = ({ value, small }) => {
  return (
    <Link to={`/currencies/${value.id}`} className="flex items-center">
      <CurrencyLogo
        className={clsx("mr-2.5", small ? "w-6 h-6" : "w-8 h-8")}
        currencyId={value.id}
      />
      {value.name}
      {/*{" "}*/}
      {/*<span className="text-gray-300">({token.shortName})</span>*/}
    </Link>
  );
};
