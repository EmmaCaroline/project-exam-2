import { handleLogin } from "../../auth/HandleLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const credentials = { email, password };
    const result = await handleLogin(credentials);

    if (result.success) {
      setSuccess(true);

      // Read the saved user after login success
      const user = JSON.parse(localStorage.getItem("user"));
      const profileName = user?.name;

      if (profileName) {
        setTimeout(() => navigate(`/profile/${profileName}`), 2000);
      }
    } else {
      setError(result.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center bg-primary mt-8">
      <div className="pt-4 pb-4 bg-secondary">
        <form
          onSubmit={handleSubmit}
          className="sm:w-80 mx-8 p-6 bg-white rounded-lg shadow-lg border border-customBlue font-body md:w-96"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm md:text-base font-body font-medium text-gray-700 mb-2"
            >
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm md:text-base font-body font-medium text-gray-700 mb-2"
            >
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="text-red-900 bg-red-200 border border-red-500 rounded-md p-2 mt-3 mb-3 font-semibold">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-700 bg-green-100 border border-green-400 rounded-md p-2 mt-3 mb-3 font-semibold">
              Login successful!
            </p>
          )}

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
