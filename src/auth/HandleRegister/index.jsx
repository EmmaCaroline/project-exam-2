import { getHeaders } from "../../utils/headers";
import { API_AUTH_REGISTER } from "../../utils/constants";

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
