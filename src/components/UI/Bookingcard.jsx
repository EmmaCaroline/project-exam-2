import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import DefaultImage from "../../assets/No_Image_Available.jpg";

const BookingCard = ({ booking, onDelete }) => {
  if (!booking.venue) {
    return (
      <div className="text-red-600 p-4 border rounded bg-red-50">
        Venue details not available for this booking.
      </div>
    );
  }

  const firstImage =
    booking.venue.media && booking.venue.media.length > 0
      ? booking.venue.media[0]
      : { url: "", alt: "" };

  return (
    <div className="h-full w-full rounded">
      <Link to={`/venue/${booking.venue.id}`}>
        <div className="block w-full h-56 overflow-hidden rounded-lg relative group">
          <img
            src={firstImage.url || DefaultImage}
            alt={firstImage.alt || booking.venue.name || "Venue image"}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </Link>

      <div className="text-sm md:text-base font-body font-semibold line-clamp-1 overflow-hidden break-words pr-8">
        {booking.venue.name}
      </div>
      <div>
        {new Date(booking.dateFrom).toLocaleDateString("nb-NO")} -{" "}
        {new Date(booking.dateTo).toLocaleDateString("nb-NO")}
      </div>

      <div className="flex items-center justify-between">
        <span>Guests: {booking.guests}</span>
        <span>
          {" "}
          {/* Delete button */}
          <button
            onClick={onDelete}
            className=" text-red-600 hover:text-red-800"
            aria-label="Delete booking"
          >
            <MdDeleteForever size={24} />
          </button>
        </span>
      </div>
    </div>
  );
};

export default BookingCard;
