import { remove } from "../../storage/key";
import { useNavigate } from "react-router-dom";

/**
 * Custom React hook that logs the user out by removing authentication data
 * from storage and redirecting to the homepage.
 *
 * @function useLogout
 * @returns {Function} A function that, when called, performs the logout process.
 *
 * @example
 * const logout = useLogout();
 * logout(); // Logs the user out and navigates to the homepage
 */
export function useLogout() {
  const navigate = useNavigate();

  return () => {
    remove("token");
    remove("user");
    navigate("/");
  };
}
