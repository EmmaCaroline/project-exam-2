import { API_KEY } from "./constants";
import * as storage from "../storage/key";

/**
 * Constructs and returns request headers for API calls, including content type,
 * optional API key, and authorization token if available.
 *
 * @function getHeaders
 * @returns {Headers} A `Headers` object with appropriate request headers.
 *
 * @example
 * const headers = getHeaders();
 * fetch("/api/data", {
 *   method: "GET",
 *   headers,
 * });
 */
export function getHeaders() {
  const token = storage.load("token");
  const headers = new Headers({
    "Content-Type": "application/json",
    ...(API_KEY && { "X-Noroff-API-Key": API_KEY }),
    ...(token && { Authorization: `Bearer ${token}` }),
  });
  return headers;
}
