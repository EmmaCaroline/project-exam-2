import { Link } from "react-router-dom";

const VenueCard = ({ venue }) => {
  const starRating = venue.data.rating.toFixed(2);
  const location =
    venue.data.location.city + ", " + venue.data.location.country;

  return (
    <div className="flex flex-col items-center group my-4 shadow-md rounded pb-3">
      <div className="flex-grow">
        <div className="relative">
          <Link to={`/venue/${venue.data.id}`}>
            <img
              src={venue.data.image.url}
              alt={venue.data.image.alt}
              className="w-56 h-56 sm:w-64 sm:h-64 xl:w-80 xl:h-80 aspect-square object-cover rounded-lg transition duration-300 ease-linear group-hover:scale-105 border border-gray-300"
            />
          </Link>
        </div>
        <p className="text-sm md:text-base font-body">{location}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm md:text-base font-body font-semibold">
            {venue.data.name}
          </span>
          <>
            <span className="text-sm md:text-base font-body">{starRating}</span>
          </>
        </div>
        <p className="text-sm md:text-base font-body">
          ${venue.data.price + " /night"}
        </p>
      </div>
    </div>
  );
};

export default VenueCard;
