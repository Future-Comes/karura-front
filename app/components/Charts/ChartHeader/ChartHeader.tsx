import React from "react";
import dayjs from "dayjs";
import type { Time } from "lightweight-charts";
import { isBusinessDay } from "~/utils/utils";

interface Props {
  title: string;
  value: string;
  date: Time;
}

export const ChartHeader: React.FC<Props> = React.memo(function ChartHeader({
  title,
  value,
  date,
}) {
  const dateObject = isBusinessDay(date)
    ? new Date(date.year, date.month - 1, date.day)
    : new Date(date);

  return (
    <div className="flex justify-between items-baseline leading-tight mt-8 pb-4 border-b-2 border-gray-250">
      <div className="font-medium relative">
        <div className="text-2xl text-gray-300 absolute bottom-full whitespace-nowrap">
          {title}
        </div>
        <div className="text-6xl">{value}</div>
      </div>
      <time className="text-2xl">
        {dayjs(dateObject).format("MMMM D, YYYY")} (UTC)
      </time>
    </div>
  );
});
