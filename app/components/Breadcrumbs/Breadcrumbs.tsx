import React from "react";
import { Link } from "@remix-run/react";

interface Props {
  links: Array<{ title: string; to: string }>;
}

export const Breadcrumbs: React.FC<Props> = ({ links }) => {
  return (
    <div className="text-gray-300 text-lg">
      {links.map((l, i) => {
        return (
          <React.Fragment key={l.to}>
            {i !== 0 && ` / `}
            <Link to={l.to}>{l.title}</Link>
          </React.Fragment>
        );
      })}
    </div>
  );
};
