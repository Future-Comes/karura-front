import React from "react";

import type { InfoItem } from "./InfoList";
import { numToString } from "~/utils/utils";
import { ChangeValue } from "~/components/Texts/ChangeValue";

interface Props {
  list: InfoItem[];
}

export const VerticalInfo: React.FC<Props> = ({ list }) => {
  return (
    <div className="flex flex-col text-2xl whitespace-nowrap">
      {list.map((item, i) => (
        <span key={i} className="mb-6 last:mb-0">
          <div className="text-gray-300">{item.name}</div>
          <div className="">
            ${numToString(item.value)}{" "}
            {item.change && (
              <ChangeValue
                className="text-lg"
                value={item.change}
                before=""
                after="%"
              />
            )}
          </div>
        </span>
      ))}
    </div>
  );
};
