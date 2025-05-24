import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BOOKING } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateBooking = ({ venueId, maxGuests }) => {
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [guestError, setGuestError] = useState("");

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_BOOKING}?_venue=true`, {
          headers: getHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        const venueBookings = result.data.filter(
          (booking) => booking.venue.id === venueId,
        );
        setBookings(venueBookings);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      }
    };

    fetchBookings();
  }, [venueId]);

  const isDateRangeValid = () => {
    return dateFrom && dateTo && dateFrom <= dateTo;
  };

  const isOverlapping = () => {
    return bookings.some((booking) => {
      const existingFrom = new Date(booking.dateFrom);
      const existingTo = new Date(booking.dateTo);
      return (
        (dateFrom >= existingFrom && dateFrom <= existingTo) ||
        (dateTo >= existingFrom && dateTo <= existingTo) ||
        (dateFrom <= existingFrom && dateTo >= existingTo)
      );
    });
  };

  // Handle guests input change with maxGuests validation
  const handleGuestChange = (e) => {
    const value = Number(e.target.value);
    if (value < 1) {
      setGuests(1);
      setGuestError("");
    } else if (value > maxGuests) {
      setGuests(maxGuests);
      setGuestError(`Maximum guests allowed is ${maxGuests}`);
    } else {
      setGuests(value);
      setGuestError("");
    }
  };

  const handleBooking = async () => {
    // Validate guests before booking
    if (guests < 1) {
      alert("Please select at least 1 guest.");
      return;
    }
    if (guests > maxGuests) {
      alert(`Maximum guests allowed is ${maxGuests}.`);
      return;
    }
    if (!isDateRangeValid()) {
      alert("Please select a valid date range.");
      return;
    }
    if (isOverlapping()) {
      alert("Selected dates overlap with an existing booking.");
      return;
    }

    try {
      setIsBooking(true);
      const response = await fetch(API_BOOKING, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          guests,
          venueId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Booking successful!");
        setDateFrom(null);
        setDateTo(null);
        setGuests(1);
        setGuestError("");
      } else {
        alert(
          "Booking failed: " +
            (result.errors?.[0]?.message || "Unknown error."),
        );
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred.");
    } finally {
      setIsBooking(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="mt-6 border p-4 rounded shadow">
      <h3 className="font-heading text-xl font-semibold mb-2">
        Book this venue
      </h3>

      <div className="flex flex-col gap-2 mb-4">
        <label>
          From:
          <DatePicker
            selected={dateFrom}
            onChange={(date) => setDateFrom(date)}
            selectsStart
            startDate={dateFrom}
            endDate={dateTo}
            minDate={new Date()}
            excludeDateIntervals={bookings.map((b) => ({
              start: new Date(b.dateFrom),
              end: new Date(b.dateTo),
            }))}
            className="border p-1 rounded w-full"
            placeholderText="Select start date"
          />
        </label>
        <label>
          To:
          <DatePicker
            selected={dateTo}
            onChange={(date) => setDateTo(date)}
            selectsEnd
            startDate={dateFrom}
            endDate={dateTo}
            minDate={dateFrom || new Date()}
            excludeDateIntervals={bookings.map((b) => ({
              start: new Date(b.dateFrom),
              end: new Date(b.dateTo),
            }))}
            className="border p-1 rounded w-full"
            placeholderText="Select end date"
          />
        </label>
        <label>
          Guests (max {maxGuests}):
          <input
            type="number"
            value={guests}
            onChange={handleGuestChange}
            className="border p-1 rounded w-full"
            min={1}
            max={maxGuests}
          />
        </label>
        {guestError && <p className="text-red-600">{guestError}</p>}
      </div>

      {!isLoggedIn ? (
        <button
          onClick={() => navigate("/login")}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Login to book this venue
        </button>
      ) : showConfirm ? (
        <div className="flex gap-2">
          <button
            onClick={handleBooking}
            disabled={isBooking || guests < 1 || guests > maxGuests}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Book now
        </button>
      )}
    </div>
  );
};

export default CreateBooking;
