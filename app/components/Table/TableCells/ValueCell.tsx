import { numToString } from "~/utils/utils";

interface Props {
  value: number;
}

export const ValueCell: React.FC<Props> = ({ value }) => {
  return <span>${numToString(value)}</span>;
};
