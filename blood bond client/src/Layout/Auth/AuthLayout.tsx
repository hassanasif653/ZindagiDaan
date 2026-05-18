import AnimatedBackground from "@/components/AnimatedBackground/AnimatedBackground";
import { ModeToggle } from "@/components/mode-toggle";
import Container from "@/Page/Shared/Responsive/Container";
import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-border ">
        <Container>
          <div className="flex items-center justify-between navbar">
            <Link to={"/"} className="text-xl font-bold ">
              ZindagiDaan
            </Link>
            <div>
              <ModeToggle />
            </div>
          </div>
        </Container>
      </nav>
      <AnimatedBackground>
        <main className="flex items-center justify-center py-5 md:py-10">
          <Outlet />
        </main>
      </AnimatedBackground>
    </div>
  );
};

export default AuthLayout;
