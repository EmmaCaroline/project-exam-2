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
    if (!isLoggedIn) {
      // Don't fetch bookings if not logged in
      setBookings([]); // Optional: clear bookings if previously fetched
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_BOOKING}?_venue=true`, {
          headers: getHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const venueBookings = result.data.filter(
          (booking) => booking.venue.id === venueId,
        );
        setBookings(venueBookings);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      }
    };

    fetchBookings();
  }, [venueId, isLoggedIn]);

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
    <div className="w-full mx-auto p-5 bg-white rounded-lg shadow-md">
      <h2 className="font-heading text-lg font-bold mb-5 text-gray-900">
        Book this venue
      </h2>

      <div className="flex flex-col gap-4 mb-5">
        <label
          htmlFor="dateFrom"
          className="flex flex-col text-gray-700 text-sm font-semibold"
        >
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
            className="mt-1 border border-gray-300 rounded-md px-2 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select start date"
          />
        </label>

        <label
          htmlFor="dateTo"
          className="flex flex-col text-gray-700 text-sm font-semibold"
        >
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
            className="mt-1 border border-gray-300 rounded-md px-2 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select end date"
          />
        </label>
      </div>

      <label
        htmlFor="guests"
        className="block mb-5 text-gray-700 text-sm font-semibold"
      >
        Guests (max {maxGuests}):
        <input
          type="number"
          value={guests}
          onChange={handleGuestChange}
          min={1}
          max={maxGuests}
          className="mt-1 block pr-10 border border-gray-300 rounded-md px-2 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
      {guestError && (
        <p className="text-red-600 text-sm -mt-4 mb-4">{guestError}</p>
      )}

      {!isLoggedIn ? (
        <button onClick={() => navigate("/login")} className="btn btn-primary">
          Login to book this venue
        </button>
      ) : showConfirm ? (
        <div className="flex gap-3">
          <button
            onClick={handleBooking}
            disabled={isBooking || guests < 1 || guests > maxGuests}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 disabled:opacity-50 transition"
          >
            Confirm
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 bg-red-500 text-white py-2.5 rounded-md hover:bg-red-600 transition"
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
