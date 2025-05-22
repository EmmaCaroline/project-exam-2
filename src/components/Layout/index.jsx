import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import Logo from "../../assets/holidaze-logo.png";
import { useLogout } from "../../auth/HandleLogout";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = useLogout();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  console.log("Menu open:", menuOpen);
  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <header className="relative bg-white shadow-lg px-6 sm:px-8 py-1 flex items-center justify-between">
        <Link to="/">
          <div className="group">
            <img
              className="aspect-square w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:transition-all lg:duration-300 lg:group-hover:scale-105"
              src={Logo}
              alt="Logo"
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-6">
          {isLoggedIn ? (
            <>
              <button
                onClick={logout}
                className="font-heading text-secondary hover:text-black text-lg"
              >
                Logout
              </button>
              <Link
                to="/profile"
                className="font-heading text-secondary hover:text-black text-lg"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="font-heading text-secondary hover:text-black text-lg"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="font-heading text-secondary hover:text-black text-lg"
              >
                Login
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className={`sm:hidden focus:outline-none ${menuOpen ? "text-secondary" : "text-black"}`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <RxCross1 size={24} /> : <RxHamburgerMenu size={24} />}
        </button>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <nav className="absolute top-full w-1/2 md:w-1/4 lg:w-1/5 right-0 bg-white shadow-lg flex flex-col items-center md:hidden">
            {isLoggedIn ? (
              <>
                <button
                  onClick={logout}
                  className="py-4 w-full text-center border-b text-secondary active:text-black"
                >
                  Logout
                </button>
                <Link
                  to="/profile"
                  className="py-4 w-full text-center border-b text-secondary active:text-black"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="py-4 w-full text-center border-b text-secondary active:text-black"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="py-4 w-full text-center border-b text-secondary active:text-black"
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        )}
      </header>

      <main className="flex-grow p-4">
        <Outlet />
      </main>

      <footer className="bg-secondary text-white p-4 text-center">
        <div className="text-sm md:text-base m-4 md:m-8">
          &copy; 2025 Holidaze
        </div>
      </footer>
    </div>
  );
};

export default Layout;
