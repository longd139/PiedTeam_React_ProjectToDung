import { Outlet, Link, NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useAuthStore } from "@/features/auth/store";
import { useLogoutMutation } from "@/features/auth/hooks/useAuth";
import ModeToggle from "../components/ui/mode-toggle";
import { Button } from "../components/ui/button";
// import ModeToggle from "../ui/mode-toggle";

const MainLayout = () => {
  const token = useAuthStore((state) => state.accessToken || "");
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  const navLinkStyle = ({ isActive }: { isActive: boolean }) => {
    const baseStyle = "text-sm font-medium transition-colors duration-200";

    return isActive
      ? `${baseStyle} text-foreground font-bold`
      : `${baseStyle} text-muted-foreground hover:text-foreground`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 relative">
          <div className="flex items-center gap-6">
            <NavLink to="/" className={navLinkStyle}>
              Home
            </NavLink>

            {token && (
              <NavLink to="/profile" className={navLinkStyle}>
                Profile
              </NavLink>
            )}

            <NavLink to="/rituals" className={navLinkStyle}>
              Rituals
            </NavLink>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link
              to="/"
              className="text-xl font-extrabold tracking-tight text-foreground"
            >
              CODELATBUG
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <ModeToggle />
            {!token && (
              <NavLink to="/login" className={navLinkStyle}>
                Log In
              </NavLink>
            )}

            {!token && (
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 ${
                    isActive ? "ring-2 ring-slate-400 ring-offset-2" : ""
                  }`
                }
              >
                Register
                <ArrowRight className="ml-2 h-4 w-4" />
              </NavLink>
            )}

            {token && (
              // <NavLink
              //   to="/logout"
              //   onClick={handleLogout}
              //   className={navLinkStyle}
              // >
              //   Logout
              // </NavLink>
              <Button type="button" onClick={() => handleLogout()}>
                Logout
              </Button>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      <footer className="bg-muted p-6 text-center text-sm text-muted-foreground">
        © 2024 ShopApp - Piedteam ReactJS Course
      </footer>
    </div>
  );
};

export default MainLayout;
