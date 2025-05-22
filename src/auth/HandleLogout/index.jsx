import { remove } from "../../storage/key";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  return () => {
    remove("token");
    remove("user");
    navigate("/");
  };
}
