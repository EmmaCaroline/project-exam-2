import { useState, useEffect } from "react";
import { API_VENUES } from "../../utils/constants";
import Search from "../UI/Search";
import VenueCard from "../UI/Venuecard";

const VENUES_PER_PAGE = 20;

/**
 * Venues component fetches and displays a paginated list of venues.
 *
 * Features:
 * - Fetches all venues on mount for client-side search filtering.
 * - Fetches paginated venues from the API when no search query is active.
 * - Allows searching venues by name, description, city, country, and address.
 * - Displays search results with client-side pagination.
 * - Provides Previous/Next buttons for pagination control.
 * - Shows loading and error states during API calls.
 * - Uses VENUES_PER_PAGE constant for pagination limits.
 *
 * State variables:
 * @property {Array} allVenues - Full list of venues fetched for searching.
 * @property {Array} venues - Venues fetched for current page when not searching.
 * @property {string} query - Search query string.
 * @property {boolean} isLoading - Loading state for fetching data.
 * @property {boolean} isError - Error state if fetching fails.
 * @property {number} currentPage - Current page number for pagination.
 * @property {number} pageCount - Total number of pages available.
 *
 * Derived variables:
 * @property {Array} filteredVenues - Venues filtered by search query.
 * @property {Array} paginatedVenues - Venues to display on current page.
 * @property {number} searchPageCount - Total pages for search results.
 *
 * Returns:
 * @returns {JSX.Element} Rendered list of venues with search and pagination UI.
 */
const Venues = () => {
  const [allVenues, setAllVenues] = useState([]);
  const [venues, setVenues] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    async function fetchAll() {
      try {
        setIsError(false);
        const all = [];
        let page = 1;
        let totalPages = 1;

        do {
          const res = await fetch(`${API_VENUES}?page=${page}&limit=100`);
          const json = await res.json();
          if (!json || !Array.isArray(json.data))
            throw new Error("Invalid data");

          all.push(...json.data);
          totalPages = json.meta?.pageCount || 1;
          page++;
        } while (page <= totalPages);

        setAllVenues(all);
      } catch (err) {
        setIsError(true);
        console.error(err);
      }
    }

    fetchAll();
  }, []);

  useEffect(() => {
    if (query) return;

    async function fetchPage() {
      try {
        setIsError(false);
        setIsLoading(true);

        const res = await fetch(
          `${API_VENUES}?page=${currentPage}&limit=${VENUES_PER_PAGE}`,
        );
        const json = await res.json();

        if (!json || !Array.isArray(json.data)) throw new Error("Invalid data");

        setVenues(json.data);
        setPageCount(json.meta?.pageCount || 1);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
        console.error(err);
      }
    }

    fetchPage();
  }, [currentPage, query]);

  const filteredVenues = query
    ? allVenues.filter((venue) => {
        const lowerQuery = query.toLowerCase();
        const searchableText = `
          ${venue.name} 
          ${venue.description}
          ${venue.location?.city} 
          ${venue.location?.country} 
          ${venue.location?.address}
        `.toLowerCase();
        return searchableText.includes(lowerQuery);
      })
    : [];

  const venuesToDisplay = query ? filteredVenues : venues;

  const searchPageCount = Math.ceil(filteredVenues.length / VENUES_PER_PAGE);

  const paginatedVenues = query
    ? venuesToDisplay.slice(
        (currentPage - 1) * VENUES_PER_PAGE,
        currentPage * VENUES_PER_PAGE,
      )
    : venuesToDisplay;

  if (isLoading) return <div>Loading venues...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div>
      <h1 className="font-heading text-3xl md:text-4xl text-center my-6 md:my-10 mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28">
        Ready for your next holiday?
      </h1>
      <Search
        query={query}
        setQuery={(q) => {
          setQuery(q);
          setCurrentPage(1);
        }}
        filteredVenues={paginatedVenues}
      />
      <h2 className="font-heading text-xl lg:text-2xl mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28">
        Browse our venues
      </h2>
      <hr className="border-t-1 border-secondary mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10 mt-4 mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28">
        {paginatedVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 my-10">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 bg-secondary text-white font-body text-sm md:text-base rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-base">
          Page {currentPage} of {query ? searchPageCount : pageCount}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, query ? searchPageCount : pageCount),
            )
          }
          disabled={currentPage === (query ? searchPageCount : pageCount)}
          className="px-4 py-1 bg-secondary text-white font-body text-sm md:text-base rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Venues;
