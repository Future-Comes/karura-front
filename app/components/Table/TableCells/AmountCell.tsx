import { microToString } from "~/utils/utils";

interface Props {
  value: {
    price: number;
    name: string;
  };
}

export const AmountCell: React.FC<Props> = ({ value }) => {
  return (
    <span>
      {microToString(value.price)} {value.name}
    </span>
  );
};
