import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * A React component that renders a booking form for a venue, allowing users to
 * select a date range, specify the number of guests, and submit a booking.
 * It handles disabled dates based on existing bookings, guest limits, and
 * displays booking success/error messages.
 *
 * @component
 *
 * @param {Object} props
 * @param {number} props.price - Price per night for the venue.
 * @param {number} props.maxGuests - Maximum allowed guests for the booking.
 * @param {Array<Object>} props.bookings - Existing bookings to disable dates (each booking has `dateFrom` and `dateTo`).
 * @param {boolean} props.isLoggedIn - Whether the user is logged in.
 * @param {function(Object): Promise} props.onSubmitBooking - Async function called on booking submission with `{ dateFrom, dateTo, guests }`.
 *
 * @returns {JSX.Element} The booking form UI.
 *
 * @example
 * <CreateBooking
 *   price={120}
 *   maxGuests={5}
 *   bookings={[{ dateFrom: "2025-06-01", dateTo: "2025-06-05" }]}
 *   isLoggedIn={true}
 *   onSubmitBooking={async (bookingData) => { ... }}
 * />
 */
const CreateBooking = ({
  price,
  maxGuests,
  bookings,
  isLoggedIn,
  onSubmitBooking,
}) => {
  const navigate = useNavigate();

  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * Calculate the number of nights between `dateFrom` and `dateTo`.
   * If either date is missing, returns 0.
   *
   * @type {number}
   */
  const nights =
    dateFrom && dateTo
      ? Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24))
      : 0;

  /**
   * Compute an array of all disabled dates based on existing bookings.
   * Each booking disables all dates from its `dateFrom` to `dateTo`.
   *
   * @type {Date[]}
   */
  const disabledDates = bookings.flatMap((b) => {
    const start = new Date(b.dateFrom);
    const end = new Date(b.dateTo);
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  });

  /**
   * Handler for changes to the guests input field.
   * Ensures the number of guests does not exceed maxGuests.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   * @returns {void}
   */
  const handleGuestChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setGuests(value > maxGuests ? maxGuests : value);
  };

  /**
   * Handles the booking submission.
   * Validates inputs, calls the async `onSubmitBooking` prop,
   * and manages UI state like loading, success, and error messages.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleBooking = async () => {
    if (!dateFrom || !dateTo || guests < 1 || guests > maxGuests) {
      setErrorMessage("Please fill in all fields correctly.");
      return;
    }

    setIsBooking(true);
    setErrorMessage("");

    try {
      const bookingData = {
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        guests,
      };

      await onSubmitBooking(bookingData);
      setSuccess(true);
      setShowConfirm(false);
    } catch {
      setErrorMessage("An error occurred during booking.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="font-heading text-lg md:text-xl lg:text-2xl font-bold mb-6 text-gray-900">
        Book this venue
      </h2>
      <p className="text-sm md:text-base font-medium mb-4">${price} /night</p>

      {nights > 0 && (
        <p className="text-sm md:text-base font-semibold text-blue-900 mb-4">
          Total cost for {nights} {nights === 1 ? "night" : "nights"}: $
          {nights * price}
        </p>
      )}

      <div className="mb-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <label
          htmlFor="dateFrom"
          className="flex flex-col text-gray-700 text-sm font-semibold"
        >
          From:
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-black">
              <FaCalendarAlt className="w-4 h-4" />
            </span>
            <DatePicker
              id="dateFrom"
              selected={dateFrom}
              onChange={(date) => {
                setDateFrom(date);
                if (dateTo && date > dateTo) {
                  setDateTo(null);
                }
              }}
              selectsStart
              startDate={dateFrom}
              endDate={dateTo}
              minDate={new Date()}
              excludeDates={disabledDates}
              className="w-full pl-10 border border-gray-300 rounded-md px-2 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select start date"
              withPortal
            />
          </div>
        </label>

        <label
          htmlFor="dateTo"
          className="flex flex-col text-gray-700 text-sm font-semibold"
        >
          To:
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-black">
              <FaCalendarAlt className="w-4 h-4" />
            </span>
            <DatePicker
              id="dateTo"
              selected={dateTo}
              onChange={(date) => setDateTo(date)}
              selectsEnd
              startDate={dateFrom}
              endDate={dateTo}
              minDate={dateFrom || new Date()}
              excludeDates={disabledDates}
              className="w-full pl-10 border border-gray-300 rounded-md px-2 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select end date"
              withPortal
              disabled={!dateFrom}
            />
          </div>
        </label>
      </div>

      <label
        htmlFor="guests"
        className="block text-gray-700 text-sm font-semibold"
      >
        Guests (max {maxGuests}):
      </label>
      <input
        id="guests"
        type="number"
        value={guests}
        onChange={handleGuestChange}
        min={1}
        max={maxGuests}
        className="mt-1 mb-6 block border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {errorMessage && (
        <p className="text-red-600 text-sm mt-1 mb-2">{errorMessage}</p>
      )}

      {success && (
        <p className="text-green-700 bg-green-100 border border-green-400 rounded-md p-2 mt-3 mb-3 font-semibold">
          Booking successful!
        </p>
      )}

      {!isLoggedIn ? (
        <button
          onClick={() => navigate("/login")}
          className="btn btn-secondary"
        >
          Login to book this venue
        </button>
      ) : showConfirm ? (
        <div className="flex gap-4">
          <button
            onClick={handleBooking}
            disabled={isBooking || guests < 1 || guests > maxGuests}
            className="flex-1 bg-green-600 text-white btn btn-primary"
          >
            Confirm
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 bg-red-500 text-white btn btn-primary"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="btn btn-primary"
        >
          BOOK NOW
        </button>
      )}
    </div>
  );
};

export default CreateBooking;
