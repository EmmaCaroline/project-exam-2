import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BOOKING } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const CreateBooking = ({ venueId, maxGuests, price }) => {
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [guestError, setGuestError] = useState("");
  const [nights, setNights] = useState(0);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      setBookings([]);
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

  useEffect(() => {
    if (dateFrom && dateTo && dateTo >= dateFrom) {
      const oneDay = 1000 * 60 * 60 * 24;
      const diffTime = dateTo.getTime() - dateFrom.getTime();
      const diffDays = Math.ceil(diffTime / oneDay);
      setNights(diffDays);
    } else {
      setNights(0);
    }
  }, [dateFrom, dateTo]);

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
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="font-heading text-lg md:text-xl lg:text-2xl font-bold mb-6 text-gray-900">
        Book this venue
      </h2>
      <p className="text-sm md:text-base font-medium  mb-4">${price} /night</p>
      {nights > 0 && (
        <p className="text-sm md:text-base font-semibold text-blue-900 mb-4">
          Total cost for {nights} {nights === 1 ? "night" : "nights"}: $
          {nights * price}
        </p>
      )}

      <div className="mb-5 grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        <label
          htmlFor="dateFrom"
          className="flex flex-col text-gray-700 text-sm font-semibold"
        >
          From:
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-black">
              <FaCalendarAlt className="w-4 h-4 " />
            </span>
            <DatePicker
              id="dateFrom"
              name="dateFrom"
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
              <FaCalendarAlt className="w-4 h-4 " />
            </span>
            <DatePicker
              id="dateTo"
              name="dateTo"
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
              className="w-full pl-10 border border-gray-300 rounded-md px-2 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select end date"
              withPortal
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
        name="guests"
        type="number"
        value={guests}
        onChange={handleGuestChange}
        min={1}
        max={maxGuests}
        className="mt-1 mb-6 block border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {guestError && (
        <p className="text-red-600 text-sm mt-1 mb-2">{guestError}</p>
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
            className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:opacity-50 transition"
          >
            Confirm
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition"
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
