import { CiSearch } from "react-icons/ci";

const Search = ({ query, setQuery }) => {
  return (
    <div className="flex justify-center p-4">
      <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-customButton focus-within:border-customButton w-full sm:w-72 md:w-96 bg-white">
        <CiSearch className="text-gray-500 text-lg" />
        <input
          type="text"
          name="query"
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search venues"
          className="w-full focus:outline-none text-black bg-transparent"
        />
      </div>
    </div>
  );
};

export default Search;
