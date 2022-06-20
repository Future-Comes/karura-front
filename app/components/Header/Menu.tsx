import clsx from "clsx";
import { NavLink } from "@remix-run/react";

const menuLinks = [
  {
    title: "Overview",
    to: "/",
  },
  {
    title: "Pools",
    to: "/pools",
  },
  {
    title: "Currencies",
    to: "/currencies",
  },
];

export const Menu = () => {
  return (
    <nav className="text-2xl text-accent ml-8">
      {menuLinks.map(({ title, to }) => {
        return (
          <NavLink
            key={to}
            className={({ isActive }) =>
              clsx(
                "pb-2 ml-9 border-b-2 hover:text-accent-hover",
                isActive ? "text-white border-accent" : "border-gray-100"
              )
            }
            to={to}
          >
            {title}
          </NavLink>
        );
      })}
    </nav>
  );
};
