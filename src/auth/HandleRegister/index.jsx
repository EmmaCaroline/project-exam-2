import { getHeaders } from "../../utils/headers";
import { API_AUTH_REGISTER } from "../../utils/constants";

/**
 * Handles user registration by sending the user's details to the registration API.
 *
 * @async
 * @function handleRegister
 * @param {Object} userDetails - The user's registration information.
 * @param {string} userDetails.name - The user's name.
 * @param {string} userDetails.email - The user's email address.
 * @param {string} userDetails.password - The user's chosen password.
 * @param {string} [userDetails.avatar] - Optional URL to the user's avatar image.
 * @param {boolean} [userDetails.venueManager=false] - Whether the user is a venue manager.
 * @returns {Promise<Object>} An object indicating success or failure.
 * @returns {boolean} return.success - Whether the registration was successful.
 * @returns {string} [return.message] - An error message if registration failed.
 *
 * @example
 * const result = await handleRegister({
 *   name: "Jane Doe",
 *   email: "jane@example.com",
 *   password: "securePassword123",
 *   avatar: "https://example.com/avatar.jpg",
 *   venueManager: true
 * });
 * if (result.success) {
 *   // Registration successful
 * } else {
 *   console.error(result.message);
 * }
 */
export async function handleRegister({
  name,
  email,
  password,
  avatar,
  venueManager,
}) {
  const payload = {
    name,
    email,
    password,
    venueManager: !!venueManager,
  };

  if (avatar) {
    payload.avatar = avatar;
  }

  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      const detailedMessage =
        data.errors?.[0]?.message || // Specific validation error
        data.message || // General API error
        "Registration failed"; // Fallback message

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
