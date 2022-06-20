interface Props {
  value: string;
}

export const TextCell: React.FC<Props> = ({ value }) => {
  return <span>{value}</span>;
};
