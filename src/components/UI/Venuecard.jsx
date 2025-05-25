import { Link } from "react-router-dom";
import DefaultImage from "../../assets/No_Image_Available.jpg";
import { FaLocationDot } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";

/**
 * VenueCard component displays a venue's image, location, name, rating, and price.
 *
 * @param {Object} props
 * @param {Object} props.venue - Venue object containing venue details.
 * @param {number} props.venue.id - Unique identifier of the venue.
 * @param {string} props.venue.name - Name of the venue.
 * @param {number} props.venue.rating - Numeric rating of the venue.
 * @param {number} props.venue.price - Price per night for the venue.
 * @param {Object} [props.venue.location] - Location object of the venue.
 * @param {string} [props.venue.location.city] - City where the venue is located.
 * @param {string} [props.venue.location.country] - Country where the venue is located.
 * @param {Array<{url: string, alt: string}>} [props.venue.media] - Array of media objects with URL and alt text.
 *
 * @returns {JSX.Element} JSX element representing a clickable venue card.
 */
const VenueCard = ({ venue }) => {
  const starRating = venue.rating.toFixed(1);
  const city = venue.location?.city || "";
  const country = venue.location?.country || "";

  const location =
    city && country
      ? `${city}, ${country}`
      : city || country || "Location unknown";

  const firstImage =
    venue.media && venue.media.length > 0
      ? venue.media[0]
      : { url: "", alt: "" };

  return (
    <Link to={`/venue/${venue.id}`}>
      <div className="h-full w-full rounded">
        <div className="block w-full h-56 overflow-hidden rounded-lg relative group">
          <img
            src={firstImage.url || DefaultImage}
            alt={
              venue.media && venue.media.length > 0
                ? firstImage.alt || venue.name
                : "Default venue image"
            }
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition duration-300 flex items-center justify-center rounded-lg">
            <p className="font-heading text-white text-base lg:text-lg font-semibold opacity-0 group-hover:opacity-100 transition duration-300">
              View venue
            </p>
          </div>
        </div>

        <p className="mt-2 flex items-center text-sm md:text-base font-body text-gray-800">
          <FaLocationDot className="mr-1 text-lg" />
          {location}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span
            className="text-sm md:text-base font-body font-semibold line-clamp-1 overflow-hidden break-words pr-8"
            title={venue.name}
          >
            {venue.name}
          </span>
          <span className="flex items-center text-sm md:text-base font-body flex-shrink-0">
            <FaStar className="mr-1 text-lg" />
            {starRating}
          </span>
        </div>

        <p className="text-sm md:text-base font-body font-medium">
          ${venue.price} /night
        </p>
      </div>
    </Link>
  );
};

export default VenueCard;
