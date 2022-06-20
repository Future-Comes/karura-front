interface Props {
  value: string;
}

export const AccountCell: React.FC<Props> = ({ value }) => {
  return (
    <a
      href={`https://karura.subscan.io/account/${value}`}
      target="_blank"
      rel="noreferrer"
      title={value}
      className="text-accent"
    >
      {value.slice(0, 6) + "..." + value.slice(value.length - 4, value.length)}
    </a>
  );
};
