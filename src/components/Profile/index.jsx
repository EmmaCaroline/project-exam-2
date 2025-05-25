import { API_PROFILES, API_BOOKING } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchBookingsByProfile } from "../../utils/fetchBookingsByProfile";
import BookingCard from "../UI/Bookingcard";
import ConfirmModal from "../UI/ConfirmModal";

export const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const openConfirm = (id) => {
    setSelectedBookingId(id);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setSelectedBookingId(null);
    setConfirmOpen(false);
  };

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_PROFILES}/${username}`, {
          method: "GET",
          headers: getHeaders(),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error("Failed to fetch profile: " + errorText);
        }

        const json = await response.json();
        setProfile(json.data);

        const bookingsData = await fetchBookingsByProfile(username);
        setBookings(bookingsData);
      } catch (err) {
        if (err.name === "TypeError") {
          setError("Network error, try again later");
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const deleteBooking = async () => {
    if (!selectedBookingId) return;

    try {
      const response = await fetch(`${API_BOOKING}/${selectedBookingId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      setBookings((prev) =>
        prev.filter((booking) => booking.id !== selectedBookingId),
      );

      closeConfirm();
    } catch (error) {
      alert(error.message || "An error occurred while deleting booking");
    }
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <>
      <div className="mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28 my-6 md:my-10">
        <div className="mb-4 flex items-center justify-between ">
          <span className="flex items-center flex-shrink-0 gap-4">
            {profile.avatar?.url && (
              <img
                src={profile.avatar.url}
                alt={profile.avatar.alt || "Profile avatar"}
                className="w-14 h-14 md:w-32 md:h-32 rounded-full border-2 object-cover"
              />
            )}
            <h1 className="font-heading text-lg md:text-xl lg:text-2xl mb-2">
              {profile.name}
            </h1>
          </span>
          <Link to={`/editprofile`}>
            <span className="flex items-center flex-shrink-0 gap-2">
              <FaUserEdit className="text-xl lg:text-2xl" />
              <button className="font-body text-sm md:text-base hidden md:flex">
                Edit avatar
              </button>
            </span>
          </Link>
        </div>
        <hr className="border-t-1 border-secondary pt-1 pb-2" />

        <p>
          Venue Manager: <strong>{profile.venueManager ? "Yes" : "No"}</strong>
        </p>
        <h2 className="font-heading font-bold text-lg md:text-xl lg:text-2xl my-4">
          Your bookings
        </h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookings
              .filter((booking) => booking.venue)
              .map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onDelete={() => openConfirm(booking.id)}
                />
              ))}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onConfirm={deleteBooking}
        onCancel={closeConfirm}
        message="Are you sure you want to delete this booking?"
      />
    </>
  );
};

export const EditProfile = () => {};
