import React from "react";
import { ChangeValue } from "~/components/Texts/ChangeValue";

interface Props {
  value: number;
}

export const PriceChangeCell: React.FC<Props> = ({ value }) => {
  return <ChangeValue value={value} after="%" />;
};
