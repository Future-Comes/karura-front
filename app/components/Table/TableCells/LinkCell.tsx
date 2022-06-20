interface Props {
  value: {
    text: string;
    link: string;
  };
}

export const LinkCell: React.FC<Props> = ({ value }) => {
  return (
    <a
      href={value.link}
      target="_blank"
      rel="noreferrer"
      title={value.text}
      className="text-accent"
    >
      {value.text}
    </a>
  );
};
