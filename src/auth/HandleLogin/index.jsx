import { getHeaders } from "../../utils/headers";
import { API_AUTH_LOGIN } from "../../utils/constants";
import { save } from "../../storage/key";

/**
 * Handles user login by sending credentials to the authentication API.
 *
 * @async
 * @function handleLogin
 * @param {Object} credentials - The login credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<Object>} An object indicating success or failure.
 * @returns {boolean} return.success - Whether the login was successful.
 * @returns {string} [return.message] - An error message if login failed.
 *
 * @example
 * const result = await handleLogin({ email: "user@example.com", password: "1234" });
 * if (result.success) {
 *   // Login successful
 * } else {
 *   console.error(result.message);
 * }
 */
export async function handleLogin({ email, password }) {
  const payload = {
    email,
    password,
  };

  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log(result.data);

    if (response.ok) {
      save("token", result.data.accessToken);
      save("user", result.data);
      return { success: true };
    } else {
      const detailedMessage =
        result.errors?.[0]?.message || result.message || "Login failed";

      return {
        success: false,
        message: detailedMessage,
      };
    }
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}
