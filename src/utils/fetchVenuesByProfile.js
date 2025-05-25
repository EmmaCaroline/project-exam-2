import { API_PROFILES } from "./constants";
import { getHeaders } from "./headers";

/**
 * Fetch all venues created by the given profile.
 * @param {string} profileName - The username of the profile.
 * @returns {Promise<Array>} List of venues.
 */
export const fetchVenuesByProfile = async (profileName) => {
  const response = await fetch(`${API_PROFILES}/${profileName}/venues`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Failed to fetch venues: " + errorText);
  }

  const json = await response.json();
  return json.data;
};
