import { getHeaders } from "../../utils/headers";
import { API_AUTH_LOGIN } from "../../utils/constants";
import { save } from "../../storage/key";

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
        result.errors?.[0]?.message || // Specific validation error
        result.message || // General API error
        "Login failed"; // Fallback message

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
