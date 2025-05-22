/**
 * Saves a value to localStorage under a specific key.
 *
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to be saved to localStorage. It will be serialized using JSON.stringify.
 */
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Loads a value from localStorage using the given key.
 *
 * @param {string} key - The key of the item to retrieve from localStorage.
 * @returns {any} - The parsed value from localStorage, or null if retrieval fails or item does not exist.
 */
export function load(key) {
  try {
    const value = localStorage.getItem(key);
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Removes an item from localStorage based on the provided key.
 *
 * @param {string} key - The key of the item to remove from localStorage.
 */
export function remove(key) {
  localStorage.removeItem(key);
}
