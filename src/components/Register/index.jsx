import { handleRegister } from "../../auth/HandleRegister";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const [venueManager, setVenueManager] = useState(false);

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      errors.name =
        "Username can only contain letters, numbers, and underscores.";
    }

    // Email validation
    if (!/^[\w.-]+@stud\.noroff\.no$/.test(email)) {
      errors.email = "Email must be a valid stud.noroff.no address.";
    }

    // Password validation
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    // Avatar URL validation (optional)
    if (avatar && !/^https?:\/\/\S+\.\S+$/.test(avatar)) {
      errors.avatar = "Avatar must be a valid URL.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0; // return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError("");
    setSuccess(false);

    const result = await handleRegister({
      name,
      email,
      password,
      avatar,
      venueManager,
    });

    if (result.success) {
      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setAvatar("");

      // 3. Redirect after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.message || "Registration failed");
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
              htmlFor="name"
              className="block text-sm md:text-base font-body font-medium text-gray-700 mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {fieldErrors.name && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {fieldErrors.password && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="avatar">Profile picture / avatar (optional):</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Image URL"
              className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {fieldErrors.avatar && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.avatar}</p>
            )}
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="venueManager"
              checked={venueManager}
              onChange={(e) => setVenueManager(e.target.checked)}
              className="mr-2 accent-primary scale-125"
            />
            <label
              htmlFor="venueManager"
              className="font-body text-sm md:text-base"
            >
              I want to register as a Venue Manager
            </label>
          </div>

          {error && (
            <p className="text-red-900 bg-red-200 border border-red-500 rounded-md p-2 mt-3 mb-3 font-semibold">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-700 bg-green-100 border border-green-400 rounded-md p-2 mt-3 mb-3 font-semibold">
              Registration successful! Redirecting to login..
            </p>
          )}

          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
