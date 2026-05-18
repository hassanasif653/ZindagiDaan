import { Link } from "react-router-dom";

import React from "react";
import type { IconType } from "react-icons/lib";

type BannerLinkProps = {
  to: string;
  span: string;

  Icon: IconType | React.ElementType;
  className: string;
};

const BannerLink = ({ to, span, Icon, className }: BannerLinkProps) => {
  const IconComponent = Icon;

  return (
    <Link
      to={`/${to}`}
      className={`btn px-10 shadow-none border-none font-normal rounded-full truncate transition-all transform hover:-translate-y-1 hover:scale-105 ${className}`}>
      {IconComponent && <IconComponent className="w-5 h-5" />}

      {span}
    </Link>
  );
};

export default BannerLink;
