import { Outlet, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import Logo from "../../assets/holidaze-logo.png";
import { useLogout } from "../../auth/HandleLogout";
import FooterBanner from "../../assets/sunset.jpg";
import ConfirmModal from "../UI/ConfirmModal";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const logout = useLogout();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);

  const confirmLogout = () => {
    closeConfirm();
    logout();
    setMenuOpen(false);
  };

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <header className="relative bg-white border border-secondary shadow-lg px-6 sm:px-8 py-1 flex items-center justify-between">
        <Link to="/" onClick={handleLinkClick}>
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
                onClick={() => {
                  openConfirm();
                  setMenuOpen(false);
                }}
                className="font-heading text-secondary hover:text-black text-lg"
              >
                Logout
              </button>
              <Link
                to={`profile/${user.name}`}
                className="font-heading text-secondary hover:text-black text-lg"
                onClick={handleLinkClick}
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="font-heading text-secondary hover:text-black text-lg"
                onClick={handleLinkClick}
              >
                Register
              </Link>
              <Link
                to="/login"
                className="font-heading text-secondary hover:text-black text-lg"
                onClick={handleLinkClick}
              >
                Login
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className={`sm:hidden focus:outline-none ${
            menuOpen ? "text-secondary" : "text-black"
          }`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <RxCross1 size={24} /> : <RxHamburgerMenu size={24} />}
        </button>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <nav
            ref={dropdownRef}
            className="absolute top-full w-1/2 md:w-1/4 lg:w-1/5 right-0 bg-white shadow-lg flex flex-col items-center md:hidden z-10"
          >
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    openConfirm();
                    setMenuOpen(false);
                  }}
                  className="py-4 w-full text-center border-b text-secondary active:text-black"
                >
                  Logout
                </button>
                <Link
                  to={`profile/${user.name}`}
                  className="py-4 w-full text-center border-b text-secondary active:text-black"
                  onClick={handleLinkClick}
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="py-4 w-full text-center border-b text-secondary active:text-black"
                  onClick={handleLinkClick}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="py-4 w-full text-center border-b text-secondary active:text-black"
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        )}
      </header>

      <main className="flex-grow w-full min-h-screen">
        <Outlet />
      </main>

      <footer>
        <img
          className="w-full h-14 sm:h-16 md:h-24 mt-10 md:mt-16"
          src={FooterBanner}
          alt="Sunset banner"
        />
        <div className="bg-secondary text-sm md:text-base text-center text-white p-8 sm:p-10 md:p-14 lg:p-16">
          &copy; 2025 Holidaze
        </div>
      </footer>

      <ConfirmModal
        isOpen={confirmOpen}
        onConfirm={confirmLogout}
        onCancel={closeConfirm}
        message="Are you sure you want to log out?"
      />
    </div>
  );
};

export default Layout;
