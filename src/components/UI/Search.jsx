import { CiSearch } from "react-icons/ci";

const Search = ({ query, setQuery }) => {
  return (
    <div className="py-2 w-full sm:w-auto">
      <div className="relative rounded-md shadow-sm w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <CiSearch className="text-gray-500 text-lg" />
        </div>
        <input
          type="text"
          name="query"
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search venues"
          className="pl-10 pr-3 py-1.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none block w-full sm:w-72 md:w-96 text-black"
        />
      </div>
    </div>
  );
};

export default Search;
