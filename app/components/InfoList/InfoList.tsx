import React from "react";
import { numToString } from "~/utils/utils";
import { ChangeValue } from "~/components/Texts/ChangeValue";

export interface InfoItem {
  name: string;
  value: number;
  change?: number;
}

interface Props {
  list: InfoItem[];
}

export const InfoList: React.FC<Props> = ({ list }) => {
  return (
    <div className="pt-6 text-2xl border-t border-gray-200 mt-24">
      {list.map((item, i) => (
        <span key={i} className="mr-14">
          <span className="text-gray-300">{item.name}:</span> $
          {numToString(item.value)}{" "}
          {item.change && (
            <ChangeValue value={item.change} before="(" after="%)" />
          )}
        </span>
      ))}
    </div>
  );
};
