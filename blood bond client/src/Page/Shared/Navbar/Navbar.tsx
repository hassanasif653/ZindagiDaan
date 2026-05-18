import { Link, NavLink } from "react-router-dom";
import Container from "../Responsive/Container";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";


import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import useAuth from "@/Hook/useAuth";
import useRole from "@/Hook/useRole";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import CustomNavLink from "./Shared/CustomNavLink";
import { HeartPlus } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOutUser, loading } = useAuth();
  const { role, status } = useRole();

  const handleUserLogout = () => {
    logOutUser();
  };

  //! Public Links (Icons removed)
  const publicLinks = (
    <>
      <CustomNavLink to="" span="Home" />
      <CustomNavLink to="about" span="About" />
      <CustomNavLink to="blog" span="Blog" />
      <CustomNavLink to="contact" span="Contact" />
      {user && <CustomNavLink to="funding" span="Funding" />}
      <hr />
      {role === "donor" ? (
  <NavLink to="/dashboard/funding" className="lg:hidden">
    <Button>Funding</Button>
  </NavLink>
) : (
  <NavLink to="/dashboard/donation-requests" className="lg:hidden">
    <Button>Donation request</Button>
  </NavLink>
)}
    </>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className=" backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-border">
      <Container>
        <div className="flex items-center justify-between py-3 gap-3">
          {/* Mobile Menu Button - Using basic symbols */}
          <div className="lg:hidden">
            <span
              onClick={() => setIsOpen(!isOpen)}
              className=" cursor-pointer text-2xl font-bold">
              {isOpen ? "✕" : "☰"}
            </span>
          </div>
          {/* Logo */}
          <div className=" items-center gap-2 flex flex-1">
            <Link
              to="/"
              className="text-2xl flex  gap-2 items-center  font-bold  truncate text-primary">
              <HeartPlus className="hidden lg:flex text-primary" /> Zindagi{" "}
              <span className="text-primary">Daan</span>
            </Link>
          </div>

          {/* Center Nav Links */}
          <div className="hidden lg:flex gap-6 font-medium flex-1 items-center justify-center">
            {publicLinks}
          </div>

          {/* Right Side: Mode Toggle + Avatar */}
          <div className="flex items-center gap-4 flex-2 md:flex-1 justify-end">
            <ModeToggle />
            {!user && (
              <Link to="/login">
                <Button className="cursor-pointer">Login</Button>
              </Link>
            )}

            {user && role === "donor" && (
  <Link to="/dashboard/funding">
    <Button className="cursor-pointer hidden lg:flex">
      Funding
    </Button>
  </Link>
)}

{user && role !== "donor" && (
  <Link to="/dashboard/donation-requests">
    <Button className="cursor-pointer hidden lg:flex">
      Donation Requests
    </Button>
  </Link>
)}

            {user && (
              <div className="dropdown dropdown-end">
                <Label tabIndex={0} className="cursor-pointer">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-primary"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </Label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-card rounded-box z-50 mt-3 w-56 p-3 border border-border space-y-2 shadow-lg ">
                  <li className="font-semibold text-center">
                    {user.displayName}
                  </li>
                  <ul>
                    <li className="text-center text-muted-foreground text-sm flex items-center justify-center flex-row capitalize">
                      Role: <span className="text-green-500">{role}</span>
                    </li>
                    <li className="text-center text-muted-foreground text-sm flex items-center justify-center flex-row capitalize">
                      Status:
                      <span
                        className={
                          status === "block" ? "text-red-500" : "text-green-500"
                        }>
                        {status || "active"}
                      </span>
                    </li>
                  </ul>
                  <div className="divider my-1"></div>

                  <Link to={role === "donor" ? "/dashboard/funding" : "/dashboard"}>
  <Button
    variant={"outline"}
    className="w-full rounded cursor-pointer">
    {role === "donor" ? "Funding" : "Dashboard"}
  </Button>
</Link>

                  <Button onClick={handleUserLogout} className="w-full">
                    Logout
                  </Button>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="lg:hidden border-t border-border pt-2  z-5 absolute left-0 w-full backdrop-blur-3xl px-4 bg-background/90"
            data-aos="fade-down">
            <Container>
              <div className="pt-2 flex flex-col gap-2 pb-5">{publicLinks}</div>
            </Container>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Navbar;