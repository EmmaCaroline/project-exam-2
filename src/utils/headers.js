import { API_KEY } from "./constants";
import * as storage from "../storage/key";

export function getHeaders() {
  const token = storage.load("token");
  const headers = new Headers({
    "Content-Type": "application/json",
    ...(API_KEY && { "X-Noroff-API-Key": API_KEY }),
    ...(token && { Authorization: `Bearer ${token}` }),
  });
  return headers;
}
