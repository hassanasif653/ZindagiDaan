
import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { FaUserFriends, FaPlus, FaMoneyBillWave, FaList } from "react-icons/fa";
import { MdOutlineBloodtype, MdVolunteerActivism } from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";
import {
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";

// Shadcn UI Components

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAuth from "@/Hook/useAuth";
import { useSidebar } from "@/Hook/useSidebar";
import useRole from "@/Hook/useRole";
import { useLenis } from "@/Hook/useLenis";
import type { LinkProps } from "@/types/blog";
import { toast } from "sonner";

const SidebarLink: React.FC<LinkProps> = ({ to, label, Icon, isCollapsed }) => {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center space-x-3 p-3 text-sm font-medium rounded text-foreground hover:bg-primary/10 transition-colors duration-200 border border-transparent hover:border hover:border-primary">
        <Icon className={`w-5 h-5 ${isCollapsed ? "mx-auto" : "ml-1"}`} />
        {!isCollapsed && <span className="truncate">{label}</span>}
      </Link>
    </li>
  );
};

const Dashboard: React.FC = () => {
  const { user, logOutUser } = useAuth();
  const { isOpen, isCollapsed, toggleOpen, toggleCollapse } = useSidebar();
  const { role } = useRole();
  const navigate = useNavigate();
  useEffect(() => {
  if (role === "donor") {
    navigate("/dashboard/funding");
  }
}, [role, navigate]);

  useLenis();

  const handleLogout = () => {
    logOutUser();
    toast.success("User logged out successfully");
  };

  // --- [ Dynamic Link Generation ] ---

 const getSidebarLinks = () => {
  const commonLinks = [
    { to: "/dashboard", label: "Home", icon: GoHome },
    {
      to: "/dashboard/my-donation-requests",
      label: "My Donation Requests",
      icon: MdOutlineBloodtype,
    },
    {
      to: "/dashboard/my-organ-requests",
      label: "My Organ Requests",
      icon: FaHeartbeat,
    },
  ];

  if (role === "admin") {
    return [
      ...commonLinks,
      {
        to: "/dashboard/create-organ-request",
        label: "Create Organ Request",
        icon: FaPlus,
      },
      {
        to: "/dashboard/all-register-user",
        label: "All Register Users",
        icon: FaUserFriends,
      },
      {
        to: "/dashboard/all-blood-donation-request",
        label: "All Donation Requests",
        icon: FaList,
      },
      {
        to: "/dashboard/all-volunteer-request",
        label: "All Volunteer Requests",
        icon: MdVolunteerActivism,
      },
      {
        to: "/dashboard/donation-requests",
        label: "Create Request",
        icon: FaPlus,
      },
      { to: "/dashboard/funding", label: "Funding", icon: FaMoneyBillWave },
    ];
  } else if (role === "donor") {
  return [
    { to: "/dashboard/funding", label: "Funding", icon: FaMoneyBillWave },
  ];
  } else if (role === "volunteer") {
    return [
      ...commonLinks,
      {
        to: "/dashboard/create-organ-request",
        label: "Create Organ Request",
        icon: FaPlus,
      },
      {
        to: "/dashboard/all-blood-donation-request",
        label: "All Donation Requests",
        icon: FaList,
      },
      {
        to: "/dashboard/donation-requests",
        label: "Create Request",
        icon: FaPlus,
      },
      { to: "/dashboard/funding", label: "Funding", icon: FaMoneyBillWave },
    ];
  }

  return commonLinks;
};

const sidebarLinks = getSidebarLinks();

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <div className="flex min-h-screen bg-background">
      {/* --- [ 1. Desktop Sidebar ] --- */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border bg-card shadow-xl transition-all duration-300 fixed top-0 left-0 min-h-screen z-50 ${sidebarWidth}`}>
        {/* Sidebar Header & Collapse Toggle */}
        <div className="p-4 flex items-center justify-between border-b border-border h-16">
          {!isCollapsed && (
            <h3 className="text-xl font-bold text-primary truncate">
              <Link to={"/"}> ZindagiDaan</Link>
            </h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className={`transition-transform duration-300 ${
              isCollapsed ? "mx-auto" : ""
            }`}>
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Sidebar Menu Links */}
        <ScrollArea className="grow p-2">
          <ul className="space-y-1">
            {sidebarLinks.map((link, index) => (
              <SidebarLink
                key={index}
                to={link.to}
                label={link.label}
                Icon={link.icon}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </ScrollArea>

        {/* Sidebar Footer (User Info & Logout) */}
        <div className="p-4 border-t border-border flex flex-col items-center space-y-2">
          <Link
            to={"/dashboard/profile"}
            className={`flex items-center w-full ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-primary"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-muted-foreground" />
            )}
            {!isCollapsed && (
              <span className="ml-3 font-semibold text-sm truncate">
                {user?.displayName || "Dashboard User"}
              </span>
            )}
          </Link>
          <Button
            variant="outline"
            onClick={handleLogout}
            className={`w-full ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
            size={isCollapsed ? "icon" : "default"}>
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* --- [ 2. Main Content Area ] --- */}
      <main
        className={`flex flex-col grow min-w-0 overflow-x-hidden transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}>
        {/* --- [ Mobile Header/Toggle ] --- */}
        <header className="lg:hidden p-4 flex items-center justify-between border-b border-border bg-card sticky top-0 z-20 shadow-sm">
          <h1 className="text-lg font-bold text-primary">Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={toggleOpen}>
            <Menu className="w-6 h-6" />
          </Button>
        </header>

        {/* --- [ Page Outlet ] --- */}
        <div className="grow p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* --- [ 3. Mobile Drawer Overlay ] --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-base-content/50 z-30 lg:hidden"
          onClick={toggleOpen}></div>
      )}

      {/* --- [ 4. Mobile Drawer Content ] --- */}
      <div
        className={`fixed inset-y-0 left-0 bg-card z-40 w-64 shadow-2xl transition-transform duration-300 transform lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex flex-col h-full">
          {/* Drawer Header (Close Button) */}
          <div className="p-4 flex items-center justify-between border-b border-border">
            <h3 className="text-xl font-bold text-primary">Menu</h3>
            <Button variant="ghost" size="icon" onClick={toggleOpen}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Mobile Links */}
          <ScrollArea className="grow p-2">
            <ul className="space-y-1" onClick={toggleOpen}>
              {sidebarLinks.map((link, index) => (
                <SidebarLink
                  key={index}
                  to={link.to}
                  label={link.label}
                  Icon={link.icon}
                  isCollapsed={false}
                />
              ))}
            </ul>
          </ScrollArea>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full">
              <LogOut className="w-5 h-5 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
