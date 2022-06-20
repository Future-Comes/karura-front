import { Link } from "@remix-run/react";
import React from "react";

interface Props {
  link?: {
    to: string;
    text: string;
  };
}

export const SectionHeader: React.FC<Props> = ({ children, link }) => {
  return (
    <h1 className="text-4xl mt-20">
      {children}
      {link && (
        <Link
          className="ml-6 text-2xl text-accent hover:text-accent-hover"
          to={link.to}
        >
          {link.text}
        </Link>
      )}
    </h1>
  );
};
