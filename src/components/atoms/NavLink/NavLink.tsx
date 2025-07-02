import { LinkProps } from "@/types/Atoms";
import React from "react";
import { Link } from "react-router-dom";
const NavLink: React.FC<LinkProps> = ({ children, href, classN }) => {
  return (
    <Link to={href} className={`text-main text-sm font-medium ${classN}`}>
      {children}
    </Link>
  );
};

export default NavLink;
