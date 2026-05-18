import React from "react";
import Navbar from "@/Page/Shared/Navbar/Navbar";
import Footer from "@/Page/Shared/Footer/Footer";
import HelpDesk from "@/Page/Shared/HelpDesk/HelpDesk";
import { Outlet } from "react-router-dom";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/Hook/useLenis";

gsap.registerPlugin(ScrollTrigger);

const MainLayouts: React.FC = () => {
  useLenis();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 my-5 md:py-10">
        <Outlet />
      </div>
      <Footer />
      <HelpDesk />
    </div>
  );
};

export default MainLayouts;
