import { API_PROFILES } from "../utils/constants";
import { getHeaders } from "../utils/headers";

/**
 * Fetches bookings made by a profile (user).
 * @param {string} username - The username of the profile.
 * @returns {Promise<Array>} - Resolves with an array of bookings.
 */
export async function fetchBookingsByProfile(username) {
  if (!username) throw new Error("Username is required");

  const url = `${API_PROFILES}/${username}/bookings?_venue=true`;

  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Failed to fetch profile bookings: " + errorText);
  }

  const json = await response.json();
  return json.data;
}
