import { useState, useEffect } from "react";
import { API_VENUES } from "../../utils/constants";
import Search from "../UI/Search";
import VenueCard from "../UI/Venuecard";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setIsError(false);
        setIsLoading(true);
        const response = await fetch(API_VENUES);
        const json = await response.json();

        if (json && json.data && Array.isArray(json.data)) {
          setVenues(json.data);
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
  }, []);

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
      <h1 className="font-heading text-2xl md:text-4xl text-center my-6 md:my-10 mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28">
        Ready for your next holiday?
      </h1>
      <Search
        query={query}
        setQuery={setQuery}
        filteredVenues={filteredVenues}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 mt-4 mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28">
        {filteredVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
};

export default Venues;
