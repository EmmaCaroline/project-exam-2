import { useState, useEffect } from "react";
import { API_VENUES } from "../../utils/constants";
import Search from "../UI/Search";
import VenueCard from "../UI/Venuecard";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const VENUES_PER_PAGE = 20;

  useEffect(() => {
    async function getData() {
      try {
        setIsError(false);
        setIsLoading(true);
        const response = await fetch(
          `${API_VENUES}?page=${currentPage}&limit=${VENUES_PER_PAGE}`,
        );
        const json = await response.json();

        if (json && Array.isArray(json.data)) {
          setVenues(json.data);
          setPageCount(json.meta?.pageCount || 1);
        } else {
          throw new Error("Invalid data format");
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        console.error("Error fetching data:", error);
      }
    }

    getData();
  }, [currentPage]);

  if (isLoading) {
    return <div>Loading venues...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  const filteredVenues = venues.filter((venue) => {
    const lowerQuery = query.toLowerCase();
    const searchableText = `
      ${venue.name} 
      ${venue.description}
      ${venue.location?.city} 
      ${venue.location?.country} 
      ${venue.location?.address}
    `.toLowerCase();

    return searchableText.includes(lowerQuery);
  });

  return (
    <div>
      <h1 className="font-heading text-3xl md:text-4xl text-center my-6 md:my-10 mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28">
        Ready for your next holiday?
      </h1>
      <Search
        query={query}
        setQuery={setQuery}
        filteredVenues={filteredVenues}
      />
      <h2 className="font-heading text-xl lg:text-2xl mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28">
        Browse our venues
      </h2>
      <hr className="border-t-1 border-secondary mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10 mt-4 mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28">
        {filteredVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 my-10">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 bg-secondary text-white font-body rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {currentPage} of {pageCount}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, pageCount))
          }
          disabled={currentPage === pageCount}
          className="px-4 py-1 bg-secondary text-white font-body rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Venues;
