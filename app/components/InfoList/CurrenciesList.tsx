import React from "react";
import clsx from "clsx";
import { numToString } from "~/utils/utils";
import { CurrencyLogo } from "~/components/CurrencyLogo";
import type { Currency } from "~/api-queries/currencyData";

interface Props {
  title: string;
  list: Array<{
    currency: Currency;
    value: number;
  }>;
}

const dotsStyle =
  "before:block before:absolute before:content-['......................................']";

export const CurrenciesList: React.FC<Props> = ({ title, list }) => {
  return (
    <div className="text-2xl mb-6">
      <div className="text-gray-300 mb-3">{title}</div>
      <div className="text-lg">
        {list.map(({ currency, value }) => (
          <div key={currency.name} className="flex items-center mb-2">
            <CurrencyLogo className="w-6 h-6 mr-3" currencyId={currency.id} />
            <div>{currency.name}</div>
            <div
              className={clsx(
                dotsStyle,
                "relative grow mx-3 text-gray-300 overflow-hidden"
              )}
            >
              {"\u00A0"}
            </div>
            <div>{numToString(value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
