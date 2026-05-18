import { Link } from "react-router-dom";

type SidebarLink = {
  to: string;
  dataTip: string;
  Icon: React.ElementType;
  span: string;
};

const SidebarLink = ({ to, dataTip, Icon, span }: SidebarLink) => {
  return (
    <li>
      <Link
        to={`${to}`}
        className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
        data-tip={dataTip}>
        {<Icon size={20} />}
        <span className="is-drawer-close:hidden">{span}</span>
      </Link>
    </li>
  );
};

export default SidebarLink;
