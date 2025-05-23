import { CiSearch } from "react-icons/ci";

const Search = ({ query, setQuery }) => {
  return (
    <div className="flex justify-center pb-4 px-6 mb-4">
      <div className="flex items-center py-1.5 border border-gray-300 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-customButton focus-within:border-customButton w-full sm:w-96 bg-white">
        <input
          type="text"
          name="query"
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Where to?"
          className="w-full focus:outline-none font-body text-center bg-transparent"
        />
      </div>
    </div>
  );
};

export default Search;
