/**
 * BookingList component displays a list of bookings for a venue.
 *
 * If there are no bookings, it shows a message indicating no bookings exist.
 *
 * Props:
 * @param {Object} props
 * @param {Array<Object>} props.bookings - Array of booking objects to display.
 * @param {string} props.bookings[].id - Unique identifier for each booking.
 * @param {Object} [props.bookings[].customer] - Customer information for the booking.
 * @param {string} [props.bookings[].customer.name] - Name of the customer who made the booking.
 * @param {string|Date} props.bookings[].dateFrom - Start date of the booking.
 * @param {string|Date} props.bookings[].dateTo - End date of the booking.
 * @param {number} props.bookings[].guests - Number of guests for the booking.
 *
 * Returns:
 * @returns {JSX.Element} JSX markup for the list of bookings.
 */
const BookingList = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return <p>No bookings have been made for this venue yet.</p>;
  }

  return (
    <div>
      <h2 className="font-heading text-lg md:text-xl lg:text-2xl mb-4">
        Guest bookings
      </h2>
      <ul className="space-y-4 max-h-96 overflow-y-auto">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="border rounded p-4 bg-primary border-secondary"
          >
            <p>
              <strong>Guest:</strong> {booking.customer?.name || "Anonymous"}
            </p>

            <p>
              <strong>From:</strong>{" "}
              {new Date(booking.dateFrom).toLocaleDateString()}
            </p>
            <p>
              <strong>To:</strong>{" "}
              {new Date(booking.dateTo).toLocaleDateString()}
            </p>
            <p>
              <strong>Number of guests:</strong> {booking.guests}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
