import React from "react";
import { Link } from "@remix-run/react";
import { CurrencyLogo } from "~/components/CurrencyLogo";
import type { PoolCurrencies } from "~/api-queries/poolData";

interface Props {
  value: PoolCurrencies;
  small?: boolean;
}

export const PoolNameCell: React.FC<Props> = ({ value, small }) => {
  return (
    <Link to={`/pools/${value.id}`} className="flex text-gray-300 items-center">
      <CurrencyLogo
        className={small ? "w-6 h-6" : "w-8 h-8"}
        currencyId={value.from.id}
      />
      <div className="text-white mx-2.5">{value.from.name}</div>
      <div className="mr-2.5">/</div>
      <CurrencyLogo
        className={small ? "w-6 h-6" : "w-8 h-8"}
        currencyId={value.to.id}
      />
      <div className="text-white mx-2.5">{value.to.name}</div>
    </Link>
  );
};
