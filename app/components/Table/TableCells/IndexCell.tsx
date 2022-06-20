interface Props {
  index: number;
}

export const IndexCell: React.FC<Props> = ({ index }) => {
  return <div>{index + 1}</div>;
};
