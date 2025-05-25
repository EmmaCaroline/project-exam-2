import { CiSearch } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5";

/**
 * Search component renders a controlled text input with a search icon and clear button.
 *
 * Props:
 * @param {Object} props
 * @param {string} props.query - Current search query string.
 * @param {(value: string) => void} props.setQuery - Function to update the search query.
 *
 * Returns:
 * @returns {JSX.Element} JSX markup for the search input with clear functionality.
 */
const Search = ({ query, setQuery }) => {
  return (
    <div className="flex justify-center pb-4 px-6 mb-4">
      <div className="relative flex items-center py-1.5 border border-gray-300 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-customButton focus-within:border-customButton w-full sm:w-96 bg-white">
        <CiSearch className="absolute left-3 text-xl text-gray-400" />
        <input
          type="text"
          name="query"
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Where to?"
          className="w-full pl-10 pr-10 focus:outline-none font-body text-center bg-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <IoCloseCircle className="text-2xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
