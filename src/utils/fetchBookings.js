import { API_BOOKING } from "./constants";
import { getHeaders } from "./headers";

/**
 * Fetches bookings for a specific venue.
 * @param {string} venueId - The ID of the venue to fetch bookings for.
 * @returns {Promise<Array>} - An array of bookings for the given venue.
 */
export const fetchBookingsByVenue = async (venueId) => {
  try {
    const response = await fetch(`${API_BOOKING}?_venue=true`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return result.data.filter((booking) => booking.venue.id === venueId);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }
};
