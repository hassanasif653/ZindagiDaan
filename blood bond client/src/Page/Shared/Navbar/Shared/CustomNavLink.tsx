import { NavLink } from "react-router-dom";

type CustomNavLink = {
  to: string;
  span: string;
};

const CustomNavLink = ({ to, span }: CustomNavLink) => {
  return (
    <NavLink
      className={"text-foreground/80 font-semibold hover:border-none"}
      to={`/${to}`}>
      {span}
    </NavLink>
  );
};

export default CustomNavLink;
